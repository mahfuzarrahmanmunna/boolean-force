// app/api/workers/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodbAdapter";

export async function GET(request) {
    try {
        // Connect to database
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Get all workers (users with role "worker")
        const workers = await db.collection("users")
            .find({ role: "worker" })
            .project({ password: 0 }) // Exclude password from response
            .toArray();

        // Return success response
        return NextResponse.json(workers);
    } catch (error) {
        console.error("Error fetching workers:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const workerData = await request.json();
        
        // Validate required fields
        if (!workerData.name || !workerData.email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }
        
        const workersCollection = await dbConnect('users');
        
        // Check if worker with this email already exists
        const existingWorker = await workersCollection.findOne({ email: workerData.email });
        if (existingWorker) {
            return NextResponse.json(
                { error: 'Worker with this email already exists' },
                { status: 409 }
            );
        }
        
        // Add default status and timestamps
        const newWorker = {
            ...workerData,
            role: "worker",
            status: workerData.status || 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            assignedWork: []
        };
        
        const result = await workersCollection.insertOne(newWorker);
        newWorker._id = result.insertedId;
        
        return NextResponse.json(
            { data: newWorker },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating worker:', error);
        return NextResponse.json(
            { error: 'Failed to create worker' },
            { status: 500 }
        );
    }
}