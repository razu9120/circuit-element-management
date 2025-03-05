import { Inject, Injectable } from '@nestjs/common';

export interface IProductCreate {
  productName: string;
  dataSheetPath: string;
}

export interface IProduct extends IProductCreate {
  productId: number;
}

export interface IProductRepository {
  findById(id: number): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
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

  newProduct(productName: string, dataSheetPath: string): IProductCreate {
    return {
      productName: productName,
      dataSheetPath: dataSheetPath,
    };
  }

  updProduct(
    productId: number,
    productName: string,
    dataSheetPath: string,
  ): IProduct {
    return {
      productId: productId,
      productName: productName,
      dataSheetPath: dataSheetPath,
    };
  }

  async getAllProducts(): Promise<IProduct[]> {
    return await this.productRepository.findAll();
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
