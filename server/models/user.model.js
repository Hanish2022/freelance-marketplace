// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String, required: true },
  skills: [{ type: String }], // Array of selected skills
  portfolio: [{ type: String }], // URLs to portfolio samples (Cloudinary links)
  isVerified: { type: Boolean, default: false },
  otp: { type: String }, // OTP for email verification
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
