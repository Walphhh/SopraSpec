import { Router } from "express";
import { signInWithPassword, logout } from "../controllers/auth-controller";

const router = Router();

router.post("/login/email-password", signInWithPassword);
router.post("/logout", logout);

export default router;
