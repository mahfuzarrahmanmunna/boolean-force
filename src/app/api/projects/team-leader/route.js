// src/app/api/projects/team-leader/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function GET(request) {
    try {
        const session = await auth();
        
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Authentication required." },
                { status: 401 }
            );
        }

        // Check if user is a team leader
        const teamsCollection = await dbConnect('teams');
        const team = await teamsCollection.findOne({
            teamLeader: new ObjectId(session.user.id)
        });

        if (!team) {
            return NextResponse.json(
                { success: false, error: "Only team leaders can access this endpoint." },
                { status: 403 }
            );
        }

        // Get projects assigned to this team that are NOT submitted/completed
        const projectsCollection = await dbConnect('projects');
        const projects = await projectsCollection.find({
            assignedTo: { $in: [team._id.toString()] },
            status: { $nin: ['submitted', 'completed'] } // Only show pending projects
        }).sort({ dueDate: 1 }).toArray();

        // Serialize the data
        const serializedProjects = projects.map(project => ({
            _id: project._id.toString(),
            title: project.title || "Untitled",
            description: project.description || "No description",
            status: project.status || 'pending',
            priority: project.priority || 'medium',
            category: project.category || 'other',
            dueDate: project.dueDate,
            progress: project.progress || 0,
            assignedTo: Array.isArray(project.assignedTo) 
                ? project.assignedTo.map(id => id.toString())
                : project.assignedTo ? [project.assignedTo.toString()] : [],
            createdAt: project.createdAt,
            tags: project.tags || []
        }));

        return NextResponse.json({
            success: true,
            data: {
                team: {
                    _id: team._id.toString(),
                    name: team.name,
                    teamLeader: team.teamLeader.toString(),
                    teamMembers: team.teamMembers || []
                },
                projects: serializedProjects
            }
        });

    } catch (error) {
        console.error("Error fetching team leader projects:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch projects." },
            { status: 500 }
        );
    }
}