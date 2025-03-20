import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  IElement,
  IElementCreate,
  ElementEntity,
  IElementAndBoard,
} from 'src/domain/element.entity';

export interface IElementUseCase {
  userGetElements(): Promise<IElement[]>;
  userGetElementById(elementId: number): Promise<IElement>;
  userGetElementByBoardId(boardId: number): Promise<IElementAndBoard[]>;
  userCreateElement(elementCreate: IElementCreate): Promise<IElement>;
  userCreateMultipleElement(
    elementCreateList: IElementCreate[],
  ): Promise<IElement>;
  userUpdateElement(element: IElement): Promise<IElement>;
  userDeleteElement(elementId: number): Promise<IElement>;
}

@Injectable()
export class ElementUseCase {
  constructor(
    @Inject(ElementEntity)
    private readonly elementEntity: ElementEntity,
  ) {}

  async userGetElementById(elementId: number): Promise<IElement> {
    try {
      return await this.elementEntity.getElementById(elementId);
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

  async userGetElementByBoardId(boardId: number): Promise<IElementAndBoard[]> {
    try {
      return await this.elementEntity.getElementByBoardId(boardId);
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

  async userCreateElement(elementCreate: IElementCreate): Promise<IElement> {
    const { boardId, reference, content, footprint } = elementCreate;

    if (!boardId) {
      throw new BadRequestException('基板IDは必須です。');
    }

    try {
      const newElement = this.elementEntity.newElement(
        boardId,
        reference,
        content,
        footprint,
      );

      const result = await this.elementEntity.createElement(newElement);
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

  async userCreateMultipleElement(
    elementCreateList: IElementCreate[],
  ): Promise<IElement[]> {
    if (!elementCreateList.length) {
      throw new BadRequestException('要素リストが空です。');
    }

    try {
      const createPromises = elementCreateList.map((elementCreate) => {
        const { boardId, reference, content, footprint } = elementCreate;

        if (!boardId) {
          throw new BadRequestException('基板IDは必須です。');
        }

        const newElement = this.elementEntity.newElement(
          boardId,
          reference,
          content,
          footprint,
        );
        return this.elementEntity.createElement(newElement);
      });

      const results = await Promise.all(createPromises);
      return results;
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

  async userUpdateElement(element: IElement): Promise<IElement> {
    const { elementId, boardId, productId, reference, content, footprint } =
      element;

    if (!elementId) {
      throw new BadRequestException('Idは必須です。');
    }

    try {
      const updElement = this.elementEntity.updElement(
        elementId,
        boardId,
        productId,
        reference,
        content,
        footprint,
      );

      if (updElement.productId === 0) {
        const result =
          await this.elementEntity.updateElementUnlinking(updElement);
        return result;
      } else {
        const result = await this.elementEntity.updateElement(updElement);
        return result;
      }
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

  async userDeleteElement(elementId: number): Promise<IElement> {
    try {
      const result = await this.elementEntity.deleteElement(elementId);
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
