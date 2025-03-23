import { Inject, Injectable } from '@nestjs/common';

export interface IUserCreate {
  loginUserId: string;
  userName: string;
  userPass: string;
}

export interface IUser extends IUserCreate {
  userId: number;
  userRole: string;
  isDeleted: boolean;
}

export interface IUserRepository {
  findByLoginUserId(loginUserId: string): Promise<IUser>;
  findAll(): Promise<IUser[]>;
  create(user: IUserCreate): Promise<IUser>;
  update(user: IUserCreate): Promise<IUser>;
  delete(id: number): Promise<IUser>;
}

@Injectable()
export class UserEntity {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  newUser(
    loginUserId: string,
    userName: string,
    userPass: string,
  ): IUserCreate {
    return {
      loginUserId: loginUserId,
      userName: userName,
      userPass: userPass,
    };
  }

  updUser(
    userId: number,
    loginUserId: string,
    userName: string,
    userPass: string,
    userRole: string,
    isDeleted: boolean,
  ): IUser {
    return {
      userId: userId,
      loginUserId: loginUserId,
      userName: userName,
      userPass: userPass,
      userRole: userRole,
      isDeleted: isDeleted,
    };
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async getUserByLoginUserId(loginUserId: string): Promise<IUser> {
    return await this.userRepository.findByLoginUserId(loginUserId);
  }

  async createUser(user: IUserCreate): Promise<IUser> {
    return await this.userRepository.create(user);
  }

  async updateUser(user: IUserCreate): Promise<IUser> {
    return await this.userRepository.update(user);
  }

  async deleteUser(id: number): Promise<IUser> {
    return await this.userRepository.delete(id);
  }
}
