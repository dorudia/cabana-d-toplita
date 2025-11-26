import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST, {
  apiVersion: "2025-11-17.clover",
});

const appUrl = "http://localhost:3000"; // local doar pentru test

export async function POST(req) {
  try {
    const { userEmail, dataSosirii, dataPlecarii, pretTotal } =
      await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "ron",
            product_data: {
              name: `Rezervare: ${dataSosirii} - ${dataPlecarii}`,
            },
            unit_amount: pretTotal * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
    });

    console.log("✅ Checkout session creat:", session.id);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ Checkout session error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
