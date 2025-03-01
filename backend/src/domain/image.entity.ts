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

@Injectable()
export class ImageEntity {}
