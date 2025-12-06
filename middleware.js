import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Hardcoded admin emails pentru edge runtime
const allowedEmails = [
  "dorudia@gmail.com",
  "elamoldovan12@gmail.com",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Debug NEXTAUTH_SECRET
  console.log("Middleware - NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  console.log("Middleware - NEXTAUTH_SECRET length:", process.env.NEXTAUTH_SECRET?.length);
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Debug logging pentru live
  console.log("Middleware - Path:", pathname);
  console.log("Middleware - Token exists:", !!token);
  console.log("Middleware - Token keys:", token ? Object.keys(token) : "no token");
  console.log("Middleware - Token email:", token?.email);
  console.log("Middleware - Token sub:", token?.sub);
  console.log("Middleware - Is admin:", token?.email ? allowedEmails.includes(token.email) : false);

  // Protejează rutele admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/rezervari")) {
    if (!token || !allowedEmails.includes(token.email)) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Protejează rutele autentificate
  if (pathname.startsWith("/account")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/rezervari/:path*", "/account/:path*"],
};
