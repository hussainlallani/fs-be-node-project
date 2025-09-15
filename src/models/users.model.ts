import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

// ----------------------
// Interface Definitions
// ----------------------

export interface GetUsersParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  name?: string;
  email?: string;
  password?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Hashed before saving
  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

export type IUserSafe = Omit<IUser, "password" | "comparePassword">;

// ----------------------
// Schema Definition
// ----------------------

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// ----------------------
// Pre-save Hook: Hash Password
// ----------------------

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password hasn't changed

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

// ----------------------
// Method: Compare Password
// ----------------------

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ----------------------
// Model Export
// ----------------------

export const UserModel = model<IUser>("User", userSchema);
