// app/api/work/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch a specific work task by ID
export async function GET(request, { params }) {
    console.log(`GET /api/work/${params.id} called`);
    try {
        // Validate the ID format
        if (!ObjectId.isValid(params.id)) {
            console.error(`Invalid ObjectId format: ${params.id}`);
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Get the collection
        const collection = await dbConnect('work');

        // Find the task
        const task = await collection.findOne({ _id: new ObjectId(params.id) });

        if (!task) {
            console.error(`Task not found with ID: ${params.id}`);
            return NextResponse.json(
                { success: false, error: "Work task not found." },
                { status: 404 }
            );
        }

        // Serialize the task
        const serializedTask = {
            ...task,
            _id: task._id.toString()
        };

        return NextResponse.json({
            success: true,
            data: serializedTask
        });
    }
    catch (err) {
        console.error(`Error in GET /api/work/${params.id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// PUT - Update a work task
export async function PUT(request, { params }) {
    console.log(`PUT /api/work/${params.id} called`);
    try {
        // Validate the ID format
        if (!ObjectId.isValid(params.id)) {
            console.error(`Invalid ObjectId format: ${params.id}`);
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Get the task data from the request body
        const taskData = await request.json();
        console.log('Task data received for update:', taskData);

        // Parse tags if provided as a string
        if (taskData.tags && typeof taskData.tags === 'string') {
            taskData.tags = taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        // Get the collection
        const collection = await dbConnect('work');

        // First, check if the task exists
        const existingTask = await collection.findOne({ _id: new ObjectId(params.id) });
        if (!existingTask) {
            console.error(`Task not found with ID: ${params.id}`);
            return NextResponse.json(
                { success: false, error: "Work task not found." },
                { status: 404 }
            );
        }

        console.log('Existing task found:', existingTask);

        // Update the task
        const result = await collection.updateOne(
            { _id: new ObjectId(params.id) },
            {
                $set: {
                    ...taskData,
                    updatedAt: new Date()
                }
            }
        );

        console.log('Update result:', result);

        // Check if the update was successful
        if (result.matchedCount === 0) {
            console.error(`Failed to update task with ID: ${params.id}`);
            return NextResponse.json(
                { success: false, error: "Failed to update work task." },
                { status: 500 }
            );
        }

        // Find and return the updated task
        const updatedTask = await collection.findOne({ _id: new ObjectId(params.id) });
        console.log('Updated task:', updatedTask);

        // Serialize the task
        const serializedTask = {
            ...updatedTask,
            _id: updatedTask._id.toString()
        };

        return NextResponse.json({
            success: true,
            data: serializedTask
        });
    }
    catch (err) {
        console.error(`Error in PUT /api/work/${params.id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while updating work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// DELETE - Delete a work task
export async function DELETE(request, { params }) {
    console.log(`DELETE /api/work/${params.id} called`);
    try {
        // Validate the ID format
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Get the collection
        const collection = await dbConnect('work');

        // Delete the task
        const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Work task not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Work task deleted successfully."
        });
    }
    catch (err) {
        console.error(`Error in DELETE /api/work/${params.id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while deleting work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}