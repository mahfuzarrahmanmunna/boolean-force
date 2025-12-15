// src/app/api/user/upload-profile-image/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request) {
    try {
        const session = await getServerSession();

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await request.formData();
        const file = data.get("profileImage");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const filename = `${session.user.email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${file.name.split('.').pop()}`;

        // Create directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Directory already exists
        }

        // Write file to disk
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Update user profile with new image URL
        const collection = await dbConnect('users');

        await collection.updateOne(
            { email: session.user.email },
            {
                $set: {
                    profileImage: `/uploads/profiles/${filename}`,
                    updatedAt: new Date()
                }
            }
        );

        return NextResponse.json(
            { imageUrl: `/uploads/profiles/${filename}` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}