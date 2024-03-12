import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CustomHttpException } from '../exception/custom-excpetion';
import { HttpStatus } from '@nestjs/common';

export const multerUploadHelper = (
  destinationPath: string,
  maxFileSize: number,
) => ({
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new CustomHttpException(
          'unsupported file type',
          HttpStatus.BAD_REQUEST,
          422,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      if (!existsSync(destinationPath)) {
        mkdirSync(destinationPath);
      }
      cb(null, destinationPath);
    },
    filename: (req: any, file: any, cb: any) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});
