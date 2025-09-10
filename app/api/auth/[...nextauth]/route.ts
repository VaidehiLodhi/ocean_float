import NextAuth from "next-auth";

import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.Client_ID!,
      clientSecret: process.env.Client_Secret!,
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt(params) {
      if (params.user) {
        params.token.id = params.user.id;
      }

      return params.token;
    },
    async session({ session, token }) {
      session.user!.id = token.id;

      return session;
    },
  },
};

// Wrap NextAuth in a handler
const handler = NextAuth(authOptions);

// App Router requires named exports for HTTP methods
export { handler as GET, handler as POST };
