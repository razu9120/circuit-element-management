import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IUser, IUserCreate, UserEntity } from '../domain/user.entity';

export interface IUserUseCase {
  userGetUsers(): Promise<IUser[]>;
  userGetUserByLoginUserId(loginUserId: string): Promise<IUser>;
  userCreateUser(userCreate: IUserCreate): Promise<IUser>;
  userUpdateUser(user: IUser): Promise<IUser>;
  userDeleteUser(userId: number): Promise<IUser>;
}

@Injectable()
export class UserUseCase {
  constructor(
    @Inject(UserEntity)
    private readonly userEntity: UserEntity,
  ) {}

  async userGetUsers(): Promise<IUser[]> {
    try {
      return await this.userEntity.getAllUsers();
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userGetUserByLoginUserId(loginUserId: string): Promise<IUser> {
    try {
      return await this.userEntity.getUserByLoginUserId(loginUserId);
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userCreateUser(userCreate: IUserCreate): Promise<IUser> {
    const { loginUserId, userName, userPass } = userCreate;

    if (!loginUserId || !userName || !userPass) {
      throw new BadRequestException(
        'ユーザID、ユーザ名、パスワードは必須です。',
      );
    }
    try {
      const newUser = this.userEntity.newUser(loginUserId, userName, userPass);

      const result = await this.userEntity.createUser(newUser);
      return result;
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userUpdateUser(user: IUser): Promise<IUser> {
    const { userId, loginUserId, userName, userPass, userRole, isDeleted } =
      user;

    if (
      !userId ||
      !loginUserId ||
      !userName ||
      !userPass ||
      !userRole ||
      !isDeleted
    ) {
      throw new BadRequestException(
        'ユーザID、ユーザ名、パスワード、ユーザ権限、削除フラグは必須です。',
      );
    }

    try {
      const updUser = this.userEntity.updUser(
        userId,
        loginUserId,
        userName,
        userPass,
        userRole,
        isDeleted,
      );
      const result = await this.userEntity.updateUser(updUser);
      return result;
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userDeleteUser(userId: number): Promise<IUser> {
    try {
      const result = await this.userEntity.deleteUser(userId);
      return result;
    } catch (e) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
