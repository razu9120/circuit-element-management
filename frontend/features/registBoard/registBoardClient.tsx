"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../app/components/button";
import Input from "../../app/components/input";
import RadioButton from "../../app/components/radioButton";
import { stencilOptions, structureOptions } from "@/app/constants/options";
import { useMenu } from "@/app/contexts/menuContext";
import { useForm } from "react-hook-form";
import Alert from "@/app/components/alert";

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

interface IFileData {
  pcbDesign: File | null;
  circuitDiagram: File | null;
  csvFile: File | null;
}

// エラーハンドリングの共通関数
const handleApiError = (
  error: unknown,
  router: ReturnType<typeof useRouter>
) => {
  console.error("エラーが発生しました:", error);
  const errorMessage =
    error instanceof Error ? error.message : "予期せぬエラーが発生しました";
  router.push(`/error?message=${encodeURIComponent(errorMessage)}`);
};

// ファイルアップロード
const uploadFiles = async (uploadData: FormData) => {
  const response = await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    body: uploadData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "ファイルのアップロードに失敗しました。"
    );
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
    const errorData = await response.json();
    throw new Error(errorData.message || "基板データの保存に失敗しました。");
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
    const errorData = await response.json();
    throw new Error(errorData.message || "素子データの保存に失敗しました。");
  }

  return response.json();
};

const createFormData = (
  pcbDesign: File | null,
  circuitDiagram: File | null
): FormData => {
  const formData = new FormData();
  if (pcbDesign) formData.append("pcbDesign", pcbDesign);
  if (circuitDiagram) formData.append("circuitDiagram", circuitDiagram);
  return formData;
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
  try {
    const lines = csvText.trim().split("\n");
    const rows = lines.slice(1);

    return rows.map((row) => {
      const values = row.split(",").map((v) => v.replace(/"/g, "").trim());
      if (values.length < 3) {
        throw new Error("CSVファイルの形式が正しくありません。");
      }
      return {
        boardId,
        reference: values[0],
        content: values[1],
        footprint: values[2],
      };
    });
  } catch {
    throw new Error("CSVファイルの解析に失敗しました。");
  }
};

const RegistBoardClient = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [formKey, setFormKey] = useState(0);
  const [fileData, setFileData] = useState<IFileData>({
    pcbDesign: null,
    circuitDiagram: null,
    csvFile: null,
  });
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IFormData>({
    mode: "onChange",
    defaultValues: {
      boardName: "",
      structure: "1",
      stencil: "false",
    },
  });

  const handleFileChange = (field: keyof IFileData, files: FileList | null) => {
    const file = files?.[0] || null;
    setFileData((prev) => ({ ...prev, [field]: file }));
  };

  const onSubmit = async (data: IFormData) => {
    try {
      // ファイルアップロード
      const uploadData = createFormData(
        fileData.pcbDesign,
        fileData.circuitDiagram
      );
      const uploadResult = await uploadFiles(uploadData);

      // 基板データの保存
      const boardData = createBoardData({ ...data, ...fileData }, uploadResult);
      const responseData = await saveBoard(boardData);
      console.log("responseData: ", responseData);
      const boardId: number = responseData[0]?.board_id;

      if (!boardId) {
        throw new Error("基板IDの取得に失敗しました。");
      }

      // CSVファイルの処理
      if (fileData.csvFile) {
        const csvText = await fileData.csvFile.text();
        const jsonElements = csvToJson(csvText, boardId);
        await saveElements(jsonElements);
      }

      // フォームのリセット
      setValue("boardName", "");
      setValue("structure", "1");
      setValue("stencil", "false");
      setFileData({
        pcbDesign: null,
        circuitDiagram: null,
        csvFile: null,
      });
      setFormKey((prev) => prev + 1);

      // 登録成功後にアラートを表示
      setShowAlert(true);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const handleRedirect = (route: string) => {
    setMenuId("000");
    router.push(route);
  };

  return (
    <div key={formKey}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-base-300 rounded-box p-3"
      >
        <h1 className="font-bold">
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

        <h1 className="font-bold">
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

        <h1 className="font-bold">PCBデザイン</h1>
        <Input
          type="file"
          accept="image/jpeg, image/png, image/svg+xml, image/bmp"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileChange("pcbDesign", e.target.files)
          }
        />

        <h1 className="font-bold">回路図</h1>
        <Input
          type="file"
          accept="image/jpeg, image/png, image/svg+xml, image/bmp"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileChange("circuitDiagram", e.target.files)
          }
        />

        <h1 className="font-bold">素子CSV</h1>
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
            type="button"
            label="戻る"
            className="btn btn-outline btn-secondary"
            onClick={() => handleRedirect("/")}
          />
          <Button
            type="submit"
            label="登録"
            className="btn btn-primary ml-10 w-32"
          />
        </div>
      </form>

      <Alert
        message="登録に成功しました"
        type="success"
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default RegistBoardClient;
