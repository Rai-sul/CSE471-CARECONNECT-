import { Prisma } from "@prisma/client";
import prisma from "../config/db.js";

const conversationWithMessagesInclude = {
  messages: {
    include: {
      sender: { select: { id: true, name: true, profilePicture: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

// ── Find conversation by ID ──
export const findConversation = (conversationId: string) =>
  prisma.conversation.findUnique({ where: { id: conversationId } });

// ── Create or reuse chatbot conversation (handles unique bookingId:null index) ──
export const createConversation = async () => {
  const existingConversation = await prisma.conversation.findFirst({
    where: { bookingId: null },
    include: conversationWithMessagesInclude,
  });

  if (existingConversation) return existingConversation;

  try {
    return await prisma.conversation.create({
      data: {},
      include: conversationWithMessagesInclude,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const conversation = await prisma.conversation.findFirst({
        where: { bookingId: null },
        include: conversationWithMessagesInclude,
      });

      if (conversation) return conversation;
    }

    throw error;
  }
};

// ── Save a message to a conversation ──
export const saveMessage = (conversationId: string, senderId: string, content: string, type: "USER" | "BOT") =>
  prisma.message.create({
    data: { conversationId, senderId, content, type },
  });
