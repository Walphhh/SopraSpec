import { Router } from "express";
import Auth from "../controllers/auth-controller";

const router = Router();

router.post("/login/email-password", Auth.signInWithPassword);
router.post("/logout", Auth.logout);

export default router;
