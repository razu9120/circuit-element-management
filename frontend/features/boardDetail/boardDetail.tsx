import React from "react";
import BoardDetailClient from "./boardDetailClient";

export interface IBoard {
  boardId: number;
  boardName: string;
  structure: string;
  stencil: boolean;
  boardImgPath: string;
  diagramImgPath: string;
}

export interface BoardDetailProps {
  boardId: number;
}

const fetchBoard = async (boardId: number) => {
  const response = await fetch(
    `http://localhost:3000/backend/v1/boards/${boardId}`,
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

const BoardDetail: React.FC<BoardDetailProps> = async ({ boardId }) => {
  try {
    const board: IBoard = await fetchBoard(boardId);
    return <BoardDetailClient board={board} />;
  } catch (error) {
    console.log(error);
  }
};

export default BoardDetail;
