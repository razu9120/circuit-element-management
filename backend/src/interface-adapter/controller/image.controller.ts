import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('backend/v1/images')
export class ImageController {
  @Get('/pcbDesign/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/pcbDesign', filename);
    return res.sendFile(filePath);
  }
}
