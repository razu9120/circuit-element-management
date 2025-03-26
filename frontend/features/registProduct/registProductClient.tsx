"use client";

import { useRouter } from "next/navigation";
import Button from "../../app/components/button";
import Input from "../../app/components/input";
import { useMenu } from "@/app/contexts/menuContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Alert from "@/app/components/alert";
import { useSession } from "next-auth/react";

// 型定義
interface IFormData {
  productName: string;
}

interface IProductData {
  userId: number;
  productName: string;
  dataSheetPath: string;
}

interface IUploadResult {
  dataSheetPdf?: {
    path: string;
  };
}

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

const RegistProductClient: React.FC = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [formKey, setFormKey] = useState(0);
  const [dataSheetPdf, setDataSheetPdf] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormData>({
    mode: "onChange",
    defaultValues: {
      productName: "",
    },
  });

  const { data: session } = useSession();

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0] || null;
    setDataSheetPdf(file);
  };

  const onSubmit = async (data: IFormData) => {
    try {
      if (dataSheetPdf) {
        // ファイルアップロード
        const uploadData = new FormData();
        uploadData.append("dataSheetPdf", dataSheetPdf);
        const uploadResult = await uploadFile(uploadData);

        // DBに登録するデータを作成
        const productData: IProductData = {
          userId: Number(session?.user?.id),
          productName: data.productName,
          dataSheetPath: uploadResult.dataSheetPdf?.path || "",
        };

        // DBに保存
        await saveProduct(productData);
      } else {
        // ファイルなしで製品データを登録
        const productData: IProductData = {
          userId: Number(session?.user?.id),
          productName: data.productName,
          dataSheetPath: "",
        };

        await saveProduct(productData);
      }

      setValue("productName", "");
      setDataSheetPdf(null);

      setFormKey((prev) => prev + 1);
      setShowAlert(true);
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
            errors.productName ? "input-error" : ""
          }`}
          {...register("productName", { required: "名前は必須です" })}
        />
        {errors.productName && (
          <p className="text-error text-sm mb-3">
            {errors.productName.message}
          </p>
        )}

        <h1 className="font-bold">データシート</h1>
        <Input
          type="file"
          accept="application/pdf"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileChange(e.target.files)
          }
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
        />

        <div className="flex justify-center mt-3">
          <Button
            type="button"
            label="戻る"
            className="btn btn-outline btn-secondary"
            onClick={() => handleRedirect("/", "000")}
          />
          <Button
            type="submit"
            label="登録"
            className="btn btn-primary ml-10 w-32"
          />
        </div>
      </form>

      <Alert
        message="製品情報を登録しました"
        type="success"
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default RegistProductClient;
