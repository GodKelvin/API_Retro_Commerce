import { ImgurClient } from 'imgur';
import fs from 'fs';
import {IImgur} from '../interfaces/imgur';

export class ImgurApi{
    private client: ImgurClient;
    constructor(){
        this.client = new ImgurClient({
            clientId: process.env.CLIENT_ID_IMGUR,
            clientSecret: process.env.CLIENTE_SECRET_IMGUR,
            refreshToken: process.env.ACCESS_REFRSH_TOKEN_IMGUR,
        });
    }

    public async uploadImage(imagem: any): Promise<IImgur>{
        const fileBuffer = fs.readFileSync(imagem.path);
        const base64Image = fileBuffer.toString('base64');
        const response = await this.client.upload({
            image:  base64Image,
            type: 'base64'
        });
        //Apagando imagem do servidor
        fs.unlinkSync(imagem.path);

        const  dataImage: IImgur = {};
        if(response.status === 200){
            dataImage.linkImage = response.data.link;
            dataImage.hashDelete = response.data.deletehash
        }
        return dataImage;
    }

    public async deleteImage(hashDelete: string): Promise<any>{
        return await this.client.deleteImage(hashDelete);
    }
}