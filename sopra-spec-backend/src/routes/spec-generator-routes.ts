import { Router } from "express";
import { generatePdf } from "../controllers/spec-pdf-controller";

const router = Router();

router.get("/generate-pdf", generatePdf);

export default router;
