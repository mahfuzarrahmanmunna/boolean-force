// app/api/blog/[id]/status/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PATCH - Update status of a blog post
export async function PATCH(request, { params }) {
    console.log("PATCH /api/blog/[id]/status called with params:", params);
    try {
        const { id } = await params;
        const { status } = await request.json();

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Blog post ID is required."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        if (!status) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Status is required."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const collection = await dbConnect('blog');

        // Try to convert to ObjectId
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (err) {
            console.error("Invalid ObjectId format:", id, err);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid blog post ID format."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Find existing document
        const existingDoc = await collection.findOne({ _id: objectId });

        if (!existingDoc) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Blog post not found."
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Update document
        const result = await collection.updateOne(
            { _id: objectId },
            {
                $set: {
                    status,
                    updatedAt: new Date()
                }
            }
        );

        // Get updated document
        const updatedDocument = await collection.findOne({ _id: objectId });
        const serializedDocument = {
            ...updatedDocument,
            _id: updatedDocument._id.toString()
        };

        return NextResponse.json(
            {
                success: true,
                message: "Status updated successfully!",
                data: serializedDocument,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                acknowledged: result.acknowledged,
                status: 200
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in PATCH /api/blog/[id]/status:", err);
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