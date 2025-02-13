import "./globals.css";
import NavigationArea from "./layouts/navigationArea";
import { MenuProvider } from "./contexts/menuContext";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="light">
      <body>
        <MenuProvider>
          <NavigationArea />
          <main className="z-0 mt-[60px] md:mt-[110px] mb-[80px] pr-5 pl-5">
            {children}
          </main>
        </MenuProvider>
      </body>
    </html>
  );
};

export default RootLayout;
