import { z } from "zod";

export const authorSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().optional(),
    website: z.string().url("Invalid URL format").optional(),
  })
  .strict();

export const partialAuthorSchema = authorSchema.partial();
export const idSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
});
