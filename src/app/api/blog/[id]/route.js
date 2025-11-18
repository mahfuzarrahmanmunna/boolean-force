// app/api/blog/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch a single blog post by ID
export async function GET(request, { params }) {
    console.log("GET /api/blog/[id] called with params:", params);
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

        // Try to convert to ObjectId, but handle case where it might fail
        let objectId;
        try {
            objectId = new ObjectId(id);
            console.log("Converted to ObjectId:", objectId);
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

        // Find by ObjectId
        const post = await collection.findOne({ _id: objectId });
        console.log("Found blog post:", post);

        if (!post) {
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

        // Convert ObjectId to string for JSON serialization
        const serializedPost = {
            ...post,
            _id: post._id.toString()
        };

        return NextResponse.json(serializedPost);
    }
    catch (err) {
        console.error("BooleanForce: Error in GET /api/blog/[id]:", err);
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

// PUT - Update an existing blog post by ID
export async function PUT(request, { params }) {
    console.log("PUT /api/blog/[id] called with params:", params);
    try {
        // Await params to fix Next.js warning
        const { id } = await params;

        // Get request body
        let updateData;
        try {
            const requestBody = await request.text();
            console.log("Raw request body:", requestBody);
            updateData = JSON.parse(requestBody);
            console.log("Parsed update data:", updateData);
        } catch (parseError) {
            console.error("Error parsing request body:", parseError);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid JSON in request body."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Blog post ID is required for updates."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Remove _id from updateData if it exists to avoid MongoDB error
        if (updateData._id) {
            console.log("Removing _id from update data");
            delete updateData._id;
        }

        // Add updated timestamp
        updateData.updatedAt = new Date();

        const collection = await dbConnect('blog');

        // Try to convert to ObjectId, but handle case where it might fail
        let objectId;
        try {
            objectId = new ObjectId(id);
            console.log("Converted to ObjectId:", objectId);
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
        console.log("Existing document:", existingDoc);

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
            { $set: updateData }
        );

        console.log("Update result:", result);

        // Get updated document
        const updatedDocument = await collection.findOne({ _id: objectId });
        const serializedDocument = {
            ...updatedDocument,
            _id: updatedDocument._id.toString()
        };

        return NextResponse.json(
            {
                success: true,
                message: "Blog post updated successfully!",
                data: serializedDocument,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                acknowledged: result.acknowledged,
                status: 200
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in PUT /api/blog/[id]:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: err.message || "Something went wrong. Please try again later.",
                details: err.stack
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

// DELETE - Delete a blog post by ID
export async function DELETE(request, { params }) {
    console.log("DELETE /api/blog/[id] called with params:", params);
    try {
        const { id } = await params;

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Blog post ID is required for deletion."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        console.log("Deleting blog post:", id);
        const collection = await dbConnect('blog');

        // Try to convert to ObjectId, but handle case where it might fail
        let objectId;
        try {
            objectId = new ObjectId(id);
            console.log("Converted to ObjectId:", objectId);
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
        console.log("Existing document:", existingDoc);

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

        const result = await collection.deleteOne({ _id: objectId });

        console.log("Delete result:", result);

        return NextResponse.json(
            {
                success: true,
                message: "Blog post deleted successfully!",
                deletedCount: result.deletedCount,
                acknowledged: result.acknowledged,
                status: 200
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in DELETE /api/blog/[id]:", err);
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