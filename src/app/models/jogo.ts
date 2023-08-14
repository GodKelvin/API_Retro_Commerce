import { IJogo } from "../interfaces/jogo";
import db from "../../database/knexInit";

export class Jogo{
    constructor(){}

    static async getByConsole(abreviacaoConsole: string): Promise<IJogo[]>{
        return await db("jogos")
                    .join("consoles", "jogos.console_id", "consoles.id")
                    .whereRaw("LOWER(consoles.abreviacao) = ?", abreviacaoConsole.toLocaleLowerCase())
                    .select(["jogos.nome", "jogos.desenvolvedora", "jogos.publicadora", 
                    "jogos.lancamento_jp", "jogos.lancamento_na", "jogos.lancamento_pal"]) as IJogo[];
    }
}