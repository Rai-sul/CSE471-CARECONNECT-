import express from "express";
import {
  createSOSAlert,
  getActiveAlerts,
  resolveAlert,
  getAlertById,
} from "../controllers/sosController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST: /api/sos - Create SOS alert
router.post("/", createSOSAlert);

// GET: /api/sos - Get active alerts
router.get("/", getActiveAlerts);

// GET: /api/sos/:id - Get alert by ID
router.get("/:id", getAlertById);

// PUT: /api/sos/:alertId/resolve - Resolve alert
router.put("/:alertId/resolve", resolveAlert);

export default router;

