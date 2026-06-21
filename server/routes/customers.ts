import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getCustomers);
router.get("/:id", authenticate, getCustomerById);
router.post("/", authenticate, createCustomer);
router.patch("/:id", authenticate, updateCustomer);
router.delete("/:id", authenticate, requireAdmin, deleteCustomer);

export default router;
