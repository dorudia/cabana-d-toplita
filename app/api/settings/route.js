import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Setting from "../../../models/Setting";
import { auth } from "../../lib/auth";

const allowedEmails = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_1,
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_2,
];

export async function GET() {
  await dbConnect();

  const settings = await Setting.findOne();

  if (!settings) {
    // Seed inițial dacă nu există
    const newSettings = await Setting.create({
      minNights: 1,
      pretNoapte: 300,
    });
    return NextResponse.json({
      message: "Settings created",
      settings: newSettings,
    });
  }

  return NextResponse.json({ message: "Settings fetched", settings });
}

export async function PATCH(req) {
  const session = await auth();
  
  // Verifică dacă utilizatorul este admin
  if (!session?.user || !allowedEmails.includes(session.user.email)) {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  await dbConnect();

  const body = await req.json();
  const { minNights, pretNoapte } = body;

  const settings = await Setting.findOne();
  if (!settings) {
    return NextResponse.json(
      { message: "Settings not found" },
      { status: 404 }
    );
  }

  if (minNights !== undefined) settings.minNights = minNights;
  if (pretNoapte !== undefined) settings.pretNoapte = pretNoapte;

  await settings.save();

  return NextResponse.json({ message: "Settings updated", settings });
}
