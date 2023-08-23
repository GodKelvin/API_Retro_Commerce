import { IAnuncio } from "../interfaces/anuncio";
import db from "../../database/knexInit";
import imgurApi from "../models/imgurApi";

export class Anuncio{
    private anuncio: IAnuncio;
    constructor(anuncio: IAnuncio){
        this.anuncio = anuncio;
    }


    static validatorFieldsForCreate(anuncio: any): Array<string>{
        //@TODO: Validar formato dos campos
        let errors: string[] = [];
        const atributos = ["caixa", "manual", "preco", "publico", "descricao", "estadoConservacaoId"];
        const atributosPendentes = atributos.filter(chave => {
            return anuncio[chave] == undefined;
        });

        if(!anuncio.consoleId && !anuncio.jogoId){
            atributosPendentes.push("Item");
        }

        //Se tiver algum atributo pendente
        if(atributosPendentes.length){
            errors.push(`Atributos pendentes: ${atributosPendentes.join(", ")}`);
        }

        //Verifica se foi passado algo nao permitido
        errors = errors.concat(this.validateFieldsDisponiveis(anuncio));
        return errors
    }

    private static validateFieldsDisponiveis(anuncio: any): Array<string>{
        const errors: string[] = [];
        const atributosDisponiveis = ["caixa", "manual", "preco", "publico", "descricao", "estadoConservacaoId","jogoId", "consoleId"];

        const chaveAnuncio = Object.keys(anuncio);

        const atributosIndisponiveis = chaveAnuncio.filter(chave => {
            return !atributosDisponiveis.includes(chave)
        });

        if(atributosIndisponiveis.length){
            console.log(atributosIndisponiveis)
            errors.push(`Atributos indisponiveis: ${atributosIndisponiveis.join(", ")}`);
        }
        return errors
    }

    public static async create(anuncio: IAnuncio): Promise<Anuncio>{
        const [novoAnuncio] = await db("anuncios").insert(anuncio).returning('*') as IAnuncio[]
        return new Anuncio(novoAnuncio);
    }

    public async insereImagens(imagens: any): Promise<any>{
        let dataImg = await imgurApi.uploadMultiplesImage(imagens);
        dataImg = dataImg.map(img =>  ({ ...img, anuncioId: this.anuncio.id }));
        
        const response =  await db("fotos_anuncio").insert(dataImg).returning('*');
        return response;
    }

    public static async getByJogo(jogoId: number): Promise<IAnuncio[]>{
        return await db("anuncios").where(jogoId) as IAnuncio[]
    }
}