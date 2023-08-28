export interface ICompra{
    id: number;
    valorTotal: number;
    comprovantePagamento: string;
    codigoRastreio: string;
    statusCompraId: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
    usuarioCompradorId: string;
    enderecoCompraId: number;
} 