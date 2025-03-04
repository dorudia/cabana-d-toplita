import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const allowedEmails = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_1,
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_2,
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  console.log("Middleware triggered for:", pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token from middleware:", token);

  if (pathname.startsWith("/rezervari")) {
    if (!token || !allowedEmails.includes(token.email)) {
      console.log("Access denied for /rezervari");
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/account")) {
    if (!token) {
      console.log("Access denied for /account");
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
