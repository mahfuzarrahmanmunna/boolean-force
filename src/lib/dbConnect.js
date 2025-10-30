import { MongoClient, ServerApiVersion } from "mongodb";

// Cache the database connection
let cachedClient = null;
let cachedDb = null;

// Collection names for BooleanForce
export const collections = {
    contacts: "contacts",
    services: "services",
    portfolio: "portfolio",
    team: "team",
    blog: "blog",
    clients: "clients",
    subscribers: "subscribers",
};

export default async function dbConnect() {
    // If we already have a connection, return it
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    try {
        // Create a new MongoDB client
        const client = new MongoClient(process.env.MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        // Connect to the MongoDB cluster
        await client.connect();

        // Select the database
        const db = client.db(process.env.DB_NAME || "boolean_force");

        // Cache the connection
        cachedClient = client;
        cachedDb = db;

        console.log("BooleanForce: Connected to MongoDB successfully");
        return { client, db };
    } catch (error) {
        console.error("BooleanForce: Failed to connect to MongoDB:", error);
        throw new Error("Database connection failed");
    }
}

// Helper function to get a specific collection
export async function getCollection(collectionName) {
    const { db } = await dbConnect();
    return db.collection(collectionName);
}