"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { useState } from "react";

const LedCalculator = () => {
  const [supplyVoltage, setSupplyVoltage] = useState<number>(5);
  const [ledVoltage, setLedVoltage] = useState<number>(1.8);
  const [ledCurrent, setLedCurrent] = useState<number>(20);
  const [resistance, setResistance] = useState<number | null>(null);
  const [roundedResistance, setRoundedResistance] = useState<number | null>(
    null
  );
  const [powerDissipation, setPowerDissipation] = useState<number | null>(null);

  // E12系列（よく使われる抵抗値）
  const E12_SERIES = [
    1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2,
  ];

  const calculateResistance = () => {
    const voltageDrop = supplyVoltage - ledVoltage;
    const currentA = ledCurrent / 1000; // mA → A
    if (voltageDrop <= 0 || currentA <= 0) {
      alert("入力値が正しくありません");
      return;
    }

    const calculatedResistance = voltageDrop / currentA;
    setResistance(calculatedResistance);

    // E12系列の近似値を求める
    const roundedValue = findNearestE12(calculatedResistance);
    setRoundedResistance(roundedValue);

    // 電力損失 (P = I^2 * R)
    setPowerDissipation(currentA ** 2 * calculatedResistance);
  };

  // E12系列の近似値を探す
  const findNearestE12 = (value: number) => {
    const base = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / base;
    const closest = E12_SERIES.reduce((prev, curr) =>
      Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev
    );
    return closest * base;
  };

  return (
    <>
      <div className="card bg-base-300 md:w-96 mb-5 md:mb-0 p-3 shadow-xl">
        <h2 className="text-xl font-bold mb-3">LED 電流制限抵抗計算ツール</h2>
        <div className="mb-2">
          <h1 className="font-bold mb-1">電源電圧 (V)</h1>
          <Input
            type="number"
            placeholder="Type here"
            value={supplyVoltage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSupplyVoltage(Number(e.target.value))
            }
            className="input input-bordered h-9"
          />
        </div>

        <div className="mb-2">
          <h1 className="font-bold mb-1">LED 順方向電圧 (V)</h1>
          <Input
            type="number"
            value={ledVoltage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLedVoltage(Number(e.target.value))
            }
            className="input input-bordered h-9"
          />
        </div>

        <div className="mb-2">
          <h1 className="font-bold mb-1">LED 電流 (mA)</h1>
          <Input
            type="number"
            value={ledCurrent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLedCurrent(Number(e.target.value))
            }
            className="input input-bordered h-9"
          />
        </div>

        <Button
          onClick={calculateResistance}
          label="計算"
          className="btn btn-primary w-32"
        />

        <div className="mt-4 pt-3 pb-3 pl-4 bg-base-100 rounded-box h-24">
          {resistance !== null && (
            <div className="flex flex-col justify-center">
              <p>
                計算結果: <strong>{resistance.toFixed(2)} Ω</strong>
              </p>
              <p>
                推奨抵抗 (E12系列): <strong>{roundedResistance} Ω</strong>
              </p>
              <p>
                電力損失: <strong>{powerDissipation?.toFixed(3)} W</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LedCalculator;
