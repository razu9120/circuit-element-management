import React from "react";
import BoardDetailClient from "./boardDetailClient";

export interface IBoard {
  userId: number;
  boardId: number;
  boardName: string;
  structure: string;
  stencil: boolean;
  boardImgPath: string;
  diagramImgPath: string;
}

export interface IElementAndBoard {
  elementId: number;
  userId: number;
  reference: string;
  content: string;
  footprint: string;
  productId: number;
  productName: string;
  dataSheetPath: string;
}

export interface IBoardDetailProps {
  boardId: number;
}

const fetchBoard = async (boardId: number) => {
  const response = await fetch(
    `http://localhost:3000/backend/v1/boards/one/${boardId}`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
  }
  return await response.json();
};

const fetchElements = async (boardId: number) => {
  const response = await fetch(
    `http://localhost:3000/backend/v1/elements/board/${boardId}`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
  }
  return await response.json();
};

const BoardDetail: React.FC<IBoardDetailProps> = async ({ boardId }) => {
  try {
    const board: IBoard = await fetchBoard(boardId);
    const elements: IElementAndBoard[] = await fetchElements(boardId);
    return <BoardDetailClient board={board} elements={elements} />;
  } catch (error) {
    console.log(error);
  }
};

export default BoardDetail;
