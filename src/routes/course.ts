import express, { Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import debug from "debug";

import { ErrorWithStatus } from "../controllers/course";
import { CustomRequest } from "../index";

import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  patchCourse, // New import
  deleteCourse,
} from "../controllers/course";

const routeDebugger = debug("app:route");
export const router = express.Router();

interface CustomError extends Error {
  status?: number; //missing from default Error
  details?: unknown; //missing from default Error
}

// Validation middleware for full updates (PUT)
const validateCourse = [
  body("title").isString().notEmpty().withMessage("Title is required"),
  body("instructor")
    .isString()
    .notEmpty()
    .withMessage("Instructor is required"),
  body("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be a non-empty array")
    .custom((tags) => tags.every((tag: string) => typeof tag === "string"))
    .withMessage("Tags must be strings"),
  body("credits")
    .isInt({ min: 1, max: 5 })
    .withMessage("Credits must be an integer between 1 and 5"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean"),
  body("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date must be a valid ISO 8601 date"),
];

// Validation middleware for partial updates (PATCH)
const validatePartialCourse = [
  body("title")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Title must be a non-empty string"),
  body("instructor")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Instructor must be a non-empty string"),
  body("tags")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Tags must be a non-empty array")
    .custom((tags) => tags.every((tag: string) => typeof tag === "string"))
    .withMessage("Tags must be strings"),
  body("credits")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Credits must be an integer between 1 and 5"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean"),
  body("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date must be a valid ISO 8601 date"),
];

const validateId = [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid ObjectId"),
];

const validatePagination = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be at least 1")
    .toInt(),
];

// Routes
router.get(
  "/",
  validatePagination,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err: ErrorWithStatus = new Error("Validation failed");
        err.status = 400;
        err.details = errors.array();
        throw err;
      }
      const { limit = 10, page = 1 } = req.query;
      const courses = await getCourses(req.db!, {
        limit: parseInt(limit as string),
        page: parseInt(page as string),
      });
      res.status(200).json(courses);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id",
  validateId,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err: ErrorWithStatus = new Error("Invalid ObjectId");
        err.status = 400;
        throw err;
      }
      const course = await getCourseById(req.db!, req.params.id);
      res.status(200).json(course);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/",
  validateCourse,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      routeDebugger("POST /api/course received:", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err: ErrorWithStatus = new Error("Validation failed");
        err.status = 400;
        err.details = errors.array();
        routeDebugger("Validation errors:", errors.array());
        throw err;
      }
      const course = await createCourse(req.db!, req.body);
      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  validateId,
  validateCourse,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err: ErrorWithStatus = new Error("Validation failed");
        err.status = 400;
        err.details = errors.array();
        throw err;
      }
      const course = await updateCourse(req.db!, req.params.id, req.body);
      res.status(200).json(course);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:id",
  validateId,
  validatePartialCourse,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err: ErrorWithStatus = new Error("Validation failed");
        err.status = 400;
        err.details = errors.array();
        throw err;
      }
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

router.delete(
  "/:id",
  validateId,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err: ErrorWithStatus = new Error("Invalid ObjectId");
        err.status = 400;
        throw err;
      }
      const result = await deleteCourse(req.db!, req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);
