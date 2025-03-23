"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  isLeftHanded: boolean;
  toggleLeftHanded: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [isLeftHanded, setIsLeftHanded] = useState(false);

  const toggleLeftHanded = () => {
    setIsLeftHanded((prev) => !prev);
  };

  return (
    <SettingsContext.Provider value={{ isLeftHanded, toggleLeftHanded }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
