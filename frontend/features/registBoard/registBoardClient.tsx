"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../app/components/button";
import Input from "../../app/components/input";
import RadioButton from "../../app/components/radioButton";
import { stencilOptions, structureOptions } from "@/app/constants/options";
import { useMenu } from "@/app/contexts/menuContext";

// 型定義
interface IFormData {
  boardName: string;
  structure: string;
  stencil: string;
  pcbDesign: File | null;
  circuitDiagram: File | null;
  csvFile: File | null;
}

interface IBoardData {
  boardName: string;
  structure: string;
  stencil: string;
  boardImgPath: string;
  diagramImgPath: string;
}

interface IElementData {
  boardId: number;
  reference: string;
  content: string;
  footprint: string;
}

interface IUploadResult {
  pcbDesign?: {
    path: string;
  };
  circuitDiagram?: {
    path: string;
  };
}

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
  uploadResult: IUploadResult
): IBoardData => ({
  boardName: formData.boardName,
  structure: formData.structure,
  stencil: formData.stencil,
  boardImgPath: uploadResult.pcbDesign ? uploadResult.pcbDesign.path : "",
  diagramImgPath: uploadResult.circuitDiagram
    ? uploadResult.circuitDiagram.path
    : "",
});

const csvToJson = (csvText: string, boardId: number): IElementData[] => {
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

const initialFormData: IFormData = {
  boardName: "",
  structure: "1",
  stencil: "false",
  pcbDesign: null,
  circuitDiagram: null,
  csvFile: null,
};

// API関連の純粋関数
const uploadFiles = async (uploadData: FormData) => {
  const response = await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    body: uploadData,
  });

  if (!response.ok) {
    throw new Error("ファイルのアップロードに失敗しました。");
  }

  return response.json();
};

const saveBoard = async (boardData: IBoardData) => {
  const response = await fetch("http://localhost:3001/api/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(boardData),
  });

  if (!response.ok) {
    throw new Error("DB登録に失敗しました。");
  }

  return response.json();
};

const saveElements = async (elements: IElementData[]) => {
  const response = await fetch("http://localhost:3001/api/elements/multiple", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(elements),
  });

  if (!response.ok) {
    throw new Error("素子データ登録に失敗しました。");
  }

  return response.json();
};

const RegistBoardClient = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [formData, setFormData] = useState<IFormData>(initialFormData);
  const [formKey, setFormKey] = useState(0);

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // ファイルアップロード
      const uploadData = createFormData(
        formData.pcbDesign,
        formData.circuitDiagram
      );
      const uploadResult = await uploadFiles(uploadData);

      // 基板データの保存
      const boardData = createBoardData(formData, uploadResult);
      const responseData = await saveBoard(boardData);
      const boardId: number = responseData[0]?.board_id;

      // CSVファイルの処理
      if (formData.csvFile) {
        const csvText = await formData.csvFile.text();
        const jsonElements = csvToJson(csvText, boardId);
        await saveElements(jsonElements);
      }

      // フォームのリセット
      setFormData(initialFormData);
      setFormKey((prev) => prev + 1);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleRedirect = (route: string) => {
    setMenuId("000");
    router.push(route);
  };

  return (
    <div key={formKey}>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <h1 className="font-bold">
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

        <h1 className="font-bold">
          ステンシル<span className="text-red-500">*</span>
        </h1>
        <RadioButton
          name="stencil"
          options={stencilOptions}
          defaultValue={formData.stencil}
          onChange={(value) => handleChange("stencil", value)}
        />

        <h1 className="font-bold">PCBデザイン</h1>
        <Input
          type="file"
          accept="image/jpeg, image/png, image/svg+xml, image/bmp"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("pcbDesign", e.target.files?.[0] || null)
          }
        />

        <h1 className="font-bold">回路図</h1>
        <Input
          type="file"
          accept="image/jpeg, image/png, image/svg+xml, image/bmp"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("circuitDiagram", e.target.files?.[0] || null)
          }
        />

        <h1 className="font-bold">素子CSV</h1>
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
          onClick={() => handleRedirect("/")}
        />
        <Button
          label="登録"
          className="btn btn-primary ml-10 w-32"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RegistBoardClient;
