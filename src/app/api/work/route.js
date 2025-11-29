// app/api/work/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// GET - Fetch all available (unassigned) work tasks
export async function GET(request) {
    console.log("GET /api/work called");
    try {
        const collection = await dbConnect('work');
        // Find tasks that are not yet assigned to anyone
        const data = await collection.find({ assignedTo: { $exists: false } }).toArray();

        const serializedData = data.map(item => ({
            ...item,
            _id: item._id.toString()
        }));

        console.log("Fetched available work:", serializedData);
        return NextResponse.json(serializedData);
    }
    catch (err) {
        console.error("Error in GET /api/work:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Something went wrong while fetching work. Please try again later.",
                details: err.message
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

// POST - Add a new work task
export async function POST(request) {
    console.log("POST /api/work called");
    try {
        const postData = await request.json();
        const collection = await dbConnect('work');

        const newWork = {
            ...postData,
            status: 'pending', // New tasks are pending by default
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newWork);

        const insertedDocument = await collection.findOne({ _id: result.insertedId });
        const serializedDocument = {
            ...insertedDocument,
            _id: insertedDocument._id.toString()
        };

        return NextResponse.json({
            success: true,
            message: "Work task added successfully!",
            data: serializedDocument
        }, { status: 201 });
    }
    catch (err) {
        console.error("Error in POST /api/work:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Something went wrong while adding the task. Please try again later.",
                details: err.message
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}