"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "@/app/components/input";
import Button from "@/app/components/button";
import Alert from "@/app/components/alert";
import bcrypt from "bcryptjs";
import { apiClient } from "@/app/common/apiClient";

interface IFormData {
  userId: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

interface IRegistUser {
  loginUserId: string;
  userName: string;
  userPass: string;
}

const Signup = () => {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormData>({
    mode: "onChange",
    defaultValues: {
      userId: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: IFormData) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const response = await apiClient.post<IRegistUser>("/users", {
        loginUserId: data.userId,
        userName: data.userName,
        userPass: hashedPassword,
      });

      if (!response) {
        setErrorMessage("アカウント作成に失敗しました");
        setShowError(true);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("アカウント作成エラー:", error);
      setErrorMessage("予期せぬエラーが発生しました");
      setShowError(true);
    }
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
          {...register("userId", {
            required: "ユーザIDは必須です",
            minLength: {
              value: 4,
              message: "ユーザIDは4文字以上で入力してください",
            },
          })}
        />
        {errors.userId && (
          <p className="text-error text-sm mb-3">{errors.userId.message}</p>
        )}

        <h1 className="font-bold">
          ユーザ名<span className="text-red-500">*</span>
        </h1>
        <Input
          type="text"
          placeholder="ユーザ名を入力"
          className={`input input-bordered mt-1 mb-3 w-full ${
            errors.userName ? "input-error" : ""
          }`}
          {...register("userName", { required: "ユーザ名は必須です" })}
        />
        {errors.userName && (
          <p className="text-error text-sm mb-3">{errors.userName.message}</p>
        )}

        <h1 className="font-bold">
          パスワード<span className="text-red-500">*</span>
        </h1>
        <Input
          type="password"
          placeholder="パスワードを入力"
          className={`input input-bordered mt-1 mb-3 w-full ${
            errors.password ? "input-error" : ""
          }`}
          {...register("password", {
            required: "パスワードは必須です",
            minLength: {
              value: 8,
              message: "パスワードは8文字以上で入力してください",
            },
          })}
        />
        {errors.password && (
          <p className="text-error text-sm mb-3">{errors.password.message}</p>
        )}

        <h1 className="font-bold">
          パスワード（確認）<span className="text-red-500">*</span>
        </h1>
        <Input
          type="password"
          placeholder="パスワードを再入力"
          className={`input input-bordered mt-1 mb-3 w-full ${
            errors.confirmPassword ? "input-error" : ""
          }`}
          {...register("confirmPassword", {
            required: "パスワード（確認）は必須です",
            validate: (value) =>
              value === watch("password") || "パスワードが一致していません",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-error text-sm mb-3">
            {errors.confirmPassword.message}
          </p>
        )}

        <div className="flex justify-center mt-3">
          <Button
            type="button"
            label="戻る"
            className="btn btn-outline btn-secondary"
            onClick={() => router.push("/login")}
          />
          <Button
            type="submit"
            label="登録"
            className="btn btn-primary ml-10 w-32"
          />
        </div>
      </form>

      <Alert
        message={errorMessage}
        type="error"
        isVisible={showError}
        onClose={() => setShowError(false)}
      />
      <Alert
        message="アカウントを作成しました"
        type="success"
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default Signup;
