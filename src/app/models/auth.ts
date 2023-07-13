import { ITokenJWT } from "../interfaces/tokenJWT";
import { IUsuario } from "../interfaces/usuario";
import { Usuario } from "./usuario";
import jwt from "jsonwebtoken";

export class Auth{

    constructor(){}

    static generateToken(usuario: Usuario): string{
        const decodedToken: ITokenJWT = {
            nome: usuario.getNome(),
            apelido: usuario.getApelido()
        }
        let secret = process.env.TOKEN_JWT || "";
        return jwt.sign(decodedToken, secret, {
            expiresIn: "1d"
        });
    }

    static async verifyToken(token: string): Promise<IUsuario | undefined>{
        let secret = process.env.TOKEN_JWT || "";
        const data = jwt.verify(String(token), secret) as ITokenJWT;
        return Usuario.searchByApelido(data.apelido);        
    }
}