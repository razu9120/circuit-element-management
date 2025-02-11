import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';

@Module({
  providers: [
    {
      provide: 'ISqlDriver',
      useClass: PostgresService,
    },
  ],
  exports: ['ISqlDriver'],
})
export class PostgresDriver {}
