export { auth as middleware } from "./auth";

export const config = {
  // 認証が必要なパスを指定
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
