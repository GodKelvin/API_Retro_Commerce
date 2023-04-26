import {Router} from "express";
import { Request, Response } from "express";

const routes = Router();
routes.get('/', async(_req: Request, res: Response) => {
    res.status(200).json({"Feito por: Kelvin Lehrback":"-> https://github.com/GodKelvin"});
});

//Importacoes das rotas

export default routes;