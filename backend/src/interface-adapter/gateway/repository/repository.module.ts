import { Module } from '@nestjs/common';
import { PostgresDriver } from 'src/infrastructure/postgres/postgres.module';
import { ProductRepository } from './products.repository';

@Module({
  imports: [PostgresDriver],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: ['IProductRepository'],
})
export class RepositoryModule {}
