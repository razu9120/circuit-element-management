import { Inject, Injectable } from '@nestjs/common';

export interface IElementCreate {
  boardId: number;
  productId: number;
  reference: string;
  content: string;
  footprint: string;
}

export interface IElement extends IElementCreate {
  elementId: number;
}

export interface IElementAndBoard {
  elementId: number;
  reference: string;
  content: string;
  footprint: string;
  productId: number;
  productName: string;
  DataSheetPath: string;
}

export interface IElementRepository {
  findById(id: number): Promise<IElement>;
  findByBoardId(id: number): Promise<IElementAndBoard[]>;
  createMultiple(element: IElementCreate): Promise<IElement>;
  create(element: IElementCreate): Promise<IElement>;
  update(element: IElementCreate): Promise<IElement>;
  updateUnlinking(element: IElementCreate): Promise<IElement>;
  delete(id: number): Promise<IElement>;
  deleteByBoardId(boardId: number): Promise<IElement>;
}

@Injectable()
export class ElementEntity {
  constructor(
    @Inject('IElementRepository')
    private readonly elementRepository: IElementRepository,
  ) {}

  newElement(
    boardId: number,
    productId: number,
    reference: string,
    content: string,
    footprint: string,
  ): IElementCreate {
    return {
      boardId: boardId,
      productId: productId,
      reference: reference,
      content: content,
      footprint: footprint,
    };
  }

  updElement(
    elementId: number,
    boardId: number,
    productId: number,
    reference: string,
    content: string,
    footprint: string,
  ): IElement {
    return {
      elementId: elementId,
      boardId: boardId,
      productId: +productId,
      reference: reference,
      content: content,
      footprint: footprint,
    };
  }

  async getElementById(id: number): Promise<IElement> {
    return await this.elementRepository.findById(id);
  }

  async getElementByBoardId(id: number): Promise<IElementAndBoard[]> {
    return await this.elementRepository.findByBoardId(id);
  }

  async createMultipleElement(element: IElementCreate): Promise<IElement> {
    return await this.elementRepository.createMultiple(element);
  }

  async createElement(element: IElementCreate): Promise<IElement> {
    return await this.elementRepository.create(element);
  }

  async updateElement(element: IElementCreate): Promise<IElement> {
    return await this.elementRepository.update(element);
  }

  async updateElementUnlinking(element: IElementCreate): Promise<IElement> {
    return await this.elementRepository.updateUnlinking(element);
  }

  async deleteElement(id: number): Promise<IElement> {
    return await this.elementRepository.delete(id);
  }

  async deleteElementByBoardId(boardId: number): Promise<IElement> {
    return await this.elementRepository.deleteByBoardId(boardId);
  }
}
