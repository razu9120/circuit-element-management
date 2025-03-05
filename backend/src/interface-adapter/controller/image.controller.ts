import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
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

  @Patch('/pdf')
  userDeletePdf(@Body() deleteData: IDeletePdf): Promise<IPdf> {
    console.log('controller: ', deleteData);
    return this.imageUseCase.userDeletePdf(deleteData);
  }
}
