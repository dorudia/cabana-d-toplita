import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Rezervare from "../../../models/Reservation";

export async function GET() {
  try {
    await dbConnect();

    const count = await Rezervare.countDocuments(); // doar test

    return NextResponse.json({
      status: "Connected to MongoDB",
      totalRezervari: count,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
