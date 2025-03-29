import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BoardEntity } from 'src/domain/board.entity';
import {
  IImage,
  IDeleteImage,
  IDeletePdf,
  IPdf,
} from 'src/domain/image.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ProductEntity } from 'src/domain/product.entity';

export interface IImageUseCase {
  userDeleteImage(deleteData: IDeleteImage): Promise<IImage>;
  userDeletePdf(deleteData: IDeletePdf): Promise<IPdf>;
}

@Injectable()
export class ImageUseCase {
  constructor(
    @Inject(BoardEntity)
    private readonly boardEntity: BoardEntity,
    @Inject(ProductEntity)
    private readonly productEntity: ProductEntity,
  ) {}

  async userDeleteImage(deleteData: IDeleteImage): Promise<IImage> {
    if (!deleteData.boardId) {
      throw new BadRequestException('Idは必須です。');
    }

    try {
      const getResult: IImage = await this.boardEntity.getBoardById(
        deleteData.boardId,
      );

      const deleteFile = async (filePath: string) => {
        if (filePath) {
          const fullPath = path.join(__dirname, '../../', filePath);
          try {
            await fs.unlink(fullPath);
            console.log(`Deleted: ${fullPath}`);
          } catch (err) {
            console.error(`Failed to delete ${fullPath}:`, err);
          }
        }
      };

      if (deleteData.diagramImgPathFlg && getResult.diagramImgPath) {
        await deleteFile(getResult.diagramImgPath);
      }

      if (deleteData.boardImgPathFlg && getResult.boardImgPath) {
        await deleteFile(getResult.boardImgPath);
      }

      return { ...getResult };
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userDeletePdf(deleteData: IDeletePdf): Promise<IPdf> {
    if (!deleteData.productId) {
      throw new BadRequestException('Idは必須です。');
    }

    try {
      const getResult: IPdf = await this.productEntity.getProductById(
        deleteData.productId,
      );

      const deleteFile = async (filePath: string) => {
        if (filePath) {
          const fullPath = path.join(__dirname, '../../', filePath);
          try {
            await fs.unlink(fullPath);
            console.log(`Deleted: ${fullPath}`);
          } catch (err) {
            console.error(`Failed to delete ${fullPath}:`, err);
          }
        }
      };

      if (getResult.dataSheetPath) {
        await deleteFile(getResult.dataSheetPath);
      }

      return { ...getResult };
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
