import { Inject, Injectable } from '@nestjs/common';
import {
  IProduct,
  IProductCreate,
  IProductRepository,
} from 'src/domain/product.entity';
import { ISqlDriver } from './repository';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @Inject('ISqlDriver')
    private readonly driver: ISqlDriver,
  ) {}

  async findById(id: number): Promise<IProduct> {
    return await this.driver.select(
      `SELECT product_id, product_name, data_sheet_path FROM products WHERE product_id = ${id} ORDER BY product_id`,
    );
  }

  async findAll(): Promise<IProduct[]> {
    return await this.driver.select(
      `SELECT product_id, product_name, data_sheet_path FROM products ORDER BY product_id`,
    );
  }

  async create(product: IProductCreate): Promise<IProduct> {
    return await this.driver.insert(`
      INSERT INTO products (product_name, data_sheet_path, created_at, updated_at)
      VALUES ('${product.productName}', '${product.dataSheetPath}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      returning *
      `);
  }

  async update(product: IProduct): Promise<IProduct> {
    return await this.driver.update(`
      UPDATE products SET product_name = '${product.productName}', data_sheet_path = '${product.dataSheetPath}', updated_at = CURRENT_TIMESTAMP
      WHERE product_id = '${product.productId}'
      returning *
      `);
  }

  async delete(id: number): Promise<IProduct> {
    return await this.driver.delete(`
      DELETE FROM products
      WHERE product_id = ${id}
      returning *
      `);
  }
}
