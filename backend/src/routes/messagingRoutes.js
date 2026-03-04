import express from "express";
import {
  getOrCreateConversation,
  sendMessage,
  getMyConversations,
  markAsRead,
  translateMessage,
  getMessageHistory,
} from "../controllers/messagingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST: /api/messaging/conversation - Get or create conversation
router.post("/conversation", getOrCreateConversation);

// POST: /api/messaging/send - Send message
router.post("/send", sendMessage);

// GET: /api/messaging/conversations - Get all conversations
router.get("/conversations", getMyConversations);

// PUT: /api/messaging/conversation/:conversationId/read - Mark as read
router.put("/conversation/:conversationId/read", markAsRead);

// POST: /api/messaging/translate - Translate message
router.post("/translate", translateMessage);

// GET: /api/messaging/conversation/:conversationId/history - Get message history
router.get("/conversation/:conversationId/history", getMessageHistory);

export default router;

