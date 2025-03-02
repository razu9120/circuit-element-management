import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('backend/v1/upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req: Request, file, callback) => {
          let uploadPath = './uploads';
          console.log('file.fieldname: ', file.fieldname);

          if (file.fieldname === 'pcbDesign') {
            uploadPath += '/pcbDesign';
          } else if (file.fieldname === 'circuitDiagram') {
            uploadPath += '/circuitDiagram';
          } else if (file.fieldname === 'dataSheetPdf') {
            uploadPath += '/dataSheetPdf';
          }

          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const fileMap = {};

    files.forEach((file) => {
      const fieldName = file.fieldname;
      fileMap[fieldName] = {
        path: `/uploads/${fieldName}/${file.filename}`,
      };
    });

    return fileMap;
  }
}
