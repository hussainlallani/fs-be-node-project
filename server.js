import express from "express";
import Logger from "./logger.js";
import { MongoClient } from "mongodb";
import { z } from "zod";
import helmet from "helmet";
import morgan from "morgan";
import config from "config";
import debug from "debug";
// routes
import { router as homeRouter } from "./src/routes/home.js";
import { router as courseRouter } from "./src/routes/courses.js";

const startupDebugger = debug("app:startup");
const dbDebugger = debug("app:db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", homeRouter);
app.use("/api/courses", courseRouter);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

dbDebugger("Connected to the database...");

app.set("view engine", "pug");
app.set("views", "./src/views"); //default

console.log(`NODE_ENV: ${process.env.NODE_ENV}`); //undefined
console.log(`APP: ${app.get("env")}`); // development
console.log(config.get("name"));
console.log(config.get("mail.host"));

app.use(helmet());

// Middleware to parse JSON requests
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
    inflate: true,
    limit: "1mb",
    parameterLimit: 5000,
    type: "application/x-www-form-urlencoded",
  })
);

app.use(express.static("public"));

const uri = "mongodb://157.173.198.244:27017"; // or your connection string
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("test");
    const collection = db.collection("demo");
    const result = await collection.insertOne({ hello: "world" });
    console.log(result);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
