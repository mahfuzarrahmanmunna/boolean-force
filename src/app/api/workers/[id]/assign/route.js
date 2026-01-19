// app/api/workers/[id]/assign/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
    try {
        // Unwrap the params promise
        const { id } = await params;

        console.log(`Assigning work to worker: ${id}`);

        // 1. Validate worker ID from URL
        if (!ObjectId.isValid(id)) {
            console.error('Invalid worker ID format');
            return NextResponse.json(
                { success: false, error: "Invalid worker ID format." },
                { status: 400 }
            );
        }

        const { taskIds } = await request.json();
        console.log('Task IDs to assign:', taskIds);

        // 2. Validate incoming payload
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

        // 4. Check if worker exists before proceeding
        const workerExists = await workersCollection.findOne({ _id: new ObjectId(id) });
        if (!workerExists) {
            console.error('Worker not found');
            return NextResponse.json(
                { success: false, error: "Worker not found." },
                { status: 404 }
            );
        }

        // 5. Check if all tasks exist
        const existingTasks = await workCollection.find({ _id: { $in: objectTaskIds } }).toArray();
        if (existingTasks.length !== objectTaskIds.length) {
            console.error('Some tasks not found');
            return NextResponse.json(
                { success: false, error: "One or more tasks not found." },
                { status: 404 }
            );
        }

        // 6. Check if all tasks belong to the same client
        const uniqueClientIds = [...new Set(existingTasks.map(task => task.clientId))];
        if (uniqueClientIds.length > 1) {
            console.error('Tasks belong to different clients:', uniqueClientIds);
            return NextResponse.json(
                { success: false, error: "All tasks must belong to the same client." },
                { status: 400 }
            );
        }

        // 7. Check if any tasks are already assigned to this specific worker
        const workerCurrentTasks = workerExists.assignedWork || [];
        const alreadyAssignedToThisWorker = objectTaskIds.filter(taskId =>
            workerCurrentTasks.includes(taskId.toString())
        );

        if (alreadyAssignedToThisWorker.length > 0) {
            const taskTitles = alreadyAssignedToThisWorker.map(taskId => {
                const task = existingTasks.find(t => t._id.toString() === taskId);
                return task ? task.title : 'Unknown task';
            }).join(', ');

            return NextResponse.json(
                { success: false, error: `Worker already has these tasks: ${taskTitles}` },
                { status: 400 }
            );
        }

        // 8. Perform database operations
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
                $push: { assignedWork: { $each: objectTaskIds.map(id => id.toString()) } },
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