"use client";

import { useEffect, useState } from "react";
import Header, { Menu } from "./header";
import Sidemenu from "./sidemenu";
import { menu } from "../components/menu";

const getBreadcrumbItemsByMenuId = (menuId: string): Menu[] => {
  return menu.filter((item) => item.menuId === menuId);
};

const NavigationArea = () => {
  const [menuId, setMenuId] = useState<string>("000");
  const [breadcrumbs, setBreadcrumbs] = useState<Menu[]>([]);

  // menuId の変更を監視し、items を更新する
  useEffect(() => {
    const newItems = getBreadcrumbItemsByMenuId(menuId);
    setBreadcrumbs(newItems);
  }, [menuId]); // menuId が変わるたびに実行
  return (
    <>
      <Header menuId={menuId} setMenuId={setMenuId} items={breadcrumbs} />
      <Sidemenu setMenuId={setMenuId} />
    </>
  );
};

export default NavigationArea;
