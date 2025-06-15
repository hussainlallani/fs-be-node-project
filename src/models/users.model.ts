import { Document, model, Schema } from "mongoose";

/**
 * Interface for the parameters used to get users.
 * This interface defines the structure of the query parameters
 * that can be used to filter and sort users.
 * @interface GetUsersParams
 * @property {number} page - The page number for pagination.
 * @property {number} limit - The number of users to return per page.
 * @property {string} sort - The field by which to sort the users.
 * @property {"asc" | "desc"} order - The order of sorting, either ascending or descending.
 * @property {string} name - Filter users by their name.
 * @property {string} email - Filter users by their email address.
 * @property {string} password - Filter users by their password (not recommended for security reasons).
 */
export interface GetUsersParams {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  name: string;
  email: string;
  password: string;
}

/**
 * Interface representing a user in the database.
 * This interface extends the Mongoose Document interface to include
 * the fields that a user document should have.
 * @interface IUser
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user (should be hashed in a real application).
 * * @property {Date} createdAt - Timestamp of when the user document was created, automatically managed by Mongoose.
 * * @property {Date} updatedAt - Timestamp of when the user document was last updated, automatically managed by Mongoose.
 * * Note: In a real application, passwords should be hashed and not stored in plain text.
 * * @property {string} [createdAt] - Timestamp of when the user document was created, automatically managed by Mongoose.
 * * @property {string} [updatedAt] - Timestamp of when the user document was last updated, automatically managed by Mongoose.
 * */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

/**
 * Mongoose schema for the User model.
 * This schema defines the structure of the user documents
 * stored in the MongoDB database.
 * @constant userSchema
 * @type {Schema<IUser>}
 * @property {string} name - The name of the user, required field.
 * @property {string} email - The email address of the user, required field and must be unique.
 * @property {string} password - The password of the user, required field (should be hashed in a real application).
 * @property {Date} createdAt - Timestamp of when the user document was created, automatically managed by Mongoose.
 * @property {Date} updatedAt - Timestamp of when the user document was last updated, automatically managed by Mongoose.
 * * Note: In a real application, passwords should be hashed and not stored in plain text.
 */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
