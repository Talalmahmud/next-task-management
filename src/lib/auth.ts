import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials", // Fix typo here
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials not provided!");
        }

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found!");
        }

        // Compare the hashed password with the one in the database
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password!");
        }
        console.log(user);

        // Return user details to store in the JWT
        return { id: user.id, role: user.role };
      },
    }),
  ],

  pages: {
    signIn: "/login", // Customize the login page
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      // Attach user data to JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role; // Store the role in JWT
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      // Attach user data to session object
      session.user.id = token.id;
      session.user.role = token.role; // Attach role to session
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
