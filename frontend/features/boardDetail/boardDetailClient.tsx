"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RadioButton from "@/app/components/radioButton";

import Button from "@/app/components/button";
import Toggle from "@/app/components/toggle";
import { useMenu } from "@/app/contexts/menuContext";
import { stencilOptions, structureOptions } from "@/app/constants/options";
import { IBoard, IElementAndBoard } from "./boardDetail";

interface IBoardDetailClientProps {
  board: IBoard;
  elements: IElementAndBoard[];
}

const BoardDetailClient: React.FC<IBoardDetailClientProps> = ({
  board,
  elements,
}) => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [isToggled, setIsToggled] = useState(false);

  const Redirect = (route: string) => {
    router.push(route);
  };

  const elementList = elements.map((element) => (
    <div
      key={element.elementId}
      className="flex bg-base-100 rounded-box w-[1000px] md:w-full mt-2 p-3"
    >
      {element.productName ? (
        <Button
          label="データシート"
          className="btn btn-xs btn-warning w-24 mr-5"
        />
      ) : (
        <Button
          label="データシート"
          className="btn btn-xs btn-warning w-24 mr-5"
          disabled
        />
      )}
      <h1 className="font-bold">{element.reference}</h1>
      {element.productName && (
        <h1 className="font-bold ml-5">{element.productName}</h1>
      )}
      <h1 className="font-bold ml-5">{element.content}</h1>
      <h1 className="font-bold ml-5">{element.footprint}</h1>
    </div>
  ));

  return (
    <>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <Toggle
          checked={isToggled}
          onChange={setIsToggled}
          className="toggle-accent"
        />
        {isToggled ? (
          <div className="flex flex-col md:flex-row gap-3">
            <div>
              <h1 className="font-bold mt-2 mb-1">PCBデザイン</h1>
              <Image
                src={
                  board.boardImgPath === ""
                    ? "/no_image3.png"
                    : `/api/images/pcbDesign/${board.boardImgPath.replace(
                        "/uploads/pcbDesign/",
                        ""
                      )}`
                }
                alt="PCB Design"
                width={500}
                height={400}
                className="rounded-box w-[300px] md:w-[346px] object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold mt-2 mb-1">回路図</h1>
              <Image
                src={
                  board.diagramImgPath === ""
                    ? "/no_image3.png"
                    : `/api/images/circuitDiagram/${board.diagramImgPath.replace(
                        "/uploads/circuitDiagram/",
                        ""
                      )}`
                }
                alt="PCB Design"
                width={500}
                height={400}
                className="rounded-box w-[300px] md:w-[346px] object-cover"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-3">
              <div>
                <h1 className="font-bold mt-2 mb-1">PCBデザイン</h1>
                <Image
                  src={
                    board.boardImgPath === ""
                      ? "/no_image3.png"
                      : `/api/images/pcbDesign/${board.boardImgPath.replace(
                          "/uploads/pcbDesign/",
                          ""
                        )}`
                  }
                  alt="PCB Design"
                  width={500}
                  height={400}
                  className="rounded-box w-full"
                />
              </div>
              <div>
                <h1 className="font-bold mt-2 mb-1">回路図</h1>
                <Image
                  src={
                    board.diagramImgPath === ""
                      ? "/no_image3.png"
                      : `/api/images/circuitDiagram/${board.diagramImgPath.replace(
                          "/uploads/circuitDiagram/",
                          ""
                        )}`
                  }
                  alt="PCB Design"
                  width={500}
                  height={400}
                  className="rounded-box w-full"
                />
              </div>
            </div>
            <h1 className="font-bold mt-2 mb-1">名前</h1>
            <div>{board.boardName}</div>
            <h1 className="font-bold mt-5">構造</h1>
            <RadioButton
              name="boardType"
              options={structureOptions}
              defaultValue={board.structure}
              onChange={(value) => console.log(value)}
              disabled
            />
            <h1 className="font-bold mt-2">ステンシル</h1>
            <RadioButton
              name="boardType1"
              options={stencilOptions}
              defaultValue={board.stencil ? "true" : "false"}
              onChange={(value) => console.log(value)}
              disabled
            />
          </>
        )}
      </div>
      <div className="bg-base-300 rounded-box mt-3 p-3">
        <h1 className="font-bold bg-base-300 mb-2 sticky top-0 z-5">素子</h1>
        <div className="h-64 md:h-72 lg:h-[465px] overflow-y-auto">
          {elementList}
        </div>
      </div>

      <div className="flex justify-center mt-3">
        <Button
          label="戻る"
          className="btn btn-outline btn-secondary"
          onClick={() => {
            setMenuId("002");
            Redirect("/boardList");
          }}
        />
        <Button
          label="基板編集"
          className="btn btn-primary ml-10 w-32"
          onClick={() => {
            setMenuId("004");
            Redirect(`/boardList/${board.boardId}/boardDetail/editBoard`);
          }}
        />
      </div>
    </>
  );
};

export default BoardDetailClient;
