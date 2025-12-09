// app/api/notifications/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
    try {
        // Check if user is authenticated
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        const skip = (page - 1) * limit;

        // Build query
        const query = {};
        if (unreadOnly) query.read = false;

        // Get notifications
        const notifications = await dbConnect("notifications");
        const notificationList = await notifications.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // Get total count for pagination
        const total = await notifications.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: notificationList,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        // Check if user is authenticated
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
        }

        const { notificationIds, markAsRead } = await request.json();

        // Validate input
        if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
            return NextResponse.json(
                { success: false, error: "Notification IDs are required" },
                { status: 400 }
            );
        }

        // Convert string IDs to ObjectId
        const objectIds = notificationIds.map(id => new ObjectId(id));

        // Update notifications
        const notifications = await dbConnect("notifications");
        await notifications.updateMany(
            { _id: { $in: objectIds } },
            { $set: { read: markAsRead } }
        );

        return NextResponse.json({
            success: true,
            message: `Notifications marked as ${markAsRead ? 'read' : 'unread'}`
        });

    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}