import express from "express";
import * as resumeController from "../controllers/resumeController.js";

const router = express.Router();

// Define API endpoints
router.get("/resumes", resumeController.getAllResumes);
router.post("/resumes", resumeController.createResume);
router.get("/resumes/:id", resumeController.getResumeById);
router.put("/resumes/:id", resumeController.updateResume);
router.delete("/resumes/:id", resumeController.deleteResume);

export default router;
