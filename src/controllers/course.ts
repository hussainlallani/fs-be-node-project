import { Db, ObjectId } from "mongodb";

export interface ErrorWithStatus extends Error {
  status?: number;
  details?: unknown;
}

export interface Course {
  _id?: ObjectId;
  title: string;
  instructor: string;
  tags: string[];
  date: Date;
  credits: number;
  description?: string | null;
  isPublished?: boolean;
}

export interface PaginationOptions {
  limit?: number;
  page?: number;
}

export interface CourseResponse {
  message: string;
  data: Course[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
}

export async function createCourse(
  db: Db,
  courseData: Course
): Promise<Course> {
  if (!db) throw new Error("Database connection not provided");
  const collection = db.collection<Course>("courses");
  const document: Course = {
    title: courseData.title,
    instructor: courseData.instructor,
    tags: courseData.tags,
    date: courseData.date ?? new Date(),
    credits: courseData.credits,
    description: courseData.description ?? null,
    isPublished: courseData.isPublished ?? false,
  };

  try {
    const result = await collection.insertOne(document);
    return { ...document, _id: result.insertedId };
  } catch (err: any) {
    if (err.message.includes("Document failed validation")) {
      const error: ErrorWithStatus = new Error("Invalid course data");
      error.status = 400;
      error.details = err.errInfo?.details;
      throw error;
    }
    throw err;
  }
}

export async function getCourses(
  db: Db,
  { limit = 10, page = 1 }: PaginationOptions = {}
): Promise<CourseResponse> {
  if (!db) throw new Error("Database connection not provided");
  const collection = db.collection<Course>("courses");
  try {
    const total = await collection.countDocuments();
    const courses = await collection
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    return {
      message: courses.length
        ? "Courses retrieved successfully"
        : "No courses found",
      data: courses,
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err: any) {
    const error: ErrorWithStatus = new Error("Failed to retrieve courses");
    error.status = 500;
    throw error;
  }
}

export async function getCourseById(db: Db, id: string): Promise<Course> {
  if (!db) throw new Error("Database connection not provided");
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    const error: ErrorWithStatus = new Error("Invalid ObjectId format");
    error.status = 400;
    throw error;
  }
  const collection = db.collection<Course>("courses");
  try {
    const course = await collection.findOne({ _id: new ObjectId(id) });
    if (!course) {
      const error: ErrorWithStatus = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    return course;
  } catch (err: any) {
    if (!err.status) {
      err.status = 500;
      err.message = "Failed to retrieve course";
    }
    throw err;
  }
}

export async function updateCourse(
  db: Db,
  id: string,
  updateData: Course
): Promise<Course> {
  if (!db) throw new Error("Database connection not provided");
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    const error: ErrorWithStatus = new Error("Invalid ObjectId format");
    error.status = 400;
    throw error;
  }
  const collection = db.collection<Course>("courses");
  const updateDoc = {
    $set: {
      title: updateData.title,
      instructor: updateData.instructor,
      tags: updateData.tags,
      date: updateData.date ?? new Date(),
      credits: updateData.credits,
      description: updateData.description ?? null,
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
      const error: ErrorWithStatus = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    return await getCourseById(db, id);
  } catch (err: any) {
    if (err.message.includes("Document failed validation")) {
      const error: ErrorWithStatus = new Error("Invalid course data");
      error.status = 400;
      error.details = err.errInfo?.details;
      throw error;
    }
    if (!err.status) {
      err.status = 500;
      err.message = "Failed to update course";
    }
    throw err;
  }
}

export async function patchCourse(
  db: Db,
  id: string,
  updateData: Partial<Course>
): Promise<Course> {
  if (!db) throw new Error("Database connection not provided");
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    const error: ErrorWithStatus = new Error("Invalid ObjectId format");
    error.status = 400;
    throw error;
  }
  const collection = db.collection<Course>("courses");
  const updateDoc: Record<string, any> = {};
  if (updateData.title) updateDoc.title = updateData.title;
  if (updateData.instructor) updateDoc.instructor = updateData.instructor;
  if (updateData.tags) updateDoc.tags = updateData.tags;
  if (updateData.date) updateDoc.date = new Date(updateData.date);
  if (updateData.credits !== undefined) updateDoc.credits = updateData.credits;
  if (updateData.description !== undefined)
    updateDoc.description = updateData.description;
  if (updateData.isPublished !== undefined)
    updateDoc.isPublished = updateData.isPublished;

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { upsert: false }
    );
    if (result.matchedCount === 0) {
      const error: ErrorWithStatus = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    return await getCourseById(db, id);
  } catch (err: any) {
    if (err.message.includes("Document failed validation")) {
      const error: ErrorWithStatus = new Error("Invalid course data");
      error.status = 400;
      error.details = err.errInfo?.details;
      throw error;
    }
    if (!err.status) {
      err.status = 500;
      err.message = "Failed to update course";
    }
    throw err;
  }
}

export async function deleteCourse(
  db: Db,
  id: string
): Promise<{ message: string }> {
  if (!db) throw new Error("Database connection not provided");
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    const error: ErrorWithStatus = new Error("Invalid ObjectId format");
    error.status = 400;
    throw error;
  }
  const collection = db.collection<Course>("courses");
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      const error: ErrorWithStatus = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    return { message: "Course deleted successfully" };
  } catch (err: any) {
    if (!err.status) {
      err.status = 500;
      err.message = "Failed to delete course";
    }
    throw err;
  }
}
