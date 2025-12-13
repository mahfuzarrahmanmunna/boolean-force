// app/api/workers/[id]/tasks/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    // Await the params object before accessing its properties
    const { id } = await params;

    console.log(`GET /api/workers/${id}/tasks called`);
    try {
        // Validate the worker ID
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId format: ${id}`);
            return NextResponse.json(
                { success: false, error: "Invalid worker ID format." },
                { status: 400 }
            );
        }

        // Get the collection
        const collection = await dbConnect('work');

        // Check if collection is valid
        if (!collection) {
            throw new Error("Failed to connect to work collection");
        }

        // Find all tasks assigned to this worker
        const tasks = await collection.find({ assignedTo: id }).toArray();

        // Serialize the tasks
        const serializedTasks = tasks.map(task => {
            if (!task || !task._id) {
                return null;
            }
            return {
                ...task,
                _id: task._id.toString()
            };
        }).filter(Boolean);

        console.log(`Found ${serializedTasks.length} tasks for worker ${id}`);
        return NextResponse.json(serializedTasks);
    }
    catch (err) {
        console.error(`Error in GET /api/workers/${id}/tasks:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching worker tasks. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}