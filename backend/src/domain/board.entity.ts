import { Inject, Injectable } from '@nestjs/common';

export interface IBoardCreate {
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
  findAll(): Promise<IBoardHasElements[]>;
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
    boardName: string,
    structure: string,
    stencil: boolean,
    diagramImgPath: string,
    boardImgPath: string,
  ): IBoardCreate {
    return {
      boardName: boardName,
      structure: structure,
      stencil: stencil,
      diagramImgPath: diagramImgPath,
      boardImgPath: boardImgPath,
    };
  }

  updBoard(
    boardId: number,
    boardName: string,
    structure: string,
    stencil: boolean,
    diagramImgPath: string,
    boardImgPath: string,
  ): IBoard {
    return {
      boardId: boardId,
      boardName: boardName,
      structure: structure,
      stencil: stencil,
      diagramImgPath: diagramImgPath,
      boardImgPath: boardImgPath,
    };
  }

  async getAllBoards(): Promise<IBoardHasElements[]> {
    return await this.boardRepository.findAll();
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
