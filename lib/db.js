"use server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
}
