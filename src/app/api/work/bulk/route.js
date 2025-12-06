// src/app/api/work/bulk/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// POST - Perform bulk actions on work tasks
export async function POST(request) {
    console.log("POST /api/work/bulk called");
    try {
        // Get the action and task IDs from the request body
        const { taskIds, action } = await request.json();
        
        // Validate input
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return NextResponse.json(
                { success: false, error: "Task IDs must be a non-empty array." },
                { status: 400 }
            );
        }
        
        if (!action || typeof action !== 'string') {
            return NextResponse.json(
                { success: false, error: "Action must be a string." },
                { status: 400 }
            );
        }
        
        // Convert string IDs to ObjectIds
        const objectTaskIds = taskIds.map(id => {
            if (!ObjectId.isValid(id)) {
                throw new Error(`Invalid task ID format: ${id}`);
            }
            return new ObjectId(id);
        });
        
        // Get the collection
        const collection = await dbConnect('work');
        
        let updateQuery = {};
        let result;
        
        // Define the update query based on the action
        switch (action) {
            case 'complete':
                updateQuery = {
                    $set: {
                        status: 'completed',
                        progress: 100,
                        updatedAt: new Date()
                    }
                };
                break;
            case 'archive':
                updateQuery = {
                    $set: {
                        status: 'archived',
                        updatedAt: new Date()
                    }
                };
                break;
            case 'delete':
                // For delete action, we use deleteMany instead of updateMany
                result = await collection.deleteMany({ _id: { $in: objectTaskIds } });
                
                if (result.deletedCount === 0) {
                    return NextResponse.json(
                        { success: false, error: "No tasks found to delete." },
                        { status: 404 }
                    );
                }
                
                return NextResponse.json({
                    success: true,
                    message: `${result.deletedCount} task(s) deleted successfully.`
                });
            default:
                return NextResponse.json(
                    { success: false, error: "Invalid action." },
                    { status: 400 }
                );
        }
        
        // For non-delete actions, update the tasks
        result = await collection.updateMany(
            { _id: { $in: objectTaskIds } },
            updateQuery
        );
        
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "No tasks found to update." },
                { status: 404 }
            );
        }
        
        // Fetch the updated tasks to return
        const updatedTasks = await collection.find({ _id: { $in: objectTaskIds } }).toArray();
        const serializedTasks = updatedTasks.map(task => ({ ...task, _id: task._id.toString() }));
        
        return NextResponse.json({
            success: true,
            message: `${result.modifiedCount} task(s) ${action}d successfully.`,
            data: serializedTasks
        });
    }
    catch (err) {
        console.error("Error in POST /api/work/bulk:", err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while performing bulk action. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}