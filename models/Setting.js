import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
  minNights: { type: Number, default: 2 },
  pretNoapte: { type: Number, default: 900 },
});

// Fallback global pentru mongoose.models
if (!mongoose.models) mongoose.models = {};

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);
