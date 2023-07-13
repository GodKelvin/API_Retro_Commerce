import {IUsuario} from '../interfaces/usuario';
import db from "../../database/knexInit";
import bcrypt from "bcrypt"

export class Usuario{
    usuario: IUsuario;
    errors: string[] = [];

    constructor(usuario: IUsuario){
        this.validator(usuario);
        this.usuario = usuario;
    }

    async create(): Promise<boolean>{
        if(!this.errors.length){
            const res = await   db("usuarios").insert(this.usuario)
                                .returning(["foto", "nome", "bio", "apelido", "avaliacao"]) as IUsuario[]
            this.usuario = res[0];
            return true
        }
        return false;
    }

    async emailExiste(): Promise<boolean>{
        const res = await   db("usuarios")
                            .whereRaw("lower(email) = ?", this.usuario.email.toLowerCase())
                            .count().first();

        //Operador NOT DUPLO que converte os valores para boolean                            
        return !!res && !!Number(res["count"]);                            
    }

    getId(): number | undefined{
        return this.usuario.id;
    }

    getNome(): string{
        return this.usuario.nome;
    }

    getApelido(): string{
        return this.usuario.apelido;
    }

    async apelidoExiste(): Promise<boolean>{
        const res = await db("usuarios")
                    .whereRaw("lower(apelido) = ?", this.usuario.apelido.toLowerCase())
                    .count().first();
        //Operador NOT DUPLO que converte os valores para boolean
        return !!res && !!Number(res["count"]);
    }


    //Retorna campos sensiveis
    static async searchFullByApelido(apelido: string): Promise <IUsuario | undefined>{
        return  db("usuarios").where({apelido: apelido}).first();
    }

    //Nao retorna campos sensiveis
    static async searchByApelido(apelido: string): Promise <IUsuario | undefined>{
        return  db("usuarios")
                .select("foto", "nome", "apelido", "bio", "avaliacao")
                .whereRaw("lower(apelido) = ?", apelido.toLowerCase())
                .first();
    }

    static async usuarioLogin(email: string, senha: string): Promise<Usuario | false>{
        //return db<IUsuario>("usuarios").where({email, senha}).first(); 
        const user = await db<IUsuario>("usuarios").where({email}).first(); 
        if(!user) return false;
        const login = await Usuario.compareSenhaCripto(senha, user);
        if(!login) return false;
        return new Usuario(user);

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

    criptoSenha(): void{
        this.usuario.senha = bcrypt.hashSync(this.usuario.senha, 9);
    }

    static async compareSenhaCripto(senha: string, usuario: IUsuario): Promise<boolean>{
        return bcrypt.compare(senha, usuario.senha);
    }

}