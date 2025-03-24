import { Inject, Injectable } from '@nestjs/common';

export interface IProductCreate {
  userId: number;
  productName: string;
  dataSheetPath: string;
}

export interface IProduct extends IProductCreate {
  productId: number;
}

export interface IProductRepository {
  findById(id: number): Promise<IProduct>;
  findAll(userId: number): Promise<IProduct[]>;
  create(product: IProductCreate): Promise<IProduct>;
  update(product: IProduct): Promise<IProduct>;
  delete(id: number): Promise<IProduct>;
}

@Injectable()
export class ProductEntity {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  newProduct(
    userId: number,
    productName: string,
    dataSheetPath: string,
  ): IProductCreate {
    return {
      userId: userId,
      productName: productName,
      dataSheetPath: dataSheetPath,
    };
  }

  updProduct(
    productId: number,
    userId: number,
    productName: string,
    dataSheetPath: string,
  ): IProduct {
    return {
      productId: productId,
      userId: userId,
      productName: productName,
      dataSheetPath: dataSheetPath,
    };
  }

  async getAllProducts(userId: number): Promise<IProduct[]> {
    return await this.productRepository.findAll(userId);
  }

  async getProductById(id: number): Promise<IProduct> {
    return await this.productRepository.findById(id);
  }

  async createProduct(product: IProductCreate): Promise<IProduct> {
    return await this.productRepository.create(product);
  }

  async updateProduct(product: IProduct): Promise<IProduct> {
    return await this.productRepository.update(product);
  }

  async deleteProduct(id: number): Promise<IProduct> {
    return await this.productRepository.delete(id);
  }
}
