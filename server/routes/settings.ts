import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", getSettings);
router.patch("/", authenticate, requireAdmin, updateSettings);

export default router;
