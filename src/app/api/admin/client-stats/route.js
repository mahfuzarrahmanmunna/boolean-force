// app/api/admin/client-stats/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodbAdapter";

export async function GET(request) {
    try {
        // Connect to database
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Get total number of clients
        const totalClients = await db.collection("users").countDocuments({ role: "client" });

        // Get number of active clients
        const activeClients = await db.collection("users").countDocuments({ role: "client", status: "active" });

        // Get number of new clients in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newClients = await db.collection("users").countDocuments({
            role: "client",
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Get clients by month for the last 12 months
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const clientsByMonth = await db.collection("users").aggregate([
            {
                $match: {
                    role: "client",
                    createdAt: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]).toArray();

        // Format the data for the chart
        const formattedData = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JavaScript months are 0-indexed

            const monthData = clientsByMonth.find(item =>
                item._id.year === year && item._id.month === month
            );

            formattedData.push({
                month: monthNames[month - 1],
                year: year,
                count: monthData ? monthData.count : 0
            });
        }

        // Return success response
        return NextResponse.json({
            totalClients,
            activeClients,
            newClients,
            clientsByMonth: formattedData
        });
    } catch (error) {
        console.error("Error fetching client statistics:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}