import { Router } from "express";
import { login, logout, register, me } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
