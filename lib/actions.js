"use server"; // dacă folosești server actions

import Reservation from "../models/Reservation";
import Setting from "@/models/Setting";
import User from "@/models/User";
import { dbConnect } from "../lib/db";
import bcrypt from "bcrypt";

// --- HELPERS ---
const toPlainObject = (doc) => JSON.parse(JSON.stringify(doc));

// --- REZERVARI ---
export const getReservations = async () => {
  await dbConnect();
  const rezervari = await Reservation.find().sort({ dataSosirii: 1 });
  return toPlainObject(rezervari);
};

export const addNewReservationToDB = async (rezervare) => {
  console.log("🔍rezervare::::", rezervare);
  await dbConnect();
  const newRez = new Reservation(rezervare);
  await newRez.save();
  return "Rezervare adaugata cu succes";
};

export const addObservatii = async (id, text, userName, pretTotal) => {
  await dbConnect();

  const updateData = { observatii: text };

  if (userName !== undefined) {
    updateData.userName = userName;
  }

  if (pretTotal !== undefined) {
    updateData.pretTotal = pretTotal;
  }

  try {
    await Reservation.findByIdAndUpdate(id, updateData, { new: true });
    return { success: true, message: "Observatii adaugate cu succes" };
  } catch (error) {
    console.error("Error updating reservation:", error);
    return { error: error.message };
  }
};

export const deleteReservation = async (id) => {
  await dbConnect();
  try {
    await Reservation.findByIdAndDelete(id);
    return "Rezervarea stearsa cu succes";
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw new Error("Delete Reservation Error: " + error.message);
  }
};

// --- SETTINGS ---
export const getSettings = async () => {
  const settings = await Setting.findOne();
  if (!settings) {
    console.log("❌From actions getSettings -- settings not found");
  }
  console.log("✅From actions getSettings -- settings found:", settings);
  return toPlainObject(settings);
};

export const updateSettings = async (minNights, pretNoapte) => {
  const settings = await Setting.findOne();
  settings.minNights = minNights;
  settings.pretNoapte = pretNoapte;
  await settings.save();
  return toPlainObject(settings);
};

// --- USERS ---
export const getUserReservations = async (email) => {
  const user = await User.findOne({ email }).populate("rezervari");
  if (!user) return [];
  return toPlainObject(user.rezervari);
};

export default async function handler(req, res) {
  try {
    await dbConnect();
    res.status(200).json({ message: "Connected to MongoDB!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function checkUserPassword(email, password) {
  await dbConnect();
  const user = await User.findOne({ email }).lean();
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  // returnăm doar câmpuri plain
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function addNewUserToDB(name, email, password) {
  try {
    await dbConnect(); // adaugă conectarea la DB

    const existing = await User.findOne({ email }).lean();
    if (existing) throw new Error("User already exists");

    // hash la parola
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // returnăm doar câmpuri plain pentru Client Component
    return {
      name: newUser.name,
      email: newUser.email,
      id: newUser._id.toString(),
    };
  } catch (err) {
    throw new Error(err.message || "Could not create user");
  }
}

export async function findUserInDB(email) {
  await dbConnect(); // adaugă conectarea la DB
  try {
    const user = await User.findOne({ email }).lean();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password, // hashed, doar pentru comparare în server
    };
  } catch (err) {
    throw new Error(err.message || "Could not find user");
  }
}
