import { Usuario } from "./usuario";
import jwt from "jsonwebtoken";

export class Auth{

    constructor(){}

    static generateToken(usuario: Usuario): string{
        const decodedToken = {
            nome: usuario.getNome(),
            apelido: usuario.getApelido()
        }
        let secret = process.env.TOKEN_JWT || "";
        return jwt.sign(decodedToken, secret, {
            expiresIn: "1d"
        });
    }
}