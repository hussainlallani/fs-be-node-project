import mongoose, { SortOrder } from "mongoose";

import { Author, IAuthor } from "../models/author.model.js";

export interface ErrorWithStatus extends Error {
  status?: number;
  details?: unknown;
}

export interface GetAuthorsOptions {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  name: string;
  bio: string;
  website: string;
}

/**
 *
 * @param data - Partial data to create a new author.
 * @throws {Error} If the data is invalid or if there is an error during saving.
 * @returns
 */
export async function createAuthor(data: Partial<IAuthor>): Promise<IAuthor> {
  const author = new Author(data);
  return await author.save();
}

/**
 *
 * @param options - Options for pagination and filtering authors.
 * @param options.page - The page number for pagination (default is 1).
 * @returns
 */
export async function getAuthors(options: Partial<GetAuthorsOptions> = {}) {
  const {
    page = 1,
    limit = 10,
    sort,
    order = "asc",
    name,
    bio,
    website,
  } = options;

  if (limit <= 0 || page <= 0) {
    throw new Error("Limit and page must be positive numbers");
  }

  const skip = (page - 1) * limit;

  // 🔍 Build query object dynamically
  const query: Record<string, any> = {};

  // $regex: name tells MongoDB to match documents where the name field contains the given substring (name).
  // $options: "i" makes the match case-insensitive (so "John" matches "john", "JOHN", etc.).
  if (name) query.name = { $regex: name, $options: "i" };
  if (bio) query.bio = { $regex: bio, $options: "i" };
  if (website) query.website = { $regex: website, $options: "i" };

  const sortOptions: Record<string, SortOrder> = {};
  if (sort) sortOptions[sort] = order === "desc" ? -1 : 1;

  const [data, total] = await Promise.all([
    Author.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    Author.countDocuments(query),
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

/**
 *
 * @param id - The ID of the author to retrieve.
 * @throws {Error} If the ID is invalid or if the author is not found.
 * @returns
 */
export async function getAuthorById(id: string): Promise<IAuthor | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  return await Author.findById(id);
}

/**
 *
 * @param id
 * @param updates
 * @returns
 */
export async function updateAuthor(
  id: string,
  updates: Partial<IAuthor>
): Promise<IAuthor | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  return await Author.findByIdAndUpdate(id, updates, { new: true });
}

/**
 *
 * @param id - The ID of the author to delete.
 * @throws {Error} If the ID is invalid or if the author is not found.
 * @returns
 */
export async function deleteAuthor(
  id: string
): Promise<{ deletedCount: number }> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  const res = await Author.deleteOne({ _id: id });
  return { deletedCount: res.deletedCount ?? 0 };
}
