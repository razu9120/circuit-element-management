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
  userGetProducts(userId: number): Promise<IProduct[]>;
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

  async userGetProducts(userId: number): Promise<IProduct[]> {
    try {
      return await this.productEntity.getAllProducts(userId);
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

  async userGetProductById(productId: number): Promise<IProduct> {
    try {
      return await this.productEntity.getProductById(productId);
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

  async userCreateProduct(productCreate: IProductCreate): Promise<IProduct> {
    const { userId, productName, dataSheetPath } = productCreate;

    if (!userId || !productName) {
      throw new BadRequestException('userIdとproductNameは必須です。');
    }
    try {
      const newProduct = this.productEntity.newProduct(
        userId,
        productName,
        dataSheetPath,
      );

      const result = await this.productEntity.createProduct(newProduct);
      return result;
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

  async userUpdateProduct(product: IProduct): Promise<IProduct> {
    const { productId, userId, productName, dataSheetPath } = product;

    if (!productId || !userId || !productName) {
      throw new BadRequestException('Id and Name and price are required');
    }

    try {
      const updProduct = this.productEntity.updProduct(
        productId,
        userId,
        productName,
        dataSheetPath,
      );

      const result = await this.productEntity.updateProduct(updProduct);
      return result;
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

  async userDeleteProduct(productId: number): Promise<IProduct> {
    try {
      const result = await this.productEntity.deleteProduct(productId);
      return result;
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
