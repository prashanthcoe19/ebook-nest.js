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
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ];
    const fieldName = file.fieldname;

    if (fieldName === 'cover_image' && !file.mimetype.match(/^image\//)) {
      return cb(
        new CustomHttpException(
          'Invalid file type for cover image',
          HttpStatus.BAD_REQUEST,
          422,
        ),
        false,
      );
    } else if (fieldName === 'pdfFile' && file.mimetype !== 'application/pdf') {
      return cb(
        new CustomHttpException(
          'Invalid file type for PDF',
          HttpStatus.BAD_REQUEST,
          422,
        ),
        false,
      );
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new CustomHttpException(
          'unsupported file type',
          HttpStatus.BAD_REQUEST,
          422,
        ),
        false,
      );
    }
    cb(null, true);
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      let dest = destinationPath;
      // Determine subdirectory based on file mimetype
      if (file.mimetype.match(/^image\//)) {
        dest += '/bookImage'; // Update destination for images
      } else if (file.mimetype === 'application/pdf') {
        dest += '/bookPdf'; // Update destination for PDFs
      }

      // Ensure the directory exists
      if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
      }

      cb(null, dest);
    },
    filename: (req: any, file: any, cb: any) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});
