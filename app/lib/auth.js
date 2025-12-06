import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { checkUserPassword } from "@/lib/actions";

// --- Configurația NextAuth ---
const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verificăm user în DB și parola cu bcrypt
        const user = await checkUserPassword(
          credentials.email,
          credentials.password
        );
        if (!user) return null;

        // Returnăm user complet, cu name
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {
      // Debug logging
      console.log("JWT Callback - user:", user?.email);
      console.log("JWT Callback - token before:", { email: token.email, name: token.name });
      
      // La login inițial, user există
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      if (account) {
        token.provider = account.provider;
      }

      console.log("JWT Callback - token after:", { email: token.email, name: token.name });
      return token;
    },

    async session({ session, token }) {
      console.log("Session Callback - token:", { email: token.email, name: token.name });
      session.user.id = token.id;
      session.user.name = token.name; // <<< acum există și pentru Credentials
      session.user.email = token.email;
      session.user.provider = token.provider;
      console.log("Session Callback - session.user:", { email: session.user.email, name: session.user.name });
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  session: {
    strategy: "jwt",
  },
};

// --- Export default pentru NextAuth ---
const nextAuthHandler = NextAuth(authConfig);
export default nextAuthHandler;

// --- Exporturi compatibile cu codul existent ---
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = nextAuthHandler;
