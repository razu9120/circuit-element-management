import { Inject, Injectable } from '@nestjs/common';

export interface IImage {
  boardId: number;
  diagramImgPath: string;
  boardImgPath: string;
}

export interface IDeleteImage {
  boardId: number;
  diagramImgPathFlg: boolean;
  boardImgPathFlg: boolean;
}

export interface IPdf {
  productId: number;
  dataSheetPath: string;
}

export interface IDeletePdf {
  productId: number;
}

@Injectable()
export class ImageEntity {}
