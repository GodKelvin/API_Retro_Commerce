import fs from 'fs';
import Handlebars from "handlebars";
import transporter from '../../mailer/config';
import { Usuario } from './usuario';
import { Auth } from './auth';

export class Mailer{
    constructor(){}

    static async EnviaEmailConfirmacao(usuario: Usuario, host: string): Promise<string>{
        const tokenConfirmEmail = Auth.generateTokenEmailConfirm(usuario);
        const htmlTemplate = await fs.promises.readFile("src/app/emails/confirmEmail.html", "utf-8");
        const template = Handlebars.compile(htmlTemplate);
        const confirmationLink = `http://${host}/usuarios/email/confirmation/${tokenConfirmEmail}`;
        const data = {usuario: usuario.getNome(), confirmationLink};
        const htmlToSend = template(data);

        const message = {
            from: process.env.EMAIL_HOST,
            to: usuario.getEmail(),
            subject: "Confirmação de Email",
            html: htmlToSend
        };
        try{
            const res = transporter.sendMail(message);
            return confirmationLink;
        }catch(error){
            console.log(error);
            return `Erro ao enviar link de email: ${error}`;
        }
    }
}