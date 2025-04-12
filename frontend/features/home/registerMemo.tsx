"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/button";

interface IMemo {
  id: number;
  content: string;
  createdAt: string;
}

const RegisterMemo = () => {
  const [memos, setMemos] = useState<IMemo[]>([]);
  const [newMemo, setNewMemo] = useState("");

  // localStorageからメモを読み込む
  useEffect(() => {
    const savedMemos = localStorage.getItem("memos");
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
  }, []);

  // メモを保存
  const saveMemo = () => {
    if (!newMemo.trim()) return;

    const memo: IMemo = {
      id: Date.now(),
      content: newMemo,
      createdAt: new Date().toLocaleString(),
    };

    const updatedMemos = [...memos, memo];
    setMemos(updatedMemos);
    localStorage.setItem("memos", JSON.stringify(updatedMemos));
    setNewMemo("");
  };

  // メモを削除
  const deleteMemo = (id: number) => {
    const updatedMemos = memos.filter((memo) => memo.id !== id);
    setMemos(updatedMemos);
    localStorage.setItem("memos", JSON.stringify(updatedMemos));
  };

  return (
    <div className="card bg-base-300 md:w-96 mb-5 md:mb-0 p-3 shadow-xl">
      <h2 className="text-xl font-bold mb-3">メモ</h2>

      <div className="flex gap-2 mb-4">
        <textarea
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          className="textarea textarea-bordered w-full h-24"
          placeholder="メモを入力してください"
        />
      </div>

      <div className="flex justify-end mb-4">
        <Button
          label="保存"
          onClick={saveMemo}
          className="btn btn-primary btn-sm"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {memos.map((memo) => (
          <div
            key={memo.id}
            className="bg-base-100 rounded-box p-3 relative group"
          >
            <p className="whitespace-pre-wrap">{memo.content}</p>
            <div className="text-xs text-gray-500 mt-2">{memo.createdAt}</div>
            <button
              onClick={() => deleteMemo(memo.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterMemo;
