import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from 'express';

const configStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      // Diretório onde os arquivos serão salvos
      callback(null, path.resolve(MulterMiddleware.caminhoUpload()));
    },
    filename: (req, file, callback) => {
      const time = new Date().getTime();
      callback(null, `${time}_${file.originalname}`);
    }
  });

class MulterMiddleware {
  private static caminhoUploads = "src/database/uploads"
  private arquivosImagensPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
  private errorMessages: { [key: string]: string } = {
    LIMIT_FILE_SIZE: "Tamanho máximo do arquivo excedido"
  }

  static caminhoUpload(): string{
    return this.caminhoUploads
  }

  public upload = multer({
    storage: configStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
    fileFilter: (req, file, callback) => {
      if (this.arquivosImagensPermitidos.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Tipo de arquivo não permitido.'));
      }
    }
  });

  //Trata erros vindos do upload
  public multerErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err) {
      const defaultErrorMessage = 'Erro no servidor ao fazer upload. Verifique o tipo de arquivo e tente mais tarde.';
      const errorMsg = this.errorMessages[err.code] || defaultErrorMessage;
      console.log(`>> ERROR MUlter: ${err.message}`)
      return res.status(400).json({
        success: false,
        message: errorMsg,
      });
    }
    next();
  };
}

export default new MulterMiddleware();
