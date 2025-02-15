import { Inject, Injectable } from '@nestjs/common';

export interface IProductCreate {
  productName: string;
  dataSheetPath: string;
}

export interface IProduct extends IProductCreate {
  productId: number;
}

export interface IProductRepository {
  findById(id: string): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  create(product: IProductCreate): Promise<IProduct>;
  update(product: IProductCreate): Promise<IProduct>;
  delete(id: string): Promise<IProduct>;
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

  async getProductById(id: string): Promise<IProduct> {
    return await this.productRepository.findById(id);
  }

  async createProduct(product: IProductCreate): Promise<IProduct> {
    return await this.productRepository.create(product);
  }

  async updateProduct(product: IProductCreate): Promise<IProduct> {
    return await this.productRepository.update(product);
  }

  async deleteProduct(id: string): Promise<IProduct> {
    return await this.productRepository.delete(id);
  }
}
