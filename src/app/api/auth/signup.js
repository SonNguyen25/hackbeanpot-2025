import { connectToDatabase } from "@/app/api/connect-database";
import User from "@/app/api/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectToDatabase(); // Ensure MongoDB connection

    const { name, email, phone, password, location, interests } = await req.json(); // Extract location properly

    if (!name || !email || !phone || !password || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      location,
      interests,
      reward: 0, 
    });

    return res.status(201).json({ user: newUser });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

