import Stripe from "stripe";

const stripeSecretKey =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_TEST;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req) {
  try {
    const {
      userEmail,
      userName,
      dataSosirii,
      dataPlecarii,
      numOaspeti,
      innoptari,
      description,
      pretTotal,
    } = await req.json();

    // Validare date de intrare
    if (!userEmail || !userName || !dataSosirii || !dataPlecarii || !numOaspeti || !pretTotal) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validare sumă (trebuie să fie pozitivă și rezonabilă)
    const amount = Number(pretTotal);
    if (isNaN(amount) || amount <= 0 || amount > 10000000) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        userName,
        dataSosirii,
        dataPlecarii,
        userEmail,
        description,
        numOaspeti: String(numOaspeti),
        innoptari: String(innoptari),
        pretTotal: String(amount),
      },
    });

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
