import { Injectable } from '@nestjs/common';
// import postgres from "postgres";
import { ISqlDriver } from 'src/interface-adapter/gateway/repository/repository';
const postgres = require('postgres');

@Injectable()
export class PostgresService implements ISqlDriver {
  #sql: any;

  constructor() {
    this.#sql = postgres({
      /* options */
      host: 'postgres', // Postgres ip address[s] or domain name[s]
      port: 5432, // Postgres server port[s]
      database: 'postgres', // Name of database to connect to
      username: 'postgres', // Username of database user
      password: 'postgres', // Password of database user
    });
  }

  async insert(sql: string): Promise<any> {
    return await this.#sql`${sql}`;
    // return await this.#sql.unsafe(sql);
  }

  async select(sql: string): Promise<any> {
    // return await this.#sql`${sql}`;
    return await this.#sql.unsafe(sql);
  }

  async update(sql: string): Promise<any> {
    return await this.#sql`${sql}`;
    // return await this.#sql.unsafe(sql);
  }

  async delete(sql: string): Promise<any> {
    return await this.#sql`${sql}`;
    // return await this.#sql.unsafe(sql);
  }
}
