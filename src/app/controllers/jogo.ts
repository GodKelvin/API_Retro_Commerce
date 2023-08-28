import { Request, Response, Router } from "express";
import { Jogo } from "../models/jogo";
import auth from "../middlewares/auth";

const jogoRouter = Router();
jogoRouter.get("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.query.jogo && !req.query.plataforma){
            return res.status(200).json({
                success: false,
                message: "Informe um jogo ou uma plataforma"
            }); 
        }
        let search = await Jogo.search(req.query);
        return res.status(200).json({
            success: true,
            message: search
        });
    }catch(error){
        console.log(`>> ERROR: Get Jogos: ${req.params.console}}:\n${error}`);
        return res.status(500).json({
            error: `Erro ao obter lista de jogos. Por favor, tente mais tarde`}
        );
    }
});

export default jogoRouter;