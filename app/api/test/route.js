import { dbConnect } from "../../../lib/db";

async function GET() {
  try {
    await dbConnect();
    Response.status(200).json({ message: "Connected to MongoDB!" });
  } catch (err) {
    Response.status(500).json({ mes: "Not Connected", error: err.message });
  }
}

export async function GET() {
  return Response.json({ message: "Hello from Test API Route..." });
}
