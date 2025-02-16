"use client";
import Badge from "@/app/components/badge";
import { useMenu } from "@/app/contexts/menuContext";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { IBoardList } from "./boardList";

interface IBoardListClientProps {
  boardList: IBoardList[];
}

const BoardListClient: React.FC<IBoardListClientProps> = ({ boardList }) => {
  const { setMenuId } = useMenu();

  const boards = boardList.map((board) => (
    <Link
      key={board.boardId}
      href={`/boardList/${board.boardId}/boardDetail`}
      onClick={() => {
        setMenuId("003");
      }}
      className="card bg-base-100 md:w-[463px] mb-5 md:mb-0 shadow-xl cursor-pointer"
    >
      <figure>
        <Image
          src={
            board.boardImgPath === ""
              ? "/no_image3.png"
              : `/api/images/${board.boardImgPath.replace(
                  "/uploads/pcbDesign/",
                  ""
                )}`
          }
          alt="PCB Design"
          width={500}
          height={400}
          style={{ objectFit: "contain" }}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{board.boardName}</h2>
        <div className="flex flex-wrap gap-1">
          {board.structure === "1" && <Badge label="片面基板" />}
          {board.structure === "2" && <Badge label="両面基板" />}
          {board.structure === "3" && <Badge label="多層基板" />}
          {!board.stencil && <Badge label="ステンシルなし" color="secondary" />}
          {board.stencil && <Badge label="ステンシルあり" color="secondary" />}
          {board.hasElements && <Badge label="素子" color="accent" />}
        </div>
      </div>
    </Link>
  ));

  return (
    <>
      <div className="md:flex flex-wrap gap-5">{boards}</div>
    </>
  );
};

export default BoardListClient;
