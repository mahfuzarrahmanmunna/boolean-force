// app/api/admin/notifications/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodbAdapter";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const notifications = db.collection("notifications");

        // Find all unread notifications
        const unreadNotifications = await notifications.find({ read: false }).toArray();

        return NextResponse.json({ notifications: unreadNotifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { notificationId } = await request.json();

        if (!notificationId) {
            return NextResponse.json(
                { error: "Notification ID is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const notifications = db.collection("notifications");

        // Mark notification as read
        await notifications.updateOne(
            { _id: new ObjectId(notificationId) },
            { $set: { read: true } }
        );

        return NextResponse.json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Error updating notification:", error);
        return NextResponse.json(
            { error: "Failed to update notification" },
            { status: 500 }
        );
    }
}