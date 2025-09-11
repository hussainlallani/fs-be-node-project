// import express, { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import morgan from "morgan";
// import debug from "debug";

// // import { Db } from "mongodb";
// // import { ErrorWithStatus } from "./controllers/course.js";
// import {
//   initializeMongoDB,
//   // getDb,
//   closeMongoDB,
// } from "./databases/mongo.database.js";
// import { router as courseRouter } from "./routes/course.route.js";
// import { router as authorRouter } from "./routes/author.route.js";
// import { ErrorWithStatus } from "./controllers/course.controller.js";

// dotenv.config();

// const startupDebugger = debug("app:startup");
// // const dbDebugger = debug("app:db");

// const app = express();
// const PORT = process.env.PORT || 3000;
// const HOST = process.env.APP_HOST;

// console.log("Host: ", HOST);

// // Express Setup
// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // const mongoUri =
// //   // process.env.MONGODB_URI || "mongodb://157.173.198.244:27017/express-app";
// //   process.env.MONGODB_URI;

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("tiny"));
//   startupDebugger("Morgan enabled...");
// }

// // Middleware to attach db
// // export interface CustomRequest extends Request {
// //   db?: Db;
// // }
// // app.use(async (req: CustomRequest, res: Response, next: NextFunction) => {
// //   try {
// //     await initializeMongoDB();
// //     req.db = getDb();
// //     next();
// //   } catch (err) {
// //     console.error("Database initialization failed:", err);
// //     res.status(503).json({ error: "Database not initialized" });
// //   }
// // });

// // Routes
// app.use("/api/course", courseRouter);
// app.use("/api/author", authorRouter);

// // Error handling middleware
// app.use(
//   (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
//     console.error("Error:", err);
//     res.status(err.status || 500).json({
//       error: err.message || "Internal Server Error",
//       details: err.details || undefined,
//     });
//   }
// );

// // Start server
// async function startServer() {
//   try {
//     await initializeMongoDB();
//     app.listen(PORT, () => {
//       console.log(`Server running onn http://${HOST}:${PORT}`);
//     });
//   } catch (err) {
//     console.error("Failed to start server:", err);
//     process.exit(1);
//   }
// }

// startServer();

// // Graceful shutdown
// process.on("SIGTERM", async () => {
//   console.log("SIGTERM received, shutting down...");
//   await closeMongoDB();
//   process.exit(0);
// });

// process.on("SIGINT", async () => {
//   console.log("SIGINT received, shutting down...");
//   await closeMongoDB();
//   process.exit(0);
// });

// import express, { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import morgan from "morgan";
// import debug from "debug";
// import fs from "fs";
// import https from "https";
// import path from "path";

// import { initializeMongoDB, closeMongoDB } from "./databases/mongo.database.js";
// import { router as usersRouter } from "./routes/users.route.js";
// import { router as courseRouter } from "./routes/course.route.js";
// import { router as authorRouter } from "./routes/author.route.js";
// import { ErrorWithStatus } from "./controllers/course.controller.js";
// import { fileURLToPath } from "url";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const startupDebugger = debug("app:startup");
// const app = express();
// const PORT = process.env.PORT || 3000;
// const HOST = process.env.APP_HOST || "157.173.198.244";
// console.log("Starting", HOST, " on...", PORT);

// // Express Setup
// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("tiny"));
//   startupDebugger("Morgan enabled...");
// }

// // Routes
// app.use("/api/users", usersRouter);
// app.use("/api/course", courseRouter);
// app.use("/api/author", authorRouter);

// // Error handling middleware
// app.use(
//   (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
//     console.error("Error:", err);
//     res.status(err.status || 500).json({
//       error: err.message || "Internal Server Error",
//       details: err.details || undefined,
//     });
//   }
// );

// // app.set("trust proxy", true); // Enable trust proxy for reverse proxies (like Nginx)

// // Start server with HTTPS
// async function startServer() {
//   try {
//     await initializeMongoDB();

//     // Load SSL cert and key for HTTPS
//     const keyPath =
//       process.env.SSL_KEY_PATH || path.join(__dirname, "../certs/key.pem");
//     const certPath =
//       process.env.SSL_CERT_PATH || path.join(__dirname, "../certs/cert.pem");
//     const options = {
//       key: fs.readFileSync(keyPath),
//       cert: fs.readFileSync(certPath),
//     };

//     const server = https.createServer(options, app);

//     server.listen(PORT, () => {
//       console.log(`HTTPS server running on https://${HOST}:${PORT}`);
//     });
//   } catch (err) {
//     console.error("Failed to start server:", err);
//     process.exit(1);
//   }
// }

// startServer();

// // Graceful shutdown
// process.on("SIGTERM", async () => {
//   console.log("SIGTERM received, shutting down...");
//   await closeMongoDB();
//   process.exit(0);
// });

// process.on("SIGINT", async () => {
//   console.log("SIGINT received, shutting down...");
//   await closeMongoDB();
//   process.exit(0);
// });
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import debug from "debug";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { initializeMongoDB, closeMongoDB } from "./databases/mongo.database.js";
import { router as authRouter } from "./routes/auth.route.js";
import { router as userRouter } from "./routes/user.route.js";
import { router as courseRouter } from "./routes/course.route.js";
import { router as authorRouter } from "./routes/author.route.js";
import { router as gamesRouter } from "./routes/games.route.js";
import { router as artworksRouter } from "./routes/artworks.route.js";
import { router as gridRouter } from "./routes/grid.route.js";
import { ErrorWithStatus } from "./controllers/course.controller.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.APP_HOST || "127.0.0.1";
const NODE_ENV = process.env.NODE_ENV || "development";
const startupDebugger = debug("app:startup");

const app = express();
console.log(`Starting server at http://${HOST}:${PORT} [${NODE_ENV}]`);

// Middleware
app.use(cors()); // Enable CORS for all routes
app.options("*", cors()); // Handles preflight for all routes
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  startupDebugger("Morgan logging enabled");
}

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/author", authorRouter);

app.use("/api/games", gamesRouter);
app.use("/api/artworks", artworksRouter);
app.use("/api/grid", gridRouter);

// Error handling middleware
app.use(
  (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled Error:", {
      message: err.message,
      stack: err.stack,
      status: err.status,
      details: err.details,
    });
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
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`${signal} received. Cleaning up...`);
  try {
    await closeMongoDB();
    console.log("MongoDB connection closed. Exiting.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();

// 2. Why is HTTP (not HTTPS) recommended for Node.js behind Nginx?
// Nginx terminates SSL/TLS: It handles all HTTPS (and HTTP/2) traffic from the client.
// Nginx then proxies to Node.js over HTTP/1.1 (not HTTP/2, not HTTPS).
// This is simpler, faster, and avoids double encryption on the same server.
// You only need SSL certificates in Nginx, not in Node.js.
// 3. Why is it recommended to use HTTPS in production?
// HTTPS encrypts data in transit, protecting against eavesdropping

// HTTP/2 server push is a feature where the server can proactively send resources (like CSS, JS) to the client before the client requests them. However, HTTP/2 server push is deprecated in all major browsers (including Chrome, Firefox, and Safari) as of 2022–2023 because it caused more problems than it solved (see Chromium bug).

// What does this mean for you?
// You cannot use HTTP/2 push from your Node.js or React app and expect browsers to benefit.
// Nginx still supports the http2_push directive, but browsers will ignore pushed resources.
// Best practice now:
// Use <link rel="preload"> in your HTML to hint to browsers to load important resources early.
