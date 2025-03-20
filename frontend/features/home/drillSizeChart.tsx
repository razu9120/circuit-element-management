"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { useState } from "react";

const DrillSizeChart = () => {
  const [leadDiameter, setLeadDiameter] = useState<number | null>(null);
  const [recommendedSize, setRecommendedSize] = useState<
    [number, number] | null
  >(null);
  const [roundedSize, setRoundedSize] = useState<number | null>(null);

  // KiCadでよく使われる標準的なドリルサイズ（mm単位）
  const KICAD_STANDARD_SIZES = [
    0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7,
    1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0,
  ];

  const calculateDrillSize = () => {
    if (!leadDiameter || leadDiameter <= 0) {
      alert("正しいリード径を入力してください。");
      return;
    }

    // 推奨ドリルサイズ（+0.2mm ～ +0.3mm）
    const minSize = parseFloat((leadDiameter + 0.2).toFixed(1));
    const maxSize = parseFloat((leadDiameter + 0.3).toFixed(1));
    setRecommendedSize([minSize, maxSize]);

    // KiCad用の近似値を求める
    const closestSize = KICAD_STANDARD_SIZES.reduce((prev, curr) =>
      Math.abs(curr - minSize) < Math.abs(prev - minSize) ? curr : prev
    );
    setRoundedSize(closestSize);
  };

  return (
    <>
      <div className="card bg-base-300 md:w-96 mb-5 md:mb-0 p-3 shadow-xl">
        <h2 className="text-xl font-bold mb-3">KiCad向けドリルサイズ対応表</h2>

        <div className="mb-2">
          <h1 className="font-bold mb-1">リード径 (mm)</h1>
          <Input
            type="number"
            step="0.1"
            value={leadDiameter ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLeadDiameter(Number(e.target.value))
            }
            className="input input-bordered h-9"
          />
        </div>

        <Button
          onClick={calculateDrillSize}
          label="計算"
          className="btn btn-primary w-32"
        />

        <div className="mt-4 pt-3 pb-3 pl-4 bg-base-100 rounded-box h-20">
          {recommendedSize && roundedSize !== null && (
            <div className="flex flex-col justify-center">
              <p>
                推奨ドリルサイズ:{" "}
                <strong>
                  {recommendedSize[0]}mm ～ {recommendedSize[1]}mm
                </strong>
              </p>
              <p className="mt-2">
                KiCad推奨ドリルサイズ: <strong>{roundedSize}mm</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DrillSizeChart;
