"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string; // 表示する文字列
  path?: string;
  isActive?: boolean; // 現在位置の場合は true
  className?: string; // 任意でスタイルを指定
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]; // パンくずリストのアイテム配列
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const router = useRouter();

  const Redirect = (route: string | undefined) => {
    if (!route) {
      return;
    }
    router.push(route);
  };

  return (
    <div className="breadcrumbs fixed bg-base-200/60 backdrop-blur-sm rounded-box text-sm z-10 pr-3 pl-3 mt-5 md:mt-[69px] ml-5">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.isActive ? (
              <span className={`font-bold ${item.className || "text-info"}`}>
                {item.label}
              </span>
            ) : (
              <a
                className={item.className}
                onClick={() => {
                  Redirect(item.path);
                }}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
