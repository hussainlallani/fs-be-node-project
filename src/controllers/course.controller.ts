// import {
//   Db,
//   MongoClient,
//   ObjectId,
//   Filter,
//   WithId,
//   UpdateFilter,
// } from "mongodb";

// // ==================== Interfaces ====================
// export interface ErrorWithStatus extends Error {
//   status?: number;
//   details?: unknown;
// }

// export interface Course {
//   _id?: ObjectId;
//   title: string;
//   instructor: string;
//   author: ObjectId;
//   tags: string[];
//   date: Date;
//   credits: number;
//   description?: string | null;
//   isPublished?: boolean;
// }

// export interface GetCoursesParams extends PaginationOptions {
//   sort?: string;
//   order?: "asc" | "desc";
//   title?: string;
//   instructor?: string;
//   tags?: string | string[];
//   description?: string;
//   credits?: number;
//   minCredits?: number;
//   maxCredits?: number;
//   isPublished?: boolean;
//   startDate?: Date;
//   endDate?: Date;
// }

// export interface PaginatedResponse<T> {
//   data: T[];
//   pagination: {
//     total: number;
//     limit: number;
//     page: number;
//     totalPages: number;
//     hasNextPage: boolean;
//     hasPreviousPage: boolean;
//   };
// }// export interface PaginationOptions {
//   limit?: number;
//   page?: number;
// }

// // ==================== Utility Functions ====================
// function validateObjectId(id: string): ObjectId {
//   if (!ObjectId.isValid(id)) {
//     const error: ErrorWithStatus = new Error("Invalid ObjectId format");
//     error.status = 400;
//     throw error;
//   }
//   return new ObjectId(id);
// }

// function buildCreditsQuery(
//   credits?: number,
//   minCredits?: number,
//   maxCredits?: number
// ): Record<string, number> | undefined {
//   if (credits !== undefined) return { credits };

//   const query: Record<string, number> = {};
//   if (minCredits !== undefined) query.$gte = minCredits;
//   if (maxCredits !== undefined) query.$lte = maxCredits;

//   return Object.keys(query).length ? query : undefined;
// }

// // ==================== Service Functions ====================
// export const createCourse = async (
//   client: MongoClient,
//   db: Db,
//   courseData: Omit<Course, "_id">
// ): Promise<WithId<Course>> => {
//   if (!db) throw new Error("Database connection not provided");

//   const collection = db.collection<Course>("courses");

//   // const objectID = new ObjectId().toHexString();
//   // console.log(objectID);

//   const document: Omit<Course, "_id"> = {
//     title: courseData.title.trim(),
//     instructor: courseData.instructor.trim(),
//     // author: validateObjectId(courseData.author as unknown as string),
//     author: new ObjectId(courseData.author),
//     tags: courseData.tags?.map((tag) => tag.trim()) || [],
//     date: courseData.date ?? new Date(),
//     credits: Math.min(Math.max(courseData.credits || 1, 1)), // Minimum 1 credit
//     description: courseData.description?.trim() || null,
//     isPublished: courseData.isPublished ?? false,
//   };

//   const session = client.startSession();

//   try {
//     session.startTransaction();
//     const result = await collection.insertOne(document, { session });
//     const inserted = await collection.findOne(
//       { _id: result.insertedId },
//       { session }
//     );
//     if (!inserted) throw new Error("Failed to retrieve created course");
//     await session.commitTransaction();
//     return inserted;
//   } catch (err: any) {
//     await session.abortTransaction();
//     if (err.code === 121) {
//       // Validation error
//       const error: ErrorWithStatus = new Error("Invalid course data");
//       error.status = 400;
//       error.details = err.errInfo?.details;
//       throw error;
//     }
//     if (err.code === 11000) {
//       // Duplicate key
//       const error: ErrorWithStatus = new Error(
//         "Course with this title already exists"
//       );
//       error.status = 409;
//       throw error;
//     }
//     console.error("Database error:", err);
//     throw err;
//   } finally {
//     session.endSession();
//   }
// };

// export async function getCourses(
//   db: Db,
//   params: GetCoursesParams
// ): Promise<PaginatedResponse<WithId<Course>>> {
//   const {
//     limit = 10,
//     page = 1,
//     sort,
//     order = "asc",
//     title,
//     instructor,
//     tags,
//     description,
//     credits,
//     minCredits,
//     maxCredits,
//     isPublished,
//     startDate,
//     endDate,
//   } = params;

//   // Validate input
//   if (limit <= 0 || page <= 0) {
//     const error: ErrorWithStatus = new Error(
//       "Limit and page must be positive numbers"
//     );
//     error.status = 400;
//     throw error;
//   }

//   const skip = (page - 1) * limit;
//   const query: Filter<Course> = {};

//   // Build query
//   if (title) query.title = { $regex: title, $options: "i" };
//   if (instructor) query.instructor = { $regex: instructor, $options: "i" };
//   if (description) query.description = { $regex: description, $options: "i" };
//   if (tags) {
//     query.tags = Array.isArray(tags) ? { $all: tags } : { $in: [tags] };
//   }

//   const creditsQuery = buildCreditsQuery(credits, minCredits, maxCredits);
//   if (creditsQuery) query.credits = creditsQuery;

//   if (isPublished !== undefined) query.isPublished = isPublished;

//   if (startDate || endDate) {
//     query.date = {};
//     if (startDate) query.date.$gte = startDate;
//     if (endDate) query.date.$lte = endDate;
//   }

//   // Build sort options
//   const sortOptions: Record<string, 1 | -1> = {};
//   if (sort) sortOptions[sort] = order === "asc" ? 1 : -1;

//   try {
//     const collection = db.collection<Course>("courses");

//     const [data, total] = await Promise.all([
//       collection
//         .find(query)
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(limit)
//         .toArray(),
//       collection.countDocuments(query),
//     ]);

//     return {
//       data,
//       pagination: {
//         total,
//         limit,
//         page,
//         totalPages: Math.ceil(total / limit),
//         hasNextPage: page * limit < total,
//         hasPreviousPage: page > 1,
//       },
//     };
//   } catch (err) {
//     console.error("Database query failed:", err);
//     const error: ErrorWithStatus = new Error("Failed to fetch courses");
//     error.status = 500;
//     throw error;
//   }
// }

// export async function getCourseById(
//   db: Db,
//   id: string
// ): Promise<WithId<Course>> {
//   if (!db) throw new Error("Database connection not provided");

//   const collection = db.collection<Course>("courses");
//   const _id = validateObjectId(id);

//   try {
//     const course = await collection.findOne({ _id });
//     if (!course) {
//       const error: ErrorWithStatus = new Error("Course not found");
//       error.status = 404;
//       throw error;
//     }
//     return course;
//   } catch (err: any) {
//     console.error("Database error:", err);
//     const error: ErrorWithStatus = new Error("Failed to retrieve course");
//     error.status = 500;
//     throw error;
//   }
// }

// export async function patchCourse(
//   db: Db,
//   id: string,
//   updateData: Partial<Course>
// ): Promise<WithId<Course>> {
//   if (!db) throw new Error("Database connection not provided");

//   const collection = db.collection<Course>("courses");
//   const _id = validateObjectId(id); // Reuse the validation function from earlier

//   // Build the update document with proper typing and sanitization
//   const updateDoc: UpdateFilter<Course> = {
//     $set: {
//       ...(updateData.title && { title: updateData.title.trim() }),
//       ...(updateData.instructor && {
//         instructor: updateData.instructor.trim(),
//       }),
//       ...(updateData.tags && {
//         tags: updateData.tags.map((tag) => tag.trim()),
//       }),
//       ...(updateData.date && { date: new Date(updateData.date) }),
//       ...(updateData.credits !== undefined && { credits: updateData.credits }),
//       ...(updateData.description !== undefined && {
//         description: updateData.description?.trim() || null,
//       }),
//       ...(updateData.isPublished !== undefined && {
//         isPublished: updateData.isPublished,
//       }),
//     },
//     $currentDate: {
//       updatedAt: true, // Optional: Add an updatedAt timestamp
//     },
//   };

//   try {
//     // Option 1: Atomic findOneAndUpdate approach
//     const result = await collection.findOneAndUpdate({ _id }, updateDoc, {
//       returnDocument: "after",
//       includeResultMetadata: true,
//     });

//     if (!result.ok || !result.value) {
//       const error: ErrorWithStatus = new Error("Course not found");
//       error.status = 404;
//       throw error;
//     }
//     return result.value;
//   } catch (err: any) {
//     if (err.code === 121) {
//       // MongoDB validation error code
//       const error: ErrorWithStatus = new Error("Invalid course data");
//       error.status = 400;
//       error.details = err.errInfo?.details;
//       throw error;
//     }
//     if (err.code === 11000) {
//       // Duplicate key error
//       const error: ErrorWithStatus = new Error(
//         "Course with this title already exists"
//       );
//       error.status = 409;
//       throw error;
//     }

//     console.error("Database error:", err);
//     const error: ErrorWithStatus = new Error("Failed to update course");
//     error.status = 500;
//     throw error;
//   }
// }

// export async function updateCourse(
//   db: Db,
//   id: string,
//   updateData: Partial<Course>
// ): Promise<WithId<Course>> {
//   if (!db) throw new Error("Database connection not provided");

//   const collection = db.collection<Course>("courses");
//   const _id = validateObjectId(id);

//   const updateDoc: UpdateFilter<Course> = {
//     $set: {
//       ...(updateData.title && { title: updateData.title.trim() }),
//       ...(updateData.instructor && {
//         instructor: updateData.instructor.trim(),
//       }),
//       ...(updateData.tags && {
//         tags: updateData.tags.map((tag) => tag.trim()),
//       }),
//       ...(updateData.date && { date: updateData.date }),
//       ...(updateData.credits !== undefined && { credits: updateData.credits }),
//       ...(updateData.description !== undefined && {
//         description: updateData.description?.trim() || null,
//       }),
//       ...(updateData.isPublished !== undefined && {
//         isPublished: updateData.isPublished,
//       }),
//     },
//   };

//   try {
//     const result = await collection.findOneAndUpdate({ _id }, updateDoc, {
//       returnDocument: "after",
//       // Omit projection entirely to return full document
//     });

//     console.log("result: ", result);

//     if (!result) {
//       const error: ErrorWithStatus = new Error("Course not found");
//       error.status = 404;
//       throw error;
//     }
//     return result;
//   } catch (err: any) {
//     if (err.code === 121) {
//       // Validation error
//       const error: ErrorWithStatus = new Error("Invalid course data");
//       error.status = 400;
//       error.details = err.errInfo?.details;
//       throw error;
//     }
//     console.error("Database error:", err);
//     const error: ErrorWithStatus = new Error("Failed to update course");
//     error.status = 500;
//     throw error;
//   }
// }

// export async function deleteCourse(
//   db: Db,
//   id: string
// ): Promise<{ deletedCount: number }> {
//   if (!db) throw new Error("Database connection not provided");

//   const collection = db.collection<Course>("courses");
//   const _id = validateObjectId(id);

//   try {
//     const result = await collection.deleteOne({ _id });
//     if (result.deletedCount === 0) {
//       const error: ErrorWithStatus = new Error("Course not found");
//       error.status = 404;
//       throw error;
//     }
//     return { deletedCount: result.deletedCount };
//   } catch (err: any) {
//     console.error("Database error:", err);
//     const error: ErrorWithStatus = new Error("Failed to delete course");
//     error.status = 500;
//     throw error;
//   }
// }

import mongoose, { SortOrder } from "mongoose";

import { Course, ICourse } from "../models/course.model.js";

export interface ErrorWithStatus extends Error {
  status?: number;
  details?: unknown;
}

export interface GetCoursesOptions {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  title: string;
  instructor: string;
  tags: string[] | string;
  description: string;
  credits: number;
  minCredits: number;
  maxCredits: number;
  isPublished: boolean;
  price: number;
  startDate: Date;
  endDate: Date;
}

export async function createCourse(data: Partial<ICourse>): Promise<ICourse> {
  const course = new Course(data);
  return await course.save();
}

export async function getCourses(options: Partial<GetCoursesOptions> = {}) {
  const {
    page = 1,
    limit = 10,
    sort,
    order = "asc",
    title,
    instructor,
    tags,
    description,
    credits,
    minCredits,
    maxCredits,
    isPublished,
    price,
    startDate,
    endDate,
  } = options;

  if (limit <= 0 || page <= 0) {
    throw new Error("Limit and page must be positive numbers");
  }

  const skip = (page - 1) * limit;

  // 🔍 Build query object dynamically
  const query: Record<string, any> = {};

  if (title) query.title = { $regex: title, $options: "i" };
  if (instructor) query.instructor = { $regex: instructor, $options: "i" };
  if (description) query.description = { $regex: description, $options: "i" };

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    query.tags = {
      $all: tagArray.map((tag) => new RegExp(`^${tag}$`, "i")),
    };
  }

  if (
    credits !== undefined ||
    minCredits !== undefined ||
    maxCredits !== undefined
  ) {
    query.credits = {};
    if (credits !== undefined) query.credits.$eq = credits;
    if (minCredits !== undefined) query.credits.$gte = minCredits;
    if (maxCredits !== undefined) query.credits.$lte = maxCredits;
  }

  if (isPublished !== undefined) query.isPublished = isPublished;
  if (price !== undefined) query.price = price;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const sortOptions: Record<string, SortOrder> = {};
  if (sort) sortOptions[sort] = order === "desc" ? -1 : 1;

  const [data, total] = await Promise.all([
    Course.find(query)
      // add field or use - is to remove fields
      // author is a document
      .populate("author", "name -_id")
      // .select("name author")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Course.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getCourseById(id: string): Promise<ICourse | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  return await Course.findById(id).lean();
}

export async function updateCourse(
  id: string,
  updates: Partial<ICourse>
): Promise<ICourse | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  return await Course.findByIdAndUpdate(id, updates, { new: true });
}

export async function deleteCourse(
  id: string
): Promise<{ deletedCount: number }> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  const res = await Course.deleteOne({ _id: id });
  return { deletedCount: res.deletedCount ?? 0 };
}
