import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Rezervation from "../../../models/Reservation";
import Stripe from "stripe";

const stripeSecretKey =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_TEST;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Dacă vine sessionId → rezervare Stripe
    if (body.sessionId) {
      const session = await stripe.checkout.sessions.retrieve(body.sessionId);
      const {
        userName,
        userEmail,
        dataSosirii,
        dataPlecarii,
        numOaspeti,
        pretTotal,
      } = session.metadata;

      const newReservation = await Rezervation.create({
        userName,
        userEmail,
        dataSosirii,
        dataPlecarii,
        numOaspeti: Number(numOaspeti),
        innoptari: Math.ceil(pretTotal / 900),
        pretTotal: Number(pretTotal),
        sessionId: body.sessionId,
      });

      return NextResponse.json({
        message: "Rezervare creată cu succes (Stripe)!",
        data: newReservation,
      });
    }

    // Dacă nu vine sessionId → rezervare manuală
    const requiredFields = [
      "userName",
      "userEmail",
      "dataSosirii",
      "dataPlecarii",
      "numOaspeti",
      "pretTotal",
    ];
    for (const field of requiredFields) {
      if (!body[field])
        return NextResponse.json(
          { error: `${field} este obligatoriu` },
          { status: 400 }
        );
    }

    const newReservation = await Rezervation.create({ ...body });
    return NextResponse.json({
      message: "Rezervare creată cu succes (manual)!",
      data: newReservation,
    });
  } catch (err) {
    console.error("POST /api/reservations error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
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
