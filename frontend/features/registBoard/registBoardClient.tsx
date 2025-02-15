"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../app/components/button";
import Input from "../../app/components/input";
import RadioButton from "../../app/components/radioButton";
import { stencilOptions, structureOptions } from "@/app/constants/options";
import { useMenu } from "@/app/contexts/menuContext";

const RegistBoardClient = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [formData, setFormData] = useState({
    boardName: "",
    structure: "1",
    stencil: "false",
    pcbDesign: null as File | null,
    circuitDiagram: null as File | null,
    csvFile: null as File | null,
  });
  const [formKey, setFormKey] = useState(0);

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const uploadUrl = "http://localhost:3001/api/upload"; // 画像アップロード
    const saveUrl = "http://localhost:3001/api/boards"; // 基板登録
    const elementsUrl = "http://localhost:3001/api/elements/multiple"; // 素子登録

    try {
      // PCBデザインと回路図のアップロード
      const uploadData = new FormData();
      if (formData.pcbDesign)
        uploadData.append("pcbDesign", formData.pcbDesign);
      if (formData.circuitDiagram)
        uploadData.append("circuitDiagram", formData.circuitDiagram);

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
        boardName: formData.boardName,
        structure: formData.structure,
        stencil: formData.stencil,
        diagramImgPath: uploadResult.pcbDesign
          ? uploadResult.pcbDesign.path
          : "",
        boardImgPath: uploadResult.circuitDiagram
          ? uploadResult.circuitDiagram.path
          : "",
      };

      // DBにリクエスト
      const saveResponse = await fetch(saveUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boardData),
      });

      const responseData = await saveResponse.json();
      const boardId: number = responseData[0]?.board_id;

      if (saveResponse.ok) {
        console.log("登録成功");
      } else {
        console.error("DB登録に失敗しました。");
      }

      // CSVファイルの処理
      if (formData.csvFile) {
        const csvText = await formData.csvFile.text();
        const jsonElements = csvToJson(csvText, boardId);

        console.log("jsonElements:", jsonElements);

        // CSVデータの送信
        const csvResponse = await fetch(elementsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonElements),
        });

        if (csvResponse.ok) {
          console.log("素子データ登録成功");
        } else {
          console.error("素子データ登録に失敗しました。");
        }
      }

      setFormData({
        boardName: "",
        structure: "1",
        stencil: "false",
        pcbDesign: null,
        circuitDiagram: null,
        csvFile: null,
      });

      setFormKey((prev) => prev + 1);
    } catch (error) {
      console.error("通信エラー:", error);
    }
  };

  const csvToJson = (csvText: string, boardId: number) => {
    const lines = csvText.trim().split("\n");
    const rows = lines.slice(1);

    return rows.map((row) => {
      const values = row.split(",").map((v) => v.replace(/"/g, "").trim());
      return {
        boardId: boardId,
        reference: values[0],
        content: values[1],
        footprint: values[2],
      };
    });
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
          value={formData.boardName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("boardName", e.target.value)
          }
          className="input input-bordered mt-1 mb-3 w-full max-w-xs"
        />

        <h1 className="font-bold">構造</h1>
        <RadioButton
          name="boardType"
          options={structureOptions}
          defaultValue={formData.structure}
          onChange={(value) => handleChange("structure", value)}
        />

        <h1 className="font-bold">ステンシル</h1>
        <RadioButton
          name="boardType1"
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

export default RegistBoardClient;
