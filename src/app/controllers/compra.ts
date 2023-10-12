import { Request, Response, Router } from "express";
import auth from "../middlewares/auth";
import { Anuncio } from "../models/anuncio";
import { Endereco } from "../models/endereco";
import { Compra } from "../models/compra";
import multerConfig from '../middlewares/multer';
import ImgurApi from "../models/imgurApi";
//import { Mailer } from "../models/mailer";

const compraRouter = Router();

compraRouter.get("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const compras = await Compra.getCompras(res.locals.usuarioId);
        return res.status(200).json({
            success: true,
            message: compras
        });
    }catch(error){
        console.log(`>> ERROR GET ANUNCIOS: Error: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao obter pedidos. Por favor, tente mais tarde."
        });
    }
});


compraRouter.post("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.body.anuncioId || !req.body.enderecoId) return res.status(400).json({
            success: false,
            message: "Informe um anuncio e um endereco"
        });
        const anuncio = await Anuncio.findForCompra(req.body.anuncioId);

        //O comprador não pode ser o proprio anunciante
        if(!anuncio || (anuncio.getUsuarioId() == res.locals.usuarioId)) return res.status(400).json({
            success: false,
            message: "Anuncio nao encontrado"
        });

        const endereco = await Endereco.searchByid(req.body.enderecoId, res.locals.usuarioId);
        if(!endereco) return res.status(400).json({
            success: false,
            message: "Endereco nao encontrado"
        });
        
        const compra = await Compra.create(1, res.locals.usuarioId, endereco, anuncio.getId()); //transaction
        if(!compra) return res.status(400).json({
            success: false,
            message: "Erro ao realizar compra. Por favor, tente mais tarde."
        });
        
        return res.status(200).json({
            sucess: true,
            message: compra
        });
    }catch(error){
        console.log(`>> ERROR POST ANUNCIO: Error: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao realizar compra. Por favor, tente mais tarde."
        });
    }
});

compraRouter.patch("/upload-comprovante", auth.checkToken, multerConfig.upload.single('comprovante-pagamento'), multerConfig.multerErrorHandler, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.file || !req.body.compraId) return res.status(400).json({
            sucess: false,
            message: "Pendente comprovante de pagamento ou dados da compra."
        });
        const compra = await Compra.searchCompradorByIds(req.body.compraId, res.locals.usuarioId);
        if(!compra) return res.status(400).json({
            success: false,
            message: "Compra nao encontrada"
        });

        if(compra.getComprovantePagamento()) await compra.deleteComprovantePagamento();

        const dataImage = await ImgurApi.uploadImage(req.file);
        if(!dataImage) return res.status(400).json({
            success: false, 
            message: "Erro ao realizar upload do comprovante da compra. Por favor, tente mais tarde."
        });

        const resUpload = await compra.setComprovantePagamento(dataImage);
        return res.status(200).json({
            success: true,
            message: resUpload
        });


    }catch(error){
        console.log(`>> ERROR POST COMPROVANTE: Error: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao realizar upload do comprovante da compra. Por favor, tente mais tarde."
        });
    }
});

compraRouter.patch("/rastreio", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    if(!req.body.codigoRastreio || !req.body.compraId) return res.status(400).json({
        sucess: false,
        message: "Pendente codigo de rastreio ou dados da compra"
    });

    const compra = await Compra.searchVendedorByIds(req.body.compraId, res.locals.usuarioId);
    if(!compra) return res.status(400).json({
        success: false,
        message: "Compra nao encontrada"
    });
    
    const resUpdate = await compra.setCodRastreio(req.body.codigoRastreio);
    return res.status(200).json({
        success: true,
        message: resUpdate
    });


});

compraRouter.patch("/confirma-entrega", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    if(!req.body.compraId) return res.status(400).json({
        sucess: false,
        message: "Pendente dados da compra"
    });

    const compra = await Compra.searchCompradorByIds(req.body.compraId, res.locals.usuarioId);
    if(!compra) return res.status(400).json({
        success: false,
        message: "Compra nao encontrada"
    });
    
    const resUpdate = await compra.setCompraRecebida();
    return res.status(200).json({
        success: true,
        message: resUpdate
    });


});

export default compraRouter;