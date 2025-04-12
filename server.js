import express from "express";
import Logger from "./logger.js";
import { MongoClient } from "mongodb";
import compression

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("API Builder YML!");
});

app.get("/courses", (req, res) => {
  res.send("Courses!");
});

app.get("/teachers", (req, res) => {
  res.send("teachers!");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

// const logger = new Logger();
// // Step1: Register a listener
// logger.on("messageLogged", (arg) => {
//   console.log("Listener called", arg);
// });

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
