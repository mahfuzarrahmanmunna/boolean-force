// app/api/work/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch all work tasks
export async function GET(request) {
    console.log("GET /api/work called");
    try {
        const collection = await dbConnect('work');

        if (!collection) {
            throw new Error("Failed to connect to work collection");
        }

        const { searchParams } = new URL(request.url);
        const assigned = searchParams.get('assigned');

        let query = {};

        // Filter by assignment status
        if (assigned === 'false') {
            query.assignedTo = { $exists: false };
        } else if (assigned === 'true') {
            query.assignedTo = { $exists: true };
        }

        console.log("Query:", JSON.stringify(query));

        const data = await collection.find(query).toArray();

        if (!data) {
            console.log("No data found");
            return NextResponse.json([]);
        }

        // Serialize the data
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
            };
        }).filter(Boolean); // Filter out null values

        console.log("Fetched work:", serializedData);
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

// POST - Create a new work task
export async function POST(request) {
    console.log("POST /api/work called");
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
                createdAt: createdAt || new Date(),
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

        console.log('Task data received:', taskData);

        // Create a new task document with assignedTo as an empty array if not provided
        const newTask = {
            ...taskData,
            assignedTo: taskData.assignedTo || [], // Initialize as empty array if not provided
            createdAt: new Date(),
            updatedAt: new Date(),
            progress: 0
        };

        const result = await collection.insertOne(newTask);

        if (!result.acknowledged) {
            throw new Error("Failed to create work task");
        }

        // Return the created task with string ID and assignedTo as array
        const createdTask = {
            ...newTask,
            _id: result.insertedId.toString(),
            assignedTo: newTask.assignedTo || [] // Ensure assignedTo is an array in the response
        };

        console.log('Task created:', createdTask);

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