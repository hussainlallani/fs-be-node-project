import { Schema, model } from "mongoose";

export interface GetAuthorsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  name?: string;
  bio?: string;
  website?: string;
}

export interface IAuthor extends Document {
  name: string;
  bio: string;
  website: string;
}

const authorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    bio: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

export const Author = model("Author", authorSchema);
