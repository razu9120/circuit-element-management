"use client";

import { useRouter } from "next/navigation";
import RadioButton from "@/app/components/radioButton";
import {
  stencilOptions,
  structureOptions,
} from "../registBoard/registBoardClient";
import Button from "@/app/components/button";
import { useMenu } from "@/app/contexts/menuContext";
import Input from "@/app/components/input";
import { useState } from "react";
import ConfirmModal from "@/app/components/confirmModal";
// import { Select } from "@/app/components/select";

const EditBoardClient = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  // const [selectedItem, setSelectedItem] = useState<{ name: string; product: string }>({ name: "", product: "" });

  const Redirect = (route: string) => {
    router.push(route);
  };

  return (
    <>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div>
            <h1 className="font-bold mb-1">PCBデザイン</h1>
            <Input
              type="file"
              className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 w-full max-w-md"
            />
          </div>
          <div>
            <h1 className="font-bold mb-1">回路図</h1>
            <Input
              type="file"
              className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 w-full max-w-md"
            />
          </div>
        </div>
        <h1 className="font-bold mt-3 mb-1">名前</h1>
        <Input
          type="text"
          placeholder="Type here"
          className="input input-bordered mt-1 mb-3 w-full max-w-xs"
        />
        <h1 className="font-bold">構造</h1>
        <RadioButton
          name="boardType"
          options={structureOptions}
          defaultValue="structure-1"
          onChange={(value) => console.log(value)}
        />
        <h1 className="font-bold mt-1">ステンシル</h1>
        <RadioButton
          name="boardType1"
          options={stencilOptions}
          defaultValue="stencil-1"
          onChange={(value) => console.log(value)}
        />
        <h1 className="font-bold">素子CSV</h1>
        <Input
          type="file"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 w-full max-w-md"
          accept=".csv"
        />
      </div>
      <div className="bg-base-300 rounded-box mt-3 p-3">
        <h1 className="font-bold bg-base-300 mb-2 sticky top-0 z-5">素子</h1>
        <div className="h-64 md:h-72 lg:h-[465px] overflow-y-auto">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
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
              <h1 className="font-bold">R{index + 1}</h1>
              <h1 className="font-bold ml-5">20Ω</h1>
              <h1 className="font-bold ml-5">
                Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-3">
        <Button
          label="戻る"
          className="btn btn-outline btn-secondary"
          onClick={() => {
            setMenuId("003");
            Redirect("/boardDetail");
          }}
        />
        <Button
          label="変更"
          className="btn btn-primary ml-10 w-32"
          onClick={() => {
            setMenuId("004");
            Redirect("/editBoard");
          }}
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
