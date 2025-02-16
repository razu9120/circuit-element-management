"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { breadcrumbs } from "../constants/menu";

const Breadcrumbs = () => {
  const pathname = usePathname(); // 現在のURLを取得
  const pathSegments = pathname.split("/").filter(Boolean); // '/' を分割し、空文字を除外

  // 現在のパスと `menu` の `destination` を比較し、一致するメニューを取得する
  const breadcrumbItems = pathSegments.reduce((acc, _, index) => {
    const currentPath = `/${pathSegments.slice(0, index + 1).join("/")}`;

    // `destination` の `:id` 部分を正規表現に置換して比較
    const menuItem = breadcrumbs.find((item) => {
      const regex = new RegExp(
        `^${item.destination.replace(/:\w+/g, "[^/]+")}$`
      );
      return regex.test(currentPath);
    });

    if (menuItem) {
      acc.push({
        label: menuItem.menuName,
        path: index === pathSegments.length - 1 ? null : currentPath, // 最後のアイテムはリンクなし
      });
    }

    return acc;
  }, [] as { label: string; path: string | null }[]);

  return (
    <div className="breadcrumbs fixed bg-base-200/60 backdrop-blur-sm rounded-box text-sm z-10 pr-3 pl-3 mt-5 md:mt-[69px] ml-5">
      <ul>
        <li>
          {pathname === "/" ? (
            <span className="font-bold text-info">ホーム</span> // ホームを強調
          ) : (
            <Link href="/">ホーム</Link>
          )}
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={index}>
            {item.path ? (
              <Link href={item.path}>{item.label}</Link>
            ) : (
              <span className="font-bold text-info">{item.label}</span> // 現在のページを強調表示
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
