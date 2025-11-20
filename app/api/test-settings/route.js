import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Setting from "@/models/Setting";

export async function GET() {
  await dbConnect();

  const s = await Setting.findOne();
  return NextResponse.json({ settings: s });
}
