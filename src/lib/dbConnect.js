import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;

export default async function dbConnect() {
    if (!client) {
        client = new MongoClient(process.env.MONGO_DB_URI, {
            serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
        });
        await client.connect();
        db = client.db(process.env.DB_NAME)
    }

    // return db.collection(collectionName)
    return db;
}