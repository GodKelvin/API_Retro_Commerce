export interface IJogo{
    id?:number;
    nome: string;
    desenvolvedora: string;
    publicadora: string;
    lancamento_jp: Date;
    lancamento_na: Date;
    lancamento_pal: Date;
    consoleId: number;
    criadoEm: Date;
    atualizadoEm: Date;
}