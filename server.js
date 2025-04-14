import express from "express";
import Logger from "./logger.js";
import { MongoClient } from "mongodb";
import { z } from "zod";
import helmet from "helmet";
import morgan from "morgan";
import config from "config";
import debug from "debug";

const startupDebugger = debug("app:startup");
const dbDebugger = debug("app:db");

const app = express();
const PORT = process.env.PORT || 3000;

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

dbDebugger("Connected to the database...");

app.set("view engine", "pug");
app.set("views", "./views"); //default

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

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
];

// Basic route
app.get("/", (req, res) => {
  // res.status(200).json({
  //   message: "Welcome to the API Builder!",
  //   status: "success",
  //   api_version: "1.0.0", // Example version, adjust as needed
  //   description:
  //     "This is the main entry point of the API. For more details, check the documentation.",
  // });
  res.render("index", { title: "My Express App", message: "Hello!" });
});

app.get("/api/courses", (req, res) => {
  // If there are no courses, return an empty array with a message
  if (courses.length === 0) {
    return res.status(200).json({
      message: "No courses found.",
      data: [],
    });
  }

  // Optional: Handle pagination or other query parameters
  const { limit = 10, page = 1 } = req.query; // Default to limit=10, page=1

  const paginatedCourses = courses.slice((page - 1) * limit, page * limit);

  // Return the paginated courses with metadata (like total count)
  res.status(200).json({
    message: "Courses retrieved successfully.",
    data: paginatedCourses,
    pagination: {
      total: courses.length,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(courses.length / limit),
    },
  });
});

app.get("/api/courses/:id", (req, res) => {
  // Parse course ID from request params and find the course
  const courseId = parseInt(req.params.id);

  if (isNaN(courseId)) {
    return res.status(400).json({
      error: "Invalid ID format.",
      message: "Course ID must be a valid number.",
    });
  }

  // Find the course with the given ID
  const course = courses.find((course) => course.id === courseId);

  if (!course) {
    return res.status(404).json({
      error: "Resource not found.",
      message: `Course with ID ${courseId} not found.`,
    });
  }

  // If course is found, return it
  return res.status(200).json(course);
});

app.post("/api/courses", (req, res) => {
  // Zod schema for validating course data
  const courseSchema = z.object({
    name: z
      .string({
        required_error: "Course name is required.",
        invalid_type_error: "Course name must be a string.",
      })
      .min(1, "Course name cannot be empty."),
  });

  // Safe parse the request body to validate
  const parseResult = courseSchema.safeParse(req.body);

  if (!parseResult.success) {
    // Format error messages
    const errors = parseResult.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return res.status(400).json({
      error: "Validation failed.",
      details: errors,
    });
  }

  // Create the new course
  const newCourse = {
    id: courses.length + 1,
    name: parseResult.data.name,
  };

  // Add the course to the courses array
  courses.push(newCourse);

  return res.status(201).json({
    message: "Course created successfully.",
    course: newCourse,
  });
});

app.put("/api/courses/:id", (req, res) => {
  const courseId = parseInt(req.params.id, 10);

  // Find the index of the course to update
  const existingCourseIndex = courses.findIndex(
    (course) => course.id === courseId
  );

  if (existingCourseIndex === -1) {
    return res.status(404).json({ error: "Course not found." });
  }

  // Zod schema for validation
  const courseUpdateSchema = z.object({
    name: z
      .string({
        required_error: "Course name is required.",
        invalid_type_error: "Course name must be a string.",
      })
      .min(1, "Course name cannot be empty."),
  });

  const validationResult = courseUpdateSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    return res.status(400).json({ errors });
  }

  // Update course with new name
  courses[existingCourseIndex].name = validationResult.data.name;

  return res.status(200).json({
    message: "Course updated successfully.",
    course: courses[existingCourseIndex],
  });
});

app.delete("/api/courses/:id", (req, res) => {
  const courseId = parseInt(req.params.id, 10);

  // Find the index of the course to delete
  const existingCourseIndex = courses.findIndex(
    (course) => course.id === courseId
  );

  if (existingCourseIndex === -1) {
    return res.status(404).json({ error: "Course not found." });
  }

  // Remove course from the array
  const deletedCourse = courses.splice(existingCourseIndex, 1);

  return res.status(200).json({
    message: "Course deleted successfully.",
    course: deletedCourse[0],
  });
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
