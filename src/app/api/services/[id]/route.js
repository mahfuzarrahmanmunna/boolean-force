// app/api/services/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch a single service by ID
export async function GET(request, { params }) {
    //console.log("GET /api/services/[id] called with params:", params);
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Service ID is required."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const collection = await dbConnect('services');

        // Try to convert to ObjectId, but handle the case where it might fail
        let objectId;
        try {
            objectId = new ObjectId(id);
            //console.log("Converted to ObjectId:", objectId);
        } catch (err) {
            console.error("Invalid ObjectId format:", id, err);
            // If it's not a valid ObjectId, try to find by the 'id' field instead
            const service = await collection.findOne({ id: parseInt(id) });

            if (!service) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: "Service not found."
                    }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }

            // Convert ObjectId to string for JSON serialization
            const serializedService = {
                ...service,
                _id: service._id.toString()
            };

            return NextResponse.json(serializedService);
        }

        // Find by ObjectId
        const service = await collection.findOne({ _id: objectId });
        //console.log("Found service:", service);

        if (!service) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Service not found."
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Convert ObjectId to string for JSON serialization
        const serializedService = {
            ...service,
            _id: service._id.toString()
        };

        return NextResponse.json(serializedService);
    }
    catch (err) {
        console.error("BooleanForce: Error in GET /api/services/[id]:", err);
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

// PUT - Update an existing service by ID
export async function PUT(request, { params }) {
    //console.log("PUT /api/services/[id] called with params:", params);
    try {
        // Await params to fix the Next.js warning
        const { id } = await params;

        // Get the request body
        let updateData;
        try {
            const requestBody = await request.text();
            //console.log("Raw request body:", requestBody);
            updateData = JSON.parse(requestBody);
            //console.log("Parsed update data:", updateData);
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
                    error: "Service ID is required for updates."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Remove _id from updateData if it exists to avoid MongoDB error
        if (updateData._id) {
            //console.log("Removing _id from update data");
            delete updateData._id;
        }

        const collection = await dbConnect('services');

        // Try to convert to ObjectId, but handle the case where it might fail
        let objectId;
        try {
            objectId = new ObjectId(id);
            //console.log("Converted to ObjectId:", objectId);
        } catch (err) {
            console.error("Invalid ObjectId format:", id, err);
            // If it's not a valid ObjectId, try to update by the 'id' field instead
            const result = await collection.updateOne(
                { id: parseInt(id) },
                { $set: updateData }
            );

            if (result.matchedCount === 0) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: "Service not found."
                    }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }

            // Get the updated document
            const updatedDocument = await collection.findOne({ id: parseInt(id) });
            const serializedDocument = {
                ...updatedDocument,
                _id: updatedDocument._id.toString()
            };

            return NextResponse.json(
                {
                    success: true,
                    message: "Service updated successfully!",
                    data: serializedDocument,
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount,
                    acknowledged: result.acknowledged,
                    status: 200
                }
            );
        }

        // Find by ObjectId
        const existingDoc = await collection.findOne({ _id: objectId });
        //console.log("Existing document:", existingDoc);

        if (!existingDoc) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Service not found."
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Update the document
        const result = await collection.updateOne(
            { _id: objectId },
            { $set: updateData }
        );

        //console.log("Update result:", result);

        // Get the updated document
        const updatedDocument = await collection.findOne({ _id: objectId });
        const serializedDocument = {
            ...updatedDocument,
            _id: updatedDocument._id.toString()
        };

        return NextResponse.json(
            {
                success: true,
                message: "Service updated successfully!",
                data: serializedDocument,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                acknowledged: result.acknowledged,
                status: 200
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in PUT /api/services/[id]:", err);
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

// DELETE - Delete a service by ID
export async function DELETE(request, { params }) {
    //console.log("DELETE /api/services/[id] called with params:", params);
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Service ID is required for deletion."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        //console.log("Deleting service:", id);
        const collection = await dbConnect('services');

        // Try to convert to ObjectId, but handle the case where it might fail
        let objectId;
        try {
            objectId = new ObjectId(id);
            //console.log("Converted to ObjectId:", objectId);
        } catch (err) {
            console.error("Invalid ObjectId format:", id, err);
            // If it's not a valid ObjectId, try to delete by the 'id' field instead
            const result = await collection.deleteOne({ id: parseInt(id) });

            if (result.deletedCount === 0) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: "Service not found."
                    }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    message: "Service deleted successfully!",
                    deletedCount: result.deletedCount,
                    acknowledged: result.acknowledged,
                    status: 200
                }
            );
        }

        // Find by ObjectId
        const existingDoc = await collection.findOne({ _id: objectId });
        //console.log("Existing document:", existingDoc);

        if (!existingDoc) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Service not found."
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const result = await collection.deleteOne({ _id: objectId });

        //console.log("Delete result:", result);

        return NextResponse.json(
            {
                success: true,
                message: "Service deleted successfully!",
                deletedCount: result.deletedCount,
                acknowledged: result.acknowledged,
                status: 200
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in DELETE /api/services/[id]:", err);
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