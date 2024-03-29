import { IAnuncio } from "../interfaces/anuncio";
import { IFotoAnuncio } from "../interfaces/fotoAnuncio";
import db from "../../database/knexInit";
import imgurApi from "../models/imgurApi";

export class Anuncio{
    private anuncio: IAnuncio;
    static readonly camposPublicos = [  "anuncios.id as id", "caixa", "manual", "preco", 
                                        "publico", "descricao", "estadoConservacaoId", 
                                        "anuncios.jogoId", "anuncios.consoleId", "anuncios.criadoEm as criadoEm", 
                                        "anuncios.atualizadoEm as atualizadoEm"];

    static readonly camposPublicosGet = [  "anuncios.id as id", "caixa", "manual", "preco", 
                                            "publico", "descricao", "anuncios.consoleId", "anuncios.criadoEm as criadoEm", 
                                            "anuncios.atualizadoEm as atualizadoEm", "jogos.nome as jogoNome",
                                            "estadosConservacao.estado as conservacao", "fotosAnuncio.foto as foto",
                                            "usuarios.apelido as anunciante"];

    static readonly camposPublicosPessoal = [  "anuncios.id as id", "caixa", "manual", "preco", 
                                            "publico", "descricao", "anuncios.consoleId", "anuncios.criadoEm as criadoEm", 
                                            "anuncios.atualizadoEm as atualizadoEm", "jogos.nome as jogoNome",
                                            "estadosConservacao.estado as conservacao", "fotosAnuncio.foto as foto",
                                            "consoles.nome as plataforma"];


    static readonly camposPublicosDetalhes = [  "anuncios.id as id", "caixa", "manual", "preco", 
                                                "publico", "descricao", "estadosConservacao.estado as conservacao", 
                                                "anuncios.criadoEm as criadoEm", "anuncios.atualizadoEm as atualizadoEm",
                                                "jogos.nome as jogoNome", "usuarios.apelido as anunciante",
                                                "consoles.nome as plataforma"];

    static readonly camposPublicosDetalhesCompra = [    "anuncios.id as id", "caixa", "manual", "preco", 
                                                        "publico", "descricao", "estadosConservacao.estado as conservacao", 
                                                        "anuncios.criadoEm as criadoEm", "anuncios.atualizadoEm as atualizadoEm",
                                                        "jogos.nome as jogoNome", "usuarios.apelido as anunciante", "statusCompra.status",
                                                        "compras.codigoRastreio", "compras.comprovantePagamento", "consoles.nome as plataforma"];

    static readonly camposPublicosDetalhesVenda = [ "anuncios.id as id", "caixa", "manual", "preco", 
                                                    "publico", "descricao", "estadosConservacao.estado as conservacao", 
                                                    "anuncios.criadoEm as criadoEm", "anuncios.atualizadoEm as atualizadoEm",
                                                    "jogos.nome as jogoNome", "usuarios.apelido as comprador", "statusCompra.status",
                                                    "compras.codigoRastreio", "compras.comprovantePagamento", "consoles.nome as plataforma"];
    constructor(anuncio: IAnuncio){
        this.anuncio = anuncio;
    }

    public static async getImagesAnuncio(id: number): Promise<any>{
        return await db("fotosAnuncio").where({anuncio_id: id}).select("foto");
    }

    public static async getAnuncioDetalhes(id: number): Promise<IAnuncio>{
        return await db("anuncios")
                    .join("jogos", "jogos.id", "anuncios.jogoId")
                    .join("estadosConservacao", "estadosConservacao.id", "anuncios.estadoConservacaoId")
                    .join("usuarios", "usuarios.id", "anuncios.usuarioId")
                    .join("consoles", "consoles.id", "jogos.console_id")
                    .where({"anuncios.id": id, publico: true})
                    .select(Anuncio.camposPublicosDetalhes)
                    .first();
    }

    public static async getAnuncioDetalhesCompra(compraId: number, usuarioId: number): Promise<IAnuncio>{
        return await db("anuncios")
                    .join("compras", "compras.anuncioId", "anuncios.id")
                    .join("jogos", "jogos.id", "anuncios.jogoId")
                    .join("estadosConservacao", "estadosConservacao.id", "anuncios.estadoConservacaoId")
                    .join("usuarios", "usuarios.id", "anuncios.usuarioId")
                    .join("statusCompra", "statusCompra.id", "compras.statusCompraId")
                    .join("consoles", "consoles.id", "jogos.console_id")
                    .where({"compras.id": compraId, "compras.usuarioCompradorId": usuarioId})
                    .select(Anuncio.camposPublicosDetalhesCompra)
                    .first();
    }

    public static async getAnuncioDetalhesVenda(compraId: number, usuarioId: number): Promise<IAnuncio>{
        return await db("anuncios")
                    .join("compras", "compras.anuncioId", "anuncios.id")
                    .join("jogos", "jogos.id", "anuncios.jogoId")
                    .join("estadosConservacao", "estadosConservacao.id", "anuncios.estadoConservacaoId")
                    .join("usuarios", "usuarios.id", "compras.usuarioCompradorId")
                    .join("statusCompra", "statusCompra.id", "compras.statusCompraId")
                    .join("consoles", "consoles.id", "jogos.console_id")
                    .where({"compras.id": compraId, "anuncios.usuarioId": usuarioId})
                    .select(Anuncio.camposPublicosDetalhesVenda)
                    .first();
    }

    public static async searchAllAnunciosUsuario(usuarioId: number): Promise<IAnuncio[]>{
        return await db("anuncios")
                    .join("jogos", "jogos.id", "anuncios.jogoId")
                    .join("estadosConservacao", "estadosConservacao.id", "anuncios.estadoConservacaoId")
                    .join("consoles", "consoles.id", "jogos.console_id")
                    .leftJoin("fotosAnuncio", "anuncios.id", "fotosAnuncio.anuncioId")
                    .distinctOn("anuncios.id")
                    .where({"anuncios.usuarioId": usuarioId})
                    .select(this.camposPublicosPessoal);
    }

    public static async searchWithPrecos(query: any): Promise<IAnuncio[]>{
        let consulta =  db("anuncios")
                        .join("jogos", "jogos.id", "anuncios.jogo_id")
                        .join("estadosConservacao", "estados_conservacao.id", "anuncios.estadoConservacaoId")
                        .join("usuarios", "usuarios.id", "anuncios.usuarioId")
                        .join("consoles", "consoles.id", "jogos.console_id")
                        .leftJoin("fotosAnuncio", "anuncios.id", "fotosAnuncio.anuncioId")
                        .select(
                            db.raw(`MAX(fotos_anuncio.foto) AS foto`),
                            db.raw(`MIN("anuncios"."preco") OVER (PARTITION BY "jogos"."id") AS preco_minimo`),
                            db.raw(`AVG("anuncios"."preco") OVER (PARTITION BY "jogos"."id") AS preco_Medio`),
                            db.raw(`MAX("anuncios"."preco") OVER (PARTITION BY "jogos"."id") AS preco_maximo`),
                            'caixa',
                            'manual',
                            'preco',
                            'publico',
                            'descricao',
                            'anuncios.jogo_id',
                            'anuncios.console_id',
                            'anuncios.criado_em',
                            'anuncios.atualizado_em',
                            'jogos.nome as jogoNome',
                            'estados_conservacao.estado as conservacao',
                            'usuarios.apelido as anunciante',
                            'anuncios.id',
                            'consoles.nome as plataforma'
                        )
                        .groupBy("anuncios.id", "jogos.id", "estadosConservacao.estado", "usuarios.apelido", "consoles.nome")

        if(query.dataInicio){
            consulta = consulta.where("anuncios.criado_em", '>=', query.dataInicio)
        }

        if(query.dataFim){
            consulta = consulta.where("anuncios.criado_em", '<', query.dataFim)
        }

        if(query.jogo){
            consulta = consulta.where("jogos.nome", "ilike", `%${query.jogo}%`)
        }

        if(query.limit){
            consulta = consulta.limit(30)
        }

        //@TODO: Paginar
        return await consulta.where({publico: true, "usuarios.ativo": true});
    }

    public static async search(query: any): Promise<IAnuncio[]>{
        let consulta =  db("anuncios")
                        .join("jogos", "jogos.id", "anuncios.jogo_id")
                        .join("estadosConservacao", "estados_conservacao.id", "anuncios.estadoConservacaoId")
                        .join("usuarios", "usuarios.id", "anuncios.usuarioId")
                        .leftJoin("fotosAnuncio", "anuncios.id", "fotosAnuncio.anuncioId")
                        .distinctOn("anuncios.id")

        if(query.dataInicio){
            consulta = consulta.where("anuncios.criado_em", '>=', query.dataInicio)
        }

        if(query.dataFim){
            consulta = consulta.where("anuncios.criado_em", '<', query.dataFim)
        }

        if(query.jogo){
            consulta = consulta.where("jogos.nome", "ilike", `%${query.jogo}%`)
        }

        //@TODO: Paginar
        return await consulta.select(this.camposPublicosGet).where({publico: true, "usuarios.ativo": true});
    }

    public static async getByUsuario(usuario: string): Promise<IAnuncio[]>{
        return await db("anuncios")
                    .join("usuarios", "anuncios.usuario_id", "usuarios.id")
                    .where({"usuarios.ativo": true, "anuncios.publico": true})
                    .whereRaw("LOWER(usuarios.apelido) = ?", usuario.toLowerCase())
                    .select(Anuncio.camposPublicos)
    }


    public static async getById(id: number): Promise<IAnuncio>{
        return await db("anuncios").select(Anuncio.camposPublicos).where({id, publico: true}).first();
    }

    //Realiza busca com base no id do anuncio e do usuario
    public static async searchByIds(usuarioId: number, id: number): Promise<Anuncio | undefined>{
        const res = await db("anuncios").where({usuarioId, id}).first();
        return res ? new Anuncio(res): undefined;
    }

    public async update(fieldsUpdate: IAnuncio): Promise<IAnuncio>{
        const res =  await db("anuncios")
                    .where({id: this.anuncio.id})
                    .update({...fieldsUpdate, ...{atualizado_em: db.fn.now()}})
                    .returning(Anuncio.camposPublicos) as IAnuncio

        return res;
    }

    public async comprado(): Promise <boolean>{
        //Status compra 5 & 6: Rejeitada e Cancelada
        const res = await db("compras").where({anuncio_id: this.anuncio.id}).whereIn("status_compra_id", [1,2,3,4,5,6]).first();
        return !!res;
    }


    public static validatorFieldsForCreate(anuncio: any): Array<string>{
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

    public static async findById(id: number): Promise<Anuncio | undefined>{
        const res = await db("anuncios").where({id}).first();
        return res ? new Anuncio(res) : undefined;
    }

    public static async findForCompra(id: number): Promise<Anuncio | undefined>{
        const res = await db("anuncios").where({id, publico: true}).first();
        return res ? new Anuncio(res) : undefined;
    }

    public getUsuarioId(): number{
        return this.anuncio.usuarioId;
    }

    public getId(): number{
        return this.anuncio.id;
    }
    
    public async deleteAllImgs(): Promise<any>{
        //Captura todas as fotos do anuncio
        const imgsAnuncio: IFotoAnuncio[] = await db("fotos_anuncio").where({anuncioId: this.getId()}) as IFotoAnuncio[];

        //Apaga todas as imgs do imgUr
        for(const img of imgsAnuncio){
            imgurApi.deleteImage(img.fotoHashDelete)
        }

        const resDelete = await db("fotos_anuncio").where({anuncioId: this.getId()}).del();
        return resDelete;
    }

    public async deleteAnuncio(): Promise<any>{
        //Primeiro apaga todas as imagens do anuncio
        await this.deleteAllImgs();
        const res = await db("anuncios").where({id: this.getId()}).del();
        return res;
    }

    //ID disponivel somente para atualizacao
    public static validateFieldsDisponiveis(anuncio: any, id?: string): Array<string>{
        const errors: string[] = [];
        const atributosDisponiveis = ["caixa", "manual", "preco", "publico", "descricao", "estadoConservacaoId","jogoId", "consoleId"];
        id !== undefined ? atributosDisponiveis.push("id") : null;

        const chaveAnuncio = Object.keys(anuncio);

        const atributosIndisponiveis = chaveAnuncio.filter(chave => {
            return !atributosDisponiveis.includes(chave)
        });

        if(atributosIndisponiveis.length){
            errors.push(`Atributos indisponiveis: ${atributosIndisponiveis.join(", ")}`);
        }
        return errors
    }

    public static async create(anuncio: IAnuncio): Promise<Anuncio>{
        const [novoAnuncio] = await db("anuncios").insert(anuncio).returning('*') as IAnuncio[];
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