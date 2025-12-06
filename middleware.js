import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Hardcoded admin emails pentru edge runtime
const allowedEmails = [
  "dorudia@gmail.com",
  "elamoldovan12@gmail.com",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Debug NEXTAUTH_SECRET și cookie
  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Middleware - Path:", pathname);
  console.log("Middleware - NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  console.log("Middleware - NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("Middleware - Cookies:", req.cookies.getAll().map(c => c.name));
  
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production"
  });

  console.log("Middleware - Token exists:", !!token);
  if (token) {
    console.log("Middleware - Token keys:", Object.keys(token));
    console.log("Middleware - Token email:", token.email);
    console.log("Middleware - Is admin:", allowedEmails.includes(token.email));
  } else {
    console.log("Middleware - NO TOKEN - getToken returned null");
  }
  console.log("======================");

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
