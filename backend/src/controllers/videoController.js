import prisma from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { sendMeetingLinkEmail } from "../services/emailService.js";

/**
 * Live Video Conferencing System (YOOM/Stream Video SDK)
 * - Video meeting room creation
 * - Meeting link generation
 * - Real-time video and audio streaming
 * - Meeting recording
 * - Screen sharing capability
 * - Clerk authentication integration (optional)
 * - Stream Video SDK integration
 */

// Generate meeting link (using Stream Video SDK or custom implementation)
const generateMeetingLink = (bookingId) => {
  // In production, integrate with Stream Video SDK or YOOM API
  // For now, generate a unique meeting ID
  const meetingId = `meeting-${uuidv4()}`;
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return `${baseUrl}/meeting/${meetingId}?bookingId=${bookingId}`;
};

// Create or get meeting link for booking
export const createMeetingLink = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Verify booking and authorization
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        parent: { include: { user: true } },
        babysitter: { include: { user: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization
    const isAuthorized =
      booking.parent.userId === userId ||
      booking.babysitter.userId === userId ||
      req.user.role === "ADMIN";

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Generate or reuse meeting link
    let meetingLink = booking.meetingLink;

    if (!meetingLink) {
      meetingLink = generateMeetingLink(booking.id);

      // Update booking with meeting link
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          meetingLink,
        },
      });
    }

    // Send meeting link via email to both parties
    try {
      await sendMeetingLinkEmail(booking, meetingLink, booking.parent.user);
      await sendMeetingLinkEmail(booking, meetingLink, booking.babysitter.user);
    } catch (emailError) {
      console.error("Failed to send meeting link email:", emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      success: true,
      message: "Meeting link created successfully",
      meetingLink,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error("Create Meeting Link Error:", error);
    res.status(500).json({ message: "Failed to create meeting link" });
  }
};

// Get meeting link for booking
export const getMeetingLink = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        parent: { include: { user: true } },
        babysitter: { include: { user: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization
    const isAuthorized =
      booking.parent.userId === userId ||
      booking.babysitter.userId === userId ||
      req.user.role === "ADMIN";

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Generate link if doesn't exist
    let meetingLink = booking.meetingLink;
    if (!meetingLink) {
      meetingLink = generateMeetingLink(booking.id);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { meetingLink },
      });
    }

    res.status(200).json({
      success: true,
      meetingLink,
      booking: {
        id: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Get Meeting Link Error:", error);
    res.status(500).json({ message: "Failed to get meeting link" });
  }
};

// Get Stream Video token (for Stream Video SDK integration)
export const getStreamToken = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    // In production, integrate with Stream Video SDK
    // This is a placeholder - you'll need to implement actual Stream Video token generation
    const token = `stream-token-${uuidv4()}`;

    res.status(200).json({
      success: true,
      token,
      userId: userId.toString(),
      // Additional Stream Video SDK config
      apiKey: process.env.STREAM_API_KEY || "",
    });
  } catch (error) {
    console.error("Get Stream Token Error:", error);
    res.status(500).json({ message: "Failed to get stream token" });
  }
};

