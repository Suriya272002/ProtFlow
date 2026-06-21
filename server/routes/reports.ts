import { Router } from "express";
import { getDailyReport, getMonthlyReport, getOrderSummary } from "../controllers/reportsController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/daily", authenticate, getDailyReport);
router.get("/monthly", authenticate, getMonthlyReport);
router.get("/summary", authenticate, getOrderSummary);

export default router;
