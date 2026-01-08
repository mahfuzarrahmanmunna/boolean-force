// app/api/projects/route.js
import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET - Fetch all work tasks
export async function GET(request) {
    try {
        const collection = await dbConnect('work');
        if (!collection) {
            throw new Error("Failed to connect to work collection");
        }

        const { searchParams } = new URL(request.url);
        const assigned = searchParams.get('assigned');
        const clientId = searchParams.get('clientId');
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const category = searchParams.get('category');

        let query = {};
        
        // Filter by assignment status
        if (assigned === 'false') {
            query.assignedTo = { $exists: false };
        } else if (assigned === 'true') {
            query.assignedTo = { $exists: true };
        }
        
        // Filter by client/project
        if (clientId) {
            query.clientId = clientId;
        }
        
        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // Filter by priority
        if (priority && priority !== 'all') {
            query.priority = priority;
        }
        
        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        const data = await collection.find(query).toArray();

        // Serialize data with null checks
        const serializedData = data.map(item => {
            if (!item || !item._id) {
                console.log("Invalid item:", item);
                return null;
            }

            return {
                ...item,
                _id: item._id.toString(),
                // Ensure assignedTo is always an array of strings
                assignedTo: Array.isArray(item.assignedTo) 
                    ? item.assignedTo.map(id => id.toString())
                    : item.assignedTo 
                        ? [item.assignedTo.toString()] 
                        : [],
                // Ensure title and description are never null
                title: item.title || "Untitled",
                description: item.description || "No description"
            };
        }).filter(Boolean); // Filter out null values

        return NextResponse.json(serializedData);
    } catch (err) {
        console.error("Error in GET /api/work:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching work. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// GET by ID - Fetch a single work task
export async function GET_BY_ID(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid work ID' },
                { status: 400 }
            );
        }
        
        const collection = await dbConnect('work');
        const workItem = await collection.findOne({ _id: new ObjectId(id) });
        
        if (!workItem) {
            return NextResponse.json(
                { error: 'Work item not found' },
                { status: 404 }
            );
        }
        
        // Serialize data with null checks
        const serializedItem = {
            ...workItem,
            _id: workItem._id.toString(),
            // Ensure assignedTo is always an array of strings
            assignedTo: Array.isArray(workItem.assignedTo) 
                ? workItem.assignedTo.map(id => id.toString())
                : workItem.assignedTo 
                    ? [workItem.assignedTo.toString()] 
                    : [],
            // Ensure title and description are never null
            title: workItem.title || "Untitled",
            description: workItem.description || "No description"
        };
        
        return NextResponse.json(serializedItem);
    } catch (err) {
        console.error("Error in GET /api/projects/[id]:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching work item. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// POST - Create a new work task
export async function POST(request) {
    try {
        const collection = await dbConnect('work');
        
        if (!collection) {
            throw new Error("Failed to connect to work collection");
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
            const createdAt = formData.get('createdAt');
            const assignedTo = formData.get('assignedTo');
            const clientId = formData.get('clientId');
            
            // Parse JSON fields
            const parsedTags = tags ? JSON.parse(tags) : [];
            const parsedAssignedTo = assignedTo ? JSON.parse(assignedTo) : [];
            
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
                createdAt: createdAt || new Date(),
                files,
                assignedTo: parsedAssignedTo,
                clientId: clientId
            };
        } else {
            // Handle regular JSON request (no files)
            taskData = await request.json();
            
            // Parse tags if provided as a string
            if (taskData.tags && typeof taskData.tags === 'string') {
                taskData.tags = taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            
            // Parse assignedTo if provided as a string
            if (taskData.assignedTo && typeof taskData.assignedTo === 'string') {
                taskData.assignedTo = taskData.assignedTo.split(',').map(id => id.trim()).filter(id => id);
            }
        }
        
        // Create a new task document
        const newTask = {
            ...taskData,
            // Ensure these fields are never null
            title: taskData.title || "Untitled",
            description: taskData.description || "No description",
            assignedTo: taskData.assignedTo || [], // Initialize as empty array if not provided
            createdAt: new Date(),
            updatedAt: new Date(),
            progress: 0
        };
        
        const result = await collection.insertOne(newTask);
        
        if (!result.acknowledged) {
            throw new Error("Failed to create work task");
        }
        
        // Return the created task with string ID
        const createdTask = {
            ...newTask,
            _id: result.insertedId.toString()
        };
        
        return NextResponse.json({
            success: true,
            data: createdTask
        }, { status: 201 });
    } catch (err) {
        console.error("Error in POST /api/work:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while creating work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// PUT - Update a work task
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid work ID' },
                { status: 400 }
            );
        }
        
        const collection = await dbConnect('work');
        
        if (!collection) {
            throw new Error("Failed to connect to work collection");
        }
        
        const updateData = await request.json();
        
        // Update the task
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );
        
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Work item not found' },
                { status: 404 }
            );
        }
        
        // Get the updated task
        const updatedTask = await collection.findOne({ _id: new ObjectId(id) });
        
        // Serialize data with null checks
        const serializedTask = {
            ...updatedTask,
            _id: updatedTask._id.toString(),
            // Ensure assignedTo is always an array of strings
            assignedTo: Array.isArray(updatedTask.assignedTo) 
                ? updatedTask.assignedTo.map(id => id.toString())
                : updatedTask.assignedTo 
                    ? [updatedTask.assignedTo.toString()] 
                    : [],
            // Ensure title and description are never null
            title: updatedTask.title || "Untitled",
            description: updatedTask.description || "No description"
        };
        
        return NextResponse.json({
            success: true,
            data: serializedTask
        });
    } catch (err) {
        console.error("Error in PUT /api/projects/[id]:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while updating work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// DELETE - Delete a work task
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid work ID' },
                { status: 400 }
            );
        }
        
        const collection = await dbConnect('work');
        
        if (!collection) {
            throw new Error("Failed to connect to work collection");
        }
        
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Work item not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: 'Work item deleted successfully'
        });
    } catch (err) {
        console.error("Error in DELETE /api/projects/[id]:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while deleting work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}