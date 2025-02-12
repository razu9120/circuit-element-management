import { Module } from '@nestjs/common';
import { PostgresDriver } from 'src/infrastructure/postgres/postgres.module';
import { ProductRepository } from './products.repository';
import { BoardRepository } from './boards.repository';
import { ElementRepository } from './elements.repository';

@Module({
  imports: [PostgresDriver],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'IBoardRepository',
      useClass: BoardRepository,
    },
    {
      provide: 'IElementRepository',
      useClass: ElementRepository,
    },
  ],
  exports: ['IProductRepository', 'IBoardRepository', 'IElementRepository'],
})
export class RepositoryModule {}
