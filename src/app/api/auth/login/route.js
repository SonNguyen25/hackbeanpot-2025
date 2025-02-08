import { connectToDatabase } from "@/app/api/connect-database";
import User from "@/app/api/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
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
