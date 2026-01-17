// app/api/projects/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
// import { authOptions } from "@/lib/auth";

// Helper function to check if a user is a team leader
async function isTeamLeader(userId) {
    try {
        const teamsCollection = await dbConnect('teams');
        const team = await teamsCollection.findOne({
            teamLeader: new ObjectId(userId)
        });
        return !!team;
    } catch (error) {
        console.error('Error checking team leader status:', error);
        return false;
    }
}

// Helper function to check if a user has permission to access a work item
async function hasWorkPermission(userId, workId, action = 'read') {
    try {
        // Admins have all permissions
        const usersCollection = await dbConnect('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        
        if (!user) {
            return false;
        }
        
        if (user.role === 'admin') {
            return true;
        }
        
        // Check if user is a team leader
        const isLeader = await isTeamLeader(userId);
        if (!isLeader) {
            return false;
        }
        
        // For read operations, check if the work is assigned to the user's team
        if (action === 'read') {
            const workCollection = await dbConnect('work');
            const work = await workCollection.findOne({ _id: new ObjectId(workId) });
            
            if (!work) {
                return false;
            }
            
            // Check if the work is assigned to the user's team
            const teamsCollection = await dbConnect('teams');
            const team = await teamsCollection.findOne({
                teamLeader: new ObjectId(userId),
                _id: { $in: work.assignedTo || [] }
            });
            
            return !!team;
        }
        
        // For write/delete operations, team leaders can manage work assigned to their teams
        const workCollection = await dbConnect('work');
        const work = await workCollection.findOne({ _id: new ObjectId(workId) });
        
        if (!work) {
            return false;
        }
        
        // Check if the work is assigned to the user's team
        const teamsCollection = await dbConnect('teams');
        const team = await teamsCollection.findOne({
            teamLeader: new ObjectId(userId),
            _id: { $in: work.assignedTo || [] }
        });
        
        return !!team;
    } catch (error) {
        console.error('Error checking work permission:', error);
        return false;
    }
}

// GET - Fetch a specific work task by ID
export async function GET(request, { params }) {
    // Awaiting the params promise to get the id
    const { id } = await params;
    console.log(`GET /api/projects/${id} called`);
    console.log('ID type:', typeof id);
    console.log('ID value:', id);

    try {
        // Get the current user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Authentication required." },
                { status: 401 }
            );
        }

        // Validate the ID format
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId format: ${id}`);
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Check if user has permission to read this work item
        const hasPermission = await hasWorkPermission(session.user.id, id, 'read');
        if (!hasPermission) {
            return NextResponse.json(
                { success: false, error: "You don't have permission to view this work task." },
                { status: 403 }
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
        console.error(`Error in GET /api/projects/${id}:`, err);
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
    console.log(`PUT /api/projects/${id} called`);
    console.log('ID type:', typeof id);
    console.log('ID value:', id);

    try {
        // Get the current user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Authentication required." },
                { status: 401 }
            );
        }

        // Validate the ID format
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId format: ${id}`);
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Check if user has permission to update this work item
        const hasPermission = await hasWorkPermission(session.user.id, id, 'write');
        if (!hasPermission) {
            return NextResponse.json(
                { success: false, error: "You don't have permission to update this work task." },
                { status: 403 }
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
                    updatedAt: new Date(),
                    updatedBy: new ObjectId(session.user.id)
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
        console.error(`Error in PUT /api/projects/${id}:`, err);
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
    console.log(`DELETE /api/projects/${id} called`);
    console.log('ID type:', typeof id);
    console.log('ID value:', id);

    try {
        // Get the current user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Authentication required." },
                { status: 401 }
            );
        }

        // Validate the ID format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid work task ID format." },
                { status: 400 }
            );
        }

        // Check if user has permission to delete this work item
        const hasPermission = await hasWorkPermission(session.user.id, id, 'delete');
        if (!hasPermission) {
            return NextResponse.json(
                { success: false, error: "You don't have permission to delete this work task." },
                { status: 403 }
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
        console.error(`Error in DELETE /api/projects/${id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while deleting work task. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}