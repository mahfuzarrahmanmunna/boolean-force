// src/app/api/contact/[id]/route.js
// src/app/api/contact/[id]/route.js (Advanced Version)
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Helper function to validate ObjectId
function isValidObjectId(id) {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

// Helper function to validate status
function isValidStatus(status) {
    const validStatuses = ['new', 'contacted', 'in-progress', 'completed', 'closed'];
    return validStatuses.includes(status);
}

// GET - Retrieve a specific contact by ID
export async function GET(request, { params }) {
    try {
        // Await params before accessing its properties
        const { id } = await params;

        // Validate ID
        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid contact ID format" },
                { status: 400 }
            );
        }

        // Connect to database
        const collection = await dbConnect('contacts');

        // Find the contact by ID
        const contact = await collection.findOne({ _id: new ObjectId(id) });

        // Check if contact exists
        if (!contact) {
            return NextResponse.json(
                { success: false, error: "Contact not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error("Error retrieving contact:", error);
        return NextResponse.json(
            { success: false, error: "Failed to retrieve contact" },
            { status: 500 }
        );
    }
}

// PUT - Update a specific contact by ID
export async function PUT(request, { params }) {
    try {
        // Await params before accessing its properties
        const { id } = await params;

        // Validate ID
        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid contact ID format" },
                { status: 400 }
            );
        }

        // Get update data from request body
        const updateData = await request.json();

        // Validate update data
        if (!updateData || Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, error: "No update data provided" },
                { status: 400 }
            );
        }

        // Validate status if provided
        if (updateData.status && !isValidStatus(updateData.status)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid status. Valid statuses are: new, contacted, in-progress, completed, closed"
                },
                { status: 400 }
            );
        }

        // Connect to database
        const collection = await dbConnect('contacts');

        // Check if contact exists
        const existingContact = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingContact) {
            return NextResponse.json(
                { success: false, error: "Contact not found" },
                { status: 404 }
            );
        }

        // Add updated timestamp
        updateData.updatedAt = new Date();

        // If status is being changed, add status history
        if (updateData.status && updateData.status !== existingContact.status) {
            const statusHistory = existingContact.statusHistory || [];
            statusHistory.push({
                status: updateData.status,
                timestamp: new Date(),
                previousStatus: existingContact.status || 'new'
            });
            updateData.statusHistory = statusHistory;
        }

        // Update the contact
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        // Check if update was successful
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Failed to update contact" },
                { status: 500 }
            );
        }

        // Get the updated contact
        const updatedContact = await collection.findOne({ _id: new ObjectId(id) });

        return NextResponse.json({
            success: true,
            message: "Contact updated successfully",
            data: updatedContact
        });

    } catch (error) {
        console.error("Error updating contact:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update contact" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a specific contact by ID
export async function DELETE(request, { params }) {
    try {
        // Await params before accessing its properties
        const { id } = await params;

        // Validate ID
        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid contact ID format" },
                { status: 400 }
            );
        }

        // Connect to database
        const collection = await dbConnect('contacts');

        // Check if contact exists
        const existingContact = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingContact) {
            return NextResponse.json(
                { success: false, error: "Contact not found" },
                { status: 404 }
            );
        }

        // Delete the contact
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        // Check if deletion was successful
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Failed to delete contact" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Contact deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting contact:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete contact" },
            { status: 500 }
        );
    }
}

// PATCH - Update specific fields of a contact (e.g., status)
export async function PATCH(request, { params }) {
    try {
        // Await params before accessing its properties
        const { id } = await params;

        // Validate ID
        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid contact ID format" },
                { status: 400 }
            );
        }

        // Get update data from request body
        const updateData = await request.json();

        // Validate update data
        if (!updateData || Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, error: "No update data provided" },
                { status: 400 }
            );
        }

        // Validate status if provided
        if (updateData.status && !isValidStatus(updateData.status)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid status. Valid statuses are: new, contacted, in-progress, completed, closed"
                },
                { status: 400 }
            );
        }

        // Connect to database
        const collection = await dbConnect('contacts');

        // Check if contact exists
        const existingContact = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingContact) {
            return NextResponse.json(
                { success: false, error: "Contact not found" },
                { status: 404 }
            );
        }

        // Add updated timestamp
        updateData.updatedAt = new Date();

        // If status is being changed, add status history
        if (updateData.status && updateData.status !== existingContact.status) {
            const statusHistory = existingContact.statusHistory || [];
            statusHistory.push({
                status: updateData.status,
                timestamp: new Date(),
                previousStatus: existingContact.status || 'new'
            });
            updateData.statusHistory = statusHistory;
        }

        // If adding a note, append to notes array
        if (updateData.note) {
            const notes = existingContact.notes || [];
            notes.push({
                content: updateData.note,
                timestamp: new Date(),
                author: updateData.author || 'System'
            });
            updateData.notes = notes;
            // Remove the note field as we've added it to the notes array
            delete updateData.note;
        }

        // Update the contact
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        // Check if update was successful
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Failed to update contact" },
                { status: 500 }
            );
        }

        // Get the updated contact
        const updatedContact = await collection.findOne({ _id: new ObjectId(id) });

        return NextResponse.json({
            success: true,
            message: "Contact updated successfully",
            data: updatedContact
        });

    } catch (error) {
        console.error("Error updating contact:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update contact" },
            { status: 500 }
        );
    }
}