import { Request, Response, Router } from "express";
import auth from "../middlewares/auth";
import { EstadoConservacao } from "../models/estadoConservacao";

const estadoConservacaoRouter = Router();

estadoConservacaoRouter.get("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const estados = await EstadoConservacao.get();
        return res.status(200).json({
            sucess: true,
            message: estados
        });
    }catch(error){
        console.log(`>> ERROR GET ESTADO CONSERVACAO: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao obter estados de conservacao. Por favor, tente mais tarde."
        });
    }
});

export default estadoConservacaoRouter;