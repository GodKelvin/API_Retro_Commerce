import {ICompra } from "../interfaces/compra";
import db from "../../database/knexInit";
import { EnderecoCompra } from "./enderecoCompra";
import { Endereco } from "./endereco";
import {IImgur} from '../interfaces/imgur';
import imgurApi from "./imgurApi";

export class Compra{
    private compra: ICompra;
    static readonly camposPublicos = [  "compras.id", "comprovantePagamento", "codigoRastreio", "statusCompraId", 
                                "compras.criadoEm", "compras.atualizadoEm", "enderecoCompraId", "anuncioId"];
    private statusCompra = {
        aguardandoPagamento: "Aguardando Pagamento",
        comprovanteEnviado: "Comprovante Enviado",
        paga: "Paga",
        enviada: "Enviada",
        realizada: "Realizada",
        rejeitada: "Rejeitada"
    };

    static readonly infoCompraWithConsole = [  "compras.id", "comprovantePagamento", "codigoRastreio", 
                                    "statusCompra.status", "compras.criadoEm", "compras.atualizadoEm",
                                    "compras.enderecoCompraId", "compras.anuncioId", "jogos.nome as itemNome",
                                    "anuncios.caixa", "anuncios.manual", "anuncios.preco", "fotosAnuncio.foto as foto",
                                    "usuarios.apelido as anunciante", "consoles.nome as plataforma"];

    static readonly infoCompra = [  "compras.id", "comprovantePagamento", "codigoRastreio", 
                                    "statusCompra.status", "compras.criadoEm", "compras.atualizadoEm",
                                    "compras.enderecoCompraId", "compras.anuncioId", "jogos.nome as itemNome",
                                    "anuncios.caixa", "anuncios.manual", "anuncios.preco", "fotosAnuncio.foto as foto",
                                    "usuarios.apelido as anunciante"];

    static readonly infoVendaWithConsole = [  "compras.id", "comprovantePagamento", "codigoRastreio", 
                                    "statusCompra.status", "compras.criadoEm", "compras.atualizadoEm",
                                    "compras.enderecoCompraId", "compras.anuncioId", "jogos.nome as itemNome",
                                    "anuncios.caixa", "anuncios.manual", "anuncios.preco", "fotosAnuncio.foto as foto",
                                    "usuarios.apelido as comprador", "consoles.nome as plataforma"];

    static readonly infoVenda = [  "compras.id", "comprovantePagamento", "codigoRastreio", 
                                    "statusCompra.status", "compras.criadoEm", "compras.atualizadoEm",
                                    "compras.enderecoCompraId", "compras.anuncioId", "jogos.nome as itemNome",
                                    "anuncios.caixa", "anuncios.manual", "anuncios.preco", "fotosAnuncio.foto as foto",
                                    "usuarios.apelido as comprador"];

    constructor(compra: ICompra){
        this.compra = compra;
    }

    public async aceitarComprovante(): Promise<ICompra>{
        const idPago = await this.searchIdStatusCompra(this.statusCompra.paga);
        const [resUpdate] = await db("compras")
                        .where({"compras.id": this.compra.id})
                        .update({
                            atualizadoEm: db.fn.now(),
                            statusCompraId: idPago
                        }).returning(Compra.camposPublicos) as ICompra[];
        return resUpdate;
    }

    public async recusarComprovante(): Promise<ICompra>{
        const idPago = await this.searchIdStatusCompra(this.statusCompra.rejeitada);
        const [resUpdate] = await db("compras")
                        .where({"compras.id": this.compra.id})
                        .update({
                            atualizadoEm: db.fn.now(),
                            statusCompraId: idPago
                        }).returning(Compra.camposPublicos) as ICompra[];
        return resUpdate;
    }

    public static async getResumoCompra(compraId: number, usuarioId: number): Promise<Compra>{
        return await db("compras")
                    .join("anuncios", "anuncios.id", "compras.anuncioId")
                    .join("usuarios", "usuarios.id", "anuncios.usuarioId")
                    .join("statusCompra", "statusCompra.id", "compras.statusCompraId")
                    .join("jogos", "jogos.id", "anuncios.jogoId")
                    .leftJoin("fotosAnuncio", "anuncios.id", "fotosAnuncio.anuncioId")
                    .distinctOn("compras.id")
                    .where({usuarioCompradorId: usuarioId, "compras.id": compraId})
                    .select(Compra.infoCompra)
                    .first();
    }

    public static async getCompras(usuarioId: number): Promise<Compra[]>{
        return await db("compras")
                    .join("anuncios", "anuncios.id", "compras.anuncioId")
                    .join("usuarios", "usuarios.id", "anuncios.usuarioId")
                    .join("statusCompra", "statusCompra.id", "compras.statusCompraId")
                    .join("jogos", "jogos.id", "anuncios.jogoId")
                    .join("consoles", "consoles.id", "jogos.console_id")
                    .leftJoin("fotosAnuncio", "anuncios.id", "fotosAnuncio.anuncioId")
                    .distinctOn("compras.id")
                    .where({usuarioCompradorId: usuarioId})
                    .select(Compra.infoCompra);
    }

    public static async getVendas(usuarioId: number): Promise<Compra[]>{
        return await db("compras")
                    .join("anuncios", "anuncios.id", "compras.anuncioId")
                    .join("usuarios", "usuarios.id", "compras.usuarioCompradorId")
                    .join("statusCompra", "statusCompra.id", "compras.statusCompraId")
                    .join("jogos", "jogos.id", "anuncios.jogoId")
                    .join("consoles", "consoles.id", "jogos.console_id")
                    .leftJoin("fotosAnuncio", "anuncios.id", "fotosAnuncio.anuncioId")
                    .distinctOn("compras.id")
                    .where({"anuncios.usuarioId": usuarioId})
                    .select(Compra.infoVendaWithConsole);
    }

    public static async getDetalhesVenda(vendaId: number, usuarioId: number): Promise<Compra>{
        return await db("compras")
                    .join("anuncios", "anuncios.id", "compras.anuncioId")
                    .join("usuarios", "usuarios.id", "compras.usuarioCompradorId")
                    .join("statusCompra", "statusCompra.id", "compras.statusCompraId")
                    .join("jogos", "jogos.id", "anuncios.jogoId")
                    .leftJoin("fotosAnuncio", "anuncios.id", "fotosAnuncio.anuncioId")
                    .distinctOn("compras.id")
                    .where({"anuncios.usuarioId": usuarioId, "compras.id": vendaId})
                    .select(Compra.infoVenda)
                    .first();
    }
    
    public static async create(
        statusCompraId: number, usuarioCompradorId: number,
        endereco: Endereco, anuncioId: number
    ): Promise<ICompra | null> {
        let novaCompra: ICompra | null = null;
        await db.transaction(async (trx) => {
            try {
                const idEndereco = await EnderecoCompra.create(trx, endereco.forNewCompra());
                if (!idEndereco) {
                    await trx.rollback();
                    return null;
                }

                const dataNovaCompra: ICompra = {
                    statusCompraId: statusCompraId,
                    usuarioCompradorId: usuarioCompradorId,
                    anuncioId: anuncioId,
                    enderecoCompraId: idEndereco
                };

                await trx("anuncios").where({id: anuncioId}).update({publico: false, atualizado_em: db.fn.now()})
                const [novaCompraRes] = await trx("compras").insert(dataNovaCompra).returning('*') as ICompra[];
                //desativa o anuncio
                novaCompra = novaCompraRes;
            } catch (error) {
                await trx.rollback();
                console.error(">> ROLLBACK creating compra:", error);
                novaCompra = null;
            }
        });

        return novaCompra;
    }

    public static async searchCompradorByIds(id: number, compradorId: number): Promise<Compra | undefined>{
        const res = await db("compras").where({id, usuario_comprador_id: compradorId}).first();
        return res ? new Compra(res) : undefined;
    }

    public static async searchVendedorByIds(id: number, vendedorId: number): Promise<Compra | undefined>{
        const res = await   db("compras")
                            .join("anuncios", "compras.anuncioId", "anuncios.id")
                            .where({"compras.id": id, "anuncios.usuarioId": vendedorId})
                            .select(Compra.camposPublicos)
                            .first();
        return res ? new Compra(res) : undefined;                 
    }

    public async setCodRastreio(codigoRastreio: string): Promise<ICompra>{
        const idCompraEnviada = await this.searchIdStatusCompra(this.statusCompra.enviada);
        const [res] =  await db("compras")
                    .where({id: this.compra.id})
                    .update({
                        atualizadoEm: db.fn.now(),
                        statusCompraId: idCompraEnviada,
                        codigoRastreio
                    }).returning(Compra.camposPublicos) as ICompra[];
        return res;
    }

    public async setCompraRecebida(): Promise<ICompra>{
        const idCompraRecebida = await this.searchIdStatusCompra(this.statusCompra.realizada);
        const [res] =  await db("compras")
                    .where({id: this.compra.id})
                    .update({
                        atualizadoEm: db.fn.now(),
                        statusCompraId: idCompraRecebida
                    }).returning(Compra.camposPublicos) as ICompra[];
        return res;
    }

    public async setComprovantePagamento(dataImage: IImgur): Promise<ICompra>{
        const idComprovanteEnviado = await this.searchIdStatusCompra(this.statusCompra.comprovanteEnviado);
        const [res] = await db("compras")
                    .where({id: this.compra.id})
                    .update({
                        atualizadoEm: db.fn.now(),
                        comprovantePagamento: dataImage.foto,
                        comprovantePagamentoHashDelete: dataImage.fotoHashDelete,
                        statusCompraId: idComprovanteEnviado
                    })
                    .returning(Compra.camposPublicos) as ICompra[];

        return res;
    }

    public getComprovantePagamento(): string | undefined{
        return this.compra.comprovantePagamento;
    }

    public async deleteComprovantePagamento(): Promise<boolean>{
        return await imgurApi.deleteImage(String(this.compra.comprovantePagamentoHashDelete));
    }

    private async searchIdStatusCompra(status: string): Promise<number>{
        const res = await db("statusCompra").select("id").where({status}).first()
        return res ? res.id : undefined
    }
    
}