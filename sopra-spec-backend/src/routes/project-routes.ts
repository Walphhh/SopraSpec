import { Router } from "express";
import ProjectController from "@src/controllers/project-controller";

const router = Router();

router.post("/", ProjectController.createProject);
router.get("/", ProjectController.getProjectsByUser); // GET /projects?ownerId=123

export default router;
