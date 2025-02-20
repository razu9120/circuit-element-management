import React from "react";
import EditBoardClient from "./editBoardClient";
import { IBoard, IElementAndBoard } from "../boardDetail/boardDetail";

export interface IEditBoardProps {
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

const EditBoard: React.FC<IEditBoardProps> = async ({ boardId }) => {
  try {
    const board: IBoard = await fetchBoard(boardId);
    const elements: IElementAndBoard[] = await fetchElements(boardId);
    return <EditBoardClient board={board} elements={elements} />;
  } catch (error) {
    console.log(error);
  }
};

export default EditBoard;
