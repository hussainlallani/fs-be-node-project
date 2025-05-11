// import { MongoClient, Db } from "mongodb";
// import debug from "debug";
// import dotenv from "dotenv";
// import mongoose from "mongoose";

// import { courseSchema } from "@/models/courseSchema";
// import { authorSchema } from "@/models/authorSchema";

// dotenv.config();

// const dbDebugger = debug("app:db");

// const mongoUri =
//   process.env.MONGODB_URI ||
//   "mongodb://157.173.198.244:27017/express-app?replicaSet=rs0";

// mongoose
//   .connect(
//     process.env.MONGODB_URI || "mongodb://157.173.198.244:27017/express-app"
//   )
//   .then(() => console.log("Connected!"));

// // Configure MongoClient with connection pool
// const client = new MongoClient(mongoUri, {
//   maxPoolSize: 10,
//   minPoolSize: 2,
//   maxIdleTimeMS: 300000,
//   connectTimeoutMS: 10000,
//   socketTimeoutMS: 30000,
// });

// // Global database reference
// let db: Db | undefined;

// // Initialize MongoDB connection
// export async function initializeMongoDB(): Promise<Db> {
//   if (db) {
//     dbDebugger("Returning existing MongoDB connection");
//     return db;
//   }
//   try {
//     dbDebugger("Connecting to MongoDB at", mongoUri);
//     await client.connect();
//     db = client.db();
//     dbDebugger("MongoDB connected with optimized connection pool");
//     await setupSchema();
//     return db;
//   } catch (err) {
//     console.error("Failed to connect to MongoDB:", err);
//     throw err;
//   }
// }

// // Setup JSON Schema for courses collection
// async function setupSchema() {
//   const collectionName = "courses";

//   try {
//     dbDebugger("Checking for 'courses' collection...");
//     const collections = await db!
//       .listCollections({ name: collectionName })
//       .toArray();
//     if (collections.length === 0) {
//       dbDebugger("Creating 'courses' collection with schema");
//       await db!.createCollection(collectionName, courseSchema);
//       console.log("Created courses collection with schema");
//     } else {
//       dbDebugger("Modifying 'courses' collection schema");
//       await db!.command({
//         collMod: collectionName,
//         validator: courseSchema.validator,
//         validationLevel: courseSchema.validationLevel,
//         validationAction: courseSchema.validationAction,
//       });
//       console.log("Modified courses collection schema");
//     }
//   } catch (err) {
//     console.error("Error setting up schema:", err);
//     throw err;
//   }
// }

// // Get database instance
// export function getDb(): Db {
//   if (!db) {
//     throw new Error("Database not initialized. Call initializeMongoDB first.");
//   }
//   return db;
// }

// // Close connection (for graceful shutdown)
// export async function closeMongoDB() {
//   if (db) {
//     dbDebugger("Closing MongoDB connection");
//     await client.close();
//     db = undefined;
//     console.log("MongoDB client closed");
//   }
// }

import mongoose from "mongoose";
import dotenv from "dotenv";
import debug from "debug";

dotenv.config();

const dbDebugger = debug("app:db");

// Replace with your env variable or fallback URI
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb://157.173.198.244:27017/express-app?replicaSet=rs0";

// Register Mongoose models
// mongoose.model("Course", courseSchema);
// mongoose.model("Author", authorSchema);

// Connect using Mongoose only
export async function initializeMongoDB(): Promise<typeof mongoose> {
  try {
    dbDebugger("Connecting to MongoDB via Mongoose at", mongoUri);
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 300000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
    dbDebugger("Mongoose connected to MongoDB");
    return mongoose;
  } catch (err) {
    console.error("Failed to connect to MongoDB via Mongoose:", err);
    throw err;
  }
}

// Get active mongoose instance
export function getDb(): typeof mongoose {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose is not connected.");
  }
  return mongoose;
}

// Graceful shutdown
export async function closeMongoDB() {
  if (mongoose.connection.readyState !== 0) {
    dbDebugger("Closing Mongoose connection");
    await mongoose.disconnect();
    console.log("Mongoose connection closed");
  }
}
