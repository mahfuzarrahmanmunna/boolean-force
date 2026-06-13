// src/app/api/tasks/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch a specific task
export async function GET(request, { params }) {
    //console.log(`GET /api/tasks/${params.id} called`);
    try {
        // Validate the ID format
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, error: "Invalid task ID format." },
                { status: 400 }
            );
        }
        
        // Get the collection
        const collection = await dbConnect('tasks');
        
        // Find the task by ID
        const task = await collection.findOne({ _id: new ObjectId(params.id) });
        
        // Check if task exists
        if (!task) {
            return NextResponse.json(
                { success: false, error: "Task not found." },
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
        console.error(`Error in GET /api/tasks/${params.id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// PUT - Update a task
export async function PUT(request, { params }) {
    //console.log(`PUT /api/tasks/${params.id} called`);
    try {
        // Validate the ID format
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, error: "Invalid task ID format." },
                { status: 400 }
            );
        }
        
        // Get the task data from the request body
        const taskData = await request.json();
        
        // Parse tags if provided as a string
        if (taskData.tags && typeof taskData.tags === 'string') {
            taskData.tags = taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // Get the collection
        const collection = await dbConnect('tasks');
        
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
        
        // Check if the update was successful
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Task not found." },
                { status: 404 }
            );
        }
        
        // Find and return the updated task
        const updatedTask = await collection.findOne({ _id: new ObjectId(params.id) });
        
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
        console.error(`Error in PUT /api/tasks/${params.id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while updating task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// DELETE - Delete a task
export async function DELETE(request, { params }) {
    //console.log(`DELETE /api/tasks/${params.id} called`);
    try {
        // Validate the ID format
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, error: "Invalid task ID format." },
                { status: 400 }
            );
        }
        
        // Get the collection
        const collection = await dbConnect('tasks');
        
        // Delete the task
        const result = await collection.deleteOne({ _id: new ObjectId(params.id) });
        
        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Task not found." },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "Task deleted successfully."
        });
    }
    catch (err) {
        console.error(`Error in DELETE /api/tasks/${params.id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while deleting task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}