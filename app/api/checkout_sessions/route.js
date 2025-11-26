import Stripe from "stripe";

const stripeSecretKey =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_TEST;

const appUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NEXT_PUBLIC_APP_URL_TEST;

const stripe = new Stripe(stripeSecretKey);

export async function POST(req) {
  try {
    const { userEmail, description, amount } = await req.json();
    console.log("DATA FROM FRONTEND:", { userEmail, description, amount });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "ron",
            product_data: { name: description },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // } catch (err) {
    console.error("Stripe full error:", err); // ← vezi TOT stack-ul
    console.error("Stripe error message:", err.message); // ← doar mesajul
    return Response.json({ error: err.message }, { status: 500 });
  }
}
