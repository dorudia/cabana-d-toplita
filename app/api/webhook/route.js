// // app/api/webhook/route.js
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST, {
//   apiVersion: "2025-11-17.clover",
// });
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST;

// export async function POST(req) {
//   console.log("🎯 WEBHOOK ATINS");
//   try {
//     // ⚡️ Folosim arrayBuffer pentru a obține raw body
//     const buf = Buffer.from(await req.arrayBuffer());
//     const sig = req.headers.get("stripe-signature");

//     const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

//     console.log("🎯 WEBHOOK ATINS:", event.type);

//     return new Response(JSON.stringify({ received: true }), { status: 200 });
//   } catch (err) {
//     console.error("⚠️ Webhook Error:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }
// }

//------------------------------------------------------------------------

// export async function POST(req) {
//   return new Response(JSON.stringify({ message: "Webhook disabled" }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }

//------------------------------------------------------------------------

// app/api/webhook/route.js
// import Stripe from "stripe";

// const stripeSecretKey =
//   process.env.NODE_ENV === "production"
//     ? process.env.STRIPE_SECRET_KEY
//     : process.env.STRIPE_SECRET_KEY_TEST;

// const webhookSecret =
//   process.env.NODE_ENV === "production"
//     ? process.env.STRIPE_WEBHOOK_SECRET
//     : process.env.STRIPE_WEBHOOK_SECRET_TEST;

// const stripe = new Stripe(stripeSecretKey, {
//   apiVersion: "2025-11-17.clover",
// });

// export async function POST(req) {
//   console.log("🎯 WEBHOOK ATINS");

//   // 1️⃣ Stripe trimite raw body -> trebuie păstrat IDENTIC
//   const body = Buffer.from(await req.arrayBuffer());
//   const sig = req.headers.get("stripe-signature");

//   try {
//     // 2️⃣ Validăm cu secret-ul corect (test sau live)
//     const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

//     console.log("📩 EVENT RECEPTIONAT:", event.type);

//     // 3️⃣ Dacă plata e finalizată -> scriem în DB sau trimitem email
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       console.log("💰 PAYMENT OK:", session.id);
//     }

//     return new Response(JSON.stringify({ received: true }), { status: 200 });
//   } catch (err) {
//     console.error("❌ Webhook Error:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }
// }

//------------------------------------------------------------------------

import Stripe from "stripe";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false, // important!
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

export async function POST(req) {
  try {
    const buf = Buffer.from(await req.arrayBuffer());
    const sig = req.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_TEST
    );
    const session = event.data.object;
    console.log("🎯 EVENT DATA:", event.data.object);
    console.log("🎯 METADATA:", session.metadata);

    console.log("🎯 WEBHOOK ATINS:", event.type);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // ex: cabana.d@gmail.com
        pass: process.env.GMAIL_PASS, // parola sau App Password
      },
    });

    await transporter.sendMail({
      from: `"Cabana D" <${process.env.EMAIL_USER}>`,
      to: "dorudia@gmail.com",
      subject: "📢 Raspuns Webhook! 📢",
      html: `<h2>🎯 EVENT DATA:</h2>
              <pre>${JSON.stringify(event.data.object, null, 2)}</pre>
              <h2>🎯 METADATA:</h2>
              <pre>${JSON.stringify(session.metadata, null, 2)}</pre>
        `,
    });

    if (event.type === "checkout.session.completed") {
      // aici intră logica ta pentru a crea rezervarea în DB
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("⚠️ Webhook Error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
