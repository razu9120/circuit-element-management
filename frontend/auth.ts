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
const fetchUser = async (loginUserId: number): Promise<IUser | null> => {
  try {
    const user = await apiClient.get<IUser>(`/users/${loginUserId}`);
    return user;
  } catch (error) {
    console.error("ユーザ取得エラー:", error);
    return null;
  }
};

// 認証不要のパスを配列で定義
const publicPaths = ["/login", "/signup"];

export const config: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const { loginUserId, userPass } = credentials as {
          loginUserId: number;
          userPass: string;
        };

        try {
          const user = await fetchUser(loginUserId);

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

        // 認証不要のパスの場合は常にtrue
        if (publicPaths.includes(pathname)) {
          return true;
        }

        // 認証されていない場合は、loginページにリダイレクト
        if (!auth) {
          //   const returnUrl = encodeURIComponent(pathname);
          request.nextUrl.pathname = "/login";
          // 元のURLをクエリパラメータとして保持
          //   request.nextUrl.searchParams.set("callbackUrl", returnUrl);
          return Response.redirect(request.nextUrl);
        }

        // 認証済みの場合はtrue
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
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
