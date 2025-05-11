import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import debug from "debug";

// import { Db } from "mongodb";
// import { ErrorWithStatus } from "./controllers/course.js";
import {
  initializeMongoDB,
  // getDb,
  closeMongoDB,
} from "./databases/mongo.database.js";
import { router as courseRouter } from "./routes/course.route.js";
import { ErrorWithStatus } from "./controllers/course.control.js";

dotenv.config();

const startupDebugger = debug("app:startup");
// const dbDebugger = debug("app:db");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.APP_HOST;

console.log("Host: ", HOST);

// Express Setup
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const mongoUri =
//   // process.env.MONGODB_URI || "mongodb://157.173.198.244:27017/express-app";
//   process.env.MONGODB_URI;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

// Middleware to attach db
// export interface CustomRequest extends Request {
//   db?: Db;
// }
// app.use(async (req: CustomRequest, res: Response, next: NextFunction) => {
//   try {
//     await initializeMongoDB();
//     req.db = getDb();
//     next();
//   } catch (err) {
//     console.error("Database initialization failed:", err);
//     res.status(503).json({ error: "Database not initialized" });
//   }
// });

// Routes
app.use("/api/course", courseRouter);

// Error handling middleware
app.use(
  (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
      details: err.details || undefined,
    });
  }
);

// Start server
async function startServer() {
  try {
    await initializeMongoDB();
    app.listen(PORT, () => {
      console.log(`Server running onn http://${HOST}:${PORT}`);
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
  await closeMongoDB();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down...");
  await closeMongoDB();
  process.exit(0);
});
