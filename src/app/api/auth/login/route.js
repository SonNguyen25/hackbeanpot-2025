import { connectToDatabase } from "@/app/api/connect-database";
import User from "@/app/api/users/users-model";
import bcrypt from "bcryptjs";

export async function POST(req) {
    console.log("🔥 Login API hit: /api/auth/login");

    try {
        await connectToDatabase();
        const { email, password } = await req.json();

        console.log("📜 Received login request for:", email);

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.warn("❌ User not found:", email);
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn("❌ Invalid credentials for:", email);
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        console.log("✅ Login successful for:", email);
        return new Response(JSON.stringify({ message: "Login successful", user }), { status: 200 });

    } catch (error) {
        console.error("🚨 Login error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
