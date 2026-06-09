// app/api/blog/[id]/duplicate/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// POST - Duplicate a blog post
export async function POST(request, { params }) {
    //console.log("POST /api/blog/[id]/duplicate called with params:", params);
    try {
        const { id } = await params;

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

        // Create a duplicate
        const duplicate = {
            ...existingDoc,
            title: `${existingDoc.title} (Copy)`,
            slug: `${existingDoc.slug}-copy-${Date.now()}`,
            status: 'draft',
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Remove _id to create a new document
        delete duplicate._id;

        const result = await collection.insertOne(duplicate);

        // Return inserted document with string ID
        const insertedDocument = await collection.findOne({ _id: result.insertedId });
        const serializedDocument = {
            ...insertedDocument,
            _id: insertedDocument._id.toString()
        };

        return NextResponse.json(
            {
                success: true,
                message: "Blog post duplicated successfully!",
                data: serializedDocument,
                insertId: result.insertedId.toString(),
                acknowledged: result.acknowledged,
                status: 201
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in POST /api/blog/[id]/duplicate:", err);
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