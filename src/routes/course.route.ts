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
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  // patchCourse,
  deleteCourse,
} from "@/controllers/course.control.js";
import { GetCoursesParams } from "@/models/course.model.js";
import { validateQuery } from "@/middleware/validate.js";
import { courseQuerySchema } from "@/validators/courseSchemas.js";

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
  validateQuery(courseQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        limit,
        page,
        sort,
        order,
        title,
        instructor,
        tags,
        description,
        credits,
        minCredits,
        maxCredits,
        isPublished,
        startDate,
        endDate,
        // } = req.query as unknown as z.infer<typeof courseQuerySchema>;
      } = req.query as GetCoursesParams;

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
      const courses = await getCourses({
        limit,
        page,
        sort,
        order,
        title,
        instructor,
        tags,
        description,
        credits,
        minCredits,
        maxCredits,
        isPublished,
        startDate,
        endDate,
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
      const course = await getCourseById(req.params.id);
      res.status(200).json(course);
    } catch (err) {
      next(err);
    }
  }
);

// POST new course
router.post(
  "/",
  // validateBody(courseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      routeDebugger("POST /api/course received:", req.body);
      // const client = (req.db as any).client; // Or however you access the client
      // const course = await createCourse(client, req.db!, req.body);
      const course = await createCourse(req.body);
      res.status(201).json(course);
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
      const course = await updateCourse(req.params.id, req.body);
      res.status(200).json(course);
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
      const course = await updateCourse(req.params.id, req.body);
      res.status(200).json(course);
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
      const result = await deleteCourse(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);
