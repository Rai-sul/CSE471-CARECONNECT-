import express from "express";
import {
  getAdminStats,
  getPendingApprovals,
  approveSitter,
  rejectSitter,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  manageUser,
  getUserById,
} from "../controllers/adminController.js";
const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/approvals", protect, adminOnly, getPendingApprovals);
router.put("/approve/:id", protect, adminOnly, approveSitter);
router.put("/reject/:id", protect, adminOnly, rejectSitter);
router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/users/:id", protect, adminOnly, manageUser);
router.get("/users/:id", protect, adminOnly, getUserById);
router.get("/bookings", protect, adminOnly, getAllBookings);
router.patch("/bookings/:id/status", protect, adminOnly, updateBookingStatus);
export default router;
