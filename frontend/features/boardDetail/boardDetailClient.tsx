"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RadioButton from "@/app/components/radioButton";
import {
  stencilOptions,
  structureOptions,
} from "../registBoard/registBoardClient";
import Button from "@/app/components/button";
import Toggle from "@/app/components/toggle";
import { useMenu } from "@/app/contexts/menuContext";

const BoardDetailClient = () => {
  const router = useRouter();
  const [isToggled, setIsToggled] = useState(false);
  const { setMenuId } = useMenu();

  const Redirect = (route: string) => {
    router.push(route);
  };

  return (
    <>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <Toggle
          checked={isToggled}
          onChange={setIsToggled}
          className="toggle-accent"
        />
        {isToggled ? (
          <div className="flex flex-col md:flex-row gap-3">
            <div>
              <h1 className="font-bold mt-2 mb-1">PCBデザイン</h1>
              <img
                className="rounded-box w-[300px] md:w-[346px] object-cover"
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="PCB Design"
              />
            </div>
            <div>
              <h1 className="font-bold mt-2 mb-1">回路図</h1>
              <img
                className="rounded-box w-[300px] md:w-[346px] object-cover"
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Circuit Diagram"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-3">
              <div>
                <h1 className="font-bold mt-2 mb-1">PCBデザイン</h1>
                <img
                  className="rounded-box w-full"
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="Shoes"
                />
              </div>
              <div>
                <h1 className="font-bold mt-2 mb-1">回路図</h1>
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
          </>
        )}
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
                label="データシート"
                className="btn btn-xs btn-warning w-24 mr-5"
              />
              <h1 className="font-bold">R1</h1>
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
            setMenuId("002");
            Redirect("/boardList");
          }}
        />
        <Button
          label="基板編集"
          className="btn btn-primary ml-10 w-32"
          onClick={() => {
            setMenuId("004");
            Redirect("/editBoard");
          }}
        />
      </div>
    </>
  );
};

export default BoardDetailClient;
