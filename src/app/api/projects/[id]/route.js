// API Route Fix (/api/projects/[id]/route.js)

import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Helper function to check if a user is a team leader
async function isTeamLeader(userId) {
    try {
        const teamsCollection = await dbConnect('teams');
        // Try to match as ObjectId first, then as string
        let team = await teamsCollection.findOne({
            teamLeader: new ObjectId(userId)
        });
        
        // If not found, try matching as string
        if (!team) {
            team = await teamsCollection.findOne({
                teamLeader: userId
            });
        }
        
        return !!team;
    } catch (error) {
        console.error('Error checking team leader status:', error);
        return false;
    }
}

// Helper function to check if a user has permission to access a project
async function hasProjectPermission(userId, projectId, action = 'read') {
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
        
        // Get the project to check which teams it's assigned to
        const projectCollection = await dbConnect('projects');
        const project = await projectCollection.findOne({ _id: new ObjectId(projectId) });
        
        if (!project) {
            return false;
        }
        
        // If the project is not assigned to any team, only admins can access it
        if (!project.assignedTo || project.assignedTo.length === 0) {
            return false;
        }
        
        // Check if the user is a team leader of any team that the project is assigned to
        const teamsCollection = await dbConnect('teams');
        
        // Convert assignedTo IDs to strings for consistent comparison
        const assignedTeamIds = project.assignedTo.map(id => {
            return typeof id === 'object' ? id.toString() : id.toString();
        });
        
        // Try to find teams where the user is a leader and the team is assigned to the project
        // First try with ObjectId comparison
        let teams = await teamsCollection.find({
            teamLeader: new ObjectId(userId),
            _id: { $in: assignedTeamIds.map(id => new ObjectId(id)) }
        }).toArray();
        
        // If no teams found, try with string comparison
        if (teams.length === 0) {
            teams = await teamsCollection.find({
                teamLeader: userId,
                _id: { $in: assignedTeamIds }
            }).toArray();
        }
        
        return teams.length > 0;
    } catch (error) {
        console.error('Error checking project permission:', error);
        return false;
    }
}

// GET - Fetch a specific project by ID
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
                { success: false, error: "Invalid project ID format." },
                { status: 400 }
            );
        }

        // Check if user has permission to read this project
        const hasPermission = await hasProjectPermission(session.user.id, id, 'read');
        if (!hasPermission) {
            return NextResponse.json(
                { success: false, error: "You don't have permission to view this project." },
                { status: 403 }
            );
        }

        // Get the collection
        const collection = await dbConnect('projects');

        // Find the project
        const project = await collection.findOne({ _id: new ObjectId(id) });

        if (!project) {
            console.error(`Project not found with ID: ${id}`);
            return NextResponse.json(
                { success: false, error: "Project not found." },
                { status: 404 }
            );
        }

        // Serialize the project
        const serializedProject = {
            ...project,
            _id: project._id.toString(),
            // Ensure assignedTo is always an array of strings
            assignedTo: Array.isArray(project.assignedTo) 
                ? project.assignedTo.map(id => typeof id === 'object' ? id.toString() : id.toString())
                : project.assignedTo 
                    ? [typeof project.assignedTo === 'object' ? project.assignedTo.toString() : project.assignedTo.toString()] 
                    : [],
        };

        return NextResponse.json({
            success: true,
            data: serializedProject
        });
    }
    catch (err) {
        console.error(`Error in GET /api/projects/${id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching project. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// PUT - Update a project
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
                { success: false, error: "Invalid project ID format." },
                { status: 400 }
            );
        }

        // Check if user has permission to update this project
        const hasPermission = await hasProjectPermission(session.user.id, id, 'write');
        if (!hasPermission) {
            console.log(`User ${session.user.id} does not have permission to update project ${id}`);
            return NextResponse.json(
                { success: false, error: "You don't have permission to update this project." },
                { status: 403 }
            );
        }

        // Check if the request is multipart/form-data (for file uploads)
        const contentType = request.headers.get('content-type');
        let projectData;
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
            
            // Create project data object
            projectData = {
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
            projectData = await request.json();
            
            // Parse tags if provided as a string
            if (projectData.tags && typeof projectData.tags === 'string') {
                projectData.tags = projectData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            
            // Parse assignedTo if provided as a string
            if (projectData.assignedTo && typeof projectData.assignedTo === 'string') {
                projectData.assignedTo = projectData.assignedTo.split(',').map(id => id.trim()).filter(id => id);
            }
        }

        // Get the collection
        const collection = await dbConnect('projects');

        // First, check if the project exists
        const existingProject = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingProject) {
            console.error(`Project not found with ID: ${id}`);
            return NextResponse.json(
                { success: false, error: "Project not found." },
                { status: 404 }
            );
        }

        console.log('Existing project found:', existingProject);

        // Update the project
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...projectData,
                    updatedAt: new Date(),
                    updatedBy: new ObjectId(session.user.id)
                }
            }
        );

        console.log('Update result:', result);

        // Check if the update was successful
        if (result.matchedCount === 0) {
            console.error(`Failed to update project with ID: ${id}`);
            return NextResponse.json(
                { success: false, error: "Failed to update project." },
                { status: 500 }
            );
        }

        // Find and return the updated project
        const updatedProject = await collection.findOne({ _id: new ObjectId(id) });
        console.log('Updated project:', updatedProject);

        // Serialize the project
        const serializedProject = {
            ...updatedProject,
            _id: updatedProject._id.toString(),
            // Ensure assignedTo is always an array of strings
            assignedTo: Array.isArray(updatedProject.assignedTo) 
                ? updatedProject.assignedTo.map(id => typeof id === 'object' ? id.toString() : id.toString())
                : updatedProject.assignedTo 
                    ? [typeof updatedProject.assignedTo === 'object' ? updatedProject.assignedTo.toString() : updatedProject.assignedTo.toString()] 
                    : [],
        };

        return NextResponse.json({
            success: true,
            data: serializedProject
        });
    }
    catch (err) {
        console.error(`Error in PUT /api/projects/${id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while updating project. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// DELETE - Delete a project
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
                { success: false, error: "Invalid project ID format." },
                { status: 400 }
            );
        }

        // Check if user has permission to delete this project
        const hasPermission = await hasProjectPermission(session.user.id, id, 'delete');
        if (!hasPermission) {
            return NextResponse.json(
                { success: false, error: "You don't have permission to delete this project." },
                { status: 403 }
            );
        }

        // Get the collection
        const projectsCollection = await dbConnect('projects');
        const teamsCollection = await dbConnect('teams');

        // First, get the project to find which teams are assigned to it
        const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
        
        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found." },
                { status: 404 }
            );
        }

        // Delete the project
        const result = await projectsCollection.deleteOne({ _id: new ObjectId(id) });

        // Check if the deletion was successful
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Project not found." },
                { status: 404 }
            );
        }

        // If the project was assigned to teams, update those teams
        if (project.assignedTo && project.assignedTo.length > 0) {
            // Convert assignedTo to ObjectIds for the query
            const assignedToObjectIds = project.assignedTo.map(id => {
                return typeof id === 'object' ? id : new ObjectId(id);
            });
            
            // Remove the project ID from all teams that were assigned to it
            await teamsCollection.updateMany(
                { _id: { $in: assignedToObjectIds } },
                {
                    $pull: {
                        assignedProjects: new ObjectId(id)
                    },
                    $set: {
                        updatedAt: new Date()
                    }
                }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully."
        });
    }
    catch (err) {
        console.error(`Error in DELETE /api/projects/${id}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while deleting project. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}