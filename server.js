// import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { MongoClient } from "mongodb";
import { router as courseRouter } from "./src/routes/course.js";
import debug from "debug";

const startupDebugger = debug("app:startup");
const dbDebugger = debug("app:db");

const app = express();
const PORT = process.env.PORT || 3000;
// const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/express-app";
const mongoHost = "157.173.198.244";
const mongoPort = "27017"; //default 27017
const mongoDatabase = "express-app";
const uri = `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`; // or your connection string

// Configure MongoClient with connection pool
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 300000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
});

// Global database reference
let db;

// Initialize MongoDB connection
async function initializeMongoDB() {
  try {
    await client.connect();
    db = client.db();
    dbDebugger("MongoDB connected with optimized connection pool");
    await setupSchema();
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

  // try {
  //   const collections = await db
  //     .listCollections({ name: collectionName })
  //     .toArray();
  //   if (collections.length === 0) {
  //     await db.createCollection(collectionName, courseSchema);
  //     console.log("Created courses collection with schema");
  //   } else {
  //     await db.command({
  //       collMod: collectionName,
  //       validator: courseSchema.validator,
  //       validationLevel: courseSchema.validationLevel,
  //       validationAction: courseSchema.validationAction,
  //     });
  //     console.log("Modified courses collection schema");
  //   }
  // } catch (err) {
  //   console.error("Error setting up schema:", err);
  //   throw err;
  // }
}

// Express Setup
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

// Middleware to attach db
app.use((req, res, next) => {
  if (!db) {
    return res.status(503).json({ error: "Database not initialized" });
  }
  req.db = db;
  next();
});

// Routes
app.use("/api/course", courseRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    details: err.details || undefined,
  });
});

// Start server
async function startServer() {
  try {
    await initializeMongoDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down...");
  await client.close();
  console.log("MongoDB client closed");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down...");
  await client.close();
  console.log("MongoDB client closed");
  process.exit(0);
});
