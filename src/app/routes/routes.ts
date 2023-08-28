import {Router} from "express";
import { Request, Response } from "express";
import usuarioRouter from "../controllers/usuario";
import authRouter from "../controllers/login";
import jogoRouter from "../controllers/jogo";
import anuncioRouter from "../controllers/anuncio";
import compraRouter from '../controllers/compra';

const routes = Router();
routes.get('/', async(_req: Request, res: Response) => {
    res.status(200).json({"Feito por: Kelvin Lehrback":"-> https://github.com/GodKelvin"});
});

//Importacoes das rotas
routes.use("/usuarios", usuarioRouter);
routes.use("/login", authRouter);
routes.use("/jogos", jogoRouter);
routes.use("/anuncios", anuncioRouter);
routes.use("/compras", compraRouter);

export default routes;