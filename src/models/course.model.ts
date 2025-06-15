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

import mongoose, { Schema, Document, SchemaTypeOptions } from "mongoose";

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
  price?: number;
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

const priceField: SchemaTypeOptions<number> = {
  type: Number,
  min: 10,
  max: 100,
  get: (v: number) => Math.round(v), // on GET
  set: (v: number) => Math.round(v), //on POST
  required: function (this: ICourse) {
    return this.isPublished === true;
  },
};

export interface ICourse extends Document {
  title: string;
  instructor: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  date: Date;
  credits: number;
  description?: string | null;
  isPublished?: boolean;
  price?: number;
  genre: string;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true, index: true },
    instructor: { type: String, required: true, trim: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    // tags: { type: [String], trim: true },
    tags: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one tag is required.",
      },
      // For API or Server-side validation we can use a async custom validator
      // validate: {
      //   validator: async function (v: string[]) {
      //     // Simulate async validation
      //     await new Promise((resolve) => setTimeout(resolve, 10000));
      //     return Array.isArray(v) && v.length > 0;
      //   },
      //   message: "At least one tag is required.",
      // },
      trim: true,
    },
    date: { type: Date, default: Date.now },
    credits: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true, default: null },
    isPublished: { type: Boolean, default: false },
    price: {
      type: Number,
      min: [10, "Price must be at least 10"],
      max: [100, "Price must be at most 100"],
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      required: [
        function (this: ICourse) {
          return this.isPublished;
        },
        "Price is required when the course is published.",
      ] as unknown as boolean,
    },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  },
  { timestamps: true }
);

// Virtual for book's URL
CourseSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/api/course/${this._id}`;
});

CourseSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
