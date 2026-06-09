// app/api/team-leaders/route.js
import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET - Fetch all team leaders with their teams, members, and project counts
export async function GET(request) {
  try {
    const teamsCollection = await dbConnect('teams');
    const teams = await teamsCollection.find({}).toArray();

    const projectsCollection = await dbConnect('projects');
    const userIds = new Set();
    teams.forEach(team => {
      if (team.teamLeader) {
        userIds.add(team.teamLeader);
      }
      if (team.teamMembers && team.teamMembers.length > 0) {
        team.teamMembers.forEach(memberId => userIds.add(memberId));
      }
    });

    const usersCollection = await dbConnect('users');
    const uniqueUserIds = Array.from(userIds).map(id => new ObjectId(id));
    const users = await usersCollection.find({ _id: { $in: uniqueUserIds } }).toArray();

    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), {
        _id: user._id.toString(),
        name: user.name || 'Unknown',
        email: user.email || 'Unknown'
      });
    });

    const teamLeadersMap = new Map();

    for (const team of teams) {
      const teamLeaderId = team.teamLeader;
      const teamLeaderDetails = userMap.get(teamLeaderId);

      if (!teamLeadersMap.has(teamLeaderId) && teamLeaderDetails) {
        teamLeadersMap.set(teamLeaderId, {
          ...teamLeaderDetails,
          teams: [],
          totalProjects: 0
        });
      }

      const leaderData = teamLeadersMap.get(teamLeaderId);
      if (!leaderData) continue; 

      const memberDetails = [];
      if (team.teamMembers && team.teamMembers.length > 0) {
        team.teamMembers.forEach(memberId => {
          const member = userMap.get(memberId);
          if (member) {
            memberDetails.push(member);
          }
        });
      }

      leaderData.teams.push({
        _id: team._id,
        name: team.name,
        projectCount: team.assignedProjects ? team.assignedProjects.length : 0,
        members: memberDetails
      });

      leaderData.totalProjects += team.assignedProjects ? team.assignedProjects.length : 0;
    }

  
    const teamLeaders = Array.from(teamLeadersMap.values());

    return NextResponse.json(teamLeaders);
  } catch (error) {
    console.error('Error fetching team leaders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team leaders' },
      { status: 500 }
    );
  }
}