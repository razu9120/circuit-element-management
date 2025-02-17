import { Inject, Injectable } from '@nestjs/common';

export interface IElementCreate {
  boardId: number;
  reference: string;
  content: string;
  footprint: string;
}

export interface IElement extends IElementCreate {
  elementId: number;
  productId: number;
}

export interface IElementAndBoard {
  elementId: number;
  reference: string;
  content: string;
  footprint: string;
  productName: string;
  DataSheetPath: string;
}

export interface IElementRepository {
  findById(id: number): Promise<IElement>;
  findByBoardId(id: number): Promise<IElementAndBoard[]>;
  create(element: IElementCreate): Promise<IElement>;
  update(element: IElementCreate): Promise<IElement>;
  delete(id: number): Promise<IElement>;
}

@Injectable()
export class ElementEntity {
  constructor(
    @Inject('IElementRepository')
    private readonly elementRepository: IElementRepository,
  ) {}

  newElement(
    boardId: number,
    reference: string,
    content: string,
    footprint: string,
  ): IElementCreate {
    return {
      boardId: boardId,
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
      productId: productId,
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

  async createElement(element: IElementCreate): Promise<IElement> {
    return await this.elementRepository.create(element);
  }

  async updateElement(element: IElementCreate): Promise<IElement> {
    return await this.elementRepository.update(element);
  }

  async deleteElement(id: number): Promise<IElement> {
    return await this.elementRepository.delete(id);
  }
}
