import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const allowedEmails = ["dorudia@gmail.com", "elamoldovan12@yahoo.com"]; // înlocuiește cu email-urile permise

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Pentru rutele din /rezervari
  if (pathname.startsWith("/rezervari")) {
    // Dacă nu e autentificat sau emailul nu e permis, redirecționează la /login
    if (!token || !allowedEmails.includes(token.email)) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }
  // Pentru rutele din /account: doar verificăm autentificarea
  else if (pathname.startsWith("/account")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/rezervari/:path*"],
};
