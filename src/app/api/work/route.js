// // app/api/work/route.js
// import { dbConnect } from "@/lib/dbConnect";
// import { NextResponse } from "next/server";
// import { ObjectId } from "mongodb";

// // GET - Fetch all available (unassigned) work tasks
// export async function GET(request) {
//     console.log("GET /api/work called");
//     try {
//         // Get the collection
//         const collection = await dbConnect('work');

//         // Check if collection is valid
//         if (!collection) {
//             throw new Error("Failed to connect to work collection");
//         }

//         // Get query parameters
//         const { searchParams } = new URL(request.url);
//         const assigned = searchParams.get('assigned'); // 'true', 'false', or 'all'

//         // Build query object
//         let query = {};

//         // Filter by assignment status
//         if (assigned === 'false') {
//             query.assignedTo = { $exists: false };
//         } else if (assigned === 'true') {
//             query.assignedTo = { $exists: true };
//         }

//         console.log("Query:", JSON.stringify(query));

//         // Find tasks based on query
//         const data = await collection.find(query).toArray();

//         // Check if data is valid
//         if (!data) {
//             console.log("No data found");
//             return NextResponse.json([]);
//         }

//         // Serialize the data
//         const serializedData = data.map(item => {
//             // Check if item exists and has _id
//             if (!item || !item._id) {
//                 console.log("Invalid item:", item);
//                 return null;
//             }

//             return {
//                 ...item,
//                 _id: item._id.toString()
//             };
//         }).filter(Boolean); // Filter out null values

//         console.log("Fetched available work:", serializedData);
//         return NextResponse.json(serializedData);
//     }
//     catch (err) {
//         console.error("Error in GET /api/work:", err);
//         return NextResponse.json({
//             success: false,
//             error: "Something went wrong while fetching work. Please try again later.",
//             details: err.message
//         }, { status: 500 });
//     }
// }

// // POST - Create a new work task
// export async function POST(request) {
//     console.log("POST /api/work called");
//     try {
//         // Get the collection
//         const collection = await dbConnect('work');

//         // Check if collection is valid
//         if (!collection) {
//             throw new Error("Failed to connect to work collection");
//         }

//         // Get the task data from the request body
//         const taskData = await request.json();

//         // Parse tags if provided as a string
//         if (taskData.tags && typeof taskData.tags === 'string') {
//             taskData.tags = taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
//         }

//         // Create a new task document
//         const newTask = {
//             ...taskData,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             progress: 0
//         };

//         // Insert the new task into the collection
//         const result = await collection.insertOne(newTask);

//         // Check if the insertion was successful
//         if (!result.acknowledged) {
//             throw new Error("Failed to create work task");
//         }

//         // Return the newly created task
//         return NextResponse.json({
//             success: true,
//             data: {
//                 ...newTask,
//                 _id: result.insertedId.toString()
//             }
//         }, { status: 201 });
//     }
//     catch (err) {
//         console.error("Error in POST /api/work:", err);
//         return NextResponse.json({
//             success: false,
//             error: "Something went wrong while creating work task. Please try again later.",
//             details: err.message
//         }, { status: 500 });
//     }
// }

// // PUT - Update a work task
// export async function PUT(request, { params }) {
//     console.log(`PUT /api/work/${params.id} called`);
//     try {
//         // Validate the ID format
//         if (!ObjectId.isValid(params.id)) {
//             console.error(`Invalid ObjectId format: ${params.id}`);
//             return NextResponse.json(
//                 { success: false, error: "Invalid work task ID format." },
//                 { status: 400 }
//             );
//         }

//         // Get the task data from the request body
//         const taskData = await request.json();
//         console.log('Task data received for update:', taskData);

//         // Parse tags if provided as a string
//         if (taskData.tags && typeof taskData.tags === 'string') {
//             taskData.tags = taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
//         }

//         // Get the collection
//         const collection = await dbConnect('work');

//         // First, check if the task exists
//         const existingTask = await collection.findOne({ _id: new ObjectId(params.id) });
//         if (!existingTask) {
//             console.error(`Task not found with ID: ${params.id}`);
//             return NextResponse.json(
//                 { success: false, error: "Work task not found." },
//                 { status: 404 }
//             );
//         }

//         console.log('Existing task found:', existingTask);

//         // Update the task
//         const result = await collection.updateOne(
//             { _id: new ObjectId(params.id) },
//             {
//                 $set: {
//                     ...taskData,
//                     updatedAt: new Date()
//                 }
//             }
//         );

//         console.log('Update result:', result);

//         // Check if the update was successful
//         if (result.matchedCount === 0) {
//             console.error(`Failed to update task with ID: ${params.id}`);
//             return NextResponse.json(
//                 { success: false, error: "Failed to update work task." },
//                 { status: 500 }
//             );
//         }

//         // Find and return the updated task
//         const updatedTask = await collection.findOne({ _id: new ObjectId(params.id) });
//         console.log('Updated task:', updatedTask);

//         // Serialize the task
//         const serializedTask = {
//             ...updatedTask,
//             _id: updatedTask._id.toString()
//         };

//         return NextResponse.json({
//             success: true,
//             data: serializedTask
//         });
//     }
//     catch (err) {
//         console.error(`Error in PUT /api/work/${params.id}:`, err);
//         return NextResponse.json({
//             success: false,
//             error: "Something went wrong while updating work task. Please try again later.",
//             details: err.message
//         }, { status: 500 });
//     }
// }

// // DELETE - Delete a work task
// export async function DELETE(request, { params }) {
//     console.log(`DELETE /api/work/${params.id} called`);
//     try {
//         // Validate the ID format
//         if (!ObjectId.isValid(params.id)) {
//             return NextResponse.json(
//                 { success: false, error: "Invalid work task ID format." },
//                 { status: 400 }
//             );
//         }

//         // Get the collection
//         const collection = await dbConnect('work');

//         // Delete the task
//         const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

//         // Check if the deletion was successful
//         if (result.deletedCount === 0) {
//             return NextResponse.json(
//                 { success: false, error: "Work task not found." },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json({
//             success: true,
//             message: "Work task deleted successfully."
//         });
//     }
//     catch (err) {
//         console.error(`Error in DELETE /api/work/${params.id}:`, err);
//         return NextResponse.json({
//             success: false,
//             error: "Something went wrong while deleting work task. Please try again later.",
//             details: err.message
//         }, { status: 500 });
//     }
// }

// app/api/work/route.js
// import { dbConnect } from "@/lib/dbConnect";
// import { NextResponse } from "next/server";
// import { ObjectId } from "mongodb";

// // GET - Fetch all work tasks
// export async function GET(request) {
//     console.log("GET /api/work called");
//     try {
//         const collection = await dbConnect('work');

//         if (!collection) {
//             throw new Error("Failed to connect to work collection");
//         }

//         const { searchParams } = new URL(request.url);
//         const assigned = searchParams.get('assigned');

//         let query = {};

//         if (assigned === 'false') {
//             query.assignedTo = { $exists: false };
//         } else if (assigned === 'true') {
//             query.assignedTo = { $exists: true };
//         }

//         console.log("Query:", JSON.stringify(query));

//         const data = await collection.find(query).toArray();

//         if (!data) {
//             console.log("No data found");
//             return NextResponse.json([]);
//         }

//         // Serialize the data
//         const serializedData = data.map(item => {
//             if (!item || !item._id) {
//                 console.log("Invalid item:", item);
//                 return null;
//             }

//             return {
//                 ...item,
//                 _id: item._id.toString(),
//                 // IMPORTANT: Serialize the assignedTo field if it's an ObjectId
//                 assignedTo: item.assignedTo ? item.assignedTo.toString() : null,
//             };
//         }).filter(Boolean);

//         console.log("Fetched available work:", serializedData);
//         return NextResponse.json(serializedData);
//     }
//     catch (err) {
//         console.error("Error in GET /api/work:", err);
//         return NextResponse.json({
//             success: false,
//             error: "Something went wrong while fetching work. Please try again later.",
//             details: err.message
//         }, { status: 500 });
//     }
// }

// // POST - Create a new work task
// export async function POST(request) {
//     console.log("POST /api/work called");
//     try {
//         const collection = await dbConnect('work');

//         if (!collection) {
//             throw new Error("Failed to connect to work collection");
//         }

//         const taskData = await request.json();

//         if (taskData.tags && typeof taskData.tags === 'string') {
//             taskData.tags = taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
//         }

//         const newTask = {
//             ...taskData,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             progress: 0
//         };

//         const result = await collection.insertOne(newTask);

//         if (!result.acknowledged) {
//             throw new Error("Failed to create work task");
//         }

//         return NextResponse.json({
//             success: true,
//             data: {
//                 ...newTask,
//                 _id: result.insertedId.toString(),
//                 // Also serialize the assignedTo field if it exists
//                 assignedTo: newTask.assignedTo ? newTask.assignedTo.toString() : null,
//             }
//         }, { status: 201 });
//     }
//     catch (err) {
//         console.error("Error in POST /api/work:", err);
//         return NextResponse.json({
//             success: false,
//             error: "Something went wrong while creating work task. Please try again later.",
//             details: err.message
//         }, { status: 500 });
//     }
// }

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
                // Also serialize the assignedTo field if it exists
                assignedTo: item.assignedTo ? item.assignedTo.toString() : null,
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

        const taskData = await request.json();
        console.log('Task data received:', taskData);

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

        const result = await collection.insertOne(newTask);

        if (!result.acknowledged) {
            throw new Error("Failed to create work task");
        }

        // Return the created task with string ID
        const createdTask = {
            ...newTask,
            _id: result.insertedId.toString()
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