// app/api/projects/[id]/assign/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
    try {
        // Unwrap the params promise
        const { id } = await params;

        console.log(`Assigning workers to project: ${id}`);

        // 1. Validate the project ID from the URL
        if (!ObjectId.isValid(id)) {
            console.error('Invalid project ID format');
            return NextResponse.json(
                { success: false, error: "Invalid project ID format." },
                { status: 400 }
            );
        }

        const { workerIds } = await request.json();
        console.log('Worker IDs to assign:', workerIds);

        // 2. Validate the incoming payload
        if (!workerIds || !Array.isArray(workerIds) || workerIds.length === 0) {
            console.error('Invalid worker IDs payload');
            return NextResponse.json(
                { success: false, error: "Worker IDs must be a non-empty array." },
                { status: 400 }
            );
        }

        // 3. Validate each worker ID format and convert to ObjectId
        let objectWorkerIds;
        try {
            objectWorkerIds = workerIds.map(id => {
                if (!ObjectId.isValid(id)) {
                    throw new Error(`Invalid worker ID format: ${id}`);
                }
                return new ObjectId(id);
            });
        } catch (e) {
            console.error('Worker ID validation error:', e.message);
            return NextResponse.json(
                { success: false, error: e.message },
                { status: 400 }
            );
        }

        const projectsCollection = await dbConnect('work');
        const workersCollection = await dbConnect('users');

        // Check if the project exists before proceeding
        const projectExists = await projectsCollection.findOne({ _id: new ObjectId(id) });
        if (!projectExists) {
            console.error('Project not found');
            return NextResponse.json(
                { success: false, error: "Project not found." },
                { status: 404 }
            );
        }

        // Check if all workers exist
        const existingWorkers = await workersCollection.find({ _id: { $in: objectWorkerIds } }).toArray();
        if (existingWorkers.length !== objectWorkerIds.length) {
            console.error('Some workers not found');
            return NextResponse.json(
                { success: false, error: "One or more workers not found." },
                { status: 404 }
            );
        }

        // Perform the database operations
        await projectsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $push: { assignedWorkers: { $each: objectWorkerIds } },
                $set: { updatedAt: new Date() }
            }
        );

        const assignedWorkers = await workersCollection.find({ _id: { $in: objectWorkerIds } }).toArray();
        const serializedWorkers = assignedWorkers.map(worker => ({
            ...worker,
            _id: worker._id.toString()
        }));

        console.log('Workers assigned successfully');
        return NextResponse.json({
            success: true,
            message: "Workers assigned successfully!",
            data: { assignedWorkers: serializedWorkers }
        });
    }
    catch (err) {
        console.error(`Error in POST /api/projects/${params.id}/assign:`, err);
        return NextResponse.json(
            { success: false, error: "An internal server error occurred.", details: err.message },
            { status: 500 }
        );
    }
}