export interface IAnuncio{
    id: number;
    caixa: boolean;
    manual: boolean;
    preco: number;
    publico: boolean;
    descricao: string;
    criadoEm: Date;
    atualizadoEm: Date;
    estadoConservacaoId: number;
    jogoId?: number;
    consoleId: number;
    usuarioId: number;
    imagens?: Array<string>;
    //Quando se busca somente o resumo dos anuncios
    foto?: string;
    precoMinimo?: number;
    precoMedio?: number;
    precoMaximo?: number;
    conservacao?: string;
} 