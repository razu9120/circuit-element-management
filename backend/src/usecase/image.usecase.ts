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
    if (
      !deleteData.boardId ||
      !deleteData.diagramImgPathFlg ||
      !deleteData.boardImgPathFlg
    ) {
      throw new BadRequestException('Idと画像情報は必須です。');
    }

    try {
      const getResult = await this.boardEntity.getBoardById(deleteData.boardId);
      console.log('usecase getResult: ', getResult);

      const camelCaseGetResult: IImage = {
        boardId: getResult[0].board_id,
        diagramImgPath: getResult[0].diagram_img_path,
        boardImgPath: getResult[0].board_img_path,
      };

      const deleteFile = async (filePath: string) => {
        console.log('usecase filePath: ', filePath);
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

      if (deleteData.diagramImgPathFlg && camelCaseGetResult.diagramImgPath) {
        await deleteFile(camelCaseGetResult.diagramImgPath);
      }

      if (deleteData.boardImgPathFlg && camelCaseGetResult.boardImgPath) {
        await deleteFile(camelCaseGetResult.boardImgPath);
      }

      return { ...camelCaseGetResult };
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
    console.log('usecase deleteData1: ', deleteData);
    if (!deleteData.productId) {
      throw new BadRequestException('Idは必須です。');
    }
    console.log('usecase deleteData2: ', deleteData);

    try {
      const getResult = await this.productEntity.getProductById(
        deleteData.productId,
      );
      console.log('usecase getResult: ', getResult);

      const camelCaseGetResult: IPdf = {
        productId: getResult[0].product_id,
        dataSheetPath: getResult[0].data_sheet_path,
      };

      const deleteFile = async (filePath: string) => {
        console.log('usecase filePath: ', filePath);
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

      if (camelCaseGetResult.dataSheetPath) {
        await deleteFile(camelCaseGetResult.dataSheetPath);
      }

      return { ...camelCaseGetResult };
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
