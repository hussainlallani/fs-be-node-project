import express, { Response, NextFunction } from "express";
import debug from "debug";
import { z } from "zod";

import {
  courseSchema,
  partialCourseSchema,
  courseQuerySchema,
  idSchema,
} from "../validators/courseSchemas";

import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middleware/validate";

import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  patchCourse,
  deleteCourse,
} from "../controllers/course";

import { CustomRequest } from "../index";
import { ErrorWithStatus } from "../controllers/course";

const routeDebugger = debug("app:route");
export const router = express.Router();

interface CustomError extends Error {
  status?: number;
  details?: unknown;
}

// GET all courses
import {} from "../controllers/course"; // 👈 import the type

router.get(
  "/",
  validateQuery(courseQuerySchema),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
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
      } = req.query as unknown as z.infer<typeof courseQuerySchema>;

      const courses = await getCourses(req.db!, {
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
  validateParams(idSchema),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const course = await getCourseById(req.db!, req.params.id);
      res.status(200).json(course);
    } catch (err) {
      next(err);
    }
  }
);

// POST new course
router.post(
  "/",
  validateBody(courseSchema),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      routeDebugger("POST /api/course received:", req.body);
      const course = await createCourse(req.db!, req.body);
      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  }
);

// PUT update course
router.put(
  "/:id",
  validateParams(idSchema),
  validateBody(courseSchema),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const course = await updateCourse(req.db!, req.params.id, req.body);
      res.status(200).json(course);
    } catch (err) {
      next(err);
    }
  }
);

// PATCH update course
router.patch(
  "/:id",
  validateParams(idSchema),
  validateBody(partialCourseSchema),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (Object.keys(req.body).length === 0) {
        const err: ErrorWithStatus = new Error("No fields provided for update");
        err.status = 400;
        throw err;
      }

      const course = await patchCourse(req.db!, req.params.id, req.body);
      res.status(200).json(course);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE a course
router.delete(
  "/:id",
  validateParams(idSchema),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const result = await deleteCourse(req.db!, req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);
