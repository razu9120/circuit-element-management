import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import {
  IElement,
  IElementAndBoard,
  IElementCreate,
} from 'src/domain/element.entity';
import { IElementUseCase } from 'src/usecase/element.usecase';

@Controller('backend/v1/elements')
export class ElementController {
  constructor(
    @Inject('IElementUseCase')
    private readonly elementUseCase: IElementUseCase,
  ) {}

  @Get(':elementId')
  userGetElementById(@Param('elementId') elementId: number): Promise<IElement> {
    return this.elementUseCase.userGetElementById(elementId);
  }

  @Get('board/:boardId')
  userGetElementByBoardId(
    @Param('boardId') boardId: number,
  ): Promise<IElementAndBoard[]> {
    return this.elementUseCase.userGetElementByBoardId(boardId);
  }

  @Post()
  userCreateElement(@Body() elementCreate: IElementCreate): Promise<IElement> {
    return this.elementUseCase.userCreateElement(elementCreate);
  }

  @Post('/multiple')
  userCreateMultipleElement(
    @Body() elementCreateList: IElementCreate[],
  ): Promise<IElement> {
    return this.elementUseCase.userCreateMultipleElement(elementCreateList);
  }

  @Patch()
  userUpdateElement(@Body() element: IElement): Promise<IElement> {
    return this.elementUseCase.userUpdateElement(element);
  }

  @Delete(':elementId')
  userDeleteElement(@Param('elementId') elementId: number): Promise<IElement> {
    return this.elementUseCase.userDeleteElement(elementId);
  }
}
