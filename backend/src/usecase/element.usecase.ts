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
    const { boardId, productId, reference, content, footprint } = elementCreate;

    if (!boardId || !productId || !reference || !content || !footprint) {
      throw new BadRequestException('Name and price are required');
    }
    try {
      const newElement = this.elementEntity.newElement(
        boardId,
        productId,
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
