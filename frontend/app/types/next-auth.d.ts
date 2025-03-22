import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    // 他の必要なユーザー情報
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    // 他の必要なトークン情報
  }
}
