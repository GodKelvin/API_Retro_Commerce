import db from "../../database/knexInit";
import { IEndereco } from "../interfaces/endereco";

export class EnderecoCompra{
    constructor() {}

    //Como importar o tipo Knex.transaction?
    public static async create(trx: any, endereco: IEndereco): Promise<number | undefined>{
        const [res] = await trx("enderecoCompra").insert(endereco).returning(["id"]) as IEndereco[];
        return res ? res.id : undefined

    }
}