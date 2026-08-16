import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (!pathname.startsWith("/admin")) return true;
      const isPublic =
        pathname.startsWith("/admin/login") ||
        pathname.startsWith("/admin/invite") ||
        pathname.startsWith("/admin/forgot-password") ||
        pathname.startsWith("/admin/reset-password");
      if (isPublic) return true;
      return !!auth;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.approved = Boolean(user.approved);
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id ?? "");
      session.user.approved = Boolean(token.approved);
      return session;
    },
  },
} satisfies NextAuthConfig;
