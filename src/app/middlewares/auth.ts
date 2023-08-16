import { NextFunction, Request, Response } from "express";
import { Auth } from "../models/auth";
class AuthMiddleware{
    public async checkToken(req: Request, res: Response, next: NextFunction){
        
        const {authorization} = req.headers;
        if(!authorization) return res.status(401).json({
            success: false,
            message: "Acesso negado"
        });

        try{
            const usuario = await Auth.verifyToken(authorization);
            if(!usuario) return res.status(401).json({
                success: false,
                message: "Acesso negado"
            });

            //Deixando o apelido visivel para a requisicao
            res.locals.apelido = usuario.getApelido();
            res.locals.usuarioId = usuario.getId();

            return next();

        }catch(error){
            console.log(`-->>Error: Auth Middleware: ${error} - ${authorization}`);
            return res.status(401).json({
                success: false,
                message: "Acesso negado"
            });
        }
    }

    public async checkTokenForEmailConfirm(req: Request, res: Response, next: NextFunction){
        
        const {token} = req.params;
        try{
            const usuario = await Auth.verifyTokenEmailConfirm(token);
            if(!usuario) return res.status(401).json({
                success: false,
                message: "Acesso negado"
            });
            //Deixando o email visivel para a requisicao
            res.locals.email = usuario.getEmail();
            return next();

        }catch(error){
            console.log(`-->>Error: Check Email Middleware: ${error} - ${token}`);
            return res.status(401).json({
                success: false,
                message: "Acesso negado"
            });
        }
    }
}

export default new AuthMiddleware();