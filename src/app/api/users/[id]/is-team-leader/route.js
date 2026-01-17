// app/api/users/[id]/is-team-leader/route.js
import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }
        
        // Get the user
        const usersCollection = await dbConnect('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        
        // Check if user is a team leader in the teams collection
        const teamsCollection = await dbConnect('teams');
        const team = await teamsCollection.findOne({
            teamLeader: new ObjectId(id)
        });
        
        // Also check if user has team leader permissions
        const hasTeamLeaderPermissions = user.permissions && 
            (user.permissions.task?.includes('submit_task') || 
             user.permissions.task?.includes('approve_task'));
        
        return NextResponse.json({
            isTeamLeader: !!team || hasTeamLeaderPermissions
        });
    } catch (error) {
        console.error('Error checking team leader status:', error);
        return NextResponse.json(
            { error: 'Failed to check team leader status' },
            { status: 500 }
        );
    }
}