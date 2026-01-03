// app/api/teams/[id]/route.js
import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET a specific team
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid team ID' },
                { status: 400 }
            );
        }
        
        const teamsCollection = await dbConnect('teams');
        const team = await teamsCollection.findOne({ _id: new ObjectId(id) });
        
        if (!team) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        return NextResponse.json(
            { error: 'Failed to fetch team' },
            { status: 500 }
        );
    }
}

// PUT to update a team
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid team ID' },
                { status: 400 }
            );
        }
        
        const updateData = await request.json();
        
        // Add updated timestamp
        updateData.updatedAt = new Date();
        
        const teamsCollection = await dbConnect('teams');
        const workersCollection = await dbConnect('users');
        
        // Validate team leader exists
        if (updateData.teamLeader) {
            const teamLeader = await workersCollection.findOne({ _id: new ObjectId(updateData.teamLeader) });
            if (!teamLeader) {
                return NextResponse.json(
                    { error: 'Team leader not found' },
                    { status: 404 }
                );
            }
        }
        
        // Validate team members exist
        if (updateData.teamMembers && updateData.teamMembers.length > 0) {
            const memberIds = updateData.teamMembers.map(id => new ObjectId(id));
            const existingMembers = await workersCollection.find({ _id: { $in: memberIds } }).toArray();
            
            if (existingMembers.length !== memberIds.length) {
                return NextResponse.json(
                    { error: 'One or more team members not found' },
                    { status: 404 }
                );
            }
        }
        
        const result = await teamsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }
        
        // Get the updated team
        const updatedTeam = await teamsCollection.findOne({ _id: new ObjectId(id) });
        
        return NextResponse.json({ data: updatedTeam });
    } catch (error) {
        console.error('Error updating team:', error);
        return NextResponse.json(
            { error: 'Failed to update team' },
            { status: 500 }
        );
    }
}

// DELETE a team
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid team ID' },
                { status: 400 }
            );
        }
        
        const teamsCollection = await dbConnect('teams');
        const result = await teamsCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { message: 'Team deleted successfully' }
        );
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json(
            { error: 'Failed to delete team' },
            { status: 500 }
        );
    }
}