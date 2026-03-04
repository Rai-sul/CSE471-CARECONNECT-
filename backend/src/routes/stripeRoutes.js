import express from "express";
import {
  createPaymentIntent,
  handleStripeWebhook,
  verifyPayment,
} from "../controllers/stripeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Webhook endpoint (must be before other routes, no JSON parsing)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Protected routes
router.post("/create-intent", protect, createPaymentIntent);
router.post("/verify", protect, verifyPayment);

export default router;

