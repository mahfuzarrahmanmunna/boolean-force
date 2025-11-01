// app/api/pricing-plans/debug/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const collection = await dbConnect('pricingPlans');
        const plans = await collection.find({}).toArray();

        // Convert ObjectId to string for JSON serialization
        const serializedPlans = plans.map(plan => ({
            ...plan,
            _id: plan._id.toString()
        }));

        return NextResponse.json({
            success: true,
            count: serializedPlans.length,
            data: serializedPlans
        });
    } catch (error) {
        console.error("Error fetching pricing plans:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}