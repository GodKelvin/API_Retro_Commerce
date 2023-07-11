import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
import { Auth } from "../models/auth";
const loginRouter = Router();

loginRouter.post("/", async(req: Request, res: Response): Promise<any> => {
    const {email, senha} = req.body;
    let user = await Usuario.usuarioLogin(email, senha);

    if(!user) return res.status(401).json({
        success: false,
        message: "Email ou senha incorretos."
    });

    let userLogado = new Usuario(user);

    return res.status(200).json({
        success: true,
        token: Auth.generateToken(userLogado)
    });
});

export default loginRouter;