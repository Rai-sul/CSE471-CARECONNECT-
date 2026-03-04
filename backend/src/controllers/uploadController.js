import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import prisma from "../config/db.js";

/**
 * File Upload & Management System
 * - Profile picture uploads
 * - Document uploads (certifications, etc.)
 * - Activity photo uploads
 * - Upload directory management
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create upload directories if they don't exist
const uploadDirs = {
  profiles: path.join(__dirname, "../../uploads/profiles"),
  documents: path.join(__dirname, "../../uploads/documents"),
  activities: path.join(__dirname, "../../uploads/activities"),
};

Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.body.uploadType || "profiles";
    const uploadDir = uploadDirs[uploadType] || uploadDirs.profiles;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and documents are allowed!"));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    const filePath = `/uploads/profiles/${req.file.filename}`;

    // Update user profile picture
    await prisma.user.update({
      where: { id: userId },
      data: {
        profilePicture: filePath,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      filePath,
      url: `${process.env.BASE_URL || "http://localhost:5000"}${filePath}`,
    });
  } catch (error) {
    console.error("Upload Profile Picture Error:", error);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
};

// Upload document (certification, etc.)
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    const { documentType, title, issuedBy, issueDate } = req.body;
    const filePath = `/uploads/documents/${req.file.filename}`;

    // If it's a certification for babysitter
    if (documentType === "certification") {
      const sitter = await prisma.babysitter.findUnique({
        where: { userId },
      });

      if (!sitter) {
        return res.status(404).json({ message: "Babysitter profile not found" });
      }

      const certification = await prisma.certification.create({
        data: {
          babysitterId: sitter.id,
          title: title || "Certification",
          documentUrl: filePath,
          issuedBy: issuedBy || null,
          issueDate: issueDate ? new Date(issueDate) : null,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        certification,
        filePath,
        url: `${process.env.BASE_URL || "http://localhost:5000"}${filePath}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      filePath,
      url: `${process.env.BASE_URL || "http://localhost:5000"}${filePath}`,
    });
  } catch (error) {
    console.error("Upload Document Error:", error);
    res.status(500).json({ message: "Failed to upload document" });
  }
};

// Upload activity photo
export const uploadActivityPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/activities/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "Activity photo uploaded successfully",
      filePath,
      url: `${process.env.BASE_URL || "http://localhost:5000"}${filePath}`,
    });
  } catch (error) {
    console.error("Upload Activity Photo Error:", error);
    res.status(500).json({ message: "Failed to upload activity photo" });
  }
};

// Note: Static file serving is now handled by express.static middleware in app.js

