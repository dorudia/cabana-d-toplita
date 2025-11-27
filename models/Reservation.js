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
    isAdmin: { type: Boolean, default: false },
    // 🔹 doar dacă NU e admin => devine obligatoriu (Stripe/session)
    sessionId: {
      type: String,
      required: function () {
        return !this.isAdmin;
      },
      unique: true,
    },
    observatii: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
