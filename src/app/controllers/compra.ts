import { Request, Response, Router } from "express";
import auth from "../middlewares/auth";
import multerConfig from '../middlewares/multer';
import { Anuncio } from "../models/anuncio";

const compraRouter = Router();

compraRouter.post("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.body.anuncioId) return res.status(400).json({
            success: false,
            message: "Informe um anuncio"
        });
        const anuncio = await Anuncio.findForCompra(req.body.anuncioId);
        if(!anuncio) return res.status(400).json({
            success: false,
            message: "Anuncio nao encontrado"
        });

        return res.status(200).json({
            sucess: true,
            message: anuncio.debugger()
        });
    }catch(error){
        console.log(`>> ERROR POST ANUNCIO: Error: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao realizar compra. Por favor, tente mais tarde."
        });
    }
});

export default compraRouter;