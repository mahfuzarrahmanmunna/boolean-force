// app/api/teams/route.js
import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET all teams
export async function GET() {
  try {
    const teamsCollection = await dbConnect('teams');
    const teams = await teamsCollection.find({}).toArray();
    
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// POST a new team
export async function POST(request) {
  try {
    const teamData = await request.json();
    
    // Validate required fields
    if (!teamData.name || !teamData.teamLeader) {
      return NextResponse.json(
        { error: 'Team name and team leader are required' },
        { status: 400 }
      );
    }
    
    const teamsCollection = await dbConnect('teams');
    const workersCollection = await dbConnect('users');
    
    // Check if team leader exists
    const teamLeader = await workersCollection.findOne({ _id: new ObjectId(teamData.teamLeader) });
    if (!teamLeader) {
      return NextResponse.json(
        { error: 'Team leader not found' },
        { status: 404 }
      );
    }
    
    // Check if all team members exist
    if (teamData.teamMembers && teamData.teamMembers.length > 0) {
      const memberIds = teamData.teamMembers.map(id => new ObjectId(id));
      const existingMembers = await workersCollection.find({ _id: { $in: memberIds } }).toArray();
      
      if (existingMembers.length !== memberIds.length) {
        return NextResponse.json(
          { error: 'One or more team members not found' },
          { status: 404 }
        );
      }
    }
    
    // Add timestamps
    const newTeam = {
      ...teamData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await teamsCollection.insertOne(newTeam);
    newTeam._id = result.insertedId;
    
    return NextResponse.json(
      { data: newTeam },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}

