import { Request, Response, Router } from "express";
import auth from "../middlewares/auth";
import { Endereco } from "../models/endereco";
import { IEndereco } from "../interfaces/endereco";

const enderecoRouter = Router();

enderecoRouter.get("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const enderecos = await Endereco.searchByUsuarioId(res.locals.usuarioId);
        return res.status(200).json({
            success: true,
            message: enderecos
        });
    }catch(error){
        console.log(`>> ERROR GET ENDERECOS: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao obter endereco. Por favor, tente mais tarde."
        });
    }
});

enderecoRouter.get("/:id", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const endereco = await Endereco.searchByid(Number(req.params.id),res.locals.usuarioId);
        if(!endereco) return res.status(400).json({
            success: false,
            message: "Endereco nao encontrado"
        });

        return res.status(200).json({
            success: true,
            message: endereco.getData()
        });
    }catch(error){
        console.log(`>> ERROR GET ENDERECO ID: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao obter endereco. Por favor, tente mais tarde."
        });
    }
});

enderecoRouter.get("/compras/:id", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const endereco = await Endereco.getEnderecoCompra(Number(req.params.id),res.locals.usuarioId);
        if(!endereco) return res.status(400).json({
            success: false,
            message: "Endereco nao encontrado"
        });

        return res.status(200).json({
            success: true,
            message: endereco.getData()
        });
    }catch(error){
        console.log(`>> ERROR GET ENDERECO COMPRA ID: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao obter endereco. Por favor, tente mais tarde."
        }); 
    }
});

enderecoRouter.post("/", auth.checkToken, async(req: Request, res: Response): Promise<any> => {
    try{
        const validatorFields = Endereco.validatorFieldsForCreate(req.body);
        if(validatorFields.length) return res.status(400).json({
            success: false,
            message: validatorFields
        });

        const novoEndereco: IEndereco = req.body;
        novoEndereco.usuarioId = res.locals.usuarioId;
        const endereco = await Endereco.create(novoEndereco);

        return res.status(200).json({
            success: true,
            message: endereco
        });
    }catch(error){
        console.log(`>> ERROR POST ENDERECO: ${error}.`);
        return res.status(500).json({
            success: false,
            message: "Erro ao inserir endereco. Por favor, tente mais tarde."
        });
    }
});

export default enderecoRouter;