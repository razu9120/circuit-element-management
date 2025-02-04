"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Menu } from "./header";

interface BreadcrumbsProps {
  items: Menu[]; // パンくずリストのアイテム配列
  setMenuId: React.Dispatch<React.SetStateAction<string>>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, setMenuId }) => {
  const router = useRouter();

  const Redirect = (route: string | undefined, menuId: string) => {
    if (!route) {
      return;
    }
    setMenuId(menuId);
    router.push(route);
  };

  return (
    <div className="breadcrumbs fixed bg-base-200/60 backdrop-blur-sm rounded-box text-sm z-10 pr-3 pl-3 mt-5 md:mt-[69px] ml-5">
      <ul>
        {items
          .flatMap((menu) =>
            menu.breadcrumbItems.map((item) => ({
              ...item,
              menuId: menu.menuId,
            }))
          )
          .map((item, index) => (
            <li key={index}>
              {item.isActive ? (
                <span className="font-bold text-info">{item.label}</span>
              ) : (
                <a
                  onClick={() => {
                    if (item.path) {
                      Redirect(item.path, item.menuId);
                    }
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
