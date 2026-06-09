import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET - Fetch all projects
export async function GET(request) {
    try {
        const collection = await dbConnect('projects');
        if (!collection) {
            throw new Error("Failed to connect to projects collection");
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
                //console.log("Invalid item:", item);
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
        const code = err?.code ?? err?.cause?.code;
        const msg = err?.message ?? "";
        if (!msg.includes("ECONNREFUSED") && !msg.includes("querySrv")) {
            console.error("Error in GET /api/projects:", err);
        }
        const isConnectionError =
            code === "ECONNREFUSED" ||
            code === "ENOTFOUND" ||
            msg.includes("ECONNREFUSED") ||
            msg.includes("querySrv");
        const message = isConnectionError
            ? "Database unavailable. Check your connection and try again."
            : "Something went wrong while fetching projects. Please try again later.";
        const status = isConnectionError ? 503 : 500;
        return NextResponse.json({
            success: false,
            error: message,
            details: msg
        }, { status });
    }
}

// POST - Create a new project
export async function POST(request) {
    try {
        const collection = await dbConnect('projects');
        
        if (!collection) {
            throw new Error("Failed to connect to projects collection");
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
                createdAt: createdAt || new Date(),
                files,
                assignedTo: parsedAssignedTo,
                clientId: clientId
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
        
        // Create a new project document
        const newProject = {
            ...projectData,
            // Ensure these fields are never null
            title: projectData.title || "Untitled",
            description: projectData.description || "No description",
            assignedTo: projectData.assignedTo || [], // Initialize as empty array if not provided
            createdAt: new Date(),
            updatedAt: new Date(),
            progress: 0
        };
        
        const result = await collection.insertOne(newProject);
        
        if (!result.acknowledged) {
            throw new Error("Failed to create project");
        }
        
        // Return the created project with string ID
        const createdProject = {
            ...newProject,
            _id: result.insertedId.toString()
        };
        
        return NextResponse.json({
            success: true,
            data: createdProject
        }, { status: 201 });
    } catch (err) {
        console.error("Error in POST /api/projects:", err);
        const code = err?.code ?? err?.cause?.code;
        const msg = err?.message ?? "";
        const isConnectionError =
            code === "ECONNREFUSED" ||
            code === "ENOTFOUND" ||
            msg.includes("ECONNREFUSED") ||
            msg.includes("querySrv");
        const message = isConnectionError
            ? "Database unavailable. Check your connection and try again."
            : "Something went wrong while creating project. Please try again later.";
        const status = isConnectionError ? 503 : 500;
        return NextResponse.json({
            success: false,
            error: message,
            details: msg
        }, { status });
    }
}