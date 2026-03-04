import express from "express";
import {
  upload,
  uploadProfilePicture,
  uploadDocument,
  uploadActivityPhoto,
} from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// POST: /api/upload/profile - Upload profile picture
router.post("/profile", upload.single("file"), uploadProfilePicture);

// POST: /api/upload/document - Upload document
router.post("/document", upload.single("file"), uploadDocument);

// POST: /api/upload/activity - Upload activity photo
router.post("/activity", upload.single("file"), uploadActivityPhoto);

export default router;

