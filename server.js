import express from "express";
import Logger from "./logger.js";
import { MongoClient } from "mongodb";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
];

// Basic route
app.get("/", (req, res) => {
  res.send("API Builder YML!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  res.send(course);
});

app.get("/api/courses/:year/:month", (req, res) => {
  res.send(
    "Your id: " +
      req.params.year +
      " your month: " +
      req.params.month +
      " sort by: " +
      JSON.stringify(req.query) // Convert query object to a string
  );
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
