import express from "express";
export const router = express.Router();

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
];

router.get("/", (req, res) => {
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

router.get("/:id", (req, res) => {
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

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

router.get("/:year/:month", (req, res) => {
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
