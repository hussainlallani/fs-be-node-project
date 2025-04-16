import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  instructor: z.string().min(1, "Instructor is required"),
  tags: z.array(z.string()).min(1, "Tags must be a non-empty array of strings"),
  credits: z.number().int().min(1).max(5, "Credits must be between 1 and 5"),
  description: z.string().optional(),
  isPublished: z.boolean().optional(),
  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Date must be a valid ISO 8601 date",
    })
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const partialCourseSchema = courseSchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided for update",
  });

export const idSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
});

export const courseQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .refine((val) => val >= 1 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1))
    .refine((val) => val >= 1, { message: "Page must be at least 1" }),
  sort: z
    .enum([
      "title",
      "instructor",
      "tags",
      "date",
      "credits",
      "description",
      "isPublished",
    ])
    .optional(),
  order: z.enum(["asc", "desc"]).optional(),
  title: z.string().min(1, "Title must be a non-empty string").optional(),
  instructor: z
    .string()
    .min(1, "Instructor must be a non-empty string")
    .optional(),
  tags: z.string().min(1, "Tags must be a non-empty string").optional(),
  description: z
    .string()
    .min(1, "Description must be a non-empty string")
    .optional(),
  credits: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined))
    .refine((val) => val === undefined || (val >= 1 && val <= 5), {
      message: "Credits must be between 1 and 5",
    }),
  minCredits: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined))
    .refine((val) => val === undefined || val >= 1, {
      message: "minCredits must be at least 1",
    }),
  maxCredits: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined))
    .refine((val) => val === undefined || val <= 5, {
      message: "maxCredits must be at most 5",
    }),
  isPublished: z
    .string()
    .optional()
    .transform((val) => (val ? val === "true" : undefined)),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "startDate must be a valid ISO 8601 date",
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "endDate must be a valid ISO 8601 date",
    })
    .transform((val) => (val ? new Date(val) : undefined)),
});
