// src/app/api/tasks/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch all tasks
export async function GET(request) {
    console.log("GET /api/tasks called");
    try {
        // Get the collection
        const collection = await dbConnect('tasks');
        
        // Check if collection is valid
        if (!collection) {
            throw new Error("Failed to connect to tasks collection");
        }
        
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const assignee = searchParams.get('assignee');
        
        // Build query object
        let query = {};
        
        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // Filter by priority
        if (priority && priority !== 'all') {
            query.priority = priority;
        }
        
        // Filter by assignee
        if (assignee) {
            query.assignee = { $regex: assignee, $options: 'i' };
        }
        
        console.log("Query:", JSON.stringify(query));
        
        // Find tasks based on query
        const data = await collection.find(query).toArray();
        
        // Check if data is valid
        if (!data) {
            console.log("No data found");
            return NextResponse.json([]);
        }
        
        // Serialize the data
        const serializedData = data.map(item => {
            // Check if item exists and has _id
            if (!item || !item._id) {
                console.log("Invalid item:", item);
                return null;
            }
            
            return {
                ...item,
                _id: item._id.toString()
            };
        }).filter(Boolean); // Filter out null values
        
        console.log("Fetched tasks:", serializedData);
        return NextResponse.json(serializedData);
    }
    catch (err) {
        console.error("Error in GET /api/tasks:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching tasks. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// POST - Create a new task
export async function POST(request) {
    console.log("POST /api/tasks called");
    try {
        // Get the collection
        const collection = await dbConnect('tasks');
        
        // Check if collection is valid
        if (!collection) {
            throw new Error("Failed to connect to tasks collection");
        }
        
        // Get the task data from the request body
        const taskData = await request.json();
        
        // Parse tags if provided as a string
        if (taskData.tags && typeof taskData.tags === 'string') {
            taskData.tags = taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        
        // Create a new task document
        const newTask = {
            ...taskData,
            createdAt: new Date(),
            updatedAt: new Date(),
            progress: 0
        };
        
        // Insert the new task into the collection
        const result = await collection.insertOne(newTask);
        
        // Check if the insertion was successful
        if (!result.acknowledged) {
            throw new Error("Failed to create task");
        }
        
        // Return the newly created task
        return NextResponse.json({
            success: true,
            data: {
                ...newTask,
                _id: result.insertedId.toString()
            }
        }, { status: 201 });
    }
    catch (err) {
        console.error("Error in POST /api/tasks:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while creating task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}