// app/api/users/[id]/activity/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    //console.log(`GET /api/users/${params.id}/activity called`);
    try {
        // Validate the user ID
        if (!ObjectId.isValid(params.id)) {
            console.error(`Invalid ObjectId format: ${params.id}`);
            return NextResponse.json(
                { success: false, error: "Invalid user ID format." },
                { status: 400 }
            );
        }

        // Get the collection
        const collection = await dbConnect('activity');

        // If activity collection doesn't exist, return empty array
        if (!collection) {
            //console.log("Activity collection not found, returning empty array");
            return NextResponse.json([]);
        }

        // Find all activities for this user, sorted by timestamp
        const activities = await collection
            .find({ userId: params.id })
            .sort({ timestamp: -1 })
            .limit(10)
            .toArray();

        // Serialize the activities
        const serializedActivities = activities.map(activity => {
            if (!activity || !activity._id) {
                return null;
            }
            return {
                ...activity,
                _id: activity._id.toString()
            };
        }).filter(Boolean);

        //console.log(`Found ${serializedActivities.length} activities for user ${params.id}`);
        return NextResponse.json(serializedActivities);
    }
    catch (err) {
        console.error(`Error in GET /api/users/${params.id}/activity:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching user activity. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}