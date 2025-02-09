import { connectToDatabase } from "@/app/api/connect-database";
import User from "@/app/api/users/users-model";
import bcrypt from "bcryptjs";


export async function POST(req) {
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
