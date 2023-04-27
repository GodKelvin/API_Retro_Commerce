import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
const usuarioRouter = Router();

usuarioRouter.post("/", async(req: Request, res: Response): Promise<any> => {
    try{
        let usuario = new Usuario(req.body);
        if(usuario.errors.length) return res.status(400).json({errors: usuario.errors});
        await usuario.create();
        return res.status(200).json("Usuario inserido com sucesso");
    }catch(error){
        return res.status(500).json(`Internal Server Error => ${error}`);
    }

});

export default usuarioRouter;