"use server"; // dacă folosești server actions

import Reservation from "../models/Reservation";
import Setting from "@/models/Setting";
import User from "@/models/User";
import { dbConnect } from "../lib/db";

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

export const addObservatii = async (id, text) => {
  await Reservation.findByIdAndUpdate(id, { observatii: text });
  return "Observatii adaugate cu succes";
};

export const deleteReservation = async (id) => {
  await dbConnect();
  try {
    await Reservation.findByIdAndDelete(id);
    return "Rezervarea stearsa cu succes";
  } catch (error) {
    return "Delete Reservation Error, Something went wrong!";
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
