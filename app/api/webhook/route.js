import { NextResponse } from "next/server";
import Stripe from "stripe";
import { dbConnect } from "../../../lib/db";
import Rezervation from "../../../models/Reservation";

const stripeWebhookSecret =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET_TEST;

const stripeSecretKey =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_TEST;

const stripe = new Stripe(stripeSecretKey);

export const config = { api: { bodyParser: false } };

async function buffer(req) {
  const chunks = [];
  for await (const chunk of req.body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export async function POST(req) {
  console.log("✅ ✅ Webhook a fost apelat!");
  const buf = await buffer(req);
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret);
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await dbConnect();

    const newReservation = await Rezervation.create({
      userName: session.metadata.userName,
      userEmail: session.customer_email,
      dataSosirii: new Date(session.metadata.checkIn),
      dataPlecarii: new Date(session.metadata.checkOut),
      innoptari: Number(session.metadata.innoptari),
      numOaspeti:
        Number(session.metadata.numAdults || 0) +
        Number(session.metadata.numKids || 0),
      pretTotal: session.amount_total / 100,
      sessionId: session.id,
    });

    console.log("Rezervare salvată:", newReservation);
  }

  console.log("Event type:", event.type); // vezi ce tip de event vine
  console.log("Event data:", event.data.object); // vezi payload-ul

  return NextResponse.json({ received: true });
}
