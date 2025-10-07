import { Router } from "express";
import SystemStack from "../controllers/system-stack-controller";

const router = Router();

router.post("/recommend", SystemStack.getRecommendedSystems);
router.get("/selection-options", SystemStack.getSelectionOptions);
router.get("/:id", SystemStack.getSystemStackById);

export default router;