"use client";

import { useState } from "react";
import Header from "./header";
import Sidemenu from "./sidemenu";

const NavigationArea = () => {
  const [menuId, setMenuId] = useState<string>("");
  return (
    <>
      <Header menuId={menuId} />
      <Sidemenu setMenuId={setMenuId} />
    </>
  );
};

export default NavigationArea;
