"use client";

import { useSearchParams } from "next/navigation";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";

const Error = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMessage =
    searchParams.get("message") || "予期せぬエラーが発生しました。";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-300 rounded-box">
      <div className="bg-base-100 p-8 rounded-box shadow-lg">
        <h1 className="text-2xl font-bold text-error mb-4">エラー</h1>
        <p className="mb-6">{errorMessage}</p>
        <Button
          label="戻る"
          className="btn btn-primary"
          onClick={() => router.push("/")}
        />
      </div>
    </div>
  );
};

export default Error;
