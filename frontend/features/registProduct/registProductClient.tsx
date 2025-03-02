"use client";

import { useRouter } from "next/navigation";
import Button from "../../app/components/button";
import Input from "../../app/components/input";
import { useMenu } from "@/app/contexts/menuContext";
import { useState } from "react";

const RegistProductClient = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [formData, setFormData] = useState({
    productName: "",
    dataSheetPdf: null as File | null,
  });
  const [formKey, setFormKey] = useState(0);

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const uploadUrl = "http://localhost:3001/api/upload"; // pdfアップロード
    const saveUrl = "http://localhost:3001/api/products"; // 製品登録

    try {
      // PCBデザインと回路図のアップロード
      const uploadData = new FormData();
      console.log("formData.dataSheetPdf: ", formData.dataSheetPdf);
      if (formData.dataSheetPdf) {
        uploadData.append("dataSheetPdf", formData.dataSheetPdf);
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: uploadData,
      });

      if (!uploadResponse.ok) {
        console.error("ファイルのアップロードに失敗しました。");
        return;
      }

      const uploadResult = await uploadResponse.json();
      console.log("アップロード成功:", uploadResult);

      // DBに登録するデータを作成
      const boardData = {
        productName: formData.productName,
        dataSheetPath: uploadResult.dataSheetPdf
          ? uploadResult.dataSheetPdf.path
          : "",
      };
      console.log("boardData: ", boardData);

      // DBにリクエスト
      const saveResponse = await fetch(saveUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boardData),
      });
      console.log("saveResponse: ", saveResponse);

      if (saveResponse.ok) {
        console.log("登録成功");
      } else {
        console.error("DB登録に失敗しました。");
      }

      setFormData({
        productName: "",
        dataSheetPdf: null,
      });

      setFormKey((prev) => prev + 1);
    } catch (error) {
      console.error("通信エラー:", error);
    }
  };

  const Redirect = (route: string) => {
    router.push(route);
  };

  return (
    <div key={formKey}>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <h1 className="font-bold">名前</h1>
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
          onClick={() => {
            setMenuId("000");
            Redirect("/");
          }}
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
