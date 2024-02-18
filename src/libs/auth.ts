import NextAuth, { type DefaultSession } from "next-auth";
import { type BuiltInProviderType } from "next-auth/providers/index";
import { type LiteralUnion } from "next-auth/react";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { db } from "@/server/db";
import { getUserById } from "@/server/data-access";
import { authConfig } from "@/auth.config";
import { sendMagicLink } from "./mail";

export type NextAuthProviders = LiteralUnion<BuiltInProviderType, string>;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    newUser: "/onboarding",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.id = token.sub;
      token.name = existingUser.name;
      token.email = existingUser.email;

      return token;
    },
  },
  providers: [
    ...authConfig.providers,
    EmailProvider({
      maxAge: 180, // // Magic links are valid for 3 min only
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await sendMagicLink(email, url);
        } catch (error) {
          console.log("***ERROR***: ", error);
        }
      },
    }),
  ],
});
