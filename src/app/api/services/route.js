// app/api/services/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch all services
export async function GET(request) {
    //console.log("GET /api/services called");
    try {
        const collection = await dbConnect('services');
        const data = await collection.find({}).toArray();

        // Convert ObjectId to string for JSON serialization
        const serializedData = data.map(item => ({
            ...item,
            _id: item._id.toString()
        }));

        //console.log("Fetched services:", serializedData);
        return NextResponse.json(serializedData);
    }
    catch (err) {
        console.error("BooleanForce: Error in GET /api/services:", err);
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

// POST - Add a new service
export async function POST(request) {
    //console.log("POST /api/services called");
    try {
        const postData = await request.json();
        //console.log("Adding new service:", postData);
        const collection = await dbConnect('services');
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
                message: "Service added successfully!",
                data: serializedDocument,
                insertId: result.insertedId.toString(),
                acknowledged: result.acknowledged,
                status: 201
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in POST /api/services:", err);
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