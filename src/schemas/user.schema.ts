import { z } from "zod";

// ObjectId regex for MongoDB _id (24 hex chars)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// User schema for full object validation
export const userSchema = z
  .object({
    name: z.string().min(3, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(50, { message: "Password must not exceed 50 characters" }),
  })
  .strict(); // Disallow extra properties

// For PATCH or partial updates
export const partialUserSchema = userSchema.partial();

// Schema to validate MongoDB ObjectId param
export const idSchema = z.object({
  id: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
});
