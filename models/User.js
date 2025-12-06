import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Poate fi gol dacă folosești OAuth
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Fallback global pentru mongoose.models
if (!mongoose.models) mongoose.models = {};

const modelName = "User";

export default mongoose.models[modelName] ||
  mongoose.model(modelName, UserSchema);
