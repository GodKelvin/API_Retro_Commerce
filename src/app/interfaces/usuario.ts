export interface IUsuario{
    id?: number;
    foto?: string;
    email: string;
    nome: string;
    senha: string;
    ativo: boolean;
    dataNascimento: Date;
    bio?: string;
    avaliacao?: number;
    tipoUsuarioID: number;
    criadoEm?: Date;
    atualizadoEm?: Date;
    apelido: string;
}