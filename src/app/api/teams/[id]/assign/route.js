import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// POST to assign projects to a team
export async function POST(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid team ID' },
                { status: 400 }
            );
        }
        
        const { projectIds } = await request.json();
        
        if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
            return NextResponse.json(
                { error: 'No project IDs provided' },
                { status: 400 }
            );
        }
        
        // Validate all project IDs
        for (const projectId of projectIds) {
            if (!ObjectId.isValid(projectId)) {
                return NextResponse.json(
                    { error: `Invalid project ID: ${projectId}` },
                    { status: 400 }
                );
            }
        }
        
        const teamsCollection = await dbConnect('teams');
        const projectsCollection = await dbConnect('projects'); // Changed from 'work' to 'projects'
        
        // Check if team exists
        const team = await teamsCollection.findOne({ _id: new ObjectId(id) });
        if (!team) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }
        
        // Check if all projects exist
        const projects = await projectsCollection.find({
            _id: { $in: projectIds.map(id => new ObjectId(id)) }
        }).toArray();
        
        if (projects.length !== projectIds.length) {
            const foundIds = projects.map(p => p._id.toString());
            const missingIds = projectIds.filter(id => !foundIds.includes(id));
            return NextResponse.json(
                { error: `Projects not found: ${missingIds.join(', ')}` },
                { status: 404 }
            );
        }
        
        // Update team by adding project IDs to assignedProjects array
        // Using $addToSet to avoid duplicates
        const updateResult = await teamsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $addToSet: {
                    assignedProjects: { $each: projectIds.map(id => new ObjectId(id)) }
                },
                $set: {
                    updatedAt: new Date()
                }
            }
        );
        
        if (updateResult.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Failed to update team' },
                { status: 500 }
            );
        }
        
        // Update each project to add the team ID to assignedTo array
        // Initialize assignedTo if it doesn't exist, then add to team ID
        const projectUpdatePromises = projectIds.map(projectId =>
            projectsCollection.updateOne(
                { _id: new ObjectId(projectId) },
                {
                    $addToSet: {
                        assignedTo: new ObjectId(id)
                    },
                    $set: {
                        updatedAt: new Date()
                    }
                }
            )
        );
        
        const projectUpdateResults = await Promise.all(projectUpdatePromises);
        
        // Get the updated team
        const updatedTeam = await teamsCollection.findOne({ _id: new ObjectId(id) });
        
        // Get the updated projects
        const updatedProjects = await projectsCollection.find({
            _id: { $in: projectIds.map(id => new ObjectId(id)) }
        }).toArray();
        
        return NextResponse.json({
            success: true,
            data: {
                team: updatedTeam,
                assignedProjects: updatedProjects
            }
        });
    } catch (error) {
        console.error('Error assigning projects to team:', error);
        return NextResponse.json(
            { error: `Failed to assign projects to team: ${error.message}` },
            { status: 500 }
        );
    }
}