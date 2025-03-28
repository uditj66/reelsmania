import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "./dbConfig";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are missing");
        }
        try {
          await connectDb();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found");
          }
          const isPasswordMatched = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordMatched) {
            throw new Error("Password doesn't Matched");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.is as string;
      }
      return session;
    },
  },
  pages:{
 signIn:"/login",
 error:"/login"
  },
  session: {
    strategy: "jwt",
    maxAge:30*24*60*60
  },
  secret: process.env.NEXTAUTH_SECRET

  
};
