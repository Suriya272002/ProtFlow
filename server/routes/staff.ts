import { Router } from "express";
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getStaff);
router.get("/:id", authenticate, getStaffById);
router.post("/", authenticate, requireAdmin, createStaff);
router.patch("/:id", authenticate, requireAdmin, updateStaff);
router.delete("/:id", authenticate, requireAdmin, deleteStaff);

export default router;
