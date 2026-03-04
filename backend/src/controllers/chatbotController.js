import prisma from "../config/db.js";
import OpenAI from "openai";

/**
 * Chatbot System
 * - AI-powered chatbot for user support
 * - Automated responses
 * - Conversation handling
 */

// Initialize OpenAI (optional - can use other AI services)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Simple rule-based responses (fallback if OpenAI not configured)
const getSimpleResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! How can I help you today?";
  }

  if (lowerMessage.includes("booking") || lowerMessage.includes("book")) {
    return "To create a booking, go to the Find Sitter page and select a babysitter. Then click 'Book Now' and fill in the details.";
  }

  if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
    return "Payments can be made after a booking is confirmed. Go to your Bookings page and click on a confirmed booking to make payment.";
  }

  if (lowerMessage.includes("profile") || lowerMessage.includes("update")) {
    return "You can update your profile by going to Account > Profile. Make sure to complete all required fields.";
  }

  if (lowerMessage.includes("sitter") || lowerMessage.includes("babysitter")) {
    return "To find a babysitter, use the Find Sitter page. You can filter by location, price, and availability. Our AI matching system will show you the best matches.";
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
    return "I'm here to help! You can ask me about bookings, payments, profiles, finding sitters, or any other questions about the platform.";
  }

  return "I understand you need help. Could you please provide more details? For specific issues, you can also contact our support team.";
};

// Chat with bot
export const chatWithBot = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let botResponse;

    // Try OpenAI if available
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant for a babysitting platform. Help users with bookings, payments, profiles, finding sitters, and general questions. Be friendly and concise.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 150,
        });

        botResponse = completion.choices[0].message.content;
      } catch (error) {
        console.error("OpenAI Error:", error);
        // Fallback to simple responses
        botResponse = getSimpleResponse(message);
      }
    } else {
      // Use simple rule-based responses
      botResponse = getSimpleResponse(message);
    }

    // Save bot message to conversation if conversationId provided
    if (conversationId) {
      // Find or create conversation for chatbot
      let conversation = await prisma.conversation.findUnique({
        where: { id: parseInt(conversationId) },
      });

      if (conversation) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: userId,
            content: message,
            type: "USER",
          },
        });

        // Create bot response message
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: userId, // Bot uses same user ID but type is BOT
            content: botResponse,
            type: "BOT",
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      response: botResponse,
      conversationId: conversationId || null,
    });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ message: "Failed to process chat message" });
  }
};

// Create chatbot conversation
export const createChatbotConversation = async (req, res) => {
  try {
    const userId = req.user.id;

    // Create a conversation without booking (for chatbot)
    const conversation = await prisma.conversation.create({
      data: {},
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Send initial bot greeting
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        content:
          "Hello! I'm your virtual assistant. How can I help you today?",
        type: "BOT",
      },
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Create Chatbot Conversation Error:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

