import {IUsuario} from '../interfaces/usuario';
export class Usuario{
    usuario: IUsuario;
    errors: string[] = [];

    constructor(usuario: any){
        this.validator(usuario);
        this.usuario = usuario;
    }


    private validator(usuario: any): boolean{
        //@TODO: Validar formato dos campos
        //Se estiver algum campo pendente
        const atributos = ["nome", "senha", "email", "dataNascimento", "apelido"];
        const atributosPendentes = atributos.filter(chave => {
            return usuario[chave] == undefined;
        });

        //Se tiver algum atributo pendente
        if(atributosPendentes.length){
            this.errors.push(`Atributos pendentes: ${atributosPendentes.join(", ")}`);
            return false
        }
        return true;
    }
}