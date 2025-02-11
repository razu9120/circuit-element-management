import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { IProduct, IProductCreate } from 'src/domain/product.entity';
import { IProductUseCase } from 'src/usecase/product.usecase';

@Controller('backend/v1/products')
export class ProductController {
  constructor(
    @Inject('IProductUseCase')
    private readonly productUseCase: IProductUseCase,
  ) {}

  @Get()
  userGetProducts(): Promise<IProduct[]> {
    console.log('controller');
    return this.productUseCase.userGetProducts();
  }

  @Get(':productId')
  userGetProductById(@Param('productId') productId: string): Promise<IProduct> {
    return this.productUseCase.userGetProductById(productId);
  }

  @Post()
  userCreateProduct(@Body() productCreate: IProductCreate): Promise<IProduct> {
    return this.productUseCase.userCreateProduct(productCreate);
  }

  @Patch()
  userUpdateProduct(@Body() product: IProduct): Promise<IProduct> {
    return this.productUseCase.userUpdateProduct(product);
  }

  @Delete(':productId')
  userDeleteProduct(@Param('productId') productId: string): Promise<IProduct> {
    return this.productUseCase.userDeleteProduct(productId);
  }
}
