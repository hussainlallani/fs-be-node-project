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
} from "../controllers/course.controller.js";
import { validateQuery } from "../middleware/validate.middleware.js";
import { courseQuerySchema } from "../schemas/course.schema.js";
import { GetCoursesParams } from "../models/course.model.js";
import mongoose from "mongoose";

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
        price,
        startDate,
        endDate,
        // } = req.query as unknown as z.infer<typeof courseQuerySchema>;
      } = req.query as GetCoursesParams;

      console.log("price: ", req.query);

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
        price,
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

router.post(
  "/",
  // validateBody(courseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    routeDebugger("POST /course received:", req.body);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Pass the session to your createCourse function if it supports it
      const course = await createCourse(req.body);
      await session.commitTransaction();
      res.status(201).json(course);
    } catch (error) {
      await session.abortTransaction();
      for (const key in error as any) {
        console.log("Error key:", key);
        console.log("ERRRR ", (error as any)[key]);
      }
      const err: CustomError = new Error("Failed to create course");
      err.status = 500;
      err.details = error;
      next(err);
    } finally {
      session.endSession();
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

router.put(
  "/:id",
  // validateParams(idSchema),
  // validateBody(courseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Pass the session to your updateCourse function if it supports it
      const course = await updateCourse(req.params.id, req.body);
      await session.commitTransaction();
      res.status(200).json(course);
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  }
);

router.delete(
  "/:id",
  // validateParams(idSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Pass the session to your deleteCourse function if it supports it
      const result = await deleteCourse(req.params.id);
      await session.commitTransaction();
      res.status(200).json(result);
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  }
);
