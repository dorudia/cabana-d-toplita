// "use server"; // dacă folosești server actions

import Rezervare from "@/models/Reservation";
import Setting from "@/models/Setting";
import User from "@/models/User";

// --- HELPERS ---
const toPlainObject = (doc) => JSON.parse(JSON.stringify(doc));

// --- REZERVARI ---
export const getReservations = async () => {
  const rezervari = await Rezervare.find().sort({ dataSosirii: 1 });
  return toPlainObject(rezervari);
};

export const addNewReservationToDB = async (rezervare) => {
  const newRez = new Rezervare(rezervare);
  await newRez.save();
  return "Rezervare adaugata cu succes";
};

export const addObservatii = async (id, text) => {
  await Rezervare.findByIdAndUpdate(id, { observatii: text });
  return "Observatii adaugate cu succes";
};

export const deleteReservation = async (id) => {
  await Rezervare.findByIdAndDelete(id);
  return "Rezervarea stearsa cu succes";
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
