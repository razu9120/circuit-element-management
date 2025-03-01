import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from './interface-adapter/gateway/repository/repository.module';
import { ProductController } from './interface-adapter/controller/product.controller';
import { ProductUseCase } from './usecase/product.usecase';
import { ProductEntity } from './domain/product.entity';
import { BoardController } from './interface-adapter/controller/board.controller';
import { BoardUseCase } from './usecase/board.usecase';
import { BoardEntity } from './domain/board.entity';
import { ElementEntity } from './domain/element.entity';
import { ElementUseCase } from './usecase/element.usecase';
import { ElementController } from './interface-adapter/controller/element.controller';
import { UploadController } from './interface-adapter/controller/upload.controller';
import { ImageController } from './interface-adapter/controller/image.controller';
import { ImageUseCase } from './usecase/image.usecase';
import { ImageEntity } from './domain/image.entity';

@Module({
  imports: [RepositoryModule],
  controllers: [
    AppController,
    ProductController,
    BoardController,
    ElementController,
    UploadController,
    ImageController,
  ],
  providers: [
    AppService,
    {
      provide: 'IProductUseCase',
      useClass: ProductUseCase,
    },
    {
      provide: 'IBoardUseCase',
      useClass: BoardUseCase,
    },
    {
      provide: 'IElementUseCase',
      useClass: ElementUseCase,
    },
    {
      provide: 'IImageUseCase',
      useClass: ImageUseCase,
    },
    ProductEntity,
    BoardEntity,
    ElementEntity,
    ImageEntity,
  ],
})
export class AppModule {}
