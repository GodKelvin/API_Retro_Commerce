import { Request, Response, Router } from "express";
import auth from "../middlewares/auth";
import { Anuncio } from "../models/anuncio";
import { IAnuncio } from "../interfaces/anuncio";

const anuncioRouter = Router();
anuncioRouter.post("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const validatorFields = Anuncio.validatorFieldsForCreate(req.body);
        if(validatorFields.length) return res.status(400).json({
            success: false,
            message: validatorFields
        });
        const novoAnuncio: IAnuncio = req.body;
        novoAnuncio.usuarioId = res.locals.usuarioId;
        const anuncio = await Anuncio.create(novoAnuncio);
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

export default anuncioRouter;