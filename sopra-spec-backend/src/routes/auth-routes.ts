import { Router } from "express";
import Auth from "../controllers/auth-controller";

const router = Router();

router.post("/login/email-password", Auth.signInWithPassword);
router.post("/logout", Auth.logout);
router.post("/signup", Auth.signUpWithEmail);
router.post("/refresh-token", Auth.refreshToken);

export default router;
