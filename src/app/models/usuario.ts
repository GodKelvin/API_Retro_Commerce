import {IUsuario} from '../interfaces/usuario';
import db from "../../database/knexInit";
import bcrypt from "bcrypt"

export class Usuario{
    usuario: IUsuario;
    static readonly camposPublicos  = ["foto", "nome", "bio", "apelido", "avaliacao"];

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

    getEmail(): string{
        return this.usuario.email;
    }
    
    async update(originalApelido: string): Promise<IUsuario>{
        //Caso queira mudar a senha
        if(this.usuario.senha){
            this.usuario.senha = Usuario.criptoSenha(this.usuario.senha);
        }

        const res =  await db("usuarios")
                    .where({apelido: originalApelido})
                    .update({...this.usuario, ...{atualizado_em: db.fn.now()}})
                    .returning(Usuario.camposPublicos) as IUsuario;
        return res;
    }

    /*-----Metodos Estaticos-----*/
    static async create(usuario: any): Promise<Usuario>{
        usuario.senha = this.criptoSenha(usuario.senha);
        const idUsuarioComum = await this.searchIdUsuarioComum();
        if(idUsuarioComum) usuario = {...usuario, ...{tipo_usuario_id: idUsuarioComum}}

        //Desestruturando o primeiro elemento do array e transformando num IUsuario
        const [newUser] =  await   db("usuarios").insert(usuario)
                        .returning(["foto", "nome", "bio", "apelido", "avaliacao", "email"]) as IUsuario[];
        return new Usuario(newUser);
    }

    static async confirmEmail(email: string): Promise<IUsuario>{
        return await db("usuarios").where({email})
                    .update({ativo: true, emailConfirmado: true})
                    .returning(Usuario.camposPublicos);
    }

    static async desativa(apelido: string): Promise<IUsuario>{
        return await db("usuarios").where({apelido: apelido})
                    .update({ativo: false})
                    .returning(Usuario.camposPublicos);
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

    static validateFieldsForUpdate(usuario: any): Array<string>{
        const errors: string[] = [];
        const atributosDisponiveis = ["foto", "email", "nome", "apelido", "senha", "dataNascimento", 
                            "bio", "tipo_usuario_id", "status_usuario_id"];

        const chavesUsuario = Object.keys(usuario);

        const atributosIndisponiveis = chavesUsuario.filter(chave => {
            return !atributosDisponiveis.includes(chave)
        });

        if(atributosIndisponiveis.length){
            errors.push(`Atributos indisponiveis: ${atributosIndisponiveis.join(", ")}`);
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
    static async searchFullByApelido(apelido: string): Promise <Usuario | undefined>{
        const res = await db("usuarios").where({apelido: apelido}).first();
        return res ? new Usuario(res) : res;
    }

    //Nao retorna campos sensiveis
    static async searchByApelido(apelido: string): Promise <Usuario | undefined>{
        const res = await db("usuarios")
                .select(this.camposPublicos)
                .where({ativo: true})
                .whereRaw("lower(apelido) = ?", apelido.toLowerCase())
                .first();
        return res ? new Usuario(res) : res;
    }

    static async searchForCheckToken(apelido: string): Promise <Usuario | undefined>{
        const res = await db("usuarios")
                .select("apelido", "id")
                .where({ativo: true})
                .whereRaw("lower(apelido) = ?", apelido.toLowerCase())
                .first();
        return res ? new Usuario(res) : res;
    }

    static async searchForConfirmEmail(email: string): Promise<Usuario | undefined>{
        const res =  await db("usuarios")
                    .select("email")
                    .where({ativo: true})
                    .whereRaw("lower(email) = ?", email.toLowerCase())
                    .first();
        return res ? new Usuario(res) : res;
    }

    static async usuarioLogin(email: string, senha: string): Promise<Usuario | false>{
        const user = await db<IUsuario>("usuarios").where({email: email, ativo: true, emailConfirmado: true}).first(); 
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

    private static async searchIdUsuarioComum(): Promise<number | undefined>{
        const res = await db("tipos_usuarios").where({tipo: "comum"}).select("id").first();
        return res ? res.id : undefined;
    }

}