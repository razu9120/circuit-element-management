import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { camelCase } from 'lodash';
import {
  IProduct,
  IProductCreate,
  ProductEntity,
} from 'src/domain/product.entity';

export interface IProductUseCase {
  userGetProducts(): Promise<IProduct[]>;
  userGetProductById(productId: number): Promise<IProduct>;
  userCreateProduct(productCreate: IProductCreate): Promise<IProduct>;
  userUpdateProduct(product: IProduct): Promise<IProduct>;
  userDeleteProduct(productId: number): Promise<IProduct>;
}

@Injectable()
export class ProductUseCase {
  constructor(
    @Inject(ProductEntity)
    private readonly productEntity: ProductEntity,
  ) {}

  async userGetProducts(): Promise<IProduct[]> {
    try {
      const result = await this.productEntity.getAllProducts();

      // スネークケースをキャメルケースに変換
      const camelCaseResult = result.map((board) =>
        Object.fromEntries(
          Object.entries(board).map(([key, value]) => [camelCase(key), value]),
        ),
      );

      return camelCaseResult as IProduct[];
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

  async userGetProductById(productId: number): Promise<IProduct> {
    try {
      const result = await this.productEntity.getProductById(productId);

      const camelCaseResult: IProduct = {
        productId: result[0].product_id,
        productName: result[0].product_name,
        dataSheetPath: result[0].data_sheet_path,
      };

      return camelCaseResult;
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

  async userCreateProduct(productCreate: IProductCreate): Promise<IProduct> {
    const { productName, dataSheetPath } = productCreate;

    if (!productName) {
      throw new BadRequestException('製品名は必須です。');
    }
    try {
      const newProduct = this.productEntity.newProduct(
        productName,
        dataSheetPath,
      );

      const result = await this.productEntity.createProduct(newProduct);
      return result;
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

  async userUpdateProduct(product: IProduct): Promise<IProduct> {
    const { productId, productName, dataSheetPath } = product;

    if (!productId || !productName || !dataSheetPath) {
      throw new BadRequestException('Id and Name and price are required');
    }

    try {
      const updProduct = this.productEntity.updProduct(
        productId,
        productName,
        dataSheetPath,
      );

      const result = await this.productEntity.updateProduct(updProduct);
      return result;
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

  async userDeleteProduct(productId: number): Promise<IProduct> {
    try {
      const result = await this.productEntity.deleteProduct(productId);
      return result;
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
