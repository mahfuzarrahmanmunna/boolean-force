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
        const code = error?.code ?? error?.cause?.code;
        const msg = error?.message ?? "";
        if (!msg.includes("ECONNREFUSED") && !msg.includes("querySrv")) {
            console.error("Error fetching clients:", error);
        }
        const isConnectionError =
            code === "ECONNREFUSED" ||
            code === "ENOTFOUND" ||
            msg.includes("ECONNREFUSED") ||
            msg.includes("querySrv");
        const message = isConnectionError
            ? "Database unavailable. Check your connection and try again."
            : "Failed to load clients.";
        const status = isConnectionError ? 503 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}