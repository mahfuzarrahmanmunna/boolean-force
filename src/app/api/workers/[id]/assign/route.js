// app/api/workers/[id]/assign/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
    try {
        // 1. Validate the worker ID from the URL
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, error: "Invalid worker ID format." },
                { status: 400 } // Bad Request
            );
        }

        const { taskIds } = await request.json();

        // 2. Validate the incoming payload
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return NextResponse.json(
                { success: false, error: "Task IDs must be a non-empty array." },
                { status: 400 }
            );
        }

        // 3. Validate each task ID format and convert to ObjectId
        let objectTaskIds;
        try {
            objectTaskIds = taskIds.map(id => {
                if (!ObjectId.isValid(id)) {
                    throw new Error(`Invalid task ID format: ${id}`);
                }
                return new ObjectId(id);
            });
        } catch (e) {
            return NextResponse.json(
                { success: false, error: e.message },
                { status: 400 }
            );
        }

        const workersCollection = await dbConnect('users');
        const workCollection = await dbConnect('work');

        // Check if the worker exists before proceeding
        const workerExists = await workersCollection.findOne({ _id: new ObjectId(params.id) });
        if (!workerExists) {
            return NextResponse.json(
                { success: false, error: "Worker not found." },
                { status: 404 }
            );
        }

        // Perform the database operations
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

        await workersCollection.updateOne(
            { _id: new ObjectId(params.id) },
            {
                $push: { assignedWork: { $each: objectTaskIds } },
                $set: { status: 'active' }
            }
        );

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
            { success: false, error: "An internal server error occurred.", details: err.message },
            { status: 500 }
        );
    }
}