import { Request, Response, Router } from "express";
import auth from "../middlewares/auth";
import { Anuncio } from "../models/anuncio";
import { IAnuncio } from "../interfaces/anuncio";
import multerConfig from '../middlewares/multer';

const anuncioRouter = Router();

anuncioRouter.get("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const search = await Anuncio.searchWithPrecos(req.query);
        return res.status(200).json({
            success: true,
            message: search
        });
    }catch(error){
        console.log(`>>ERROR: Get Anuncios: ${req.params}\n: ${error}`);
        return res.status(500).json({
            error: `Erro ao obter lista de anuncios. Por favor, tente mais tarde`}
        );
    }
});

anuncioRouter.get("/:id", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.params.id || isNaN(Number(req.params.id))) return res.status(400).json({
            success: false,
            message: "id de anuncio invalido"
        });
        const idAnuncio = Number(req.params.id);
        let search = await Anuncio.getAnuncioDetalhes(idAnuncio);
        
        if(!search) return res.status(400).json({
            success: false,
            message: "Anuncio nao encontrado"
        });

        let images = await Anuncio.getImagesAnuncio(idAnuncio);
        search["imagens"] = images;
        return res.status(200).json({
            success: true,
            message: search
        });
    }catch(error){
        console.log(`>>ERROR: GET ANUNCIO BY ID: ${error}`);
        return res.status(500).json({
            error: `Erro ao obter anuncio. Por favor, tente mais Tarde`
        });
    }
});

anuncioRouter.get("/all/me", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const search = await Anuncio.searchAllAnunciosUsuario(res.locals.usuarioId);
        return res.status(200).json({
            success: true,
            message: search
        });
    }catch(error){
        console.log(`>>ERROR: GET ALL ANUNCIOS USUARIO: ${error}`);
        return res.status(500).json({
            error: `Erro ao obter seus anuncios. Por favor, tente mais Tarde`
        }); 
    }
});

anuncioRouter.get("/usuario/:usuario", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.params.usuario) return res.status(400).json({
            success: false,
            message: "Informe um usuario"
        });
        let search = await Anuncio.getByUsuario(req.params.usuario)
        return res.status(200).json({
            success: true,
            message: search
        });
    }catch(error){
        console.log(`>>ERROR: GET ANUNCIO BY USUARIO: ${error}`);
        return res.status(500).json({
            error: `Erro ao obter anuncio. Por favor, tente mais Tarde`
        });
    }
});

anuncioRouter.post("/", auth.checkToken, multerConfig.upload.array('photos', 10), multerConfig.multerErrorHandler, async(req: Request, res: Response): Promise<any> => {
    try{
        const validatorFields = Anuncio.validatorFieldsForCreate(req.body);
        if(validatorFields.length) return res.status(400).json({
            success: false,
            message: validatorFields
        });
        const novoAnuncio: IAnuncio = req.body;
        novoAnuncio.usuarioId = res.locals.usuarioId;
        const anuncio = await Anuncio.create(novoAnuncio);
        if(req.files?.length) anuncio.insereImagens(req.files)

        return res.status(200).json({
            success: true,
            message: anuncio
        });
    }catch(error){
        console.log(`>> ERROR: POST anuncios: ${req.body}:\n${error}`);
        return res.status(500).json({
            error: `Erro ao obter anuncios. Por favor, tente mais Tarde`
        });
    }
});

anuncioRouter.patch("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        //Garante que buscara o anuncio do respectivo usuario do token
        const anuncio = await Anuncio.searchByIds(res.locals.usuarioId, req.body.id || null);
        if(!anuncio || await anuncio.comprado()) return res.status(400).json({
            success: false,
            message: "Anuncio nao encontrado"
        });

        const validatorFields = Anuncio.validateFieldsDisponiveis(req.body, "id");
        if(validatorFields.length) return res.status(400).json({
            success: false,
            message: validatorFields
        });
        delete req.body.id
        const resUpdate = await anuncio.update(req.body);
        return res.status(200).json({
            success: true,
            message: resUpdate
        });
    }catch(error){
        console.log(`>> ERROR: PATCH anuncios: ${req.body}}:\n${error}`);
        return res.status(500).json({
            error: `Erro ao obter anuncios. Por favor, tente mais Tarde`}
        );
    }
});

anuncioRouter.delete("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const anuncio = await Anuncio.searchByIds(res.locals.usuarioId, req.body.id || null);
        if(!anuncio || await anuncio.comprado()) return res.status(400).json({
                success: false,
                message: "Anuncio nao encontrado"
        });
        anuncio.deleteAnuncio();

        return res.status(200).json({
            success: true,
            message: "Anuncio apagado"
        });
    }catch(error: any){
        console.log(`>> ERROR: DEL anuncios: ${req.body}}:\n${error}`);
        return res.status(500).json({
            error: `Erro ao apagar anuncio. Por favor, tente mais Tarde`}
        );
    }
});
export default anuncioRouter;