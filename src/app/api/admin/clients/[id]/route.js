// app/api/admin/clients/[id]/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodbAdapter";

export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Connect to database
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Find the client
        const clientUser = await db.collection("users")
            .findOne({ _id: new ObjectId(id), role: "client" }, { projection: { password: 0 } });

        if (!clientUser) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json(clientUser);
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, email, status } = await request.json();

        // Validate input
        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        // Connect to database
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Check if the client exists
        const existingClient = await db.collection("users").findOne({ _id: new ObjectId(id), role: "client" });
        if (!existingClient) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        // Check if the email is already in use by another user
        if (email !== existingClient.email) {
            const emailInUse = await db.collection("users").findOne({
                email,
                _id: { $ne: new ObjectId(id) }
            });

            if (emailInUse) {
                return NextResponse.json(
                    { error: "Email is already in use by another user" },
                    { status: 409 }
                );
            }
        }

        // Update the client
        await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name,
                    email,
                    ...(status && { status }) // Only update status if provided
                }
            }
        );

        // Return success response
        return NextResponse.json(
            { message: "Client updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating client:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // Connect to database
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Check if the client exists
        const existingClient = await db.collection("users").findOne({ _id: new ObjectId(id), role: "client" });
        if (!existingClient) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        // Delete the client
        await db.collection("users").deleteOne({ _id: new ObjectId(id) });

        // Return success response
        return NextResponse.json(
            { message: "Client deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting client:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}