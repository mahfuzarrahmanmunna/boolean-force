
import { collections } from "@/lib/dbConnect";

export async function POST(request) {
    try {
        const body = await request.json();

        // Get database connection
        const { db } = await dbConnect();
        const collection = db.collection(collections.contacts);

        // Create new contact document
        const newContact = {
            name: body.name,
            email: body.email,
            phone: body.phone || '',
            company: body.company || '',
            services: body.services || [],
            budget: body.budget || '',
            timeline: body.timeline || '',
            message: body.message,
            source: 'website',
            status: 'new',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Validate required fields
        if (!newContact.name || !newContact.email || !newContact.message) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Name, email, and message are required"
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Log for debugging
        console.log('BooleanForce: New contact submission:', {
            name: body.name,
            email: body.email,
            services: body.services
        });

        const result = await collection.insertOne(newContact);

        return new Response(JSON.stringify({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!',
            contactId: result.insertedId
        }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("BooleanForce: Error submitting contact form:", err);
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