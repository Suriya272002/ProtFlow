import { Router } from "express";
import {
  getCustomization,
  updateCustomization,
  getThemeConfig,
} from "../controllers/customizationController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", getCustomization);
router.get("/theme", getThemeConfig);
router.patch("/", authenticate, requireAdmin, updateCustomization);

export default router;
