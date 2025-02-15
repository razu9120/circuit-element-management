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
import { IBoard, IBoardCreate } from 'src/domain/board.entity';
import { IBoardUseCase } from 'src/usecase/board.usecase';

@Controller('backend/v1/boards')
export class BoardController {
  constructor(
    @Inject('IBoardUseCase')
    private readonly boardUseCase: IBoardUseCase,
  ) {}

  @Get()
  userGetBoards(): Promise<IBoard[]> {
    return this.boardUseCase.userGetBoards();
  }

  @Get(':boardId')
  userGetBoardById(@Param('boardId') boardId: string): Promise<IBoard> {
    return this.boardUseCase.userGetBoardById(boardId);
  }

  @Post()
  userCreateBoard(@Body() boardCreate: IBoardCreate): Promise<IBoard> {
    console.log('boardCreate:', boardCreate);
    return this.boardUseCase.userCreateBoard(boardCreate);
  }

  @Patch()
  userUpdateBoard(@Body() board: IBoard): Promise<IBoard> {
    return this.boardUseCase.userUpdateBoard(board);
  }

  @Delete(':boardId')
  userDeleteBoard(@Param('boardId') boardId: string): Promise<IBoard> {
    return this.boardUseCase.userDeleteBoard(boardId);
  }
}
