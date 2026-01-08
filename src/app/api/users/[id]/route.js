// app/api/users/[id]/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";

// GET - Fetch a specific user
export async function GET(request, { params }) {
    try {
        // Log the entire params object to see its structure
        console.log("GET params:", params);
        
        // Try different ways to extract the ID
        let id;
        if (params && params.id) {
            id = params.id;
        } else if (params && typeof params === 'string') {
            id = params;
        } else {
            // Try to get ID from URL
            const url = new URL(request.url);
            const pathSegments = url.pathname.split('/');
            id = pathSegments[pathSegments.length - 1];
        }
        
        console.log("Extracted ID:", id);
        
        // Validate the user ID
        if (!ObjectId.isValid(id)) {
            console.log("Invalid ID format:", id);
            return NextResponse.json(
                { error: "Invalid user ID format." },
                { status: 400 }
            );
        }

        // Connect to 'users' collection
        const collection = await dbConnect('users');

        // Find user by ID, but EXCLUDE password field for security
        const user = await collection.findOne(
            { _id: new ObjectId(id) }, 
            { projection: { password: 0 } }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Convert MongoDB ObjectId to string for JSON serialization
        const serializedUser = {
            ...user,
            _id: user._id.toString()
        };

        return NextResponse.json(serializedUser);
    }
    catch (err) {
        console.error(`Error in GET /api/users/${params?.id || 'unknown'}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while fetching user. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}

// PUT - Update user profile (including isTeamLeader field)
export async function PUT(request, { params }) {
    try {
        // Log the entire params object to see its structure
        console.log("PUT params:", params);
        
        // Try different ways to extract the ID
        let id;
        if (params && params.id) {
            id = params.id;
        } else if (params && typeof params === 'string') {
            id = params;
        } else {
            // Try to get ID from URL
            const url = new URL(request.url);
            const pathSegments = url.pathname.split('/');
            id = pathSegments[pathSegments.length - 1];
        }
        
        console.log("Extracted ID:", id);
        
        const session = await getServerSession();

        if (!session) {
            console.log("PUT /api/users/[id]: No session found");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if the current user is an admin
        const usersCollection = await dbConnect('users');
        const currentUser = await usersCollection.findOne(
            { email: session.user.email },
            { projection: { password: 0 } }
        );

        console.log("PUT /api/users/[id]: Current user:", currentUser);

        if (!currentUser || currentUser.role !== 'admin') {
            console.log("PUT /api/users/[id]: User is not admin or not found");
            return NextResponse.json(
                { error: "Only admins can update user roles" },
                { status: 403 }
            );
        }

        // Validate the user ID to be updated
        if (!ObjectId.isValid(id)) {
            console.log("PUT /api/users/[id]: Invalid ID format:", id);
            return NextResponse.json(
                { error: "Invalid user ID format." },
                { status: 400 }
            );
        }

        const data = await request.json();
        console.log("PUT /api/users/[id]: Update data:", data);
        
        // Allow updating isTeamLeader field and other user fields
        const { isTeamLeader, ...otherFields } = data;
        
        if (typeof isTeamLeader !== 'boolean' && isTeamLeader !== undefined) {
            return NextResponse.json(
                { error: "isTeamLeader must be a boolean value" },
                { status: 400 }
            );
        }

        // Prepare update object
        const updateObject = { updatedAt: new Date() };
        
        if (isTeamLeader !== undefined) {
            updateObject.isTeamLeader = isTeamLeader;
        }
        
        // Add other fields if provided
        Object.keys(otherFields).forEach(key => {
            updateObject[key] = otherFields[key];
        });

        console.log("PUT /api/users/[id]: Update object:", updateObject);

        // Update user profile
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateObject }
        );

        console.log("PUT /api/users/[id]: Update result:", result);

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get the updated user
        const updatedUser = await usersCollection.findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );

        console.log("PUT /api/users/[id]: Updated user:", updatedUser);

        return NextResponse.json({
            success: true,
            message: `User ${isTeamLeader ? 'is now a team leader' : 'is no longer a team leader'}`,
            data: {
                ...updatedUser,
                _id: updatedUser._id.toString()
            }
        });
    }
    catch (err) {
        console.error(`Error in PUT /api/users/${params?.id || 'unknown'}:`, err);
        return NextResponse.json({
            success: false,
            error: "Something went wrong while updating user. Please try again later.",
            details: err.message
        }, { status: 500 });
    }
}