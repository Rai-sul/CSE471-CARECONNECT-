import prisma from "../config/db.js";
import { sendBookingRequestEmail } from "../services/emailService.js";

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Parent Only)
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    // 🔍 Debug Log: See what data is coming
    console.log("1. Booking Request from UserID:", userId);
    console.log("2. Body Data:", req.body);

    const { babysitterId, startTime, endTime, note } = req.body;

    console.log("Received booking data:", {
      babysitterId,
      startTime,
      endTime,
      note,
    });

    // --- Validation 1: Check Input ---
    if (!babysitterId || !startTime || !endTime) {
      console.log("Error: Missing fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // --- Validation 2: Check Parent Profile ---
    const parent = await prisma.parent.findUnique({
      where: { userId: userId },
    });

    if (!parent) {
      console.log("Error: Parent profile not found for UserID:", userId);
      return res.status(404).json({
        message: "Please complete your Parent Profile first in Settings.",
      });
    }

    // --- Validation 3: Check Babysitter ---
    // Ensure babysitterId is an integer
    const sitterIdInt = parseInt(babysitterId);

    // Try to find by babysitter profile ID first
    let sitter = await prisma.babysitter.findUnique({
      where: { id: sitterIdInt },
    });

    // If not found, try to find by user ID
    if (!sitter) {
      sitter = await prisma.babysitter.findUnique({
        where: { userId: sitterIdInt },
      });
    }

    if (!sitter) {
      console.log("Error: Babysitter not found with ID:", sitterIdInt);
      return res.status(404).json({ message: "Babysitter not found." });
    }

    // --- Calculation: Cost ---
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const durationHours = (end - start) / (1000 * 60 * 60); // Hours

    if (durationHours <= 0) {
      return res
        .status(400)
        .json({ message: "End time must be after start time." });
    }

    // Handle Decimal safely (Prisma Decimal -> Float)
    const rate = parseFloat(sitter.hourlyRate.toString());
    const totalCost = durationHours * rate;

    console.log(
      `3. Cost Calc: ${durationHours} hrs * ${rate} rate = ${totalCost}`
    );

    // --- Action: Create Booking ---
    const booking = await prisma.booking.create({
      data: {
        parentId: parent.id,
        babysitterId: sitter.id,
        startTime: start,
        endTime: end,
        totalAmount: totalCost,
        status: "PENDING",
      },
    });

    console.log("4. Booking Created Success:", booking.id);

    // Send booking request email to babysitter
    try {
      const sitterUser = await prisma.user.findUnique({
        where: { id: sitter.userId },
      });
      if (sitterUser) {
        await sendBookingRequestEmail(booking, sitterUser);
      }
    } catch (emailError) {
      console.error("Failed to send booking email:", emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: "Booking request sent successfully!",
      booking,
    });
  } catch (error) {
    // 🔥 This log will show the REAL error in your terminal
    console.error("CRITICAL BOOKING ERROR:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Failed to create booking. Check server logs.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get My Bookings
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let bookings = [];

    if (role === "PARENT") {
      const parent = await prisma.parent.findUnique({ where: { userId } });
      if (!parent) {
        // Return empty array instead of error if profile not found
        return res.status(200).json({ success: true, bookings: [] });
      }

      bookings = await prisma.booking.findMany({
        where: { parentId: parent.id },
        include: {
          babysitter: {
            include: { user: { select: { name: true, email: true } } },
          },
          payment: {
            select: {
              id: true,
              status: true,
              transactionId: true,
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "BABYSITTER") {
      const sitter = await prisma.babysitter.findUnique({ where: { userId } });
      if (!sitter) {
        // Return empty array instead of error if profile not found
        return res.status(200).json({ success: true, bookings: [] });
      }

      bookings = await prisma.booking.findMany({
        where: { babysitterId: sitter.id },
        include: {
          parent: {
            include: {
              user: { select: { name: true, email: true, phoneNumber: true } },
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
              transactionId: true,
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "ADMIN") {
      // Admin can see all bookings
      bookings = await prisma.booking.findMany({
        include: {
          parent: {
            include: { user: { select: { name: true, email: true } } },
          },
          babysitter: {
            include: { user: { select: { name: true, email: true } } },
          },
          payment: {
            select: {
              id: true,
              status: true,
              transactionId: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.status(200).json({ success: true, bookings: bookings || [] });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// @desc    Update Booking Status (Accept/Reject/Cancel)
// @route   PATCH /api/bookings/:id
export const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { status } = req.body; // "CONFIRMED", "REJECTED", "CANCELLED"
    const userId = req.user.id;

    // ১. বুকিং চেক করা
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { babysitter: true, parent: true },
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ২. পারমিশন চেক (যে কেউ স্ট্যাটাস চেঞ্জ করতে পারবে না)
    // সিটার কনফার্ম/রিজেক্ট করতে পারবে
    // প্যারেন্ট শুধু ক্যান্সেল করতে পারবে
    const isSitter = booking.babysitter.userId === userId;
    const isParent = booking.parent.userId === userId;

    if (!isSitter && !isParent) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this booking." });
    }

    // ৩. আপডেট
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status },
      include: {
        parent: { include: { user: true } },
        babysitter: { include: { user: true } },
      },
    });

    // Send email notification on status change
    try {
      if (status === "CONFIRMED") {
        await sendBookingRequestEmail(
          updatedBooking,
          updatedBooking.parent.user
        );
      }
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
    }

    res
      .status(200)
      .json({
        success: true,
        message: `Booking ${status.toLowerCase()}`,
        booking: updatedBooking,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};
