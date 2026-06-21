import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  bookOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// Public booking endpoint (no auth required — used by booking form)
router.post("/book", bookOrder);

// Protected endpoints
router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrderById);
router.post("/", authenticate, createOrder);
router.patch("/:id", authenticate, updateOrder);
router.delete("/:id", authenticate, requireAdmin, deleteOrder);

export default router;
