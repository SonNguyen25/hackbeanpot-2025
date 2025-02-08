import { connectToDatabase } from "@/app/api/connect-database";
import User from "@/app/api/models/User";
import bcrypt from "bcryptjs";

const signUp = async (req, res) => {
  try {
    await connectToDatabase(); // Ensure MongoDB connection

    const { name, email, password, location, interests } = await req.json(); // Extract location properly

    if (!name || !email || !password || !location) {
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

const logIn = async (req, res) => {
  try {
    await connectToDatabase(); // Ensure MongoDB connection

    const { email, password } = await req.json(); // Get data from request

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const findUser = async (req, res) => {
  try {
    const userId = req.query.userId || req.params.userId; 
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error("Find user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { findUser, signUp, logIn };
