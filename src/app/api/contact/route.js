
// import { collections } from "@/lib/dbConnect";

import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const collection = await dbConnect('contacts');
        const data = await collection.find({}).toArray();
        console.log(data);
        return NextResponse.json(data)

    }
    catch (err) {
        console.error("BooleanForce: Error in GET /api/contact:", err);
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

export async function POST(request) {
    try {
        const postData = await request.json();
        console.log(postData);
        const collection = await dbConnect('contacts');
        const result = await collection.insertOne(postData);
        return NextResponse.json(
            {
                success: true,
                message: "Your message has been sent successfully!",
                insertId: result.insertedId,
                acknowledged: result.acknowledged,
                status: 201
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in POST /api/contact:", err);
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