import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
// import { JWT } from 'next-auth/jwt';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
