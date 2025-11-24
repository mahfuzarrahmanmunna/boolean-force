import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Connect to database
        const db = await dbConnect();
        const userCollection = db.collection("test_user");

        // Check if user already exists
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: "user",
            provider: "credentials",
            createdAt: new Date(),
        };

        // Insert user into database
        const result = await userCollection.insertOne(newUser);

        // Return success response
        return NextResponse.json(
            {
                message: "User registered successfully",
                userId: result.insertedId.toString()
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}