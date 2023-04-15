import express, {Request, Response} from "express";
import indexRoutes from "./routes/indexRoutes";
import dotenv from "dotenv";

//Carregando variaveis de ambiente
dotenv.config();

const server = express();
server.use(indexRoutes);