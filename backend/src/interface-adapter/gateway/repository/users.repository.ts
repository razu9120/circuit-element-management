import { Inject, Injectable } from '@nestjs/common';
import { IUser, IUserCreate, IUserRepository } from 'src/domain/user.entity';
import { ISqlDriver } from './repository';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject('ISqlDriver')
    private readonly driver: ISqlDriver,
  ) {}

  async findAll(): Promise<IUser[]> {
    const output = await this.driver.select(`
      SELECT user_id, login_user_id, user_pass, user_name, user_role, is_deleted
      FROM users
      WHERE is_deleted = FALSE
      ORDER BY user_id
      `);
    return output.map((item: any) => this.normalizeFindAll(item));
  }

  async findByLoginUserId(loginUserId: string): Promise<IUser> {
    const output = await this.driver.select(`
      SELECT user_id, login_user_id, user_pass, user_name, user_role, is_deleted
      FROM users
      WHERE login_user_id = '${loginUserId}' AND is_deleted = FALSE
      `);
    return this.normalizeFindByLoginUserId(output[0]);
  }

  async create(user: IUserCreate): Promise<IUser> {
    return await this.driver.insert(`
      INSERT INTO users (login_user_id, user_pass, user_name, user_role, created_at, updated_at)
      VALUES ('${user.loginUserId}', '${user.userPass}', '${user.userName}', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      returning *
      `);
  }

  async update(user: IUser): Promise<IUser> {
    return await this.driver.update(`
      UPDATE users SET user_name = '${user.userName}', user_pass = '${user.userPass}', user_role = '${user.userRole}', is_deleted = '${user.isDeleted}', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user.userId}
      returning *
      `);
  }

  async delete(id: number): Promise<IUser> {
    return await this.driver.delete(`
      UPDATE users SET is_deleted = TRUE
      WHERE user_id = ${id}
      returning *
      `);
  }

  private normalizeFindAll(input: any): IUser {
    const output: IUser = {
      userId: input?.user_id ?? 0,
      loginUserId: input?.login_user_id ?? '',
      userPass: input?.user_pass ?? '',
      userName: input?.user_name ?? '',
      userRole: input?.user_role ?? '',
      isDeleted: input?.is_deleted ?? false,
    };
    return output;
  }

  private normalizeFindByLoginUserId(input: any): IUser {
    const output: IUser = {
      userId: input?.user_id ?? 0,
      loginUserId: input?.login_user_id ?? '',
      userPass: input?.user_pass ?? '',
      userName: input?.user_name ?? '',
      userRole: input?.user_role ?? '',
      isDeleted: input?.is_deleted ?? false,
    };
    return output;
  }
}
