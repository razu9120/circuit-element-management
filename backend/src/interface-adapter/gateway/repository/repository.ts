export interface ISqlDriver {
  insert(sql: string): Promise<any>;
  select(sql: string): Promise<any>;
  update(sql: string): Promise<any>;
  delete(sql: string): Promise<any>;
}
