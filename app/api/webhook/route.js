// app/api/webhook/route.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST, {
  apiVersion: "2025-11-17.clover",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST;

export async function POST(req) {
  try {
    // ⚡️ Folosim arrayBuffer pentru a obține raw body
    const buf = Buffer.from(await req.arrayBuffer());
    const sig = req.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

    console.log("🎯 WEBHOOK ATINS:", event.type);

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("⚠️ Webhook Error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}

// // pages/api/webhook.js

// /api/webhook.js  (sau /route.js dacă e cu app router)

// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// export const config = {
//   api: { bodyParser: false }, // OBLIGATORIU
// };

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST, {
//   apiVersion: "2025-11-17.clover", // ai văzut asta când ai dat stripe listen
// });

// // 🟡 citim manual raw body (NO micro!)
// async function getRawBody(req) {
//   const chunks = [];
//   for await (const chunk of req.body) chunks.push(chunk);
//   return Buffer.concat(chunks);
// }

// // 🟢 metoda HTTP corectă (UNICA din fișier!)
// export async function POST(req) {
//   const sig = req.headers.get("stripe-signature") || "no-signature";
//   console.log("token:", sig); // 👀 vezi dacă ajunge

//   const buf = await getRawBody(req);

//   try {
//     const event = stripe.webhooks.constructEvent(
//       buf,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET_TEST
//     );

//     console.log("🎯 WEBHOOK ATINS:", event.type);

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("❌ Webhook error:", err.message);
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }
