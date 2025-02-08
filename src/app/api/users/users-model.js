import mongoose from "mongoose";
const {
  usersInterests,
  usersLocations,
} = require("@/app/constants/user-constants");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  location: { type: String, enum: usersLocations, required: true },
  interests: [{ type: String, enum: usersInterests }],
  reward: { type: String, default: 0 },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
