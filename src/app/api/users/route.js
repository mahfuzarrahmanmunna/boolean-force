// app/api/users/route.js
import { dbConnect } from "@/lib/dbConnect"; // Adjust the path if needed
import { NextResponse } from "next/server";

// GET - Fetch all users
export async function GET(request) {
    console.log("GET /api/users called");
    try {
        // Connect to the 'users' collection
        const collection = await dbConnect('users');

        // Find all users, but EXCLUDE the password field for security
        const data = await collection.find({}, { projection: { password: 0 } }).toArray();

        // Convert MongoDB ObjectId to string for JSON serialization
        const serializedData = data.map(item => ({
            ...item,
            _id: item._id.toString()
        }));

        console.log("Fetched users:", serializedData);
        return NextResponse.json(serializedData);
    }
    catch (err) {
        console.error("Error in GET /api/users:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Something went wrong while fetching users. Please try again later.",
                details: err.message
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}