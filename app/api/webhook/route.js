import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Rezervation from "../../../models/Reservation";
import Stripe from "stripe";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false, // important pentru webhook
  },
};

const stripeSecretKey =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_TEST;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET_TEST;

export async function POST(req) {
  try {
    await dbConnect();

    const buf = Buffer.from(await req.arrayBuffer());
    const sig = req.headers.get("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log("🎯 WEBHOOK ATINS:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
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
        pretTotal: Number(pretTotal) / 100,
        sessionId: session.id,
      });

      // send email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yy = String(date.getFullYear()).slice(-2);
        return `${dd}/${mm}/${yy}`;
      };

      const dataFormataSosire = formatDate(dataSosirii);
      const dataFormataPlec = formatDate(dataPlecarii);

      // email client
      await transporter.sendMail({
        from: `"Cabana D" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: "Rezervare confirmată 🎉",
        html: `<h2>Rezervarea ta este confirmată!</h2>
               <p><strong>${userName}</strong></p>
               <p><strong>${dataFormataSosire} → ${dataFormataPlec}</strong></p>
               <p>Nr. oaspeți: ${numOaspeti}</p>
               <p>Total: ${pretTotal / 100} RON</p>`,
      });

      // email admin
      await transporter.sendMail({
        from: `"Cabana D" <${process.env.GMAIL_USER}>`,
        to: ["dorudia@gmail.com", "elamoldovan12@gmail.com"],
        subject: "📢 Nouă rezervare!",
        html: `<h2>Nouă rezervare creată pentru perioada ${dataFormataSosire} - ${dataFormataPlec}</h2>
               <p><strong>Nume: ${userName}</strong></p>
               <p>Nr. oaspeți: ${numOaspeti}</p>
               <p>Pret: ${pretTotal / 100} RON</p>`,
      });

      return new Response(
        JSON.stringify({ message: "Rezervare creată cu succes!" }),
        {
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Rezervare creată cu succes!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("⚠️ Webhook Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}
