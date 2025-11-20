import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    dataSosirii: { type: Date, required: true },
    dataPlecarii: { type: Date, required: true },
    innoptari: { type: Number, required: true },
    numOaspeti: { type: Number, required: true },
    pretTotal: { type: Number, required: true },
    observatii: { type: String, default: "" },
  },
  { timestamps: true }
);

// Fallback global pentru mongoose.models
if (!mongoose.models) mongoose.models = {};

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
