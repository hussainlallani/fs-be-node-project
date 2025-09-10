import express, { Response, NextFunction, Request } from "express";
import debug from "debug";
import {
  createUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  deleteUsersByIds,
} from "../controllers/users.controller.js";
import { MESSAGES } from "../config/messages.js";
import { getErrorMessage } from "../utils/error.util.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { userSchema } from "../schemas/user.schema.js";

const routeDebugger = debug("users:route");
export const router = express.Router();

router.get(
  "/",
  async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      routeDebugger("Fetching all users");
      const users = await getUsers();
      res.status(200).json(users);
    } catch (error) {
      routeDebugger("Error:", error);
      res
        .status(500)
        .json({ message: MESSAGES.ERROR_FETCH, error: getErrorMessage(error) });
    }
  }
);

router.get("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  try {
    routeDebugger("Fetching user with ID:", req.params.id);
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: MESSAGES.NOT_FOUND });
    }
    res.status(200).json(user);
  } catch (error) {
    routeDebugger("Error:", error);
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_FETCH, error: getErrorMessage(error) });
  }
});

router.post(
  "/bulk",
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      routeDebugger("Creating multiple users");
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: MESSAGES.INVALID_BODY });
      }
      const newUsers = await Promise.all(
        req.body.map((userData: any) => createUser("", userData))
      );
      res.status(201).json(newUsers);
    } catch (error) {
      routeDebugger("Error:", error);
      res.status(500).json({
        message: MESSAGES.ERROR_BULK_CREATE,
        error: getErrorMessage(error),
      });
    }
  }
);

router.post(
  "/",
  validateBody(userSchema),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      routeDebugger("Creating new user");
      const newUser = await createUser("", req.body);
      res.status(201).json(newUser);
    } catch (error) {
      routeDebugger("Error:", error);
      res.status(500).json({
        error: getErrorMessage(error),
        message: MESSAGES.ERROR_CREATE,
      });
    }
  }
);

router.put("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  try {
    routeDebugger("Updating user with ID:", req.params.id);
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: MESSAGES.NOT_FOUND });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    routeDebugger("Error:", error);
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_UPDATE, error: getErrorMessage(error) });
  }
});

router.delete(
  "/bulk",
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      routeDebugger("Bulk deleting users");
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: MESSAGES.NO_IDS_PROVIDED });
      }

      const result = await deleteUsersByIds(ids);
      res.status(200).json({
        message: "Users deleted successfully",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      routeDebugger("Error:", error);
      res.status(500).json({
        message: MESSAGES.ERROR_BULK_DELETE,
        error: getErrorMessage(error),
      });
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      routeDebugger("Deleting user with ID:", req.params.id);
      const deletedUser = await deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: MESSAGES.NOT_FOUND });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      routeDebugger("Error:", error);
      res.status(500).json({
        message: MESSAGES.ERROR_DELETE,
        error: getErrorMessage(error),
      });
    }
  }
);

export default router;
