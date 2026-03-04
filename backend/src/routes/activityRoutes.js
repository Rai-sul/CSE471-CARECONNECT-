import express from "express";
import {
  createDailyReport,
  addActivityLog,
  getDailyReport,
  getActivities,
  deleteActivityLog,
} from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST: /api/activities/report - Create or update daily report
router.post("/report", createDailyReport);

// POST: /api/activities/log - Add activity log
router.post("/log", addActivityLog);

// GET: /api/activities/report/:bookingId - Get daily report
router.get("/report/:bookingId", getDailyReport);

// GET: /api/activities/:bookingId - Get all activities for booking
router.get("/:bookingId", getActivities);

// DELETE: /api/activities/log/:activityId - Delete activity log
router.delete("/log/:activityId", deleteActivityLog);

export default router;

