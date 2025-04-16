import { MongoClient, Db } from "mongodb";
import debug from "debug";
import dotenv from "dotenv";

dotenv.config();

const dbDebugger = debug("app:db");

const mongoUri =
  process.env.MONGODB_URI || "mongodb://157.173.198.244:27017/express-app";

// Configure MongoClient with connection pool
const client = new MongoClient(mongoUri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 300000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
});

// Global database reference
let db: Db | undefined;

// Initialize MongoDB connection
export async function initializeMongoDB(): Promise<Db> {
  if (db) {
    dbDebugger("Returning existing MongoDB connection");
    return db;
  }
  try {
    dbDebugger("Connecting to MongoDB at", mongoUri);
    await client.connect();
    db = client.db();
    dbDebugger("MongoDB connected with optimized connection pool");
    await setupSchema();
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

// Setup JSON Schema for courses collection
async function setupSchema() {
  const collectionName = "courses";
  const courseSchema = {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "instructor", "tags", "date", "credits"],
        properties: {
          title: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          instructor: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          tags: {
            bsonType: "array",
            items: {
              bsonType: "string",
              description: "each tag must be a string",
            },
            minItems: 1,
            description:
              "must be an array of at least one string and is required",
          },
          date: {
            bsonType: "date",
            description: "must be a date and is required",
          },
          credits: {
            bsonType: "int",
            minimum: 1,
            maximum: 5,
            description: "must be an integer between 1 and 5 and is required",
          },
          description: {
            bsonType: ["string", "null"],
            description: "must be a string or null if provided",
          },
          isPublished: {
            bsonType: "bool",
            description: "must be a boolean if provided",
          },
        },
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  };

  try {
    dbDebugger("Checking for 'courses' collection...");
    const collections = await db!
      .listCollections({ name: collectionName })
      .toArray();
    if (collections.length === 0) {
      dbDebugger("Creating 'courses' collection with schema");
      await db!.createCollection(collectionName, courseSchema);
      console.log("Created courses collection with schema");
    } else {
      dbDebugger("Modifying 'courses' collection schema");
      await db!.command({
        collMod: collectionName,
        validator: courseSchema.validator,
        validationLevel: courseSchema.validationLevel,
        validationAction: courseSchema.validationAction,
      });
      console.log("Modified courses collection schema");
    }
  } catch (err) {
    console.error("Error setting up schema:", err);
    throw err;
  }
}

// Get database instance
export function getDb(): Db {
  if (!db) {
    throw new Error("Database not initialized. Call initializeMongoDB first.");
  }
  return db;
}

// Close connection (for graceful shutdown)
export async function closeMongoDB() {
  if (db) {
    dbDebugger("Closing MongoDB connection");
    await client.close();
    db = undefined;
    console.log("MongoDB client closed");
  }
}
