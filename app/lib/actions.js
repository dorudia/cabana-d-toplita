"use server";

import { redirect } from "next/dist/server/api-utils";
import { Resend } from "resend";
import supabase from "../../lib/supabase";
import { signIn, signOut } from "./auth";
import Welcome from "../emails/Welcome";
import { auth } from "../../app/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (request) => {
  console.log("request", request);

  await resend.emails.send({
    from: "OreDev <onboarding@resend.dev>",
    to: "dorudia@gmail.com",
    subject: "Hello world",
    react: Welcome({
      name: request.name,
      email: request.email,
      password: request.password || "",
    }),
  });
};

export async function signInWithGoogle() {
  await signIn("google");

  // Așteaptă să se obțină sesiunea utilizatorului după autentificare
  const session = await auth();

  if (session?.user) {
    await sendEmail(session.user.name, session.user.email);
  } else {
    console.log("No user session found after sign-in.");
  }
}

export async function signInWithFacebook() {
  await signIn("facebook");
}

export async function signInWithCredentials(name, email, password) {
  console.log("signInWithCredentials:?:?:?", name, email, password);
  await signIn("credentials", {
    name,
    email,
    password,
  });
}

export async function signOutAction() {
  await signOut();
  redirect("/");
}

// Check if user exists
export async function findUserInDB(formData, checkPasswordMatch) {
  const enteredEmail = formData?.get("email");
  const enteredPassword = formData?.get("password");
  console.log("userEmail:::::", enteredEmail);

  let { data: users, error } = await supabase
    .from("users")
    .select("*")

    // Filters
    .eq("email", enteredEmail);

  if (error) {
    console.log("error", error);
  }
  if (users && users.length > 0 && checkPasswordMatch) {
    const user = users[0];
    if (user.password === enteredPassword) {
      console.log("user???", user);
      return user;
    } else {
      throw new Error("Wrong password");
    }
  }
  if (users && users.length > 0 && !checkPasswordMatch) {
    return users[0];
  }
  if (users && users.length === 0 && checkPasswordMatch) {
    throw new Error("User not found, please sign up");
  }
}

export async function addNewUserToDB(name, email, password = "") {
  const { data, error } = await supabase
    .from("users")
    .insert([{ name: name, email: email, password: password }])
    .select();

  if (error) {
    console.log("error", error);
  }
}

export const searchUserInDBAndSendEmail = async (session) => {
  let { data: users, error } = await supabase
    .from("users")
    .select("*")
    // Filters
    .eq("email", session?.user?.email);

  if (error) {
    console.log("error", error);
  }

  if (!session?.user || !session?.user?.email) {
    return;
  }

  if (users && users.length > 0) {
    const user = users[0];

    console.log("user in db", user);
    return;
  }
  if (!users || users.length === 0) {
    console.log("user not in db", session?.user, "session:", session);

    await addNewUserToDB(session?.user?.name, session?.user?.email);
    await sendEmail({
      name: session?.user?.name,
      email: session?.user?.email,
    });
  }
};

export const getUserReservations = async (email) => {
  console.log("email", email);
  let { data: userReservations, error } = await supabase
    .from("users")
    .select(`*, rezervari(*)`)
    .eq("email", email);

  if (error) {
    console.log("error", error);
  }

  return userReservations;
};

export const getReservations = async () => {
  console.log("getAllReservations");
  let { data: rezervari, error } = await supabase.from("rezervari").select("*");

  if (error) {
    console.log("error:", error);
  }
  return rezervari;
};

// console.log("getReservations::", getReservations());
