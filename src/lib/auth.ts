import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOption = {
  providers: [
    CredentialsProvider({
      name: "Cradentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        return { id: "2", email: "test@gmail.com", role: "Admin" };
      },
    }),
  ],

  
  pages: { signIn: "/login" },
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
  callback: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role; // Store role in JWT
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.user.role = token.role; // Attach role to session
      return session;
    },
  },
};

export const handler = NextAuth(authOption);
