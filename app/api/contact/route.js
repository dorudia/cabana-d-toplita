// /app/api/contact/route.js
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Toate câmpurile sunt obligatorii" },
        { status: 400 }
      );
    }

    // Configurează transporter Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // ex: cabana.d@gmail.com
        pass: process.env.GMAIL_PASS, // parola sau App Password
      },
    });

    // Trimite email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "dorudia@gmail.com",
      subject: `Mesaj de la ${name} - Cabana D`,
      text: message,
      html: `<p><strong>Nume:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mesaj:</strong></p>
             <p>${message}</p>`,
    });

    return Response.json(
      { message: "Mesaj trimis cu succes!" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Eroare la trimiterea mesajului" },
      { status: 500 }
    );
  }
}
