import { Response, NextFunction } from "express";
import { z } from "zod";
import { CustomRequest } from "../index";
import { ErrorWithStatus } from "../controllers/course";

export const validateBody =
  <Output, Input = Output>(schema: z.ZodType<Output, any, Input>) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      const error: ErrorWithStatus = new Error("Validation failed");
      error.status = 400;
      error.details = err instanceof z.ZodError ? err.errors : err;
      next(error);
    }
  };

export const validateQuery =
  <Output, Input = Output>(schema: z.ZodType<Output, any, Input>) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (err) {
      const error: ErrorWithStatus = new Error("Validation failed");
      error.status = 400;
      error.details = err instanceof z.ZodError ? err.errors : err;
      next(error);
    }
  };

export const validateParams =
  <Output, Input = Output>(schema: z.ZodType<Output, any, Input>) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.params);
      req.params = parsed as any;
      next();
    } catch (err) {
      const error: ErrorWithStatus = new Error("Validation failed");
      error.status = 400;
      error.details = err instanceof z.ZodError ? err.errors : err;
      next(error);
    }
  };
