import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
const usuarioRouter = Router();

usuarioRouter.post("/", async(req: Request, res: Response): Promise<any> => {
    try{
        let usuario = new Usuario(req.body);
        if(usuario.errors.length) return res.status(400).json({
            success: false,
            errors: usuario.errors
        });

        if(await usuario.emailExiste()) return res.status(400).json({
            success: false,
            errors: "Email já cadastrado"
        });

        if(await usuario.apelidoExiste()) return res.status(400).json({
            success: false,
            errors: "Apelido indisponivel"
        });

        await usuario.create();
        return res.status(200).json({
            success: true,
            message: usuario.usuario
        });
    }catch(error){
        return res.status(500).json(`Internal Server Error => ${error}`);
    }

});

export default usuarioRouter;