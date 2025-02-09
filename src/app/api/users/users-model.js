import { N } from "framer-motion/dist/types.d-6pKw1mTI";
import mongoose from "mongoose";
const {
  usersInterests,
  usersLocations,
  usersGenders
} = require("@/app/constants/user-constants");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: usersGenders, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  location: { type: String, enum: usersLocations, required: true },
  interests: [{ type: String, enum: usersInterests }],
  reward: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
