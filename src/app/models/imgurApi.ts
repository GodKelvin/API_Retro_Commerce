import { ImgurClient } from 'imgur';
import fs from 'fs';
import {IImgur} from '../interfaces/imgur';

class ImgurApi{
    private client: ImgurClient;
    constructor(){
        this.client = new ImgurClient({
            clientId: process.env.CLIENT_ID_IMGUR,
            clientSecret: process.env.CLIENTE_SECRET_IMGUR,
            refreshToken: process.env.ACCESS_REFRESH_TOKEN_IMGUR,
        });
    }

    public async uploadImage(imagem: any): Promise<IImgur>{
        const base64Image = this.convertToBase64(imagem)
        const response = await this.client.upload({
            image:  base64Image,
            type: 'base64'
        });
        //Apagando imagem do servidor
        fs.unlinkSync(imagem.path);

        const  dataImage: IImgur = {};
        if(response.status === 200){
            dataImage.foto = response.data.link;
            dataImage.fotoHashDelete = response.data.deletehash
        }
        return dataImage;
    }

    public async uploadMultiplesImage(imagens: any): Promise<IImgur[]>{
        const  dataImages: IImgur[] = [];
        for(const img of imagens){
            let dataImg = await this.uploadImage(img);
            dataImages.push(dataImg);
        }
        return dataImages;
    }

    public async deleteImage(hashDelete: string): Promise<any>{
        return await this.client.deleteImage(hashDelete);
    }

    private convertToBase64(imagem: any): string{
        const fileBuffer = fs.readFileSync(imagem.path);
        return fileBuffer.toString('base64');
    }
}

export default new ImgurApi();