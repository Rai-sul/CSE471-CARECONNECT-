import express from "express";
import {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST: /api/payments - Create payment
router.post("/", createPayment);

// PUT: /api/payments/:paymentId/confirm - Confirm payment
router.put("/:paymentId/confirm", confirmPayment);

// GET: /api/payments - Get payment history
router.get("/", getPaymentHistory);

// GET: /api/payments/:id - Get payment by ID
router.get("/:id", getPaymentById);

export default router;

