import express from "express";
import {
  createReview,
  getSitterReviews,
  getMyReviews,
  getReviewsReceived,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createReview);
router.get("/my", protect, getMyReviews);
router.get("/received", protect, getReviewsReceived);

// Public route for sitter reviews
router.get("/sitter/:id", getSitterReviews);

export default router;
