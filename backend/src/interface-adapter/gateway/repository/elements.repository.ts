import { Inject, Injectable } from '@nestjs/common';
import {
  IElement,
  IElementAndBoard,
  IElementCreate,
  IElementRepository,
} from 'src/domain/element.entity';
import { ISqlDriver } from './repository';

@Injectable()
export class ElementRepository implements IElementRepository {
  constructor(
    @Inject('ISqlDriver')
    private readonly driver: ISqlDriver,
  ) {}

  async findById(id: number): Promise<IElement> {
    const output = await this.driver.select(`
      SELECT element_id, board_id, product_id, reference, content, footprint
      FROM elements
      WHERE element_id = ${id}
      ORDER BY element_id`);
    return this.normalizeFindById(output[0]);
  }

  async findByBoardId(id: number): Promise<IElementAndBoard[]> {
    const output = await this.driver.select(`
      SELECT T1.element_id, T1.user_id, T1.reference, T1.content, T1.footprint, T2.product_id, T2.product_name, T2.data_sheet_path
      FROM elements T1
      LEFT OUTER JOIN products T2
      ON T1.product_id = T2.product_id
      WHERE T1.board_id = ${id}`);
    return output.map((item: any) => this.normalizeFindByBoardId(item));
  }

  async createMultiple(element: IElementCreate): Promise<IElement> {
    return await this.driver.insert(`
      INSERT INTO elements (user_id, board_id, reference, content, footprint, created_at, updated_at)
      VALUES ('${element.userId}', '${element.boardId}', '${element.reference}', '${element.content}', '${element.footprint}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      returning *
      `);
  }

  async create(element: IElementCreate): Promise<IElement> {
    return await this.driver.insert(`
      INSERT INTO elements (user_id, board_id, product_id, reference, content, footprint, created_at, updated_at)
      VALUES ('${element.userId}', '${element.boardId}', '${element.productId}', '${element.reference}', '${element.content}', '${element.footprint}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      returning *
      `);
  }

  async createUnlinking(element: IElementCreate): Promise<IElement> {
    return await this.driver.insert(`
      INSERT INTO elements (user_id, board_id, reference, content, footprint, created_at, updated_at)
      VALUES ('${element.userId}', '${element.boardId}', '${element.reference}', '${element.content}', '${element.footprint}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      returning *
      `);
  }

  async update(element: IElement): Promise<IElement> {
    return await this.driver.update(`
      UPDATE elements SET board_id = '${element.boardId}', product_id = '${element.productId}', reference = '${element.reference}', content = '${element.content}', footprint = '${element.footprint}', updated_at = CURRENT_TIMESTAMP
      WHERE element_id = '${element.elementId}'
      returning *
      `);
  }

  async updateUnlinking(element: IElement): Promise<IElement> {
    return await this.driver.update(`
      UPDATE elements SET board_id = '${element.boardId}', product_id = NULL, reference = '${element.reference}', content = '${element.content}', footprint = '${element.footprint}', updated_at = CURRENT_TIMESTAMP
      WHERE element_id = '${element.elementId}'
      returning *
      `);
  }

  async delete(id: number): Promise<IElement> {
    return await this.driver.delete(`
      DELETE FROM elements
      WHERE element_id = ${id}
      returning *
      `);
  }

  async deleteByBoardId(boardId: number): Promise<IElement> {
    return await this.driver.delete(`
      DELETE FROM elements
      WHERE board_id = ${boardId}
      returning *
      `);
  }

  private normalizeFindById(input: any): IElement {
    const output: IElement = {
      userId: input?.user_id ?? 0,
      elementId: input?.element_id ?? 0,
      boardId: input?.board_id ?? 0,
      productId: input?.product_id ?? 0,
      reference: input?.reference ?? '',
      content: input?.content ?? '',
      footprint: input?.footprint ?? '',
    };
    return output;
  }

  private normalizeFindByBoardId(input: any): IElementAndBoard {
    const output: IElementAndBoard = {
      elementId: input?.element_id ?? 0,
      userId: input?.user_id ?? 0,
      reference: input?.reference ?? '',
      content: input?.content ?? '',
      footprint: input?.footprint ?? '',
      productId: input?.product_id ?? 0,
      productName: input?.product_name ?? '',
      dataSheetPath: input?.data_sheet_path ?? '',
    };
    return output;
  }
}
