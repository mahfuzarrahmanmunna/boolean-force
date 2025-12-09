// app/api/admin/clients/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodbAdapter";

export async function GET(request) {
    try {
        // Connect to database
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Get all clients
        const clients = await db.collection("users")
            .find({ role: "client" })
            .project({ password: 0 }) // Exclude password from the response
            .toArray();

        // Return success response
        return NextResponse.json(clients);
    } catch (error) {
        console.error("Error fetching clients:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}