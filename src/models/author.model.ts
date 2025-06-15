import { validateBody } from "@/middleware/validate.middleware";
import mongoose, { Schema, model } from "mongoose";

/**
 * Interface for the parameters used to get authors.
 * This interface defines the structure of the query parameters
 * that can be used to filter and sort authors.
 * @interface GetAuthorsParams
 * @property {number} page - The page number for pagination.
 * @property {number} limit - The number of authors to return per page.
 * @property {string} sort - The field by which to sort the authors.
 * @property {"asc" | "desc"} order - The order of sorting, either ascending or descending.
 * @property {string} name - Filter authors by their name.
 * @property {string} bio - Filter authors by their biography.
 * @property {string} website - Filter authors by their website.
 */
export interface GetAuthorsParams {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  name: string;
  bio: string;
  website: string;
}

/**
 * Interface representing an author in the database.
 * This interface extends the Mongoose Document interface to include
 * the fields that an author document should have.
 * @interface IAuthor
 * @property {string} name - The name of the author.
 * @property {string} bio - A brief biography of the author.
 * @property {string} website - The author's personal or professional website.
 */
export interface IAuthor extends Document {
  name: string;
  bio: string;
  website: string;
}

/**
 * Mongoose schema for the Author model.
 * This schema defines the structure of the author documents
 * stored in the MongoDB database.
 * @constant authorSchema
 * @type {Schema<IAuthor>}
 * @property {string} name - The name of the author, required field.
 * @property {string} bio - A brief biography of the author, optional field.
 * @property {string} website - The author's personal or professional website, optional field.
 * @property {Date} createdAt - Timestamp of when the author document was created, automatically managed by Mongoose.
 * @property {Date} updatedAt - Timestamp of when the author document was last updated, automatically managed by Mongoose.
 */
const authorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    bio: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

// filepath: c:\Web Projects\fs-be-node-project\src\models\author.model.ts
authorSchema.post("validate", function (doc) {
  console.log("%s has been validated (but not saved yet)", doc._id);
});
authorSchema.post("save", function (doc) {
  console.log("%s has been saved", doc._id);
});
authorSchema.post("deleteOne", function (doc) {
  console.log("%s has been deleted", doc._id);
});

/**
 * Mongoose model for the Author schema.
 * This model provides an interface for interacting with the
 * authors collection in the MongoDB database.
 * @constant Author
 * @type {Model<IAuthor>}
 * @property {Schema<IAuthor>} authorSchema - The schema defining the structure of the author documents.
 * @property {string} name - The name of the author, required field.
 * @property {string} bio - A brief biography of the author, optional field.
 * @property {string} website - The author's personal or professional website, optional field.
 * @property {Date} createdAt - Timestamp of when the author document was created, automatically managed by Mongoose.
 * @property {Date} updatedAt - Timestamp of when the author document was last updated, automatically managed by Mongoose.
 */
export const Author = model<IAuthor>("Author", authorSchema);
