import {ICompra } from "../interfaces/compra";
import db from "../../database/knexInit";
import { EnderecoCompra } from "./enderecoCompra";
import { Endereco } from "./endereco";
import {IImgur} from '../interfaces/imgur';
import imgurApi from "./imgurApi";

export class Compra{
    private compra: ICompra;
    private camposPublicos = [  "id", "comprovantePagamento", "codigoRastreio", "statusCompraId", 
                                "criadoEm", "atualizadoEm", "enderecoCompraId", "anuncioId"];
    private statusCompra = {
        aguardandoPagamento: "Aguardando Pagamento",
        comprovanteEnviado: "Comprovante Enviado",
        paga: "Paga",
        enviada: "Enviada",
        realizada: "Realizada",
        rejeitada: "Rejeitada"
    };

    constructor(compra: ICompra){
        this.compra = compra;
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

    public static async searchByIds(id: number, compradorId: number): Promise<Compra | undefined>{
        const res = await db("compras").where({id, usuario_comprador_id: compradorId}).first();
        return res ? new Compra(res) : undefined;
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
                    .returning(this.camposPublicos) as ICompra[];

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