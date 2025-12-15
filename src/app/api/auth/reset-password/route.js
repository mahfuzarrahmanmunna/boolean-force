// app/api/auth/reset-password/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodbAdapter";

export async function POST(request) {
    try {
        const { token, password } = await request.json();

        // Validate input
        if (!token || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Connect to database
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Find the reset token
        const resetToken = await db.collection("passwordResets").findOne({
            token,
            expiresAt: { $gt: new Date() }
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Find the user
        const user = await db.collection("users").findOne({ email: resetToken.email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password
        await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
        );

        // Delete the reset token
        await db.collection("passwordResets").deleteOne({ token });

        // Create notification for user
        await db.collection("notifications").insertOne({
            type: "password_changed",
            title: "Password Changed",
            message: "Your password has been successfully changed.",
            userId: user._id.toString(),
            read: false,
            createdAt: new Date(),
        });

        // Return success response
        return NextResponse.json(
            { message: "Password reset successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}