"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn("credentials", {
        userId: formData.get("username"),
        userPass: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError("ログインに失敗しました");
        return;
      }

      router.push("/"); // ログイン後のリダイレクト先
      router.refresh();
    } catch (error) {
      console.error("ログインエラー:", error);
      setError("予期せぬエラーが発生しました");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              ユーザーID
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
