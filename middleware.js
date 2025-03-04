import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const allowedEmails = [
  process.env.NEXTAUTH_EMAIL_1,
  process.env.NEXTAUTH_EMAIL_2,
]; // înlocuiește cu email-urile permise

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("token", token);

  // Pentru rutele din /rezervari
  // if (pathname.startsWith("/rezervari")) {
  //   // Dacă nu e autentificat sau emailul nu e permis, redirecționează la /login
  //   if (!token || !allowedEmails.includes(token.email)) {
  //     const url = req.nextUrl.clone();
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }
  // }
  // Pentru rutele din /account: doar verificăm autentificarea
  // if (pathname.startsWith("/account")) {
  //   if (!token) {
  //     const url = req.nextUrl.clone();
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }
  // }
  return NextResponse.next();
}
