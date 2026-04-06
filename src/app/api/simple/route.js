// import dbConnect from "@/lib/dbConnect";

import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
    try {
        const { db } = await dbConnect();

        const collection = db.collection('users');

        const users = await collection.find({}).toArray();

        //console.log('fetched users:', users);

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
    catch (err) {
        console.error('Error fetching users:', err);

        return new Response(
            JSON.stringify({ error: "Error fetching users" }),
            { status: 500, headers: { 'Content-Type': "application/json" } }
        );
    }
}