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
            res.locals.apelido = usuario.apelido;

            return next();

        }catch(error){
            console.log(`-->>Error: Auth Middleware: ${error} - ${authorization}`);
            return res.status(401).json({
                success: false,
                message: "Acesso negado"
            });
        }
    }
}

export default new AuthMiddleware();