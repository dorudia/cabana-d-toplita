import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email este obligatoriu" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Nu dezvăluim dacă emailul există sau nu (securitate)
      return NextResponse.json({
        message: "Dacă emailul există, veți primi instrucțiuni de resetare.",
      });
    }

    // Nu poate reseta parola dacă a folosit OAuth
    if (!user.password) {
      return NextResponse.json({
        message:
          "Acest cont folosește autentificare prin Google/Facebook. Nu poate fi resetată parola.",
      });
    }

    // Generează token securizat
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Salvează în DB cu expirare de 1 oră
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 oră
    await user.save();

    // Link de reset
    const appUrl = "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

    // Configurare Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Trimite email
    await transporter.sendMail({
      from: `"Cabana D" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Resetare parolă - Cabana D",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Resetare parolă</h2>
          <p>Ai solicitat resetarea parolei pentru contul tău de la Cabana D.</p>
          <p>Click pe link-ul de mai jos pentru a-ți reseta parola:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Resetează parola
          </a>
          <p>Sau copiază acest link în browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>Link-ul expiră în 1 oră.</strong></p>
          <p>Dacă nu ai solicitat resetarea parolei, ignoră acest email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">Cabana D Toplița</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Email de resetare trimis cu succes!",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Eroare la procesarea cererii" },
      { status: 500 }
    );
  }
}
