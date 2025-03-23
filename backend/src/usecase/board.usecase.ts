import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  IBoard,
  IBoardCreate,
  BoardEntity,
  IBoardHasElements,
} from 'src/domain/board.entity';

export interface IBoardUseCase {
  userGetBoards(userId: number): Promise<IBoardHasElements[]>;
  userGetBoardById(boardId: number): Promise<IBoard>;
  userCreateBoard(boardCreate: IBoardCreate): Promise<IBoard>;
  userUpdateBoard(board: IBoard): Promise<IBoard>;
  userDeleteBoard(boardId: number): Promise<IBoard>;
}

@Injectable()
export class BoardUseCase {
  constructor(
    @Inject(BoardEntity)
    private readonly boardEntity: BoardEntity,
  ) {}

  async userGetBoards(userId: number): Promise<IBoardHasElements[]> {
    try {
      return await this.boardEntity.getAllBoards(userId);
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

  async userGetBoardById(boardId: number): Promise<IBoard> {
    try {
      return await this.boardEntity.getBoardById(boardId);
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

  async userCreateBoard(boardCreate: IBoardCreate): Promise<IBoard> {
    const {
      userId,
      boardName,
      structure,
      stencil,
      diagramImgPath,
      boardImgPath,
    } = boardCreate;

    if (!userId || !boardName || !structure || !stencil) {
      throw new BadRequestException('名前、構造、ステンシルは必須です。');
    }
    try {
      const newBoard = this.boardEntity.newBoard(
        userId,
        boardName,
        structure,
        stencil,
        diagramImgPath,
        boardImgPath,
      );

      const result = await this.boardEntity.createBoard(newBoard);
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

  async userUpdateBoard(board: IBoard): Promise<IBoard> {
    const {
      boardId,
      boardName,
      structure,
      stencil,
      diagramImgPath,
      boardImgPath,
    } = board;

    if (
      !boardId ||
      !structure ||
      !stencil ||
      !diagramImgPath ||
      !boardImgPath
    ) {
      throw new BadRequestException('Id and Name and price are required');
    }

    try {
      const updBoard = this.boardEntity.updBoard(
        boardId,
        boardName,
        structure,
        stencil,
        diagramImgPath,
        boardImgPath,
      );

      const result = await this.boardEntity.updateBoard(updBoard);
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

  async userDeleteBoard(boardId: number): Promise<IBoard> {
    try {
      const result = await this.boardEntity.deleteBoard(boardId);
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
