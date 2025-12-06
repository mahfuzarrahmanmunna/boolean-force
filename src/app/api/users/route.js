// src/app/api/users/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

// GET - Fetch all users
export async function GET(request) {
    console.log("GET /api/users called");
    try {
        // Connect to 'users' collection
        const collection = await dbConnect('users');

        // Find all users, but EXCLUDE password field for security
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

// PUT - Update user profile
export async function PUT(request) {
    console.log("PUT /api/users called");
    try {
        const session = await getServerSession();

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await request.json();
        console.log("Update data:", data);

        // Connect to 'users' collection
        const collection = await dbConnect('users');

        // Update user profile by email
        const result = await collection.updateOne(
            { email: session.user.email },
            { $set: { ...data, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Profile updated successfully" },
            { status: 200 }
        );
    }
    catch (err) {
        console.error("Error in PUT /api/users:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Something went wrong while updating profile. Please try again later.",
                details: err.message
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}