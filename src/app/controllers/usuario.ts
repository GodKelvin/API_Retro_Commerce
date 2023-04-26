import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
const usuarioRouter = Router();

usuarioRouter.post("/", async(req: Request, res: Response): Promise<any> => {
    let usuario = new Usuario(req.body);
    if(usuario.errors) return res.status(400).json({errors: usuario.errors});

});

export default usuarioRouter;