import db from "../../database/knexInit";
import {IEndereco} from "../interfaces/endereco";

export class Endereco{
    private endereco: IEndereco;
    static readonly camposPublicos = ['id', 'pais', 'estado', 'cidade', 'bairro', 'rua', 'numero', 'cep', 'nome', 'pontoReferencia', 'criadoEm', 'atualizadoEm'];
    constructor(endereco: IEndereco){
        this.endereco = endereco;
    }

    public static async create(endereco: IEndereco): Promise<IEndereco>{
        const [novoEndereco] = await db("enderecos").insert(endereco).returning(this.camposPublicos) as IEndereco[];
        return novoEndereco;
    }

    public static async searchByUsuarioId(usuarioId: number): Promise<IEndereco[]>{
        return await db("enderecos").select(Endereco.camposPublicos).where({usuarioId}) as IEndereco[];
    }

    public static async searchByid(id: number, usuarioId: number): Promise<Endereco | undefined>{
        const res = await db("enderecos").select(Endereco.camposPublicos).where({id, usuarioId}).first();
        return res ? new Endereco(res) : undefined;
    }

    public forNewCompra(): IEndereco{
        const enderecoFornewCompra = this.endereco;
        delete enderecoFornewCompra.id;
        delete enderecoFornewCompra.criadoEm;
        delete enderecoFornewCompra.atualizadoEm;
        delete enderecoFornewCompra.nome;
        delete enderecoFornewCompra.usuarioId;
        return enderecoFornewCompra;
    }



    //*---------METODOS PRIVADOS--------*//
    public static validatorFieldsForCreate(endereco: any): Array<string>{
        //@TODO: Validar formato dos campos
        let errors: string[] = [];
        const atributos = ['pais', 'estado', 'cidade', 'bairro', 'rua', 'numero', 'cep', 'nome', 'pontoReferencia'];
        const atributosPendentes = atributos.filter(chave => {
            return endereco[chave] == undefined;
        });

        //Se tiver algum atributo pendente
        if(atributosPendentes.length){
            errors.push(`Atributos pendentes: ${atributosPendentes.join(", ")}`);
        }

        //Verifica se foi passado algo nao permitido
        errors = errors.concat(this.validateFieldsDisponiveis(endereco));
        return errors
    }

    public static validateFieldsDisponiveis(anuncio: any): Array<string>{
        const errors: string[] = [];
        const atributosDisponiveis = ['pais', 'estado', 'cidade', 'bairro', 'numero', 'cep', 'nome', 'pontoReferencia', "rua"];
        const chaves = Object.keys(anuncio);

        const atributosIndisponiveis = chaves.filter(chave => {
            return !atributosDisponiveis.includes(chave)
        });

        if(atributosIndisponiveis.length){
            errors.push(`Atributos indisponiveis: ${atributosIndisponiveis.join(", ")}`);
        }
        return errors
    }
}