import {IUsuario} from '../interfaces/usuario';
export class Usuario{
    usuario: IUsuario;
    constructor(usuario: IUsuario){
        this.usuario = usuario;
    }
}