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

@Module({
  imports: [RepositoryModule],
  controllers: [AppController, ProductController, BoardController],
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
    ProductEntity,
    BoardEntity,
  ],
})
export class AppModule {}
