import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const allowedEmails = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_1,
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_2,
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

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
