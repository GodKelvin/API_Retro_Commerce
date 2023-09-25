import db from "../../database/knexInit";
import { IEstadoConservacao } from "../interfaces/estadoConservacao";

export class EstadoConservacao{
    constructor(){};
    public static async get(): Promise<IEstadoConservacao[]>{
        return await db("estadosConservacao").select("id", "estado");
    }
}
