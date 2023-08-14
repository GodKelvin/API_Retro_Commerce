import { Request, Response, Router } from "express";
import { Jogo } from "../models/jogo";
import auth from "../middlewares/auth";

const jogoRouter = Router();
jogoRouter.get("/:console", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.params.console) return res.status(400).json({
            success: false,
            message: "Informe um console"
        });
        let search = await Jogo.getByConsole(req.params.console);
        return res.status(200).json({
            success: true,
            message: search
        });
    }catch(error){
        console.log(`>> ERROR: Get Jogos ${console}}:\n${error}`);
        return res.status(500).json({
            error: `Erro ao obter lista de jogos. Por favor, tente mais Tarde`}
        );
    }
});

export default jogoRouter;