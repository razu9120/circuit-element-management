"use client";

import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

interface IMenuContextType {
  menuId: string;
  setMenuId: Dispatch<SetStateAction<string>>;
}

export const MenuContext = createContext<IMenuContextType>({
  menuId: "",
  setMenuId: () => {
    throw new Error("MenuContextでエラーが発生しました。");
  },
});

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuId, setMenuId] = useState<string>("000");

  return (
    <MenuContext.Provider value={{ menuId, setMenuId }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): IMenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("MenuContextでエラーが発生しました。");
  }
  return context;
};
