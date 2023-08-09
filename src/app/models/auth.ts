import { ITokenEmaiLConfirm } from "../interfaces/tokenEmailConfirm";
import { ITokenLoginJWT } from "../interfaces/tokenLoginJWT";
import { IUsuario } from "../interfaces/usuario";
import { Usuario } from "./usuario";
import jwt from "jsonwebtoken";

export class Auth{
    static secret: string  = process.env.TOKEN_JWT || "";
    constructor(){}

    
    static generateTokenLogin(usuario: Usuario): string{
        const decodedToken: ITokenLoginJWT = {
            nome: usuario.getNome(),
            apelido: usuario.getApelido()
        }
        return this.generateToken(decodedToken);
    }
    
    static generateTokenEmailConfirm(usuario: Usuario): string{
        const decodedToken: any = {
            email: usuario.getEmail(),
            apelido: usuario.getApelido()
        }
        return this.generateToken(decodedToken);
    }
    
    static async verifyToken(token: string): Promise<Usuario | undefined>{
        let secret = process.env.TOKEN_JWT || "";
        const data = jwt.verify(String(token), secret) as ITokenLoginJWT;
        return Usuario.searchByApelido(data.apelido);        
    }

    static async verifyTokenEmailConfirm(token: string): Promise<Usuario | undefined>{
        let secret = process.env.TOKEN_JWT || "";
        const data = jwt.verify(String(token), secret) as ITokenEmaiLConfirm;
        return Usuario.searchForConfirmEmail(data.email);
    }

    private static generateToken(decodedToken: any): string{
        return jwt.sign(decodedToken, this.secret, {
            expiresIn: "1d"
        });
    }
}