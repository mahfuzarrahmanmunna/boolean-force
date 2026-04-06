// app/api/pricing-plans/route.js

import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch all pricing plans
export async function GET(request) {
    //console.log("GET /api/pricing-plans called");
    try {
        const collection = await dbConnect('pricingPlans');
        const data = await collection.find({}).toArray();

        // Convert ObjectId to string for JSON serialization
        const serializedData = data.map(item => ({
            ...item,
            _id: item._id.toString()
        }));

        //console.log("Fetched pricing plans:", serializedData);
        return NextResponse.json(serializedData);
    }
    catch (err) {
        console.error("BooleanForce: Error in GET /api/pricing-plans:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Something went wrong. Please try again later.",
                details: err.message
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

// POST - Add a new pricing plan
export async function POST(request) {
    //console.log("POST /api/pricing-plans called");
    try {
        const postData = await request.json();
        //console.log("Adding new pricing plan:", postData);
        const collection = await dbConnect('pricingPlans');
        const result = await collection.insertOne(postData);

        // Return the inserted document with the string ID
        const insertedDocument = await collection.findOne({ _id: result.insertedId });
        const serializedDocument = {
            ...insertedDocument,
            _id: insertedDocument._id.toString()
        };

        return NextResponse.json(
            {
                success: true,
                message: "Pricing plan added successfully!",
                data: serializedDocument,
                insertId: result.insertedId.toString(),
                acknowledged: result.acknowledged,
                status: 201
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in POST /api/pricing-plans:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Something went wrong. Please try again later.",
                details: err.message
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

