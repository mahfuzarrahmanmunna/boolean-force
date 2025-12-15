// app/api/workers/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PUT - Update a worker's status
export async function PUT(request, { params }) {
    console.log(`PUT /api/workers/${params.id} called`);
    try {
        // 1. Validate the ID format before using it
        if (!ObjectId.isValid(params.id)) {
            console.error(`Invalid ObjectId format: ${params.id}`);
            return NextResponse.json(
                { success: false, error: "Invalid worker ID format." },
                { status: 400 } // Bad Request
            );
        }

        const { status } = await request.json();

        // 2. Basic validation for the status field itself
        if (!status || typeof status !== 'string' || status.trim() === '') {
            return NextResponse.json(
                { success: false, error: "Status is required and must be a non-empty string." },
                { status: 400 } // Bad Request
            );
        }

        const collection = await dbConnect('users');

        const result = await collection.updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { status: status.trim(), updatedAt: new Date() } }
        );

        // 3. Check if the update actually matched a document
        if (result.matchedCount === 0) {
            console.error(`Worker not found with ID: ${params.id}`);
            return NextResponse.json({ success: false, error: "Worker not found." }, { status: 404 });
        }

        // Find and return the updated document to confirm the change
        const updatedWorker = await collection.findOne({ _id: new ObjectId(params.id) });
        
        // It's possible findOne fails even if updateOne succeeded, though unlikely.
        if (!updatedWorker) {
             return NextResponse.json({ success: false, error: "Worker not found after update." }, { status: 404 });
        }

        const serializedWorker = { ...updatedWorker, _id: updatedWorker._id.toString() };

        return NextResponse.json({ success: true, data: serializedWorker });
    }
    catch (err) {
        // 4. Log the full error and send a detailed message back
        console.error(`Error in PUT /api/workers/${params.id}:`, err);
        return NextResponse.json(
            { success: false, error: "Failed to update worker status.", details: err.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete a worker
export async function DELETE(request, { params }) {
    console.log(`DELETE /api/workers/${params.id} called`);
    try {
        // Validate the ID format first
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, error: "Invalid worker ID format." },
                { status: 400 } // Bad Request
            );
        }

        const collection = await dbConnect('users');
        const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, error: "Worker not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Worker deleted successfully." });
    }
    catch (err) {
        console.error(`Error in DELETE /api/workers/${params.id}:`, err);
        return NextResponse.json(
            { success: false, error: "Failed to delete worker.", details: err.message },
            { status: 500 }
        );
    }
}