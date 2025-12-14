import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
    try {
        // Unwrap the params promise
        const { id } = await params;

        console.log(`Assigning work to worker: ${id}`);

        // 1. Validate the worker ID from the URL
        if (!ObjectId.isValid(id)) {
            console.error('Invalid worker ID format');
            return NextResponse.json(
                { success: false, error: "Invalid worker ID format." },
                { status: 400 }
            );
        }

        const { taskIds } = await request.json();
        console.log('Task IDs to assign:', taskIds);

        // 2. Validate the incoming payload
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            console.error('Invalid task IDs payload');
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
            console.error('Task ID validation error:', e.message);
            return NextResponse.json(
                { success: false, error: e.message },
                { status: 400 }
            );
        }

        const workersCollection = await dbConnect('users');
        const workCollection = await dbConnect('work');

        // Check if the worker exists before proceeding
        const workerExists = await workersCollection.findOne({ _id: new ObjectId(id) });
        if (!workerExists) {
            console.error('Worker not found');
            return NextResponse.json(
                { success: false, error: "Worker not found." },
                { status: 404 }
            );
        }

        // Check if all tasks exist and are not already assigned
        const existingTasks = await workCollection.find({ _id: { $in: objectTaskIds } }).toArray();
        if (existingTasks.length !== objectTaskIds.length) {
            console.error('Some tasks not found');
            return NextResponse.json(
                { success: false, error: "One or more tasks not found." },
                { status: 404 }
            );
        }

        // Check if any tasks are already assigned
        const alreadyAssignedTasks = existingTasks.filter(task => task.assignedTo);
        if (alreadyAssignedTasks.length > 0) {
            const taskTitles = alreadyAssignedTasks.map(task => task.title).join(', ');
            console.error('Tasks already assigned:', taskTitles);
            return NextResponse.json(
                { success: false, error: `The following tasks are already assigned: ${taskTitles}` },
                { status: 400 }
            );
        }

        // Perform the database operations
        const updateResult = await workCollection.updateMany(
            { _id: { $in: objectTaskIds } },
            {
                $set: {
                    assignedTo: new ObjectId(id),
                    status: 'in-progress',
                    assignedAt: new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            console.error('No tasks were updated');
            return NextResponse.json(
                { success: false, error: "No tasks were updated. They might have been modified by another process." },
                { status: 400 }
            );
        }

        await workersCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $push: { assignedWork: { $each: objectTaskIds } },
                $set: { status: 'active' }
            }
        );

        const assignedTasks = await workCollection.find({ _id: { $in: objectTaskIds } }).toArray();
        const serializedTasks = assignedTasks.map(task => ({
            ...task,
            _id: task._id.toString(),
            assignedTo: task.assignedTo ? task.assignedTo.toString() : null
        }));

        console.log('Tasks assigned successfully');
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