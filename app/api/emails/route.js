"use server";
import { Resend } from "resend";
import Welcome from "../../emails/Welcome";
import { NextResponse } from "next/server";

const resend = new Resend("process.env.RESEND_API_KEY");
// console.log(process.env.RESEND_API_KEY);

// export async function POST(request) {
//   const { email, name } = await request.json();
//   console.log("----------request-----------", email, name);
//   const { data, error } = await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: [email],
//     subject: "Hello world",
//     react: Welcome({ firstName: "John" }),
//   });

//   if (error) {
//     return res.status(400).json(error);
//   }

//   res.status(200).json(data);
// }

export async function POST() {
  // console.log("----------request-----------");
  try {
    const { data, error } = await resend.emails.send({
      from: "OreDev <onboarding@resend.dev>",
      to: "dorudia@gmail.com",
      subject: "Hello world",
      react: Welcome({ name: "John" }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
