import {ICompra } from "../interfaces/compra";
import db from "../../database/knexInit";
import { EnderecoCompra } from "./enderecoCompra";
import { Endereco } from "./endereco";

export class Compra{
    private compra: ICompra
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

                const [novaCompraRes] = await trx("compras").insert(dataNovaCompra).returning('*') as ICompra[];
                novaCompra = novaCompraRes;
            } catch (error) {
                await trx.rollback();
                console.error(">> ROLLBACK creating compra:", error);
                novaCompra = null;
            }
        });

        return novaCompra;
    }
    

}