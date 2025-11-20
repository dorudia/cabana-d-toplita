import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Rezervation from "../../../models/Reservation";

// POST: creare rezervare
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // Validare minimă
    const requiredFields = [
      "userName",
      "userEmail",
      "dataSosirii",
      "dataPlecarii",
      "innoptari",
      "numOaspeti",
      "pretTotal",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} este obligatoriu.` },
          { status: 400 }
        );
      }
    }

    const newReservation = await Rezervation.create(body);

    return NextResponse.json({
      message: "Rezervare creată cu succes!",
      data: newReservation,
    });
  } catch (err) {
    console.error("POST /api/reservations error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: preluare toate rezervările
export async function GET() {
  try {
    await dbConnect();

    const rezervari = await Rezervation.find().sort({ dataSosirii: 1 });

    return NextResponse.json({ rezervari });
  } catch (err) {
    console.error("GET /api/reservations error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
