import { Request, Response, Router } from "express";
import auth from "../middlewares/auth";
import { Anuncio } from "../models/anuncio";
import { IAnuncio } from "../interfaces/anuncio";
import multerConfig from '../middlewares/multer';

const anuncioRouter = Router();
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

        if(req.files) anuncio.insereImagens(req.files)

        return res.status(200).json({
            success: true,
            message: anuncio
        });
    }catch(error){
        console.log(`>> ERROR: POST anuncios: ${req.body}}:\n${error}`);
        return res.status(500).json({
            error: `Erro ao obter anuncios. Por favor, tente mais Tarde`}
        );
    }
});

anuncioRouter.delete("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const anuncio = await Anuncio.findById(req.body.id);
        if(!anuncio || (anuncio.getUsuarioId() != res.locals.usuarioId)){
            return res.status(400).json({
                success: false,
                message: "Anuncio nao encontrado"
            });
        }
        
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