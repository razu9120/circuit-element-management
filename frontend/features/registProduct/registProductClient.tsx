"use client";

import { useRouter } from "next/navigation";
import Button from "../../app/components/button";
import Input from "../../app/components/input";
import { useMenu } from "@/app/contexts/menuContext";
import { useState } from "react";

// 型定義
interface IFormData {
  productName: string;
  dataSheetPdf: File | null;
}

interface IProductData {
  productName: string;
  dataSheetPath: string;
}

interface IUploadResult {
  dataSheetPdf?: {
    path: string;
  };
}

// 純粋関数
const createFormData = (dataSheetPdf: File | null): FormData => {
  const uploadData = new FormData();
  if (dataSheetPdf) {
    uploadData.append("dataSheetPdf", dataSheetPdf);
  }
  return uploadData;
};

const createProductData = (
  formData: IFormData,
  uploadResult: IUploadResult
): IProductData => ({
  productName: formData.productName,
  dataSheetPath: uploadResult.dataSheetPdf
    ? uploadResult.dataSheetPdf.path
    : "",
});

const uploadFile = async (uploadData: FormData): Promise<IUploadResult> => {
  const response = await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    body: uploadData,
  });

  if (!response.ok) {
    throw new Error("ファイルのアップロードに失敗しました。");
  }

  return response.json();
};

const saveProduct = async (productData: IProductData): Promise<void> => {
  const response = await fetch("http://localhost:3001/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("DB登録に失敗しました。");
  }
};

const createInitialFormData = (): IFormData => ({
  productName: "",
  dataSheetPdf: null,
});

const RegistProductClient = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [formData, setFormData] = useState<IFormData>(createInitialFormData());
  const [formKey, setFormKey] = useState(0);

  const handleChange = (
    field: keyof IFormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // ファイルアップロード
      const uploadData = createFormData(formData.dataSheetPdf);
      const uploadResult = await uploadFile(uploadData);

      // DBに登録するデータを作成
      const productData = createProductData(formData, uploadResult);

      // DBに保存
      await saveProduct(productData);

      // フォームをリセット
      setFormData(createInitialFormData());
      setFormKey((prev) => prev + 1);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleRedirect = (route: string, menuId: string) => {
    setMenuId(menuId);
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
          value={formData.productName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("productName", e.target.value)
          }
          className="input input-bordered mt-1 mb-3 w-full max-w-xs"
        />

        <h1 className="font-bold">データシート</h1>
        <Input
          type="file"
          accept="application/pdf"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("dataSheetPdf", e.target.files?.[0] || null)
          }
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
        />
      </div>

      <div className="flex justify-center mt-3">
        <Button
          label="戻る"
          className="btn btn-outline btn-secondary"
          onClick={() => handleRedirect("/", "000")}
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

export default RegistProductClient;
