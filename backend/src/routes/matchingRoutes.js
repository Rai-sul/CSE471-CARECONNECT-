import express from "express";
import { findMatchingSitters } from "../controllers/matchingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET: /api/matching/sitters - Find matching sitters for parent
router.get("/sitters", protect, findMatchingSitters);

export default router;

