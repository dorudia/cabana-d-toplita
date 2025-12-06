import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import crypto from "crypto";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    console.log("🔍 Reset attempt - Token:", token?.substring(0, 20) + "...");
    console.log("🔍 Password length:", password?.length);

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token și parola sunt obligatorii" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Parola trebuie să aibă minim 6 caractere" },
        { status: 400 }
      );
    }

    // Hash-uim tokenul primit pentru comparație
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("🔍 Hashed token:", resetTokenHash.substring(0, 20) + "...");

    // Găsim user-ul cu token valid și neexpirat
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("🔍 User found:", user ? user.email : "NONE");
    console.log("🔍 Token expires:", user?.resetPasswordExpires);
    console.log("🔍 Current time:", new Date());

    if (!user) {
      return NextResponse.json(
        { error: "Token invalid sau expirat" },
        { status: 400 }
      );
    }

    // Hash-uim noua parolă
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizăm parola și ștergem token-ul
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      message: "Parola a fost resetată cu succes!",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Eroare la resetarea parolei" },
      { status: 500 }
    );
  }
}
