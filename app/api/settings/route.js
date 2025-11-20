import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Setting from "../../../models/Setting";

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
