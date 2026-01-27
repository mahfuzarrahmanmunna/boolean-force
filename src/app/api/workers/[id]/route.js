// app/api/projects/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodbAdapter";

// PUT - Update a worker's status or job title
export async function PUT(request, { params }) {
    // Await params since it's a Promise in Next.js 13+
    const { id } = await params;
    
    console.log(`PUT /api/projects/${id} called`);
    try {
        const { status, jobTitle, skills, experience, skillLevel, name, email, phone } = await request.json();
        
        // Validate that at least one field is provided
        if (!status && !jobTitle && !skills && !experience && !skillLevel && !name && !email && !phone) {
            return NextResponse.json(
                { success: false, error: "At least one field must be provided" },
                { status: 400 }
            );
        }

        const collection = await dbConnect('users');
        
        // Build update object with only provided fields
        const updateData = { updatedAt: new Date() };
        if (status) updateData.status = status.trim();
        if (jobTitle) updateData.jobTitle = jobTitle.trim();
        if (skills !== undefined) updateData.skills = skills.trim();
        if (experience !== undefined) updateData.experience = experience.trim();
        if (skillLevel) updateData.skillLevel = skillLevel.trim();
        if (name) updateData.name = name.trim();
        if (email) updateData.email = email.trim();
        if (phone !== undefined) updateData.phone = phone.trim();

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, error: "Worker not found" }, { status: 404 });
        }

        // Find and return updated document
        const updatedWorker = await collection.findOne({ _id: new ObjectId(id) });
        const serializedWorker = { ...updatedWorker, _id: updatedWorker._id.toString() };

        return NextResponse.json({ success: true, data: serializedWorker });
    }
    catch (err) {
        console.error(`Error in PUT /api/projects/${id}:`, err);
        return NextResponse.json(
            { success: false, error: "Failed to update worker." },
            { status: 500 }
        );
    }
}

// DELETE - Delete a worker
export async function DELETE(request, { params }) {
    // Await params since it's a Promise in Next.js 13+
    const { id } = await params;
    
    console.log(`DELETE /api/projects/${id} called`);
    try {
        const collection = await dbConnect('users');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, error: "Worker not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Worker deleted successfully." });
    }
    catch (err) {
        console.error(`Error in DELETE /api/projects/${id}:`, err);
        return NextResponse.json(
            { success: false, error: "Failed to delete worker." },
            { status: 500 }
        );
    }
}

// GET - Get a single worker by ID
export async function GET(request, { params }) {
    // Await params since it's a Promise in Next.js 13+
    const { id } = await params;
    
    try {
        // Validate ID format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid worker ID format" },
                { status: 400 }
            );
        }

        const collection = await dbConnect('users');
        const worker = await collection.findOne({ _id: new ObjectId(id) });

        if (!worker) {
            return NextResponse.json({ success: false, error: "Worker not found" }, { status: 404 });
        }

        // Return worker without password
        const { password, ...workerWithoutPassword } = worker;
        return NextResponse.json({ success: true, data: workerWithoutPassword });
    }
    catch (err) {
        console.error(`Error in GET /api/projects/${id}:`, err);
        return NextResponse.json(
            { success: false, error: "Failed to fetch worker." },
            { status: 500 }
        );
    }
}