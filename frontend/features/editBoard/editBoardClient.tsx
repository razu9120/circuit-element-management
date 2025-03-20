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
import { useForm } from "react-hook-form";
import Alert from "@/app/components/alert";

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
}

interface IFileData {
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

const bulkDeleteElements = async (boardId: number) => {
  const response = await fetch(
    `http://localhost:3001/api/elements/board/${boardId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageCode || "エラーが発生しました");
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
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] =
    useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [updatedBoard, setUpdatedBoard] = useState<IBoard>(board);
  const [updatedElements, setUpdatedElements] =
    useState<IElementAndBoard[]>(elements);
  const [fileData, setFileData] = useState<IFileData>({
    pcbDesign: null,
    circuitDiagram: null,
    csvFile: null,
  });
  const [formKey, setFormKey] = useState(0);
  const [elementId, setElementId] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);

  const productOptions = createProductOptions(productList);

  const [showAlert, setShowAlert] = useState(false);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IFormData>({
    mode: "onChange",
    defaultValues: {
      boardName: updatedBoard.boardName,
      structure: updatedBoard.structure,
      stencil: updatedBoard.stencil.toString(),
    },
  });

  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    formState: { errors: modalErrors },
    reset: resetModal,
  } = useForm<IModalFormData>({
    mode: "onChange",
    defaultValues: {
      elementId: 0,
      reference: "",
      content: "",
      footprint: "",
      productId: 0,
    },
  });

  const handleFileChange = (field: keyof IFileData, files: FileList | null) => {
    const file = files?.[0] || null;
    setFileData((prev: IFileData) => ({ ...prev, [field]: file }));
  };

  const onSubmit = async (data: IFormData) => {
    try {
      // ファイルアップロード
      const uploadData = createFormData(
        fileData.pcbDesign,
        fileData.circuitDiagram
      );
      const uploadResult = await uploadFiles(uploadData);

      // 既存ファイルの削除
      if (fileData.pcbDesign || fileData.circuitDiagram) {
        const deleteData = createDeleteData(
          updatedBoard.boardId,
          fileData.pcbDesign,
          fileData.circuitDiagram
        );
        await deleteFiles(deleteData);
      }

      // 基板データの更新
      const boardData = createBoardData(data, uploadResult, updatedBoard);
      await updateBoard(boardData);

      // CSVファイルの処理
      if (fileData.csvFile) {
        const csvText = await fileData.csvFile.text();
        const jsonElements = csvToJson(csvText, board.boardId);
        await fetch("http://localhost:3001/api/elements/multiple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonElements),
        });
      }

      // データの更新
      const updatedData = await fetchBoard(board.boardId);
      setFileData({
        pcbDesign: null,
        circuitDiagram: null,
        csvFile: null,
      });
      setUpdatedBoard(updatedData);
      await fetchUpdatedElements();

      setFormKey((prev) => prev + 1);
      setShowAlert(true);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleEditModalOpen = (element: IElementAndBoard) => {
    resetModal({
      elementId: element.elementId,
      reference: element.reference,
      content: element.content,
      footprint: element.footprint,
      productId: element.productId,
    });
    setSelectedProductId(element.productId || 0);
    setEditModalOpen(true);
  };

  const onModalSubmit = async (data: IModalFormData) => {
    try {
      const elementData = {
        elementId: data.elementId,
        boardId: board.boardId,
        productId: selectedProductId,
        reference: data.reference,
        content: data.content,
        footprint: data.footprint,
      };

      await updateElement(elementData);
      await fetchUpdatedElements();
      setShowModalAlert(true);
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

  const handleDeleteModalOpen = (elementId: number) => {
    setElementId(elementId);
    setDeleteModalOpen(true);
  };

  const handleBulkDeleteElement = async () => {
    try {
      await bulkDeleteElements(board.boardId);
      await fetchUpdatedElements();
      setShowBulkDeleteAlert(true);
      setBulkDeleteModalOpen(false);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleDeleteElement = async () => {
    try {
      await deleteElement(elementId);
      await fetchUpdatedElements();
      setShowDeleteAlert(true);
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-base-300 rounded-box p-3"
      >
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
                  handleFileChange("pcbDesign", e.target.files)
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
                  handleFileChange("circuitDiagram", e.target.files)
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
          className={`input input-bordered mt-1 mb-3 w-full max-w-xs ${
            errors.boardName ? "input-error" : ""
          }`}
          {...register("boardName", { required: "名前は必須です" })}
        />
        {errors.boardName && (
          <p className="text-error text-sm mb-3">{errors.boardName.message}</p>
        )}

        <h1 className="font-bold">
          構造<span className="text-red-500">*</span>
        </h1>
        <div className={errors.structure ? "radio-error" : ""}>
          <RadioButton
            name="structure"
            options={structureOptions}
            defaultValue={watch("structure")}
            onChange={(value) => setValue("structure", value)}
          />
        </div>
        {errors.structure && (
          <p className="text-error text-sm mb-3">{errors.structure.message}</p>
        )}

        <h1 className="font-bold mt-1">
          ステンシル<span className="text-red-500">*</span>
        </h1>
        <div className={errors.stencil ? "radio-error" : ""}>
          <RadioButton
            name="stencil"
            options={stencilOptions}
            defaultValue={watch("stencil")}
            onChange={(value) => setValue("stencil", value)}
          />
        </div>
        {errors.stencil && (
          <p className="text-error text-sm mb-3">{errors.stencil.message}</p>
        )}

        <h1 className="font-bold mt-1">素子CSV</h1>
        <Input
          type="file"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 w-full max-w-md"
          accept=".csv"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileChange("csvFile", e.target.files)
          }
        />
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
            type="submit"
            label="変更"
            className="btn btn-primary ml-10 w-32"
          />
        </div>
      </form>

      <Alert
        message="基板情報を更新しました"
        type="success"
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Alert
        message="素子を一括削除しました"
        type="success"
        isVisible={showBulkDeleteAlert}
        onClose={() => setShowBulkDeleteAlert(false)}
      />
      <Alert
        message="素子を削除しました"
        type="success"
        isVisible={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
      />

      <div className="bg-base-300 rounded-box mt-9 p-3">
        <div className="flex">
          <h1 className="font-bold bg-base-300 mb-2 sticky top-0 z-5">素子</h1>
          <Button label="追加" className="btn btn-xs btn-accent w-16 ml-6" />
          {elementList.length > 0 && (
            <Button
              label="一括削除"
              className="btn btn-xs btn-secondary ml-3"
              onClick={() => setBulkDeleteModalOpen(true)}
            />
          )}
        </div>
        <div className="h-64 md:h-72 lg:h-[465px] overflow-y-auto">
          {elementList}
        </div>
      </div>

      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        title="素子一括削除"
        body="本当に一括削除しますか？"
        onConfirm={() => handleBulkDeleteElement()}
        onCancel={() => setBulkDeleteModalOpen(false)}
      />

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
            <form
              onSubmit={handleSubmitModal(onModalSubmit)}
              className="flex flex-col bg-base-300 rounded-box p-3"
            >
              <h2 className="font-bold text-lg">素子編集</h2>
              <label className="block font-bold mt-3">
                参照/名前<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                className={`input input-bordered mt-1 mb-3 w-full max-w-xs ${
                  modalErrors.reference ? "input-error" : ""
                }`}
                {...registerModal("reference", {
                  required: "参照/名前は必須です",
                })}
              />
              {modalErrors.reference && (
                <p className="text-error text-sm mb-3">
                  {modalErrors.reference.message}
                </p>
              )}

              <label className="block font-bold">値</label>
              <Input
                type="text"
                className="input input-bordered mt-1 mb-3 w-full max-w-xs"
                {...registerModal("content")}
              />

              <label className="block font-bold">フットプリント</label>
              <Input
                type="text"
                className="input input-bordered mt-1 mb-3 w-full max-w-xl"
                {...registerModal("footprint")}
              />

              <label className="block font-bold">製品紐付</label>
              <Select
                options={productOptions}
                className="select select-bordered mt-1 w-full max-w-xs"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
              />

              <div className="flex justify-center mt-3 modal-action">
                <Button
                  type="button"
                  label="戻る"
                  className="btn btn-outline btn-secondary"
                  onClick={() => {
                    setEditModalOpen(false);
                    setShowModalAlert(false);
                  }}
                />
                <Button
                  type="submit"
                  label="変更"
                  className="btn btn-primary ml-10 w-32"
                />
              </div>
            </form>
          </div>
          <Alert
            message="素子情報を更新しました"
            type="success"
            isVisible={showModalAlert}
            onClose={() => setShowModalAlert(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EditBoardClient;
