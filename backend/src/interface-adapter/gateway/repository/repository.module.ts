import { Module } from '@nestjs/common';
import { PostgresDriver } from 'src/infrastructure/postgres/postgres.module';
import { ProductRepository } from './products.repository';
import { BoardRepository } from './boards.repository';

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
  ],
  exports: ['IProductRepository', 'IBoardRepository'],
})
export class RepositoryModule {}
