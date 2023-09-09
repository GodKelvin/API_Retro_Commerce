import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
import { Auth } from "../models/auth";
const loginRouter = Router();

loginRouter.post("/", async(req: Request, res: Response): Promise<any> => {
    const {email, senha} = req.body;

    if(!email || !senha) return res.status(400).json({
        success: false,
        message: "Email ou senha pendentes"
    });
    const user = await Usuario.usuarioLogin(email, senha);

    if(!user) return res.status(401).json({
        success: false,
        message: "Email ou senha incorretos."
    });

    return res.status(200).json({
        success: true,
        message:{token: Auth.generateTokenLogin(user)}
    });
});

export default loginRouter;