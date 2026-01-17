<<<<<<< HEAD
// app/api/projects/[id]/permissions/route.js
=======
// app/api/workers/[id]/permissions/route.js
>>>>>>> 045201b2b3ff3301ceb45344a3816fe4f692766c
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PUT - Update worker permissions
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid worker ID format." },
                { status: 400 }
            );
        }

        const { permissions } = await request.json();
        
        if (!permissions) {
            return NextResponse.json(
                { success: false, error: "Permissions data is required." },
                { status: 400 }
            );
        }

        const workersCollection = await dbConnect('users');
        
        // Check if worker exists
        const worker = await workersCollection.findOne({ _id: new ObjectId(id) });
        if (!worker) {
            return NextResponse.json(
                { success: false, error: "Worker not found." },
                { status: 404 }
            );
        }

        // Update worker permissions
        const result = await workersCollection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    permissions,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Failed to update permissions." },
                { status: 500 }
            );
        }

        // Get the updated worker
        const updatedWorker = await workersCollection.findOne({ _id: new ObjectId(id) });
        
        return NextResponse.json({
            success: true,
            data: updatedWorker
        });
    } catch (err) {
<<<<<<< HEAD
        console.error(`Error in PUT /api/projects/${params.id}/permissions:`, err);
=======
        console.error(`Error in PUT /api/workers/${params.id}/permissions:`, err);
>>>>>>> 045201b2b3ff3301ceb45344a3816fe4f692766c
        return NextResponse.json(
            { success: false, error: "An internal server error occurred.", details: err.message },
            { status: 500 }
        );
    }
}