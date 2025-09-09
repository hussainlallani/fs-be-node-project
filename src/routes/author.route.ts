import express, { Response, NextFunction, Request } from "express";
import debug from "debug";
// import { z } from "zod";

// import {
//   courseSchema,
//   partialCourseSchema,
//   courseQuerySchema,
//   idSchema,
// } from "../validators/courseSchemas.js";

// import {
//   validateBody,
//   validateQuery,
//   validateParams,
// } from "../middleware/validate.js";

import {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  // patchAuthor,
  deleteAuthor,
} from "../controllers/author.controller.js";
import {
  validateBody,
  validateQuery,
} from "../middlewares/validate.middleware.js";
import { courseQuerySchema } from "../schemas/course.schema.js";
import { GetCoursesParams } from "../models/course.model.js";
import { GetAuthorsParams } from "../models/author.model.js";
import { authorSchema } from "../schemas/author.schema.js";
import { partialAuthorSchema } from "../schemas/author.schema.js";

// import { CustomRequest } from "../index.js";
// import { ErrorWithStatus } from "../controllers/course.js";

const routeDebugger = debug("app:route");
export const router = express.Router();

interface CustomError extends Error {
  status?: number;
  details?: unknown;
}

// GET all courses
router.get(
  "/",
  // validateQuery(courseQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        bio,
        website,
        // } = req.query as unknown as z.infer<typeof courseQuerySchema>;
      } = req.query as Partial<GetAuthorsParams>;

      // const courses = await getCourses(req.db!, {
      //   limit,
      //   page,
      //   sort,
      //   order,
      //   title,
      //   instructor,
      //   tags,
      //   description,
      //   credits,
      //   minCredits,
      //   maxCredits,
      //   isPublished,
      //   startDate,
      //   endDate,
      // });
      const courses = await getAuthors({
        name,
        bio,
        website,
      });
      res.status(200).json(courses);
    } catch (err) {
      next(err);
    }
  }
);

// GET course by ID
router.get(
  "/:id",
  // validateParams(idSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const course = await getCourseById(req.db!, req.params.id);
      const author = await getAuthorById(req.params.id);
      res.status(200).json(author);
    } catch (err) {
      next(err);
    }
  }
);

// POST new course
router.post(
  "/",
  validateBody(partialAuthorSchema), // Assuming you have an authorSchema for validation
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      routeDebugger("POST /api/course received:", req.body);
      // const client = (req.db as any).client; // Or however you access the client
      // const course = await createCourse(client, req.db!, req.body);
      const author = await createAuthor(req.body);
      res.status(201).json(author);
    } catch (err) {
      next(err);
    }
  }
);

// PUT update course
router.put(
  "/:id",
  // validateParams(idSchema),
  // validateBody(courseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const course = await updateCourse(req.db!, req.params.id, req.body);
      const author = await updateAuthor(req.params.id, req.body);
      res.status(200).json(author);
    } catch (err) {
      next(err);
    }
  }
);

// PATCH update course
router.patch(
  "/:id",
  // validateParams(idSchema),
  // validateBody(partialCourseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if (Object.keys(req.body).length === 0) {
      //   const err: ErrorWithStatus = new Error("No fields provided for update");
      //   err.status = 400;
      //   throw err;
      // }

      // const course = await patchCourse(req.db!, req.params.id, req.body);
      const author = await updateAuthor(req.params.id, req.body);
      res.status(200).json(author);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE a course
router.delete(
  "/:id",
  // validateParams(idSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const result = await deleteCourse(req.db!, req.params.id);
      const result = await deleteAuthor(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);
