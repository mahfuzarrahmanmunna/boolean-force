// app/api/pricing-plans/[id]/route.js

// import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";

// GET - Fetch a single pricing plan by ID
export async function GET(request, { params }) {
    //console.log("GET /api/pricing-plans/[id] called with params:", params);
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Plan ID is required."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const collection = await dbConnect('pricingPlans');

        // Try to convert to ObjectId, but handle the case where it might fail
        let objectId;
        try {
            objectId = new ObjectId(id);
            //console.log("Converted to ObjectId:", objectId);
        } catch (err) {
            console.error("Invalid ObjectId format:", id, err);
            // If it's not a valid ObjectId, try to find by the 'id' field instead
            const plan = await collection.findOne({ id: parseInt(id) });

            if (!plan) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: "Pricing plan not found."
                    }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }

            // Convert ObjectId to string for JSON serialization
            const serializedPlan = {
                ...plan,
                _id: plan._id.toString()
            };

            return NextResponse.json(serializedPlan);
        }

        // Find by ObjectId
        const plan = await collection.findOne({ _id: objectId });
        //console.log("Found plan:", plan);

        if (!plan) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Pricing plan not found."
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Convert ObjectId to string for JSON serialization
        const serializedPlan = {
            ...plan,
            _id: plan._id.toString()
        };

        return NextResponse.json(serializedPlan);
    }
    catch (err) {
        console.error("BooleanForce: Error in GET /api/pricing-plans/[id]:", err);
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

// PUT - Update an existing pricing plan by ID
export async function PUT(request, { params }) {
    //console.log("PUT /api/pricing-plans/[id] called with params:", params);
    try {
        const { id } = params;
        const updateData = await request.json();
        //console.log("Updating pricing plan:", id, updateData);

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Plan ID is required for updates."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const collection = await dbConnect('pricingPlans');

        // Add debugging logs
        //console.log("Connected to database, collection:", collection.collectionName);

        // Check all document IDs in the database
        const allDocs = await collection.find({}).toArray();
        //console.log("All document IDs in database:", allDocs.map(doc => ({ _id: doc._id.toString(), name: doc.name })));

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
                        error: "Pricing plan not found."
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
                    message: "Pricing plan updated successfully!",
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
            // Try to find by string ID as a fallback
            //console.log("ObjectId search failed, trying string-based search");
            const stringDoc = await collection.findOne({ _id: id });
            //console.log("String-based search result:", stringDoc);

            if (!stringDoc) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: "Pricing plan not found with either ObjectId or string ID."
                    }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }

            // Update using string ID
            const result = await collection.updateOne(
                { _id: id },
                { $set: updateData }
            );

            // Get the updated document
            const updatedDocument = await collection.findOne({ _id: id });
            const serializedDocument = {
                ...updatedDocument,
                _id: updatedDocument._id.toString()
            };

            return NextResponse.json(
                {
                    success: true,
                    message: "Pricing plan updated successfully!",
                    data: serializedDocument,
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount,
                    acknowledged: result.acknowledged,
                    status: 200
                }
            );
        }

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
                message: "Pricing plan updated successfully!",
                data: serializedDocument,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                acknowledged: result.acknowledged,
                status: 200
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in PUT /api/pricing-plans/[id]:", err);
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

// PATCH - Partially update an existing pricing plan by ID
export async function PATCH(request, { params }) {
    //console.log("PATCH /api/pricing-plans/[id] called with params:", params);
    try {
        const { id } = params;
        const updateData = await request.json();
        //console.log("Partially updating pricing plan:", id, updateData);

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Plan ID is required for updates."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const collection = await dbConnect('pricingPlans');

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
                        error: "Pricing plan not found."
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
                    message: "Pricing plan updated successfully!",
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
                    error: "Pricing plan not found."
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

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
                message: "Pricing plan updated successfully!",
                data: serializedDocument,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                acknowledged: result.acknowledged,
                status: 200
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in PATCH /api/pricing-plans/[id]:", err);
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

// DELETE - Delete a pricing plan by ID
export async function DELETE(request, { params }) {
    //console.log("DELETE /api/pricing-plans/[id] called with params:", params);
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Plan ID is required for deletion."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        //console.log("Deleting pricing plan:", id);
        const collection = await dbConnect('pricingPlans');

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
                        error: "Pricing plan not found."
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
                    message: "Pricing plan deleted successfully!",
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
                    error: "Pricing plan not found."
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
                message: "Pricing plan deleted successfully!",
                deletedCount: result.deletedCount,
                acknowledged: result.acknowledged,
                status: 200
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in DELETE /api/pricing-plans/[id]:", err);
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