import mongoose, { SortOrder } from "mongoose";
import { IUser, UserModel } from "../models/users.model";

/**
 * Creates a new user in the database.
 * @param data - The user data to be created.
 * @returns A promise that resolves to the created user.
 */
export async function createUser(id: string, data: IUser): Promise<IUser> {
  const user = new UserModel(data);
  return await user.save();
}

/**
 * Fetch all users from the database.
 * @returns A promise that resolves to an array of users.
 */
export async function getUsers(id?: string): Promise<IUser[]> {
  return UserModel.find().select("-password").exec(); // Never expose password
}

/**
 * Get a user by their unique ID.
 * @param id - The user's ID.
 * @returns A promise that resolves to the user or null.
 */
export async function getUserById(id: string): Promise<IUser | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await UserModel.findById(id).select("-password").exec();
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  return user;
}

/**
 * Update a user by ID.
 * @param id - The user's ID.
 * @param data - The data to update.
 * @returns The updated user.
 */
export async function updateUser(
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await UserModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .exec();

  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  return user;
}

/**
 * Delete a user by ID.
 * @param id - The user's ID.
 * @returns The deleted user.
 */
export async function deleteUser(id: string): Promise<IUser | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await UserModel.findByIdAndDelete(id).select("-password").exec();
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  return user;
}

/**
 * Delete all users.
 */
export async function deleteAllUsers(): Promise<void> {
  const result = await UserModel.deleteMany({}).exec();
  if (result.deletedCount === 0) {
    throw new Error("No users found to delete");
  }
}

/**
 * Find a user by email.
 * @param email - The user's email.
 */
export async function getUserByEmail(email: string): Promise<IUser | null> {
  if (!email) throw new Error("Email is required");

  const user = await UserModel.findOne({ email }).select("-password").exec();
  if (!user) throw new Error(`User with email ${email} not found`);

  return user;
}

/**
 * Validate user credentials (for login).
 * @param email - The user's email.
 * @param password - The user's password.
 */
export async function getUserByEmailAndPassword(
  email: string,
  password: string
): Promise<IUser | null> {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await UserModel.findOne({ email }).exec();
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }

  // Remove password before returning
  const userObj = user.toObject();
  //   delete userObj.password;
  return userObj as IUser;
}

/**
 * Get users with pagination and optional filters.
 */
export async function getUsersWithPaginationAndFiltering({
  page = 1,
  limit = 10,
  sort = "name",
  order = "asc",
  name = "",
  email = "",
}: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  name?: string;
  email?: string;
}): Promise<{ users: IUser[]; total: number }> {
  const query: any = {};

  if (name) query.name = { $regex: name, $options: "i" };
  if (email) query.email = { $regex: email, $options: "i" };

  const total = await UserModel.countDocuments(query);
  const users = await UserModel.find(query)
    .select("-password")
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  return { users, total };
}
