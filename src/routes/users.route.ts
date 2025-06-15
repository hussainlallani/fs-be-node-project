import express, { Response, NextFunction, Request } from "express";
import debug from "debug";
import {
  createUser,
  getUsers,
  deleteUser,
  getUserById,
} from "@/controllers/users.controller";

const routeDebugger = debug("users:route");
export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    routeDebugger("Fetching all users");
    const users = await getUsers(); // Assuming getUsers is a function that fetches users
    res.status(200).json(users);
  } catch (error) {
    routeDebugger("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    routeDebugger("Fetching user with ID:", req.params.id);
    const user = await getUserById(req.params.id); // Assuming getUsers can also fetch by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    routeDebugger("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    routeDebugger("Creating new user with data:", req.body);
    // Assuming createUser is a function that creates a new user
    const newUser = await createUser("", req.body);
    res.status(201).json(newUser);
  } catch (error) {
    routeDebugger("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    routeDebugger("Updating user with ID:", req.params.id);
    // Assuming updateUser is a function that updates a user by ID
    const updatedUser = await createUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    routeDebugger("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      routeDebugger("Deleting user with ID:", req.params.id);
      // Assuming deleteUser is a function that deletes a user by ID
      const deletedUser = await deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      routeDebugger("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user", error });
    }
  }
);

// Export the router to be used in the main app
export default router;
