import { ObjectId } from "mongodb";

// Validate ObjectId
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Create a course
export const createCourse = async (db, courseData) => {
  const collection = db.collection("courses");
  const document = {
    title: courseData.title,
    instructor: courseData.instructor,
    tags: courseData.tags,
    date: courseData.date ? new Date(courseData.date) : new Date(), // Default to Date.now()
    credits: Number.parseInt(courseData.credits, 10),
    description: courseData.description || null,
    isPublished: courseData.isPublished ?? false,
  };

  try {
    const result = await collection.insertOne(document);
    return { ...document, _id: result.insertedId };
  } catch (err) {
    throw new Error(`Failed to create course: ${err.message}`);
  }
};

// Get all courses
export const getCourses = async (db) => {
  const collection = db.collection("courses");
  try {
    return await collection.find().toArray();
  } catch (err) {
    throw new Error(`Failed to retrieve courses: ${err.message}`);
  }
};

// Get a course by ID
export const getCourseById = async (db, id) => {
  if (!isValidObjectId(id)) {
    throw new Error("Invalid ObjectId format");
  }
  const collection = db.collection("courses");
  try {
    const course = await collection.findOne({ _id: new ObjectId(id) });
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  } catch (err) {
    throw new Error(`Failed to retrieve course: ${err.message}`);
  }
};

// Update a course
export const updateCourse = async (db, id, updateData) => {
  if (!isValidObjectId(id)) {
    throw new Error("Invalid ObjectId format");
  }
  const collection = db.collection("courses");
  const updateDoc = {
    $set: {
      title: updateData.title,
      instructor: updateData.instructor,
      tags: updateData.tags,
      date: updateData.date ? new Date(updateData.date) : new Date(),
      credits: Number.parseInt(updateData.credits, 10),
      description: updateData.description || null,
      isPublished: updateData.isPublished ?? false,
    },
  };

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc,
      { upsert: false }
    );
    if (result.matchedCount === 0) {
      throw new Error("Course not found");
    }
    return await getCourseById(db, id);
  } catch (err) {
    throw new Error(`Failed to update course: ${err.message}`);
  }
};

// Delete a course
export const deleteCourse = async (db, id) => {
  if (!isValidObjectId(id)) {
    throw new Error("Invalid ObjectId format");
  }
  const collection = db.collection("courses");
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error("Course not found");
    }
    return { message: "Course deleted successfully" };
  } catch (err) {
    throw new Error(`Failed to delete course: ${err.message}`);
  }
};
