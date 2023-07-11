import {Router} from "express";
import { Request, Response } from "express";
import usuarioRouter from "../controllers/usuario";
import authRouter from "../controllers/login";

const routes = Router();
routes.get('/', async(_req: Request, res: Response) => {
    res.status(200).json({"Feito por: Kelvin Lehrback":"-> https://github.com/GodKelvin"});
});

//Importacoes das rotas
routes.use("/usuario", usuarioRouter);
routes.use("/login", authRouter)

export default routes;