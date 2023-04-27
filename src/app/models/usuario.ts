import {IUsuario} from '../interfaces/usuario';
import db from "../../database/knexInit";

export class Usuario{
    usuario: IUsuario;
    errors: string[] = [];

    constructor(usuario: any){
        this.validator(usuario);
        this.usuario = usuario;
    }

    async create(){
        if(!this.errors.length){
            db("usuarios").insert(this.camelToSnake(this.usuario)).returning('*')
            .then(res => {
                console.log(res);
                db.destroy();
            });
        }
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

    private camelToSnake(objeto: any): any{
        const keys = Object.keys(objeto);
        const convertObject: { [key: string]: any } = {};

        keys.forEach((key) => {
            const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            convertObject[newKey] = objeto[key];
        })

        return convertObject;
    }
}