import { Router } from "express";
import { trackOrder } from "../controllers/trackingController";

const router = Router();

// Public route — anyone can track an order by booking ID or order number
router.get("/:identifier", trackOrder);

export default router;
