"use client";

import { usePathname } from "next/navigation";
import NavigationArea from "./navigationArea";

const SwitchDisplay: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  if (pathname === "/login") {
    return <div>{children}</div>;
  }
  return (
    <>
      <NavigationArea />
      <main className="z-0 mt-[60px] md:mt-[110px] mb-[80px] pr-5 pl-5">
        {children}
      </main>
    </>
  );
};

export default SwitchDisplay;
