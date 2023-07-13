import {IUsuario} from '../interfaces/usuario';
import db from "../../database/knexInit";
import bcrypt from "bcrypt"

export class Usuario{
    usuario: IUsuario;
    
    constructor(usuario: IUsuario){
        this.usuario = usuario;
    }

     /*-----Metodos de instancia-----*/
     getId(): number | undefined{
        return this.usuario.id;
    }

    getNome(): string{
        return this.usuario.nome;
    }

    getApelido(): string{
        return this.usuario.apelido;
    }

    /*-----Metodos Estaticos-----*/
    static async create(usuario: any): Promise<IUsuario>{
        usuario.senha = this.criptoSenha(usuario.senha);
        return await   db("usuarios").insert(usuario)
                        .returning(["foto", "nome", "bio", "apelido", "avaliacao"]) as IUsuario
    }

    static validatorFieldsForCreate(usuario: any): Array<string>{
        //@TODO: Validar formato dos campos
        //Se estiver algum campo pendente
        const errors: string[] = [];
        const atributos = ["nome", "senha", "email", "dataNascimento", "apelido"];
        const atributosPendentes = atributos.filter(chave => {
            return usuario[chave] == undefined;
        });

        //Se tiver algum atributo pendente
        if(atributosPendentes.length){
            errors.push(`Atributos pendentes: ${atributosPendentes.join(", ")}`);
        }
        return errors
        
    }

    static async emailExiste(email: string): Promise<boolean>{
        const res = await   db("usuarios")
                            .whereRaw("lower(email) = ?", email.toLowerCase())
                            .count().first();

        //Operador NOT DUPLO que converte os valores para boolean                            
        return !!res && !!Number(res["count"]);                            
    }

    static async apelidoExiste(apelido: string): Promise<boolean>{
        const res = await db("usuarios")
                    .whereRaw("lower(apelido) = ?", apelido.toLowerCase())
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
        const login = await this.compareSenhaCripto(senha, user);
        if(!login) return false;
        return new Usuario(user);

    }

    /*-----Metodos privados-----*/
    private static criptoSenha(senha: string): string{
        return bcrypt.hashSync(senha, 9);
    }

    private static async compareSenhaCripto(senha: string, usuario: IUsuario): Promise<boolean>{
        return bcrypt.compare(senha, usuario.senha);
    }

}