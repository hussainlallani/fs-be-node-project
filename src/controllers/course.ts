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

export interface GetCoursesParams {
  limit: number;
  page: number;
  sort?: string;
  order?: "asc" | "desc";
  title?: string;
  instructor?: string;
  tags?: string;
  description?: string;
  credits?: number;
  minCredits?: number;
  maxCredits?: number;
  isPublished?: boolean;
  startDate?: Date;
  endDate?: Date;
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

export async function getCourses(db: Db, params: GetCoursesParams) {
  const {
    limit,
    page,
    sort,
    order,
    title,
    instructor,
    tags,
    description,
    credits,
    minCredits,
    maxCredits,
    isPublished,
    startDate,
    endDate,
  } = params;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};
  if (title) query.title = { $regex: title, $options: "i" };
  if (instructor) query.instructor = { $regex: instructor, $options: "i" };
  if (tags) query.tags = { $in: [tags] };
  if (description) query.description = { $regex: description, $options: "i" };
  if (credits !== undefined) query.credits = credits;
  if (minCredits !== undefined || maxCredits !== undefined) {
    query.credits = {};
    if (minCredits !== undefined) query.credits.$gte = minCredits;
    if (maxCredits !== undefined) query.credits.$lte = maxCredits;
  }
  if (isPublished !== undefined) query.isPublished = isPublished;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  // Build sort options
  const sortOptions: any = {};
  if (sort && order) {
    sortOptions[sort] = order === "asc" ? 1 : -1;
  }

  try {
    const courses = await db
      .collection<Course>("courses")
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();
    return courses;
  } catch (err) {
    const error: ErrorWithStatus = new Error("Failed to fetch courses");
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
