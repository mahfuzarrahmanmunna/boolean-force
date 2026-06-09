import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// POST to unassign projects from a team
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
        const workCollection = await dbConnect('work');
        
        // Check if team exists
        const team = await teamsCollection.findOne({ _id: new ObjectId(id) });
        if (!team) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }
        
        // Update team by removing project IDs from assignedProjects array
        // Using $pull to remove specific IDs
        const updateResult = await teamsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $pull: {
                    assignedProjects: { $in: projectIds.map(id => new ObjectId(id)) }
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
        
        // Update each project to remove the team ID from assignedTo array
        const projectUpdatePromises = projectIds.map(projectId =>
            workCollection.updateOne(
                { _id: new ObjectId(projectId) },
                {
                    $pull: {
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
        const updatedProjects = await workCollection.find({
            _id: { $in: projectIds.map(id => new ObjectId(id)) }
        }).toArray();
        
        return NextResponse.json({
            success: true,
            data: {
                team: updatedTeam,
                unassignedProjects: updatedProjects
            }
        });
    } catch (error) {
        console.error('Error unassigning projects from team:', error);
        return NextResponse.json(
            { error: `Failed to unassign projects from team: ${error.message}` },
            { status: 500 }
        );
    }
}