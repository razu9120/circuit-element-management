"use client";

import { useState } from "react";

const COLORS = [
  { name: "黒", value: 0, multiplier: 1, rgb: "#000000" },
  {
    name: "茶",
    value: 1,
    multiplier: 10,
    tolerance: "±1%",
    tempCoeff: 100,
    rgb: "#964B00",
  },
  {
    name: "赤",
    value: 2,
    multiplier: 100,
    tolerance: "±2%",
    tempCoeff: 50,
    rgb: "#FF0000",
  },
  { name: "橙", value: 3, multiplier: 1_000, tempCoeff: 15, rgb: "#FFA500" },
  { name: "黄", value: 4, multiplier: 10_000, tempCoeff: 25, rgb: "#FFFF00" },
  {
    name: "緑",
    value: 5,
    multiplier: 100_000,
    tolerance: "±0.5%",
    tempCoeff: 10,
    rgb: "#008000",
  },
  {
    name: "青",
    value: 6,
    multiplier: 1_000_000,
    tolerance: "±0.25%",
    tempCoeff: 5,
    rgb: "#0000FF",
  },
  {
    name: "紫",
    value: 7,
    multiplier: 10_000_000,
    tolerance: "±0.1%",
    tempCoeff: 1,
    rgb: "#800080",
  },
  {
    name: "灰",
    value: 8,
    multiplier: 100_000_000,
    tolerance: "±0.05%",
    rgb: "#808080",
  },
  { name: "白", value: 9, multiplier: 1_000_000_000, rgb: "#FFFFFF" },
  { name: "金", value: -1, multiplier: 0.1, tolerance: "±5%", rgb: "#FFD700" },
  {
    name: "銀",
    value: -2,
    multiplier: 0.01,
    tolerance: "±10%",
    rgb: "#C0C0C0",
  },
];

const RegisterColorCode = () => {
  const [band1, setBand1] = useState(0);
  const [band2, setBand2] = useState(0);
  const [band3, setBand3] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const calculateResistance = () => {
    const baseValue = (band1 * 100 + band2 * 10 + band3) * multiplier;
    return baseValue >= 1000 ? `${baseValue / 1000}kΩ` : `${baseValue}Ω`;
  };

  return (
    <>
      <div className="card bg-base-300 md:w-96 mb-5 md:mb-0 p-3 shadow-xl">
        <h2 className="text-xl font-bold mb-3">抵抗カラーコード計算ツール</h2>
        {[band1, band2, band3, multiplier].map((_, i) => (
          <div key={i} className="mb-2">
            <h1 className="font-bold mb-1">
              {["1本目", "2本目", "3本目", "乗数"][i]}
            </h1>
            <select
              value={
                i === 0
                  ? band1
                  : i === 1
                  ? band2
                  : i === 2
                  ? band3
                  : COLORS.findIndex((c) => c.multiplier === multiplier)
              }
              onChange={(e) => {
                const value = Number(e.target.value);
                if (i === 0) setBand1(value);
                else if (i === 1) setBand2(value);
                else if (i === 2) setBand3(value);
                else setMultiplier(COLORS[value].multiplier);
              }}
              className="w-full border p-1 h-8"
              style={{
                backgroundColor:
                  COLORS[
                    i === 0
                      ? band1
                      : i === 1
                      ? band2
                      : i === 2
                      ? band3
                      : COLORS.findIndex((c) => c.multiplier === multiplier)
                  ]?.rgb,
                color: "#fff",
              }}
            >
              {COLORS.map((color, index) => (
                <option
                  key={index}
                  value={index}
                  style={{ backgroundColor: color.rgb, color: "#000" }}
                >
                  {color.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="mt-4 pt-3 pb-3 pl-4 bg-base-100 rounded-box h-12">
          <p>
            抵抗値: <strong>{calculateResistance()}</strong>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterColorCode;
