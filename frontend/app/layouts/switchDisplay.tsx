"use client";

import { usePathname } from "next/navigation";
import NavigationArea from "./navigationArea";
import { SessionProvider } from "next-auth/react";

// ヘッダー、サイドメニューを表示しない画面のパスを配列で定義
const pathnames = ["/login", "/signup"];

const SwitchDisplay: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  if (pathnames.includes(pathname)) {
    return <>{children}</>;
  }
  return (
    <>
      <SessionProvider>
        <NavigationArea />
        <main className="z-0 mt-[60px] md:mt-[110px] mb-[80px] pr-5 pl-5">
          {children}
        </main>
      </SessionProvider>
    </>
  );
};

export default SwitchDisplay;
