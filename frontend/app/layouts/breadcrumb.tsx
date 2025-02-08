"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "../contexts/menuContext";
import { menu } from "../constants/menu";

const Breadcrumbs = () => {
  const router = useRouter();
  const { menuId, setMenuId } = useMenu();

  const items = menu.filter((item) => item.menuId === menuId);

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
