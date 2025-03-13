"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import RadioButton from "@/app/components/radioButton";
import Button from "@/app/components/button";
import { useMenu } from "@/app/contexts/menuContext";
import Input from "@/app/components/input";
import React, { useState } from "react";
import ConfirmModal from "@/app/components/confirmModal";
import { stencilOptions, structureOptions } from "@/app/constants/options";
import { IBoard, IElementAndBoard } from "../boardDetail/boardDetail";
import Select from "@/app/components/select";
import { IProduct } from "../productList/productList";
// import { Select } from "@/app/components/select";

interface IEditBoardClientProps {
  board: IBoard;
  elements: IElementAndBoard[];
  productList: IProduct[];
}

interface IProductOptions {
  value: number;
  label: string;
}

interface IFormData {
  boardName: string;
  structure: string;
  stencil: string;
  pcbDesign: File | null;
  circuitDiagram: File | null;
  csvFile: File | null;
}

interface IModalFormData {
  elementId: number;
  reference: string;
  content: string;
  footprint: string;
  productId: number;
}

interface IUploadResult {
  pcbDesign?: {
    path: string;
  };
  circuitDiagram?: {
    path: string;
  };
}

interface IBoardData {
  boardId: number;
  boardName: string;
  structure: string;
  stencil: string;
  boardImgPath: string;
  diagramImgPath: string;
}

interface IDeleteData {
  boardId: number;
  boardImgPathFlg: boolean;
  diagramImgPathFlg: boolean;
}

interface IElementData {
  elementId: number;
  boardId: number;
  productId: number;
  reference: string;
  content: string;
  footprint: string;
}

interface ICsvElementData {
  boardId: number;
  reference: string;
  content: string;
  footprint: string;
}

const createProductOptions = (productList: IProduct[]): IProductOptions[] => {
  return productList.map((product) => ({
    value: product.productId,
    label: product.productName,
  }));
};

const createFormData = (
  pcbDesign: File | null,
  circuitDiagram: File | null
): FormData => {
  const uploadData = new FormData();
  if (pcbDesign) uploadData.append("pcbDesign", pcbDesign);
  if (circuitDiagram) uploadData.append("circuitDiagram", circuitDiagram);
  return uploadData;
};

const createBoardData = (
  formData: IFormData,
  uploadResult: IUploadResult,
  updatedBoard: IBoard
): IBoardData => ({
  boardId: updatedBoard.boardId,
  boardName: formData.boardName,
  structure: formData.structure,
  stencil: formData.stencil,
  boardImgPath: uploadResult.pcbDesign
    ? uploadResult.pcbDesign.path
    : updatedBoard.boardImgPath,
  diagramImgPath: uploadResult.circuitDiagram
    ? uploadResult.circuitDiagram.path
    : updatedBoard.diagramImgPath,
});

const createDeleteData = (
  boardId: number,
  pcbDesign: File | null,
  circuitDiagram: File | null
) => ({
  boardId,
  boardImgPathFlg: !!pcbDesign,
  diagramImgPathFlg: !!circuitDiagram,
});

const csvToJson = (csvText: string, boardId: number): ICsvElementData[] => {
  const lines = csvText.trim().split("\n");
  const rows = lines.slice(1);

  return rows.map((row) => {
    const values = row.split(",").map((v) => v.replace(/"/g, "").trim());
    return {
      boardId,
      reference: values[0],
      content: values[1],
      footprint: values[2],
    };
  });
};

const createElementList = (
  elements: IElementAndBoard[],
  onEdit: (element: IElementAndBoard) => void,
  onDelete: (elementId: number) => void
) => {
  return elements.map((element) => (
    <div
      key={element.elementId}
      className="flex bg-base-100 rounded-box w-[1000px] md:w-full mt-2 p-3"
    >
      <Button
        label="編集"
        className="btn btn-xs btn-accent w-16 mr-3"
        onClick={() => onEdit(element)}
      />
      <Button
        label="削除"
        className="btn btn-xs btn-secondary w-12 mr-5"
        onClick={() => onDelete(element.elementId)}
      />
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

const uploadFiles = async (uploadData: FormData): Promise<IUploadResult> => {
  const response = await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    body: uploadData,
  });

  if (!response.ok) {
    throw new Error("ファイルのアップロードに失敗しました。");
  }

  return response.json();
};

const deleteFiles = async (deleteData: IDeleteData) => {
  const response = await fetch("http://localhost:3001/api/images", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deleteData),
  });

  if (!response.ok) {
    throw new Error("ファイルの削除に失敗しました。");
  }
};

const updateBoard = async (boardData: IBoardData) => {
  const response = await fetch("http://localhost:3001/api/boards", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(boardData),
  });

  if (!response.ok) {
    throw new Error("DB更新に失敗しました。");
  }

  return response.json();
};

const updateElement = async (elementData: IElementData) => {
  const response = await fetch("http://localhost:3001/api/elements", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(elementData),
  });

  if (!response.ok) {
    throw new Error("DB更新に失敗しました。");
  }
};

const deleteElement = async (elementId: number) => {
  const response = await fetch(
    `http://localhost:3001/api/elements/${elementId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
  }
};

const fetchBoard = async (boardId: number): Promise<IBoard> => {
  const response = await fetch(`http://localhost:3001/api/boards/${boardId}`);
  if (!response.ok) {
    throw new Error("更新後のデータ取得に失敗しました。");
  }
  return response.json();
};

const fetchElements = async (boardId: number): Promise<IElementAndBoard[]> => {
  const response = await fetch(
    `http://localhost:3001/api/elements/board/${boardId}`
  );
  if (!response.ok) {
    throw new Error("素子データの取得に失敗しました。");
  }
  return response.json();
};

const EditBoardClient: React.FC<IEditBoardClientProps> = ({
  board,
  elements,
  productList,
}) => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [updatedBoard, setUpdatedBoard] = useState<IBoard>(board);
  const [updatedElements, setUpdatedElements] =
    useState<IElementAndBoard[]>(elements);
  const [formData, setFormData] = useState<IFormData>({
    boardName: updatedBoard.boardName,
    structure: updatedBoard.structure,
    stencil: updatedBoard.stencil.toString(),
    pcbDesign: null,
    circuitDiagram: null,
    csvFile: null,
  });
  const [modalFormData, setModalFormData] = useState<IModalFormData>({
    elementId: 0,
    reference: "",
    content: "",
    footprint: "",
    productId: 0,
  });
  const [formKey, setFormKey] = useState(0);
  const [elementId, setElementId] = useState<number>(0);

  const productOptions = createProductOptions(productList);

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalChange = (field: string, value: string | File | null) => {
    setModalFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // ファイルアップロード
      const uploadData = createFormData(
        formData.pcbDesign,
        formData.circuitDiagram
      );
      const uploadResult = await uploadFiles(uploadData);

      // 既存ファイルの削除
      if (formData.pcbDesign || formData.circuitDiagram) {
        const deleteData = createDeleteData(
          updatedBoard.boardId,
          formData.pcbDesign,
          formData.circuitDiagram
        );
        await deleteFiles(deleteData);
      }

      // 基板データの更新
      const boardData = createBoardData(formData, uploadResult, updatedBoard);
      await updateBoard(boardData);

      // CSVファイルの処理
      if (formData.csvFile) {
        const csvText = await formData.csvFile.text();
        const jsonElements = csvToJson(csvText, board.boardId);
        await fetch("http://localhost:3001/api/elements/multiple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonElements),
        });
      }

      // データの更新
      const updatedData = await fetchBoard(board.boardId);
      setFormData({
        boardName: updatedData.boardName,
        structure: updatedData.structure,
        stencil: updatedData.stencil.toString(),
        pcbDesign: null,
        circuitDiagram: null,
        csvFile: null,
      });
      setUpdatedBoard(updatedData);
      await fetchUpdatedElements();

      setFormKey((prev) => prev + 1);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const elementData = {
        elementId: modalFormData.elementId,
        boardId: board.boardId,
        productId: modalFormData.productId,
        reference: modalFormData.reference,
        content: modalFormData.content,
        footprint: modalFormData.footprint,
      };

      await updateElement(elementData);
      await fetchUpdatedElements();
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const fetchUpdatedElements = async () => {
    try {
      const newElements = await fetchElements(board.boardId);
      setUpdatedElements(newElements);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleEditModalOpen = (element: IElementAndBoard) => {
    setModalFormData({
      elementId: element.elementId,
      reference: element.reference,
      content: element.content,
      footprint: element.footprint,
      productId: element.productId,
    });
    setEditModalOpen(true);
  };

  const handleDeleteModalOpen = (elementId: number) => {
    setElementId(elementId);
    setDeleteModalOpen(true);
  };

  const handleDeleteElement = async () => {
    try {
      await deleteElement(elementId);
      await fetchUpdatedElements();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleRedirect = (route: string, menuId: string) => {
    setMenuId(menuId);
    router.push(route);
  };

  const elementList = createElementList(
    updatedElements,
    handleEditModalOpen,
    handleDeleteModalOpen
  );

  return (
    <div key={formKey}>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          <div className="flex flex-col">
            <h1 className="font-bold mb-1">PCBデザイン</h1>
            <Image
              src={
                updatedBoard.boardImgPath === ""
                  ? "/no_image3.png"
                  : `/api/images/pcbDesign/${updatedBoard.boardImgPath.replace(
                      "/uploads/pcbDesign/",
                      ""
                    )}`
              }
              alt="PCB Design"
              width={500}
              height={400}
              className="rounded-box w-[300px] md:w-[346px] object-cover"
            />
            <div className="flex-1 flex items-end">
              <Input
                type="file"
                accept="image/jpeg, image/png, image/svg+xml, image/bmp"
                className="file-input file-input-xs md:file-input-lg file-input-bordered mt-2 w-full max-w-md"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("pcbDesign", e.target.files?.[0] || null)
                }
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold mb-1">回路図</h1>
            <Image
              src={
                updatedBoard.diagramImgPath === ""
                  ? "/no_image3.png"
                  : `/api/images/circuitDiagram/${updatedBoard.diagramImgPath.replace(
                      "/uploads/circuitDiagram/",
                      ""
                    )}`
              }
              alt="PCB Design"
              width={500}
              height={400}
              className="rounded-box w-[300px] md:w-[346px] object-cover"
            />
            <div className="flex-1 flex items-end">
              <Input
                type="file"
                accept="image/jpeg, image/png, image/svg+xml, image/bmp"
                className="file-input file-input-xs md:file-input-lg file-input-bordered mt-2 w-full max-w-md"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("circuitDiagram", e.target.files?.[0] || null)
                }
              />
            </div>
          </div>
        </div>

        <h1 className="font-bold mt-3 mb-1">
          名前<span className="text-red-500">*</span>
        </h1>
        <Input
          type="text"
          placeholder="Type here"
          value={formData.boardName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("boardName", e.target.value)
          }
          className="input input-bordered mt-1 mb-3 w-full max-w-xs"
        />
        <h1 className="font-bold">
          構造<span className="text-red-500">*</span>
        </h1>
        <RadioButton
          name="boardType"
          options={structureOptions}
          defaultValue={formData.structure}
          onChange={(value) => handleChange("structure", value)}
        />
        <h1 className="font-bold mt-1">
          ステンシル<span className="text-red-500">*</span>
        </h1>
        <RadioButton
          name="stencil"
          options={stencilOptions}
          defaultValue={formData.stencil.toString()}
          onChange={(value) => handleChange("stencil", value)}
        />
        <h1 className="font-bold mt-1">素子CSV</h1>
        <Input
          type="file"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 w-full max-w-md"
          accept=".csv"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("csvFile", e.target.files?.[0] || null)
          }
        />
      </div>

      <div className="flex justify-center mt-3">
        <Button
          label="戻る"
          className="btn btn-outline btn-secondary"
          onClick={() => {
            setMenuId("003");
            handleRedirect(`/boardList/${board.boardId}/boardDetail`, "003");
          }}
        />
        <Button
          label="変更"
          className="btn btn-primary ml-10 w-32"
          onClick={handleSubmit}
        />
      </div>

      <div className="bg-base-300 rounded-box mt-9 p-3">
        <h1 className="font-bold bg-base-300 mb-2 sticky top-0 z-5">素子</h1>
        <div className="h-64 md:h-72 lg:h-[465px] overflow-y-auto">
          {elementList}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="素子削除"
        body="本当に削除しますか？"
        onConfirm={() => handleDeleteElement()}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {editModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl">
            <div className="flex flex-col bg-base-300 rounded-box p-3">
              <h2 className="font-bold text-lg">素子編集</h2>
              <label className="block font-bold mt-3">参照</label>
              <Input
                type="text"
                value={modalFormData.reference}
                className="input input-bordered mt-1 w-full max-w-xs"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleModalChange("reference", e.target.value)
                }
              />
              <label className="block font-bold mt-3">値</label>
              <Input
                type="text"
                value={modalFormData.content}
                className="input input-bordered mt-1 w-full max-w-xs"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleModalChange("content", e.target.value)
                }
              />
              <label className="block font-bold mt-3">フットプリント</label>
              <Input
                type="text"
                value={modalFormData.footprint}
                className="input input-bordered mt-1 w-full max-w-xl"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleModalChange("footprint", e.target.value)
                }
              />
              <label className="block font-bold mt-3">製品紐付</label>
              <Select
                options={productOptions}
                defaultValue={
                  modalFormData.productId ? modalFormData.productId : 0
                }
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleModalChange("productId", e.target.value)
                }
                className="select select-bordered mt-1 w-full max-w-xs"
              />
            </div>
            <div className="flex justify-center mt-3 modal-action">
              <Button
                label="戻る"
                className="btn btn-outline btn-secondary"
                onClick={() => setEditModalOpen(false)}
              />
              <Button
                label="変更"
                className="btn btn-primary ml-10 w-32"
                onClick={handleModalSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBoardClient;
