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

  async findById(id: string): Promise<IBoard> {
    return await this.driver.select(`
      SELECT board_id, board_name, structure, stencil, diagram_img_path, board_img_path
      FROM boards
      WHERE board_id = ${id}
      ORDER BY board_id
      `);
  }

  async findAll(): Promise<IBoardHasElements[]> {
    return await this.driver.select(`
      SELECT b.board_id, b.board_name, b.structure, b.stencil, b.diagram_img_path, b.board_img_path,
        EXISTS (
          SELECT 1 FROM elements e WHERE e.board_id = b.board_id
        ) AS has_elements
      FROM boards b
      ORDER BY b.board_id
      `);
  }

  async create(board: IBoardCreate): Promise<IBoard> {
    return await this.driver.insert(`
      INSERT INTO boards (board_name, structure, stencil, diagram_img_path, board_img_path, created_at, updated_at)
      VALUES ('${board.boardName}', '${board.structure}', '${board.stencil}', '${board.diagramImgPath}', '${board.boardImgPath}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      returning *
      `);
  }

  async update(board: IBoard): Promise<IBoard> {
    return await this.driver.update(`
      UPDATE boards SET board_name = '${board.boardName}', structure = ${board.structure}, stencil = ${board.stencil}, diagram_img_path = ${board.diagramImgPath}, board_img_path = ${board.boardImgPath}, updated_at = CURRENT_TIMESTAMP
      WHERE board_id = ${board.boardId}
      returning *
      `);
  }

  async delete(id: string): Promise<IBoard> {
    return await this.driver.delete(`
      DELETE FROM boards
      WHERE board_id = ${id}
      returning *
      `);
  }
}
