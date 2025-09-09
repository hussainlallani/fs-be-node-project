import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

export function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
