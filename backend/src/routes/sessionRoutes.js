import express from "express";
import {
  startSession,
  updateLocation,
  endSession,
  getSessionDetails,
  getLiveSessions,
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST: /api/sessions/start - Start live session
router.post("/start", startSession);

// POST: /api/sessions/location - Update GPS location
router.post("/location", updateLocation);

// POST: /api/sessions/end - End session
router.post("/end", endSession);

// GET: /api/sessions/live - Get live sessions
router.get("/live", getLiveSessions);

// GET: /api/sessions/:bookingId - Get session details
router.get("/:bookingId", getSessionDetails);

export default router;

