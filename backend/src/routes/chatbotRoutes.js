import express from "express";
import {
  chatWithBot,
  createChatbotConversation,
} from "../controllers/chatbotController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST: /api/chatbot/conversation - Create chatbot conversation
router.post("/conversation", createChatbotConversation);

// POST: /api/chatbot/chat - Chat with bot
router.post("/chat", chatWithBot);

export default router;

