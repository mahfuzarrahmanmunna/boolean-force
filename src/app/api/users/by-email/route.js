import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required." },
                { status: 400 }
            );
        }

        // Get the collection
        const collection = await dbConnect('users');

        // Find user by email
        const user = await collection.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found." },
                { status: 404 }
            );
        }

        // Serialize the user
        const serializedUser = {
            ...user,
            _id: user._id.toString()
        };

        return NextResponse.json({
            success: true,
            data: serializedUser
        });
    }
    catch (err) {
        console.error("Error in POST /api/users/by-email:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching user. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}