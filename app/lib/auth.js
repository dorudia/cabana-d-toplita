// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import FacebookProvider from "next-auth/providers/facebook";

// const authConfig = {
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         name: { label: "UserName", type: "text", placeholder: "your name" },
//         email: { label: "Email", type: "email", placeholder: "your email" },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "your password",
//         },
//       },
//       async authorize(credentials, req) {
//         return credentials;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token, account, user }) {
//       // console.log("JWT callback - token:", token);
//       // console.log("JWT callback - account:", account);
//       console.log(
//         "JWT callback - user:",
//         user,
//         "JWT callback - token:",
//         token,
//         "JWT callback - account:",
//         account
//       );
//       // Dacă e login inițial, account și user sunt disponibile.
//       if (account) {
//         token.provider = account.provider;
//         token.email = user?.email || token.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.email = token.email;
//       session.user.provider = token.provider;
//       session.user.name = token.name;
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       return baseUrl;
//     },
//   },
// };

// export default NextAuth(authConfig);

// export const {
//   auth,
//   signIn,
//   signOut,
//   handlers: { GET, POST },
// } = NextAuth(authConfig);

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { checkUserPassword } from "@/lib/actions"; // verifică email+parolă cu bcrypt

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
      // La login inițial, user există
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      if (account) {
        token.provider = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name; // <<< acum există și pentru Credentials
      session.user.email = token.email;
      session.user.provider = token.provider;
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
