import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";

const authConfig = {
  providers: [
    Google({
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
        name: { label: "UserName", type: "text", placeholder: "your name" },
        email: { label: "Email", type: "email", placeholder: "your email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your password",
        },
      },
      async authorize(credentials, req) {
        return credentials;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      console.log("JWT callback - token:", token);
      console.log("JWT callback - account:", account);
      console.log("JWT callback - user:", user);
      // Dacă e login inițial, account și user sunt disponibile.
      if (account) {
        token.provider = account.provider;
        token.email = user?.email || token.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.provider = token.provider;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

export default NextAuth(authConfig);

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
// import CredentialsProvider from "next-auth/providers/credentials";

// const authConfig = {
//   providers: [
//     GoogleProvider({
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
//       async authorize(credentials) {
//         // Aici poți adăuga logica pentru autentificarea cu credentials
//         // De exemplu, verifică în baza de date sau într-un API
//         if (
//           credentials.email === "test@example.com" &&
//           credentials.password === "password"
//         ) {
//           return { id: 1, name: "Test User", email: "test@example.com" };
//         }
//         return null; // Returnează null dacă autentificarea eșuează
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login", // Pagina de login personalizată
//   },
//   secret: process.env.NEXTAUTH_SECRET, // Secretul pentru semnarea token-urilor
//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (account) {
//         token.provider = account.provider;
//         token.email = user?.email || token.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.email = token.email;
//       session.user.provider = token.provider;
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       // Redirecționează utilizatorul după autentificare
//       return baseUrl; // Redirecționează către URL-ul de bază
//     },
//   },
//   cookies: {
//     sessionToken: {
//       name: `__Secure-next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "production", // Folosește HTTPS în producție
//       },
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
