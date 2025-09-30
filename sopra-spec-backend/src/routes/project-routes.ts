import { Router } from "express";
import ProjectController from "@src/controllers/project-controller";

const router = Router();

// Projects
router.post("/", ProjectController.createProject);
router.get("/", ProjectController.getProjectsByOwner);
router.get("/:id", ProjectController.getProjectById);
router.delete("/:id", ProjectController.deleteProject);

// Project Areas
router.post("/:projectId/areas", ProjectController.createProjectArea);
router.get("/:projectId/areas", ProjectController.getProjectAreas);

export default router;
