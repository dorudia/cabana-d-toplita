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
export async function POST(req) {
  return new Response(JSON.stringify({ message: "Webhook disabled" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
