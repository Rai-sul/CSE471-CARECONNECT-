import express from "express";
import {
  updateProfile,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);

router.put("/update-profile", protect, updateProfile);

export default router;
