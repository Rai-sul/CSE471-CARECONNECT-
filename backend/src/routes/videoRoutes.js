import express from "express";
import {
  createMeetingLink,
  getMeetingLink,
  getStreamToken,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST: /api/video/meeting - Create meeting link
router.post("/meeting", createMeetingLink);

// GET: /api/video/meeting/:bookingId - Get meeting link
router.get("/meeting/:bookingId", getMeetingLink);

// POST: /api/video/token - Get Stream Video token
router.post("/token", getStreamToken);

export default router;

