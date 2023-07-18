import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
import auth from "../middlewares/auth";
import { Auth } from "../models/auth";
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
            message: "Email indisponivel"
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

usuarioRouter.patch("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        if(!await Auth.checkUserBodyToken(String(req.headers.authorization), req.body.originalApelido)) return res.status(401).json({
            success: false,
            message: "Acesso negado"
        });

        const validate = Usuario.validateFieldsForUpdate(req.body);
        if(validate.length) return res.status(400).json({
            success: false,
            message: validate
        });

        if(req.body.email && await Usuario.emailExiste(req.body.email)) return res.status(400).json({
            success: false,
            message: "Email indisponivel"
        });

        if(req.body.apelido && await Usuario.apelidoExiste(req.body.apelido)) return res.status(400).json({
            success: false,
            message: "Apelido indisponivel"
        });

        const originalApelido = req.body.originalApelido
        delete req.body.originalApelido;
        const usuario = new Usuario(req.body);
        const resUpdate = await usuario.update(originalApelido);

        return res.status(200).json({
            success: true,
            message: resUpdate
        });
    }catch(error){
        res.status(500).json({
            error: error
        })
    }
});

usuarioRouter.delete("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    if(!await Auth.checkUserBodyToken(String(req.headers.authorization), req.body.apelido)) return res.status(401).json({
        success: false,
        message: "Acesso negado"
    });


});


export default usuarioRouter;