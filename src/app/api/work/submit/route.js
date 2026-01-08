// app/api/projects/submit/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
// import { authOptions } from "@/lib/auth";

// Helper function to check if a user is a team leader
async function isTeamLeader(userId) {
    try {
        const teamsCollection = await dbConnect('teams');
        const team = await teamsCollection.findOne({
            teamLeader: new ObjectId(userId)
        });
        return !!team;
    } catch (error) {
        console.error('Error checking team leader status:', error);
        return false;
    }
}

// POST - Submit work
export async function POST(request) {
    try {
        // Get the current user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Authentication required." },
                { status: 401 }
            );
        }

        // Check if user is a team leader or admin
        const usersCollection = await dbConnect('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id) });
        
        if (!user || (user.role !== 'admin' && !await isTeamLeader(session.user.id))) {
            return NextResponse.json(
                { success: false, error: "Only team leaders can submit work." },
                { status: 403 }
            );
        }

        // Get the work data from the request
        const { workId, submissionData, submissionNotes } = await request.json();

        if (!workId) {
            return NextResponse.json(
                { success: false, error: "Work ID is required." },
                { status: 400 }
            );
        }

        if (!ObjectId.isValid(workId)) {
            return NextResponse.json(
                { success: false, error: "Invalid work ID format." },
                { status: 400 }
            );
        }

        // Check if the work exists and is assigned to the user's team
        const workCollection = await dbConnect('work');
        const work = await workCollection.findOne({ _id: new ObjectId(workId) });

        if (!work) {
            return NextResponse.json(
                { success: false, error: "Work not found." },
                { status: 404 }
            );
        }

        // If user is not admin, check if the work is assigned to their team
        if (user.role !== 'admin') {
            const teamsCollection = await dbConnect('teams');
            const team = await teamsCollection.findOne({
                teamLeader: new ObjectId(session.user.id),
                _id: { $in: work.assignedTo || [] }
            });

            if (!team) {
                return NextResponse.json(
                    { success: false, error: "This work is not assigned to your team." },
                    { status: 403 }
                );
            }
        }

        // Update the work with submission data
        const result = await workCollection.updateOne(
            { _id: new ObjectId(workId) },
            {
                $set: {
                    status: 'submitted',
                    submissionData,
                    submissionNotes,
                    submittedBy: new ObjectId(session.user.id),
                    submittedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Failed to submit work." },
                { status: 500 }
            );
        }

        // Get the updated work
        const updatedWork = await workCollection.findOne({ _id: new ObjectId(workId) });

        return NextResponse.json({
            success: true,
            data: {
                ...updatedWork,
                _id: updatedWork._id.toString(),
                assignedTo: Array.isArray(updatedWork.assignedTo) 
                    ? updatedWork.assignedTo.map(id => id.toString())
                    : updatedWork.assignedTo 
                        ? [updatedWork.assignedTo.toString()] 
                        : [],
            }
        });
    }
    catch (err) {
        console.error(`Error in POST /api/projects/submit:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while submitting work. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}