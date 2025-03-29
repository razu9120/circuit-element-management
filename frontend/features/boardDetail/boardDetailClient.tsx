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

// 型定義
interface IImageProps {
  src: string;
  alt: string;
  className: string;
}

const getImagePath = (
  path: string,
  type: "pcbDesign" | "circuitDiagram"
): string => {
  if (path === "") return "/no_image3.png";
  const basePath = `/api/images/${type}/`;
  const fileName = path.replace(`/uploads/${type}/`, "");
  return `${basePath}${fileName}`;
};

const createImageProps = (
  path: string,
  type: "pcbDesign" | "circuitDiagram",
  className: string
): IImageProps => ({
  src: getImagePath(path, type),
  alt: type === "pcbDesign" ? "PCB Design Image" : "Circuit Diagram Image",
  className,
});

const createElementList = (
  elements: IElementAndBoard[],
  onDataSheetClick: (path: string) => void
) => {
  return elements.map((element) => (
    <div
      key={element.elementId}
      className="flex bg-base-100 rounded-box w-[1000px] md:w-full mt-2 p-3"
    >
      {element.dataSheetPath ? (
        <Button
          label="データシート"
          className="btn btn-xs btn-warning w-24 mr-5"
          onClick={() => onDataSheetClick(element.dataSheetPath)}
        />
      ) : (
        <Button
          label="データシート"
          className="btn btn-xs btn-warning w-24 mr-5"
          disabled
        />
      )}
      {element.productName && (
        <h1 className="font-bold text-warning">{element.productName}</h1>
      )}
      <h1 className={`font-bold ${element.productName ? "ml-5" : ""}`}>
        {element.reference}
      </h1>
      <h1 className="font-bold ml-5">{element.content}</h1>
      <h1 className="font-bold ml-5">{element.footprint}</h1>
    </div>
  ));
};

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

  const displayDataSheetPdf = (dataSheetPath: string) => {
    window.open(
      `http://localhost:3001/api/images/dataSheetPdf/${dataSheetPath.replace(
        "/uploads/dataSheetPdf/",
        ""
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleRedirect = (route: string, menuId: string) => {
    setMenuId(menuId);
    router.push(route);
  };

  const elementList = createElementList(elements, displayDataSheetPdf);

  const renderImages = (className: string) => (
    <div className="flex flex-col md:flex-row gap-3">
      <div>
        <h1 className="font-bold mt-2 mb-1">PCBデザイン</h1>
        <Image
          {...createImageProps(board.boardImgPath, "pcbDesign", className)}
          width={500}
          height={400}
          alt="pcbDesign"
        />
      </div>
      <div>
        <h1 className="font-bold mt-2 mb-1">回路図</h1>
        <Image
          {...createImageProps(
            board.diagramImgPath,
            "circuitDiagram",
            className
          )}
          width={500}
          height={400}
          alt="circuitDiagram"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <Toggle
          checked={isToggled}
          onChange={setIsToggled}
          className="toggle-accent"
        />
        {isToggled ? (
          renderImages("rounded-box w-[300px] md:w-[346px] object-cover")
        ) : (
          <>
            {renderImages("rounded-box w-full")}
            <h1 className="font-bold mt-2 mb-1">名前</h1>
            <div>{board.boardName}</div>
            <h1 className="font-bold mt-5">構造</h1>
            <RadioButton
              name="boardType"
              options={structureOptions}
              defaultValue={board.structure}
              disabled
            />
            <h1 className="font-bold mt-2">ステンシル</h1>
            <RadioButton
              name="boardType1"
              options={stencilOptions}
              defaultValue={board.stencil ? "true" : "false"}
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
          onClick={() => handleRedirect("/boardList", "002")}
        />
        <Button
          label="基板編集"
          className="btn btn-primary ml-10 w-32"
          onClick={() =>
            handleRedirect(
              `/boardList/${board.boardId}/boardDetail/editBoard`,
              "004"
            )
          }
        />
      </div>
    </>
  );
};

export default BoardDetailClient;
