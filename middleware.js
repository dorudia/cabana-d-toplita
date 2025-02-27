// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const allowedEmails = ["dorudia@gmail.com", "elamoldovan12@gmail.com"]; // înlocuiește cu email-urile permise

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   // Pentru rutele din /rezervari
//   if (pathname.startsWith("/rezervari")) {
//     // Dacă nu e autentificat sau emailul nu e permis, redirecționează la /login
//     if (!token || !allowedEmails.includes(token.email)) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/";
//       return NextResponse.redirect(url);
//     }
//   }
//   // Pentru rutele din /account: doar verificăm autentificarea
//   else if (pathname.startsWith("/account")) {
//     if (!token) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/account/:path*", "/rezervari/:path*"],
// };

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   console.log("Token email:", token?.email);
//   console.log("Allowed emails:", allowedEmails);

//   if (pathname.startsWith("/rezervari")) {
//     if (!token || !allowedEmails.includes(token.email.toLowerCase())) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   } else if (pathname.startsWith("/account")) {
//     if (!token) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }
//   return NextResponse.next();
// }

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  try {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Token:", token);

    // ... restul logicii pentru rute
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
