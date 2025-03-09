import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import * as fs from 'fs';
import { Response } from 'express';
import { join } from 'path';
import {
  IDeleteImage,
  IDeletePdf,
  IImage,
  IPdf,
} from 'src/domain/image.entity';
import { IImageUseCase } from 'src/usecase/image.usecase';

@Controller('backend/v1/images')
export class ImageController {
  constructor(
    @Inject('IImageUseCase')
    private readonly imageUseCase: IImageUseCase,
  ) {}

  @Get('/pcbDesign/:filename')
  async getPcbDesignImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads/pcbDesign', filename);
    return res.sendFile(filePath);
  }

  @Get('/circuitDiagram/:filename')
  async getCircuitDiagramImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads/circuitDiagram', filename);
    return res.sendFile(filePath);
  }

  @Patch()
  userDeleteImage(@Body() deleteData: IDeleteImage): Promise<IImage> {
    console.log('controller: ', deleteData);
    return this.imageUseCase.userDeleteImage(deleteData);
  }

  @Get('/pdf/:filename')
  async getDataSheetPdf(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads/dataSheetPdf', filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); // ブラウザで表示（ダウンロードなら `attachment`）
    res.sendFile(filePath);
  }

  @Patch('/pdf')
  userDeletePdf(@Body() deleteData: IDeletePdf): Promise<IPdf> {
    console.log('controller: ', deleteData);
    return this.imageUseCase.userDeletePdf(deleteData);
  }
}
