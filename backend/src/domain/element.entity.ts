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

export interface IElementRepository {
  findById(id: string): Promise<IElement>;
  create(element: IElementCreate): Promise<IElement>;
  update(element: IElementCreate): Promise<IElement>;
  delete(id: string): Promise<IElement>;
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
      productId: productId,
      reference: reference,
      content: content,
      footprint: footprint,
    };
  }

  async getElementById(id: string): Promise<IElement> {
    return await this.elementRepository.findById(id);
  }

  async createElement(element: IElementCreate): Promise<IElement> {
    return await this.elementRepository.create(element);
  }

  async updateElement(element: IElementCreate): Promise<IElement> {
    return await this.elementRepository.update(element);
  }

  async deleteElement(id: string): Promise<IElement> {
    return await this.elementRepository.delete(id);
  }
}
