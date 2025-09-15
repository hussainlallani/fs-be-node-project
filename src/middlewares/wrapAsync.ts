import { Request, Response, NextFunction } from "express";

export const wrapAsync =
  <T extends Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<void>
  ) =>
  (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
