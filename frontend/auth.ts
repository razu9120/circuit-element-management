import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { apiClient } from "./app/common/apiClient";

interface IUser {
  userId: number;
  loginUserId: string;
  userPass: string;
  userName: string;
  userRole: string;
  isDeleted: boolean;
}

// fetchUser関数の実装
const fetchUser = async (userId: number): Promise<IUser | null> => {
  try {
    const user = await apiClient.get<IUser>(`/api/users/${userId}`);
    return user;
  } catch (error) {
    console.error("ユーザ取得エラー:", error);
    return null;
  }
};

export const config: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const { userId, userPass } = credentials as {
          userId: number;
          userPass: string;
        };

        try {
          const user = await fetchUser(userId);

          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(userPass, user.userPass);

          if (!isValid) {
            return null;
          }

          return {
            id: user.userId.toString(),
            name: user.userName,
            role: user.userRole,
          };
        } catch (error) {
          console.error("認証エラー:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async authorized({ auth, request }) {
      try {
        const { pathname } = request.nextUrl;
        if (pathname !== "/login") {
          return !!auth;
        }
        return true;
      } catch (e) {
        console.error("認証エラー:", e);
        return false;
      }
    },
    // JWTの作成時に呼ばれる
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // セッション作成時に呼ばれる
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // カスタムログインページ
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
