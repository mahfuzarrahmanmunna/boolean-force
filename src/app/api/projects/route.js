// app/api/projects/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        const projectsCollection = await dbConnect('projects');

        // Build query filter
        const filter = {};

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (priority && priority !== 'all') {
            filter.priority = priority;
        }

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { clientName: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const total = await projectsCollection.countDocuments(filter);

        // Fetch projects with pagination
        const projects = await projectsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        // Serialize ObjectIds to strings
        const serializedProjects = projects.map(project => ({
            ...project,
            _id: project._id.toString(),
            clientId: project.clientId ? project.clientId.toString() : null,
            assignedWorkers: project.assignedWorkers ? project.assignedWorkers.map(id => id.toString()) : [],
            tasks: project.tasks ? project.tasks.map(task => ({
                ...task,
                _id: task._id.toString(),
                assignedTo: task.assignedTo ? task.assignedTo.toString() : null
            })) : []
        }));

        return NextResponse.json({
            success: true,
            data: {
                projects: serializedProjects,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const projectData = await request.json();

        // Validate required fields
        if (!projectData.title || !projectData.description || !projectData.clientId) {
            return NextResponse.json(
                { success: false, error: "Title, description, and client ID are required" },
                { status: 400 }
            );
        }

        const projectsCollection = await dbConnect('projects');

        // Create new project
        const newProject = {
            ...projectData,
            status: 'planning',
            progress: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            assignedWorkers: projectData.assignedWorkers || [],
            tasks: projectData.tasks || [],
            budget: projectData.budget || 0,
            startDate: projectData.startDate || null,
            endDate: projectData.endDate || null,
            tags: projectData.tags || []
        };

        const result = await projectsCollection.insertOne(newProject);

        // Return the created project with string ID
        const createdProject = {
            ...newProject,
            _id: result.insertedId.toString()
        };

        return NextResponse.json({
            success: true,
            data: createdProject
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { success: false, error: "Failed to create project" },
            { status: 500 }
        );
    }
}