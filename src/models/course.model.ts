// // Collections Schemas

// export const courseSchema = {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["title", "instructor", "tags", "date", "credits"],
//       properties: {
//         title: {
//           bsonType: "string",
//           description: "must be a string and is required",
//         },
//         instructor: {
//           bsonType: "string",
//           description: "must be a string and is required",
//         },
//         author: {
//           bsonType: "objectId",
//           description: "must be object Id",
//         },
//         tags: {
//           bsonType: "array",
//           items: {
//             bsonType: "string",
//             description: "each tag must be a string",
//           },
//           minItems: 1,
//           description:
//             "must be an array of at least one string and is required",
//         },
//         date: {
//           bsonType: "date",
//           description: "must be a date and is required",
//         },
//         credits: {
//           bsonType: "int",
//           minimum: 1,
//           maximum: 5,
//           description: "must be an integer between 1 and 5 and is required",
//         },
//         description: {
//           bsonType: ["string", "null"],
//           description: "must be a string or null if provided",
//         },
//         isPublished: {
//           bsonType: "bool",
//           description: "must be a boolean if provided",
//         },
//       },
//     },
//   },
//   validationLevel: "strict",
//   validationAction: "error",
// };

import mongoose, { Schema, Document } from "mongoose";

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  title?: string;
  instructor?: string;
  tags?: string[] | string;
  description?: string;
  credits?: number;
  minCredits?: number;
  maxCredits?: number;
  isPublished?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ICourse extends Document {
  title: string;
  instructor: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  date: Date;
  credits: number;
  description?: string | null;
  isPublished?: boolean;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true, index: true },
    instructor: { type: String, required: true, trim: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String, trim: true }],
    date: { type: Date, default: Date.now },
    credits: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true, default: null },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CourseSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
