import { connectToDatabase } from "@/app/api/connect-database";
import User from "@/app/api/models/User";

export async function GET(req) {
    try {
        await connectToDatabase(); // Ensure MongoDB connection
        
        const users = await User.find({}, "-password"); // Fetch all users excluding passwords for security
        
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
