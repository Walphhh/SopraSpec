import { Router } from "express";
import SystemStack from "../controllers/system-stack-controller";

const router = Router();

router.get("/:id", SystemStack.getSystemStackById);

export default router;