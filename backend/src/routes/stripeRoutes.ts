import express from "express";
import {
  createPaymentIntent,
  getStripeConfig,
  handleStripeWebhook,
  verifyPayment,
} from "../controllers/stripeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { sensitiveLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/config", getStripeConfig as express.RequestHandler);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook as express.RequestHandler
);

router.post(
  "/create-intent",
  sensitiveLimiter,
  protect as express.RequestHandler,
  createPaymentIntent as express.RequestHandler
);
router.post(
  "/verify",
  sensitiveLimiter,
  protect as express.RequestHandler,
  verifyPayment as express.RequestHandler
);

export default router;
