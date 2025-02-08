import { connectToDatabase } from "@/app/api/connect-database";
import User from "@/app/api/models/User";
import bcrypt from "bcryptjs";

const signUp = async (req, res)  => {
  try {
    await connectToDatabase(); // Ensure MongoDB connection

    const { name, email, password, interests } = await req.json(); // Get user data

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      interests,
      reward: 0, 
    });

    await newUser.save();

    res.status(201).json({ user });

  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


const logIn = async (req, res) => {
  try {
    await connectToDatabase(); // Ensure MongoDB connection

    const { email, password } = await req.json(); // Get data from request

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Login successful", user }), { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


const findUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (user) {
    res.status(201).json({ user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};


module.exports = { findUser, signUp, logIn };