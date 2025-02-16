import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { camelCase } from 'lodash';
import { IBoard, IBoardCreate, BoardEntity } from 'src/domain/board.entity';

export interface IBoardUseCase {
  userGetBoards(): Promise<IBoard[]>;
  userGetBoardById(boardId: string): Promise<IBoard>;
  userCreateBoard(boardCreate: IBoardCreate): Promise<IBoard>;
  userUpdateBoard(board: IBoard): Promise<IBoard>;
  userDeleteBoard(boardId: string): Promise<IBoard>;
}

@Injectable()
export class BoardUseCase {
  constructor(
    @Inject(BoardEntity)
    private readonly boardEntity: BoardEntity,
  ) {}

  async userGetBoards(): Promise<IBoard[]> {
    try {
      const result = await this.boardEntity.getAllBoards();

      // スネークケースをキャメルケースに変換
      const camelCaseResult = result.map((board) =>
        Object.fromEntries(
          Object.entries(board).map(([key, value]) => [camelCase(key), value]),
        ),
      );

      return camelCaseResult as IBoard[];
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userGetBoardById(boardId: string): Promise<IBoard> {
    try {
      const result = await this.boardEntity.getBoardById(boardId);
      return result;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
    const { boardName, structure, stencil, diagramImgPath, boardImgPath } =
      boardCreate;

    if (!boardName || !structure || !stencil) {
      throw new BadRequestException('名前、構造、ステンシルは必須です。');
    }
    try {
      const newBoard = this.boardEntity.newBoard(
        boardName,
        structure,
        stencil,
        diagramImgPath,
        boardImgPath,
      );

      const result = await this.boardEntity.createBoard(newBoard);
      return result;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userDeleteBoard(boardId: string): Promise<IBoard> {
    try {
      const result = await this.boardEntity.deleteBoard(boardId);
      return result;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
