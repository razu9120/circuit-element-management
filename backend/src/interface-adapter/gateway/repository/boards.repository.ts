import { Inject, Injectable } from '@nestjs/common';
import {
  IBoard,
  IBoardCreate,
  IBoardHasElements,
  IBoardRepository,
} from 'src/domain/board.entity';
import { ISqlDriver } from './repository';

@Injectable()
export class BoardRepository implements IBoardRepository {
  constructor(
    @Inject('ISqlDriver')
    private readonly driver: ISqlDriver,
  ) {}

  async findAll(userId: number): Promise<IBoardHasElements[]> {
    const output = await this.driver.select(`
      SELECT T1.board_id, T1.user_id, T1.board_name, T1.structure, T1.stencil, T1.diagram_img_path, T1.board_img_path,
        EXISTS (
          SELECT 1 FROM elements T2 WHERE T2.board_id = T1.board_id
        ) AS has_elements
      FROM boards T1
      WHERE T1.user_id = ${userId}
      ORDER BY T1.board_id
      `);
    return output.map((item: any) => this.normalizeFindAll(item));
  }

  async findById(id: number): Promise<IBoard> {
    const output = await this.driver.select(`
      SELECT board_id, user_id, board_name, structure, stencil, diagram_img_path, board_img_path
      FROM boards
      WHERE board_id = ${id}
      ORDER BY board_id
      `);
    return this.normalizeFindById(output[0]);
  }

  async create(board: IBoardCreate): Promise<IBoard> {
    return await this.driver.insert(`
      INSERT INTO boards (user_id, board_name, structure, stencil, diagram_img_path, board_img_path, created_at, updated_at)
      VALUES ('${board.userId}', '${board.boardName}', '${board.structure}', '${board.stencil}', '${board.diagramImgPath}', '${board.boardImgPath}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      returning *
      `);
  }

  async update(board: IBoard): Promise<IBoard> {
    return await this.driver.update(`
      UPDATE boards SET board_name = '${board.boardName}', structure = '${board.structure}', stencil = '${board.stencil}', diagram_img_path = '${board.diagramImgPath}', board_img_path = '${board.boardImgPath}', updated_at = CURRENT_TIMESTAMP
      WHERE board_id = ${board.boardId}
      returning *
      `);
  }

  async delete(id: number): Promise<IBoard> {
    return await this.driver.delete(`
      DELETE FROM boards
      WHERE board_id = ${id}
      returning *
      `);
  }

  private normalizeFindAll(input: any): IBoardHasElements {
    const output: IBoardHasElements = {
      boardId: input?.board_id ?? 0,
      userId: input?.user_id ?? 0,
      boardName: input?.board_name ?? '',
      structure: input?.structure ?? '',
      stencil: input?.stencil ?? false,
      diagramImgPath: input?.diagram_img_path ?? '',
      boardImgPath: input?.board_img_path ?? '',
      hasElements: input?.has_elements ?? false,
    };
    return output;
  }

  private normalizeFindById(input: any): IBoard {
    const output: IBoard = {
      boardId: input?.board_id ?? 0,
      userId: input?.user_id ?? 0,
      boardName: input?.board_name ?? '',
      structure: input?.structure ?? '',
      stencil: input?.stencil ?? false,
      diagramImgPath: input?.diagram_img_path ?? '',
      boardImgPath: input?.board_img_path ?? '',
    };
    return output;
  }
}
