import "./registerDbRejection";
import { MongoClient, ServerApiVersion } from "mongodb";

let cachedClient = null;
let cachedDb = null;
/** Single connection promise so we never create multiple connect() calls (avoids extra unhandled rejections) */
let connectionPromise = null;

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  throw new Error("Please define MONGO_URI and DB_NAME in your .env file");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

function getConnectionPromise() {
  if (!connectionPromise) {
    connectionPromise = client.connect().catch((err) => {
      throw err;
    });
  }
  return connectionPromise;
}

export async function dbConnect(collectionName) {
  if (!cachedClient || !cachedDb) {
    await getConnectionPromise();
    cachedClient = client;
    cachedDb = client.db(dbName);
  }

  return cachedDb.collection(collectionName);
}
