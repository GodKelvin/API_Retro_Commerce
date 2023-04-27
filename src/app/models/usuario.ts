import {IUsuario} from '../interfaces/usuario';
import db from "../../database/knexInit";

export class Usuario{
    usuario: IUsuario;
    errors: string[] = [];

    constructor(usuario: any){
        this.validator(usuario);
        this.usuario = usuario;
    }

    create(): boolean{
        if(!this.errors.length){
            db("usuarios").insert(this.usuario).returning('*')
            .then((res: IUsuario[]) => {
                this.usuario = res[0];
                console.log(this.usuario);
                return true
            });
        }
        return false;
    }

    async emailExiste(): Promise<boolean>{
        const res = await db("usuarios").where({ email: this.usuario.email }).count().first();
        if (res && res["count"]) return false;
        return true;
    }

    // apelidoExiste(): boolean{
    //     const res = db("usuarios").where({apelido: this.usuario.apelido}).count();
    //     if(res.length) return true;
    //     return false;
    // }

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