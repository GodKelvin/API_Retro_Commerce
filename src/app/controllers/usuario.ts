import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
const usuarioRouter = Router();

usuarioRouter.post("/", async(req: Request, res: Response): Promise<any> => {
    try{
        let usuario = new Usuario(req.body);
        if(usuario.errors.length) return res.status(400).json({errors: usuario.errors});
        const resCreate = await usuario.create();
        if(!resCreate) return res.status(400).json(resCreate);
        return res.status(200).json(resCreate);
    }catch(error){
        return res.status(500).json(`Internal Server Error => ${error}`);
    }

});

export default usuarioRouter;