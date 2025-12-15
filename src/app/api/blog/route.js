// app/api/blog/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch all blog posts with pagination and filtering
export async function GET(request) {
    console.log("GET /api/blog called");
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        const category = searchParams.get('category') || '';
        const sortBy = searchParams.get('sortBy') || 'date';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build query
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { 'author.name': { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (category && category !== 'All') {
            query.tags = { $in: [category] };
        }

        // Build sort object
        let sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const collection = await dbConnect('blog');

        // Get total count for pagination
        const totalPosts = await collection.countDocuments(query);

        // Get posts with pagination
        const posts = await collection
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();

        // Convert ObjectId to string for JSON serialization
        const serializedPosts = posts.map(post => ({
            ...post,
            _id: post._id.toString()
        }));

        // Calculate total pages
        const totalPages = Math.ceil(totalPosts / limit);

        console.log("Fetched blog posts:", {
            posts: serializedPosts.length,
            totalPosts,
            totalPages,
            currentPage: page
        });

        return NextResponse.json({
            posts: serializedPosts,
            totalPosts,
            totalPages,
            currentPage: page
        });
    }
    catch (err) {
        console.error("BooleanForce: Error in GET /api/blog:", err);
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

// POST - Add a new blog post
export async function POST(request) {
    console.log("POST /api/blog called");
    try {
        const postData = await request.json();
        console.log("Adding new blog post:", postData);

        // Add timestamps
        postData.createdAt = new Date();
        postData.updatedAt = new Date();

        const collection = await dbConnect('blog');
        const result = await collection.insertOne(postData);

        // Return inserted document with string ID
        const insertedDocument = await collection.findOne({ _id: result.insertedId });
        const serializedDocument = {
            ...insertedDocument,
            _id: insertedDocument._id.toString()
        };

        return NextResponse.json(
            {
                success: true,
                message: "Blog post added successfully!",
                data: serializedDocument,
                insertId: result.insertedId.toString(),
                acknowledged: result.acknowledged,
                status: 201
            }
        );
    }
    catch (err) {
        console.error("BooleanForce: Error in POST /api/blog:", err);
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