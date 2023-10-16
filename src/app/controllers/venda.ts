import { Request, Response, Router } from "express";
import auth from "../middlewares/auth";
import { Anuncio } from "../models/anuncio";
import { Compra } from "../models/compra";

const vendaRouter = Router();

vendaRouter.get("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const compras = await Compra.getVendas(res.locals.usuarioId);
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

vendaRouter.get("/:id", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.params.id || isNaN(Number(req.params.id))) return res.status(400).json({
            success: false,
            message: "id de venda invalido"
        });
        const idCompra = Number(req.params.id);
        let search = await Anuncio.getAnuncioDetalhesVenda(idCompra, res.locals.usuarioId);
        
        if(!search) return res.status(400).json({
            success: false,
            message: "Venda nao encontrada"
        });

        let images = await Anuncio.getImagesAnuncio(search.id);
        search["imagens"] = images;
        return res.status(200).json({
            success: true,
            message: search
        });
    }catch(error){
        console.log(`>>ERROR: GET COMPRA BY ID: ${error}`);
        return res.status(500).json({
            error: `Erro ao obter compra. Por favor, tente mais tarde.`
        });
    }
});

vendaRouter.patch("/aceitar-comprovante", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.body.vendaId) return res.status(400).json({
            success: false,
            message: "Pendente informacoes da venda"
        });   
        const idVenda = Number(req.body.vendaId);   
        const venda = await Compra.searchVendedorByIds(idVenda, res.locals.usuarioId);
        if(!venda) return res.status(400).json({
            success: false,
            message: "Venda nao encontrada"
        });     
        await venda.aceitarComprovante();
        const resumoVenda = await Compra.getDetalhesVenda(idVenda, res.locals.usuarioId);
        return res.status(200).json({
            success: true,
            message: resumoVenda
        });
    }catch(error){
        console.log(`>>ERROR: PATCH UPDATE VENDA ACEITA COMPROVANTE: ${error}`);
        return res.status(500).json({
            error: `Erro ao atualizar venda. Por favor, tente mais tarde.`
        });
    }
});

vendaRouter.patch("/recusar-comprovante", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.body.vendaId) return res.status(400).json({
            success: false,
            message: "Pendente informacoes da venda"
        });   

        const idVenda = Number(req.body.vendaId);   
        const venda = await Compra.searchVendedorByIds(idVenda, res.locals.usuarioId);
        if(!venda) return res.status(400).json({
            success: false,
            message: "Venda nao encontrada"
        });     
        await venda.recusarComprovante();
        const resumoVenda = await Compra.getDetalhesVenda(idVenda, res.locals.usuarioId);
        return res.status(200).json({
            success: true,
            message: resumoVenda
        });
    }catch(error){
        console.log(`>>ERROR: PATCH UPDATE VENDA ACEITA COMPROVANTE: ${error}`);
        return res.status(500).json({
            error: `Erro ao atualizar venda. Por favor, tente mais tarde.`
        });
    }
});

export default vendaRouter;