import React from "react";
import EditBoardClient from "./editBoardClient";
import { IBoard, IElementAndBoard } from "../boardDetail/boardDetail";
import { IProduct } from "../productList/productList";

export interface IEditBoardProps {
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

const fetchProducts = async (userId: number) => {
  const response = await fetch(
    `http://localhost:3000/backend/v1/products/${userId}`,
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
    const productList: IProduct[] = await fetchProducts(board.userId);
    return (
      <EditBoardClient
        board={board}
        elements={elements}
        productList={productList}
      />
    );
  } catch (error) {
    console.log(error);
  }
};

export default EditBoard;
