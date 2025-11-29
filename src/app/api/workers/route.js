// app/api/workers/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PUT - Update a worker's status
export async function PUT(request, { params }) {
    console.log(`PUT /api/workers/${params.id} called`);
    try {
        const { status } = await request.json();
        const collection = await dbConnect('users');

        const result = await collection.updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, error: "Worker not found" }, { status: 404 });
        }

        // Find and return the updated document
        const updatedWorker = await collection.findOne({ _id: new ObjectId(params.id) });
        const serializedWorker = { ...updatedWorker, _id: updatedWorker._id.toString() };

        return NextResponse.json({ success: true, data: serializedWorker });
    }
    catch (err) {
        console.error(`Error in PUT /api/workers/${params.id}:`, err);
        return NextResponse.json(
            { success: false, error: "Failed to update worker status." },
            { status: 500 }
        );
    }
}

// DELETE - Delete a worker
export async function DELETE(request, { params }) {
    console.log(`DELETE /api/workers/${params.id} called`);
    try {
        const collection = await dbConnect('users');
        const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, error: "Worker not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Worker deleted successfully." });
    }
    catch (err) {
        console.error(`Error in DELETE /api/workers/${params.id}:`, err);
        return NextResponse.json(
            { success: false, error: "Failed to delete worker." },
            { status: 500 }
        );
    }
}