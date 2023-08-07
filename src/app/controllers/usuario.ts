import { Request, Response, Router } from "express";
import { Usuario } from "../models/usuario";
import auth from "../middlewares/auth";
import { Mailer } from "../models/mailer";
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
        const linkConfirmEmail = await Mailer.EnviaEmailConfirmacao(newUser, String(req.headers.host));

        return res.status(200).json({
            success: true,
            message: {link_confirm_email: linkConfirmEmail}
        });
    }catch(error){
        return res.status(500).json(`Internal Server Error => ${error}`);
    }

});

usuarioRouter.patch("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
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

        const usuario = new Usuario(req.body);
        const resUpdate = await usuario.update(res.locals.apelido);

        return res.status(200).json({
            success: true,
            message: resUpdate
        });
    }catch(error){
        return res.status(500).json({
            error: error
        })
    }
});

usuarioRouter.delete("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const resDesativa = await Usuario.desativa(res.locals.apelido);
        return res.status(200).json({
            success: true,
            message: resDesativa
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            error: error
        });
    }
});

usuarioRouter.get("/email/confirmation/:token", auth.checkTokenForEmailConfirm, async(req: Request, res: Response): Promise<any> => {
    try{
        const usuario = await Usuario.confirmEmail(res.locals.email);
        return res.status(200).json({
            success: true,
            message: usuario
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error
        });
    }
})


export default usuarioRouter;