export interface ICompra{
    id?: number;
    comprovantePagamento?: string;
    codigoRastreio?: string;
    statusCompraId: number;
    criadoEm?: Date;
    atualizadoEm?: Date;
    usuarioCompradorId: number;
    enderecoCompraId: number;
    anuncioId: number;
} 