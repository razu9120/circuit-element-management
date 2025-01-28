import "./globals.css";
import NavigationArea from "./layouts/navigationArea";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" data-theme="light">
      <body>
        <NavigationArea />
        <main className="absolute inset-0 z-0 mt-[60px] md:mt-[110px] pr-5 pb-5 pl-5">
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
