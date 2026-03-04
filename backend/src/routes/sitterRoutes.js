import express from "express";
import {
  updateAvailability,
  getSitters,
  getSitterById,
  getMyAvailability,
  getMySitterProfile,
} from "../controllers/sitterController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSitters);
router.get("/me", protect, getMySitterProfile); // Must be before /:id
router.post("/availability", protect, updateAvailability);
router.get("/availability", protect, getMyAvailability);
router.get("/:id", getSitterById);
export default router;
