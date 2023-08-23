import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from 'express';

const configStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      // Diretório onde os arquivos serão salvos
      callback(null, path.resolve("src/database/uploads"));
    },
    filename: (req, file, callback) => {
      const time = new Date().getTime();
      callback(null, `${time}_${file.originalname}`);
    }
  });

class MulterMiddleware {
  public upload = multer({
    storage: configStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  });

  //Trata erros vindos do upload
  public multerErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err) {
      let msg = null;
      if (err.code === "LIMIT_FILE_SIZE") msg = "Tamanho máximo do arquivo excedido";
      else msg = "Erro no servidor ao fazer upload. Por favor, tente mais tarde.";
      console.log(`>> ERROR MUlter: ${err}`)
      return res.status(400).json({
        success: false,
        message: msg,
      });
    }
    next();
  };
}

export default new MulterMiddleware();
