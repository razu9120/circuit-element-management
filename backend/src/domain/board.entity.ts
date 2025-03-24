import { Inject, Injectable } from '@nestjs/common';

export interface IBoardCreate {
  userId: number;
  boardName: string;
  structure: string;
  stencil: boolean;
  diagramImgPath: string;
  boardImgPath: string;
}

export interface IBoard extends IBoardCreate {
  boardId: number;
}

export interface IBoardHasElements extends IBoard {
  hasElements: boolean;
}

export interface IBoardRepository {
  findById(id: number): Promise<IBoard>;
  findAll(userId: number): Promise<IBoardHasElements[]>;
  create(board: IBoardCreate): Promise<IBoard>;
  update(board: IBoardCreate): Promise<IBoard>;
  delete(id: number): Promise<IBoard>;
}

@Injectable()
export class BoardEntity {
  constructor(
    @Inject('IBoardRepository')
    private readonly boardRepository: IBoardRepository,
  ) {}

  newBoard(
    userId: number,
    boardName: string,
    structure: string,
    stencil: boolean,
    diagramImgPath: string,
    boardImgPath: string,
  ): IBoardCreate {
    return {
      userId: userId,
      boardName: boardName,
      structure: structure,
      stencil: stencil,
      diagramImgPath: diagramImgPath,
      boardImgPath: boardImgPath,
    };
  }

  updBoard(
    boardId: number,
    userId: number,
    boardName: string,
    structure: string,
    stencil: boolean,
    diagramImgPath: string,
    boardImgPath: string,
  ): IBoard {
    return {
      userId: userId,
      boardId: boardId,
      boardName: boardName,
      structure: structure,
      stencil: stencil,
      diagramImgPath: diagramImgPath,
      boardImgPath: boardImgPath,
    };
  }

  async getAllBoards(userId: number): Promise<IBoardHasElements[]> {
    return await this.boardRepository.findAll(userId);
  }

  async getBoardById(id: number): Promise<IBoard> {
    return await this.boardRepository.findById(id);
  }

  async createBoard(board: IBoardCreate): Promise<IBoard> {
    return await this.boardRepository.create(board);
  }

  async updateBoard(board: IBoardCreate): Promise<IBoard> {
    return await this.boardRepository.update(board);
  }

  async deleteBoard(id: number): Promise<IBoard> {
    return await this.boardRepository.delete(id);
  }
}
