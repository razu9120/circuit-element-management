import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { IUser, IUserCreate } from '../../domain/user.entity';
import { IUserUseCase } from '../../usecase/user.usecase';

@Controller('backend/v1/users')
export class UserController {
  constructor(
    @Inject('IUserUseCase')
    private readonly userUseCase: IUserUseCase,
  ) {}

  //   @Get()
  //   userGetUsers(): Promise<IUser[]> {
  //     return this.userUseCase.userGetUsers();
  //   }

  @Get(':loginUserId')
  userGetUserByLoginUserId(
    @Param('loginUserId') loginUserId: string,
  ): Promise<IUser> {
    return this.userUseCase.userGetUserByLoginUserId(loginUserId);
  }

  @Post()
  userCreateUser(@Body() userCreate: IUserCreate): Promise<IUser> {
    return this.userUseCase.userCreateUser(userCreate);
  }

  //   @Patch()
  //   userUpdateUser(@Body() user: IUser): Promise<IUser> {
  //     return this.userUseCase.userUpdateUser(user);
  //   }

  //   @Delete(':userId')
  //   userDeleteUser(@Param('userId') userId: number): Promise<IUser> {
  //     return this.userUseCase.userDeleteUser(userId);
  //   }
}
