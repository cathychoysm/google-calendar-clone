import { redirect } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions, getServerSession } from "next-auth";
import { User } from "next-auth";

import { compareHash } from "./bcrypt";
import { prisma } from "../../prisma/prisma";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password)
          return null;

        // DB check goes below
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            password: true,
          },
        });

        if (user) {
          const correctPassword = await compareHash(
            credentials.password,
            user.password as string
          );
          if (correctPassword) {
            const { id, email } = user;
            return user as User;
          }
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      try {
        if (profile) {
          const userExist = await prisma.user.findUnique({
            where: {
              email: profile.email,
            },
          });

          if (!userExist) {
            const newUser = await prisma.user.create({
              data: {
                name: profile.name as string,
                email: profile.email as string,
                registerType: "google",
              },
            });
            const calendar = await prisma.calendar.create({
              data: {
                userId: newUser.id,
                name: newUser.name,
                defaultColor: "Cobalt",
              },
            });
          }
          return true;
        }

        if (user) {
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    },
    jwt: async ({ token, user }) => {
      // Fetch user data from the database
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email as string },
      });
      token.id = dbUser?.id;
      token.name = dbUser?.name;

      return token;
    },
    session: async ({ session, token }) => {
      if (token.id) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};

export async function getSession() {
  return await getServerSession(authConfig);
}

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/");
  return session;
}
