// app/api/work/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch a specific work task by ID
export async function GET(request, { params }) {
    // Awaiting the params promise to get the id
    const { id } = await params;
    console.log(`GET /api/work/${id} called`);
    console.log('ID type:', typeof id);
    console.log('ID value:', id);

    try {
        // Validate the ID format
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId format: ${id}`);
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Get the collection
        const collection = await dbConnect('work');

        // Find the task
        const task = await collection.findOne({ _id: new ObjectId(id) });

        if (!task) {
            console.error(`Task not found with ID: ${id}`);
            return NextResponse.json(
                { success: false, error: "Work task not found." },
                { status: 404 }
            );
        }

        // Serialize the task
        const serializedTask = {
            ...task,
            _id: task._id.toString(),
            // Ensure assignedTo is always an array of strings
            assignedTo: Array.isArray(task.assignedTo) 
                ? task.assignedTo.map(id => id.toString())
                : task.assignedTo 
                    ? [task.assignedTo.toString()] 
                    : [],
        };

        return NextResponse.json({
            success: true,
            data: serializedTask
        });
    }
    catch (err) {
        console.error(`Error in GET /api/work/${id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// PUT - Update a work task
export async function PUT(request, { params }) {
    // Awaiting the params promise to get the id
    const { id } = await params;
    console.log(`PUT /api/work/${id} called`);
    console.log('ID type:', typeof id);
    console.log('ID value:', id);

    try {
        // Validate the ID format
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId format: ${id}`);
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Check if the request is multipart/form-data (for file uploads)
        const contentType = request.headers.get('content-type');
        let taskData;
        let files = [];

        if (contentType && contentType.includes('multipart/form-data')) {
            // Handle file upload
            const formData = await request.formData();
            
            // Extract form fields
            const title = formData.get('title');
            const description = formData.get('description');
            const dueDate = formData.get('dueDate');
            const priority = formData.get('priority') || 'medium';
            const category = formData.get('category') || 'other';
            const estimatedHours = formData.get('estimatedHours');
            const tags = formData.get('tags');
            const directions = formData.get('directions');
            const assignedTeams = formData.get('assignedTeams');
            
            // Parse JSON fields
            const parsedTags = tags ? JSON.parse(tags) : [];
            const parsedAssignedTeams = assignedTeams ? JSON.parse(assignedTeams) : [];
            
            // Handle file uploads
            for (const [key, value] of formData.entries()) {
                if (key === 'files' && value instanceof File) {
                    // In a real implementation, you would upload the file to a storage service
                    // For now, we'll just store the file info
                    const fileName = `${Date.now()}-${value.name}`;
                    
                    // In a real app, you would upload to a service like S3, Cloudinary, etc.
                    // For this example, we'll just store the file info in the database
                    files.push({
                        name: value.name,
                        size: value.size,
                        type: value.type,
                        // In a real implementation, you would store the URL here
                        url: `/uploads/${fileName}`
                    });
                }
            }
            
            // Create task data object
            taskData = {
                title,
                description,
                dueDate,
                priority,
                category,
                estimatedHours,
                tags: parsedTags,
                directions,
                files,
                assignedTo: parsedAssignedTeams
            };
        } else {
            // Handle regular JSON request (no files)
            taskData = await request.json();
            
            // Parse tags if provided as a string
            if (taskData.tags && typeof taskData.tags === 'string') {
                taskData.tags = taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        // Get the collection
        const collection = await dbConnect('work');

        // First, check if the task exists
        const existingTask = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingTask) {
            console.error(`Task not found with ID: ${id}`);
            return NextResponse.json(
                { success: false, error: "Work task not found." },
                { status: 404 }
            );
        }

        console.log('Existing task found:', existingTask);

        // Update the task
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
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
            console.error(`Failed to update task with ID: ${id}`);
            return NextResponse.json(
                { success: false, error: "Failed to update work task." },
                { status: 500 }
            );
        }

        // Find and return the updated task
        const updatedTask = await collection.findOne({ _id: new ObjectId(id) });
        console.log('Updated task:', updatedTask);

        // Serialize the task
        const serializedTask = {
            ...updatedTask,
            _id: updatedTask._id.toString(),
            // Ensure assignedTo is always an array of strings
            assignedTo: Array.isArray(updatedTask.assignedTo) 
                ? updatedTask.assignedTo.map(id => id.toString())
                : updatedTask.assignedTo 
                    ? [updatedTask.assignedTo.toString()] 
                    : [],
        };

        return NextResponse.json({
            success: true,
            data: serializedTask
        });
    }
    catch (err) {
        console.error(`Error in PUT /api/work/${id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while updating work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// DELETE - Delete a work task
export async function DELETE(request, { params }) {
    // Awaiting the params promise to get the id
    const { id } = await params;
    console.log(`DELETE /api/work/${id} called`);
    console.log('ID type:', typeof id);
    console.log('ID value:', id);

    try {
        // Validate the ID format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Get the collection
        const collection = await dbConnect('work');

        // Delete the task
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

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
        console.error(`Error in DELETE /api/work/${id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while deleting work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}