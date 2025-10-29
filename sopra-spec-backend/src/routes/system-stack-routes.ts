import { Router } from "express";
import SystemStack from "../controllers/system-stack-controller";

const router = Router();

router.post("/recommend", SystemStack.getRecommendedSystems);
router.get("/options", SystemStack.getSelectionOptions);
router.post("/options", SystemStack.getDynamicSelectionOptions);
router.get("/:id/layers", SystemStack.getSystemStackLayers);
router.get("/:id", SystemStack.getSystemStackById);
router.post('/projects/:projectId/generate-pdf', SystemStack.generateProjectPDF);
export default router;
