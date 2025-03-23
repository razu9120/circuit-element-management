import { Module } from '@nestjs/common';
import { PostgresDriver } from 'src/infrastructure/postgres/postgres.module';
import { ProductRepository } from './products.repository';
import { BoardRepository } from './boards.repository';
import { ElementRepository } from './elements.repository';
import { UserRepository } from './users.repository';

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
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [
    'IProductRepository',
    'IBoardRepository',
    'IElementRepository',
    'IUserRepository',
  ],
})
export class RepositoryModule {}
