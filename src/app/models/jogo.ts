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

    static async search(query: any): Promise<IJogo[]>{

        const colunas = ["jogos.id as id", "jogos.nome", "jogos.publicadora", "jogos.desenvolvedora", "jogos.lancamento_jp",
                        "jogos.lancamento_na", "jogos.lancamento_pal", "consoles.nome AS plataforma"]

        let consulta = db("jogos").join("consoles", "jogos.console_id", "consoles.id")

        if(query.plataforma){
            consulta = consulta.whereRaw("LOWER(consoles.abreviacao) = LOWER(?)", query.plataforma)
        }

        if(query.jogo){
            consulta = consulta.where("jogos.nome", "ilike", `%${query.jogo}%`)
        }

        //@TODO: Buscar via demais parametros?
        return await consulta.select(colunas);
    }
}