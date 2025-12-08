// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodbAdapter";

export async function POST(request) {
    try {
        const { name, email, password, role } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Connect to database
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const users = db.collection("users");

        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Determine user status based on role
        const userStatus = role === "client" ? "active" : "pending"; // Clients are active by default, workers need approval

        // Create new user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: role || "worker", // Default role is worker
            status: userStatus,
            provider: "credentials",
            createdAt: new Date(),
        };

        // Insert user into database
        const result = await users.insertOne(newUser);

        // Create notification for admin only for worker registrations
        if (role !== "client") {
            await db.collection("notifications").insertOne({
                type: "new_user_registration",
                title: "New Worker Registration",
                message: `${name} has registered as a worker and is waiting for approval.`,
                userId: result.insertedId.toString(),
                read: false,
                createdAt: new Date(),
            });
        }

        // Return success response
        const message = role === "client"
            ? "Client account created successfully! You can now log in."
            : "Registration successful! Your account is pending approval by the admin.";

        return NextResponse.json(
            {
                message,
                userId: result.insertedId.toString(),
                status: userStatus
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