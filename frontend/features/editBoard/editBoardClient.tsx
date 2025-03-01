"use client";

import { useRouter } from "next/navigation";
import RadioButton from "@/app/components/radioButton";
import Button from "@/app/components/button";
import { useMenu } from "@/app/contexts/menuContext";
import Input from "@/app/components/input";
import React, { useState } from "react";
import ConfirmModal from "@/app/components/confirmModal";
import { stencilOptions, structureOptions } from "@/app/constants/options";
import { IBoard, IElementAndBoard } from "../boardDetail/boardDetail";
// import { Select } from "@/app/components/select";

interface IEditBoardClientProps {
  board: IBoard;
  elements: IElementAndBoard[];
}

const EditBoardClient: React.FC<IEditBoardClientProps> = ({
  board,
  elements,
}) => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  // const [selectedItem, setSelectedItem] = useState<{ name: string; product: string }>({ name: "", product: "" });
  const [formData, setFormData] = useState({
    boardName: board.boardName,
    structure: board.structure,
    stencil: board.stencil.toString(),
    pcbDesign: null as File | null,
    circuitDiagram: null as File | null,
    csvFile: null as File | null,
  });

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const uploadUrl = "http://localhost:3001/api/upload"; // 画像アップロード
    const deleteUrl = "http://localhost:3001/api/images"; // 画像削除
    const saveUrl = "http://localhost:3001/api/boards"; // 基板更新
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

      // 既存PCBデザインと回路図の削除
      if (formData.pcbDesign || formData.circuitDiagram) {
        // 画像を削除するデータを作成
        const deleteData = {
          boardId: board.boardId,
          boardImgPathFlg: !!formData.pcbDesign,
          diagramImgPathFlg: !!formData.circuitDiagram,
        };

        const deleteResponse = await fetch(deleteUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deleteData),
        });
        console.log("deleteResponse: ", deleteResponse);

        if (!deleteResponse.ok) {
          console.error("ファイルの削除に失敗しました。");
          return;
        }
      }

      // DBを更新するデータを作成
      const boardData = {
        boardId: board.boardId,
        boardName: formData.boardName,
        structure: formData.structure,
        stencil: formData.stencil,
        boardImgPath: uploadResult.pcbDesign
          ? uploadResult.pcbDesign.path
          : board.boardImgPath,
        diagramImgPath: uploadResult.circuitDiagram
          ? uploadResult.circuitDiagram.path
          : board.diagramImgPath,
      };

      console.log("boardData: ", boardData);

      // DBにリクエスト
      const saveResponse = await fetch(saveUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boardData),
      });

      console.log("saveResponse: ", saveResponse);

      const responseData = await saveResponse.json();
      const boardId: number = responseData[0]?.board_id;

      if (saveResponse.ok) {
        console.log("更新成功");
      } else {
        console.error("DB更新に失敗しました。");
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

      // setFormKey((prev) => prev + 1);
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

  const elementList = elements.map((element) => (
    <div
      key={element.elementId}
      className="flex bg-base-100 rounded-box w-[1000px] md:w-full mt-2 p-3"
    >
      <Button
        label="編集"
        className="btn btn-xs btn-accent w-16 mr-3"
        onClick={() => {
          // setSelectedItem({ name: `R${index + 1}`, product: "Product 1" });
          setEditModalOpen(true);
        }}
      />
      <Button
        label="削除"
        className="btn btn-xs btn-secondary w-12 mr-5"
        onClick={() => setModalOpen(true)}
      />
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
        <div className="flex flex-col md:flex-row gap-3">
          <div>
            <h1 className="font-bold mb-1">PCBデザイン</h1>
            <Input
              type="file"
              accept="image/jpeg, image/png, image/svg+xml, image/bmp"
              className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("pcbDesign", e.target.files?.[0] || null)
              }
            />
          </div>
          <div>
            <h1 className="font-bold mb-1">回路図</h1>
            <Input
              type="file"
              accept="image/jpeg, image/png, image/svg+xml, image/bmp"
              className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("circuitDiagram", e.target.files?.[0] || null)
              }
            />
          </div>
        </div>
        <h1 className="font-bold mt-3 mb-1">名前</h1>
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
        <h1 className="font-bold mt-1">ステンシル</h1>
        <RadioButton
          name="stencil"
          options={stencilOptions}
          defaultValue={formData.stencil.toString()}
          onChange={(value) => handleChange("stencil", value)}
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
            setMenuId("003");
            Redirect(`/boardList/${board.boardId}/boardDetail`);
          }}
        />
        <Button
          label="変更"
          className="btn btn-primary ml-10 w-32"
          onClick={handleSubmit}
        />
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="素子削除"
        body="本当に削除しますか？"
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      />

      {editModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl">
            <div className="flex flex-col bg-base-300 rounded-box p-3">
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <h2 className="font-bold text-lg">素子編集</h2>
              <label className="block mt-3">名前</label>
              {/* <Input
              type="text"
              value={selectedItem.name}
              onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
              className="input input-bordered w-full"
            /> */}
              <label className="block mt-3">製品</label>
              {/* <Select
              options={["Product 1", "Product 2", "Product 3"]}
              value={selectedItem.product}
              onChange={(value) => setSelectedItem({ ...selectedItem, product: value })}
              className="select select-bordered w-full"
            /> */}
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
                onClick={() => setEditModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditBoardClient;
