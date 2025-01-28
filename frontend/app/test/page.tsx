"use client";

import Button from "../components/button";
import Input from "../components/input";
import RadioButton from "../components/radioButton";

const structureOptions = [
  { value: "structure-1", label: "片面基板" },
  { value: "structure-2", label: "両面基板" },
  { value: "structure-3", label: "多層基板" },
];

const stencilOptions = [
  { value: "stencil-1", label: "なし" },
  { value: "stencil-2", label: "あり" },
];

const Home = () => {
  return (
    <>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <h1 className="font-bold">名前</h1>
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

        <h1 className="font-bold">ステンシル</h1>
        <RadioButton
          name="boardType1"
          options={stencilOptions}
          defaultValue="stencil-1"
          onChange={(value) => console.log(value)}
        />

        <h1 className="font-bold">PCBデザイン</h1>
        <Input
          type="file"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
        />

        <h1 className="font-bold">回路図</h1>
        <Input
          type="file"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 mb-3 w-full max-w-md"
        />

        <h1 className="font-bold">素子CSV</h1>
        <Input
          type="file"
          className="file-input file-input-xs md:file-input-lg file-input-bordered mt-1 w-full max-w-md"
          accept=".csv"
        />
      </div>

      <div className="flex justify-center mt-3">
        <Button label="戻る" className="btn btn-outline btn-secondary" />
        <Button label="登録" className="btn btn-primary ml-10 w-32" />
      </div>
    </>
  );
};

export default Home;
