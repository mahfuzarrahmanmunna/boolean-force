// app/api/workers/[id]/assign/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// POST - Assign work tasks to a specific worker
export async function POST(request, { params }) {
    console.log(`POST /api/workers/${params.id}/assign called`);
    try {
        const { taskIds } = await request.json();
        const workersCollection = await dbConnect('users');
        const workCollection = await dbConnect('work');

        // Convert string IDs from the frontend into MongoDB ObjectIds
        const objectTaskIds = taskIds.map(id => new ObjectId(id));

        // 1. Update the work tasks to mark them as assigned
        await workCollection.updateMany(
            { _id: { $in: objectTaskIds } },
            {
                $set: {
                    assignedTo: new ObjectId(params.id),
                    status: 'in-progress',
                    assignedAt: new Date()
                }
            }
        );

        // 2. Add the new task IDs to the worker's document
        await workersCollection.updateOne(
            { _id: new ObjectId(params.id) },
            {
                $push: { assignedWork: { $each: objectTaskIds } },
                $set: { status: 'active' } // Optional: Update worker status when work is assigned
            }
        );

        // 3. Fetch the newly assigned tasks to return them
        const assignedTasks = await workCollection.find({ _id: { $in: objectTaskIds } }).toArray();
        const serializedTasks = assignedTasks.map(task => ({ ...task, _id: task._id.toString() }));

        return NextResponse.json({
            success: true,
            message: "Work assigned successfully!",
            data: { assignedTasks: serializedTasks }
        });
    }
    catch (err) {
        console.error(`Error in POST /api/workers/${params.id}/assign:`, err);
        return NextResponse.json(
            { success: false, error: "Failed to assign work." },
            { status: 500 }
        );
    }
}