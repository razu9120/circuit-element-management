import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './interface-adapter/controller/product.controller';
import { ProductUseCase } from './usecase/product.usecase';
import { ProductEntity } from './domain/product.entity';
import { RepositoryModule } from './interface-adapter/gateway/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [AppController, ProductController],
  providers: [
    AppService,
    {
      provide: 'IProductUseCase',
      useClass: ProductUseCase,
    },
    ProductEntity,
  ],
})
export class AppModule {}
