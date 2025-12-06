import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Rezervation from "../../../models/Reservation";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { auth } from "../../lib/auth";

const allowedEmails = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_1,
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_2,
];

export async function GET() {
  try {
    const session = await auth();

    // Verifică dacă utilizatorul este autentificat și admin
    if (!session?.user || !allowedEmails.includes(session.user.email)) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();

    const rezervari = await Rezervation.find().sort({ dataSosirii: 1 });

    return NextResponse.json({ rezervari });
  } catch (err) {
    console.error("GET /api/reservations error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
