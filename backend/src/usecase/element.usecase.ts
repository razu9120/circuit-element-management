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
} from 'src/domain/element.entity';

export interface IElementUseCase {
  userGetElements(): Promise<IElement[]>;
  userGetElementById(elementId: string): Promise<IElement>;
  userCreateElement(elementCreate: IElementCreate): Promise<IElement>;
  userCreateMultipleElement(
    elementCreateList: IElementCreate[],
  ): Promise<IElement>;
  userUpdateElement(element: IElement): Promise<IElement>;
  userDeleteElement(elementId: string): Promise<IElement>;
}

@Injectable()
export class ElementUseCase {
  constructor(
    @Inject(ElementEntity)
    private readonly elementEntity: ElementEntity,
  ) {}

  async userGetElementById(elementId: string): Promise<IElement> {
    try {
      const result = await this.elementEntity.getElementById(elementId);
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

  async userUpdateElement(element: IElement): Promise<IElement> {
    const { elementId, boardId, productId, reference, content, footprint } =
      element;

    if (
      !elementId ||
      !boardId ||
      !productId ||
      !reference ||
      !content ||
      !footprint
    ) {
      throw new BadRequestException('Id and Name and price are required');
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

      const result = await this.elementEntity.updateElement(updElement);
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

  async userDeleteElement(elementId: string): Promise<IElement> {
    try {
      const result = await this.elementEntity.deleteElement(elementId);
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
