import prisma from "../config/db.js";

/**
 * Messaging & Communication System
 * - Send and receive messages
 * - Conversation management
 * - Message read/unread tracking
 * - Multi-language support (translation capability)
 */

// Create or get conversation
export const getOrCreateConversation = async (req, res) => {
  try {
    const { bookingId, otherUserId } = req.body;
    const userId = req.user.id;

    // Check if conversation exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { bookingId: bookingId ? parseInt(bookingId) : undefined },
          // For direct messages without booking
          {
            messages: {
              some: {
                OR: [
                  { senderId: userId },
                  { senderId: parseInt(otherUserId) },
                ],
              },
            },
          },
        ],
      },
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
        booking: {
          include: {
            parent: { include: { user: { select: { name: true } } } },
            babysitter: { include: { user: { select: { name: true } } } },
          },
        },
      },
    });

    // Create if doesn't exist
    if (!conversation && bookingId) {
      conversation = await prisma.conversation.create({
        data: {
          bookingId: parseInt(bookingId),
        },
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
          booking: {
            include: {
              parent: { include: { user: { select: { name: true } } } },
              babysitter: { include: { user: { select: { name: true } } } },
            },
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      conversation: conversation || null,
    });
  } catch (error) {
    console.error("Conversation Error:", error);
    res.status(500).json({ message: "Failed to get conversation" });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, translatedContent, language } = req.body;
    const senderId = req.user.id;

    if (!conversationId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Use translated content if provided, otherwise use original
    const messageContent = translatedContent || content;

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: parseInt(conversationId),
        senderId,
        content: messageContent,
        type: "USER",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: parseInt(conversationId) },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Get all conversations for user
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all conversations where user has messages
    const conversations = await prisma.conversation.findMany({
      where: {
        messages: {
          some: {
            OR: [
              {
                senderId: userId,
              },
              {
                // Get conversations via booking
                conversation: {
                  booking: {
                    OR: [
                      { parent: { userId } },
                      { babysitter: { userId } },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Latest message
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        booking: {
          include: {
            parent: {
              include: {
                user: { select: { name: true, profilePicture: true } },
              },
            },
            babysitter: {
              include: {
                user: { select: { name: true, profilePicture: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Count unread messages
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            isRead: false,
          },
        });

        return {
          ...conv,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      conversations: conversationsWithUnread,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    res.status(500).json({ message: "Failed to get conversations" });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await prisma.message.updateMany({
      where: {
        conversationId: parseInt(conversationId),
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

// Translate message (simple implementation - can be enhanced with Google Translate API)
export const translateMessage = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // For now, return original text (placeholder for translation API integration)
    // In production, integrate with Google Translate API or similar service
    let translatedText = text; // Placeholder

    // Example translation mapping (very basic)
    // TODO: Integrate with Google Translate API or similar service
    const translations = {
      // Add basic translations here if needed
      // Example: "Hello": { en: "Hello", bn: "হ্যালো", hi: "नमस्ते" }
    };

    res.status(200).json({
      success: true,
      translatedText: translatedText,
      originalText: text,
      targetLanguage,
      note: "Translation API integration needed for full functionality",
    });
  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ message: "Failed to translate message" });
  }
};

// Get message history for a conversation
export const getMessageHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(conversationId) },
      include: {
        booking: {
          include: {
            parent: { include: { user: true } },
            babysitter: { include: { user: true } },
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check authorization
    const isAuthorized =
      conversation.booking?.parent?.userId === userId ||
      conversation.booking?.babysitter?.userId === userId ||
      req.user.role === "ADMIN";

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get messages with pagination
    const limitNum = parseInt(limit) || 50;
    const offsetNum = parseInt(offset) || 0;

    const messages = await prisma.message.findMany({
      where: { conversationId: parseInt(conversationId) },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limitNum,
      skip: offsetNum,
    });

    const total = await prisma.message.count({
      where: { conversationId: parseInt(conversationId) },
    });

    res.status(200).json({
      success: true,
      messages: messages.reverse(), // Reverse to show oldest first
      total,
      hasMore: total > offsetNum + messages.length,
    });
  } catch (error) {
    console.error("Get Message History Error:", error);
    res.status(500).json({ message: "Failed to get message history" });
  }
};

