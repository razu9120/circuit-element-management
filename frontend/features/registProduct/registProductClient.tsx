"use client";

import { useRouter } from "next/navigation";
import Button from "../../app/components/button";
import Input from "../../app/components/input";
import { useMenu } from "@/app/contexts/menuContext";

export const structureOptions = [
  { value: "structure-1", label: "片面基板" },
  { value: "structure-2", label: "両面基板" },
  { value: "structure-3", label: "多層基板" },
];

export const stencilOptions = [
  { value: "stencil-1", label: "なし" },
  { value: "stencil-2", label: "あり" },
];

const RegistProductClient = () => {
  const router = useRouter();
  const { setMenuId } = useMenu();

  const Redirect = (route: string) => {
    router.push(route);
  };

  return (
    <>
      <div className="flex flex-col bg-base-300 rounded-box p-3">
        <h1 className="font-bold">名前</h1>
        <Input
          type="text"
          placeholder="Type here"
          className="input input-bordered mt-1 mb-3 w-full max-w-xs"
        />

        <h1 className="font-bold">データシート</h1>
        <Input
          type="file"
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
        <Button label="登録" className="btn btn-primary ml-10 w-32" />
      </div>
    </>
  );
};

export default RegistProductClient;
