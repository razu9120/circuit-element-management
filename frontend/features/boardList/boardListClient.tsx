"use client";
import Badge from "@/app/components/badge";
import { useMenu } from "@/app/contexts/menuContext";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { IBoardList } from "./boardList";

// 型定義
interface IBoardListClientProps {
  boardList: IBoardList[];
}

interface IImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  style: React.CSSProperties;
}

// 純粋関数
const getImagePath = (boardImgPath: string): string => {
  if (boardImgPath === "") return "/no_image3.png";
  return `/api/images/pcbDesign/${boardImgPath.replace(
    "/uploads/pcbDesign/",
    ""
  )}`;
};

const createImageProps = (boardImgPath: string): IImageProps => ({
  src: getImagePath(boardImgPath),
  alt: "PCB Design",
  width: 500,
  height: 400,
  style: { objectFit: "contain" },
});

const createBadgeList = (board: IBoardList) => {
  const badges = [];

  if (board.structure === "1")
    badges.push(<Badge key="single" label="片面基板" />);
  if (board.structure === "2")
    badges.push(<Badge key="double" label="両面基板" />);
  if (board.structure === "3")
    badges.push(<Badge key="multi" label="多層基板" />);
  if (!board.stencil)
    badges.push(
      <Badge key="no-stencil" label="ステンシルなし" color="secondary" />
    );
  if (board.stencil)
    badges.push(
      <Badge key="with-stencil" label="ステンシルあり" color="secondary" />
    );
  if (board.hasElements)
    badges.push(<Badge key="elements" label="素子" color="accent" />);

  return badges;
};

const createBoardCard = (
  board: IBoardList,
  onMenuIdChange: (menuId: string) => void
) => (
  <Link
    key={board.boardId}
    href={`/boardList/${board.boardId}/boardDetail`}
    onClick={() => onMenuIdChange("003")}
    className="card bg-base-300 md:w-[463px] mb-5 md:mb-0 shadow-xl cursor-pointer"
  >
    <figure>
      <Image {...createImageProps(board.boardImgPath)} alt="pcbDesign" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{board.boardName}</h2>
      <div className="flex flex-wrap gap-1">{createBadgeList(board)}</div>
    </div>
  </Link>
);

const createBoardList = (
  boardList: IBoardList[],
  onMenuIdChange: (menuId: string) => void
) => {
  return boardList.map((board) => createBoardCard(board, onMenuIdChange));
};

const BoardListClient: React.FC<IBoardListClientProps> = ({ boardList }) => {
  const { setMenuId } = useMenu();

  const boards = createBoardList(boardList, setMenuId);

  return (
    <>
      <div className="md:flex flex-wrap gap-5">{boards}</div>
    </>
  );
};

export default BoardListClient;
