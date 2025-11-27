import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Rezervation from "../../../models/Reservation";
import Stripe from "stripe";
import nodemailer from "nodemailer";

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
        innoptari,
        numOaspeti,
        pretTotal,
      } = session.metadata;

      const newReservation = await Rezervation.create({
        userName,
        userEmail,
        dataSosirii,
        dataPlecarii,
        numOaspeti: Number(numOaspeti),
        innoptari: Number(innoptari),
        pretTotal: Number(pretTotal),
        sessionId: body.sessionId,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER, // ex: cabana.d@gmail.com
          pass: process.env.GMAIL_PASS, // parola sau App Password
        },
      });

      function formatDate(dateString) {
        const date = new Date(dateString);
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yy = String(date.getFullYear()).slice(-2);
        return `${dd}/${mm}/${yy}`;
      }

      const dataFormataSosire = formatDate(dataSosirii);
      const dataFormataPlec = formatDate(dataPlecarii);

      await transporter.sendMail({
        from: `"Cabana D" <${process.env.EMAIL_USER}>`,
        to: userEmail, // clientul
        subject: "Rezervare confirmată 🎉",
        html: `
    <h2>Rezervarea ta este confirmată!</h2>
    <p><strong>${dataFormataSosire} → ${dataFormataPlec}</strong></p>
    <p>Nr. oaspeți: ${numOaspeti}</p>
    <p>Total: ${pretTotal} RON</p>
  `,
      });

      // + email către tine (admin)
      await transporter.sendMail({
        from: `"Cabana D" <${process.env.EMAIL_USER}>`,
        to: "dorudia@gmail.com",
        subject: "📢 Nouă rezervare!",
        html: `<h2>Nouă rezervare creată pentru perioada ${dataFormataSosire} - ${dataFormataPlec}</h2>
        <p>Nr. oaspeți: ${numOaspeti}</p>
        <p>Total: ${pretTotal} RON</p>
        `,
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
