"use client";

import RadioButton from "@/app/components/radioButton";
import {
  stencilOptions,
  structureOptions,
} from "../registBoard/registBoardClient";
import Button from "@/app/components/button";

const BoardDetailClient = () => {
  return (
    <>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div>
            <h1 className="font-bold mb-1">PCBデザイン</h1>
            <img
              className="rounded-box w-full"
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </div>
          <div>
            <h1 className="font-bold mb-1">回路図</h1>
            <img
              className="rounded-box w-full"
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </div>
        </div>
        <h1 className="font-bold mt-2 mb-2">名前</h1>
        <div>LoRa通信シリアル変換接続</div>
        <h1 className="font-bold mt-5">構造</h1>
        <RadioButton
          name="boardType"
          options={structureOptions}
          defaultValue="structure-1"
          onChange={(value) => console.log(value)}
        />
        <h1 className="font-bold mt-2">ステンシル</h1>
        <RadioButton
          name="boardType1"
          options={stencilOptions}
          defaultValue="stencil-1"
          onChange={(value) => console.log(value)}
        />
      </div>
      <div className="flex bg-base-300 rounded-box mt-3 p-3">
        <h1 className="font-bold">R1</h1>
        <h1 className="font-bold ml-5">20Ω</h1>
        <h1 className="font-bold ml-5">
          Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder
        </h1>
        <Button label="データシート" className="btn btn-xs btn-warning ml-5" />
      </div>
      <div className="flex bg-base-300 rounded-box mt-3 p-3">
        <h1 className="font-bold">R1</h1>
        <h1 className="font-bold ml-5">20Ω</h1>
        <h1 className="font-bold ml-5">
          Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder
        </h1>
        <Button label="データシート" className="btn btn-xs btn-warning ml-5" />
      </div>
      <div className="flex bg-base-300 rounded-box mt-3 p-3">
        <h1 className="font-bold">R1</h1>
        <h1 className="font-bold ml-5">20Ω</h1>
        <h1 className="font-bold ml-5">
          Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder
        </h1>
        <Button label="データシート" className="btn btn-xs btn-warning ml-5" />
      </div>
      <div className="flex bg-base-300 rounded-box mt-3 p-3">
        <h1 className="font-bold">R1</h1>
        <h1 className="font-bold ml-5">20Ω</h1>
        <h1 className="font-bold ml-5">
          Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder
        </h1>
        <Button label="データシート" className="btn btn-xs btn-warning ml-5" />
      </div>
    </>
  );
};

export default BoardDetailClient;
