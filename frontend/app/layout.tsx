import "./globals.css";
import { MenuProvider } from "./contexts/menuContext";
import SwitchDisplay from "./layouts/switchDisplay";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="light">
      <body>
        <MenuProvider>
          <SwitchDisplay>{children}</SwitchDisplay>
        </MenuProvider>
      </body>
    </html>
  );
};

export default RootLayout;
