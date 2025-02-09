import { connectToDatabase } from "@/app/api/connect-database";
import User from "@/app/api/users/users-model";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const { firstname, lastname, email, dob, phone, password, gender, location, interests } = body;

        // Convert dob to a Date object
        const dobDate = new Date(dob);
        if (isNaN(dobDate)) {
            return new Response(JSON.stringify({ error: "Invalid date format" }), { status: 400 });
        }

        if (!firstname || !lastname || !email || !phone || !password || !gender || !location) {
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstname,
            lastname,
            email,
            phone,
            password: hashedPassword,
            gender,
            location,
            dob: dobDate, 
            interests,
            reward: 0,
        });

        console.log("✅ USER CREATED SUCCESSFULLY:", newUser);

        return new Response(JSON.stringify({ user: newUser }), { status: 201 });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), { status: 500 });
    }
}
