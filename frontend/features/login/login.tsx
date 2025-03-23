"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "@/app/components/input";
import Button from "@/app/components/button";
import Alert from "@/app/components/alert";

interface IFormData {
  userId: string;
  userPass: string;
}

const Login = () => {
  const router = useRouter();
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    mode: "onChange",
    defaultValues: {
      userId: "",
      userPass: "",
    },
  });

  const onSubmit = async (data: IFormData) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl") || "/";

      const result = await signIn("credentials", {
        userId: data.userId,
        userPass: data.userPass,
        redirect: false,
      });

      if (result?.error) {
        setShowError(true);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error("ログインエラー:", error);
      setShowError(true);
    }
  };

  const handleRedirect = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-base-300 rounded-box p-16 w-[600px]"
      >
        <h1 className="font-bold">
          ユーザID<span className="text-red-500">*</span>
        </h1>
        <Input
          type="text"
          placeholder="ユーザIDを入力"
          className={`input input-bordered mt-1 mb-3 w-full ${
            errors.userId ? "input-error" : ""
          }`}
          {...register("userId", { required: "ユーザIDは必須です" })}
        />
        {errors.userId && (
          <p className="text-error text-sm mb-3">{errors.userId.message}</p>
        )}

        <h1 className="font-bold">
          パスワード<span className="text-red-500">*</span>
        </h1>
        <Input
          type="password"
          placeholder="パスワードを入力"
          className={`input input-bordered mt-1 mb-3 w-full ${
            errors.userPass ? "input-error" : ""
          }`}
          {...register("userPass", { required: "パスワードは必須です" })}
        />
        {errors.userPass && (
          <p className="text-error text-sm mb-3">{errors.userPass.message}</p>
        )}

        <div className="flex justify-center mt-3">
          <Button
            type="button"
            label="アカウント作成"
            className="btn btn-outline btn-secondary"
            onClick={() => handleRedirect("/signup")}
          />
          <Button
            type="submit"
            label="ログイン"
            className="btn btn-primary ml-10 w-32"
          />
        </div>
      </form>

      <Alert
        message="ログインに失敗しました"
        type="error"
        isVisible={showError}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};

export default Login;
