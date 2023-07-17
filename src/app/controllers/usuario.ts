import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
import auth from "../middlewares/auth";

const usuarioRouter = Router();

usuarioRouter.get("/:apelido", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!req.params.apelido) return res.status(400).json({
            success: false,
            message: "Informe um apelido"
        });
        let search = await Usuario.searchByApelido(req.params.apelido);
        if(!search) return res.status(400).json({
            success: false,
            message: "Usuario nao encontrado"
        });
        return res.status(200).json({
            success: true,
            message: search
        });
    }catch(error){
        return res.status(500).json(`Internal Server Error => ${error}`);
    }
});

usuarioRouter.post("/", async(req: Request, res: Response): Promise<any> => {
    try{
        if(req.body.senha != req.body.confirmarSenha) return res.status(400).json({
            success: false,
            message: "Senhas nao conferem"
        });
        delete req.body.confirmarSenha;
        const validatorFields = Usuario.validatorFieldsForCreate(req.body);
        if(validatorFields.length) return res.status(400).json({
            success: false,
            message: validatorFields
        });

        if(await Usuario.emailExiste(req.body.email)) return res.status(400).json({
            success: false,
            message: "Email já cadastrado"
        });
        
        if(await Usuario.apelidoExiste(req.body.apelido)) return res.status(400).json({
            success: false,
            message: "Apelido indisponivel"
        });

        const newUser = await Usuario.create(req.body);
        return res.status(200).json({
            success: true,
            message: newUser
        });
    }catch(error){
        return res.status(500).json(`Internal Server Error => ${error}`);
    }

});

usuarioRouter.put("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    
});


export default usuarioRouter;