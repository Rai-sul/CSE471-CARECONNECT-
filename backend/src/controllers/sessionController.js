import prisma from "../config/db.js";

/**
 * Live Session Tracking System
 * - Start, pause, and resume sessions
 * - Real-time location tracking
 * - Session duration monitoring
 * - Session history records
 * - Live GPS coordinate logging
 */

// Start session
export const startSession = async (req, res) => {
  try {
    const { bookingId, latitude, longitude } = req.body;
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

    // Only babysitter can start session
    if (booking.babysitter.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Only babysitter can start the session" });
    }

    if (booking.status !== "CONFIRMED") {
      return res
        .status(400)
        .json({ message: "Booking must be confirmed to start session" });
    }

    // Initialize GPS logs
    const gpsLogs = [
      {
        lat: parseFloat(latitude) || null,
        lng: parseFloat(longitude) || null,
        time: new Date().toISOString(),
      },
    ];

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "LIVE",
        actualStart: new Date(),
        gpsLogs: gpsLogs,
      },
      include: {
        parent: {
          include: { user: { select: { name: true, email: true, phoneNumber: true } } },
        },
        babysitter: {
          include: { user: { select: { name: true, email: true, phoneNumber: true } } },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Session started successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Start Session Error:", error);
    res.status(500).json({ message: "Failed to start session" });
  }
};

// Update GPS location during session
export const updateLocation = async (req, res) => {
  try {
    const { bookingId, latitude, longitude } = req.body;
    const userId = req.user.id;

    if (!bookingId || !latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Booking ID, latitude, and longitude are required" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        babysitter: { include: { user: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.babysitter.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "LIVE") {
      return res.status(400).json({ message: "Session is not live" });
    }

    // Get existing GPS logs
    const existingLogs = Array.isArray(booking.gpsLogs) ? booking.gpsLogs : [];

    // Add new location
    const newLog = {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      time: new Date().toISOString(),
    };

    const updatedLogs = [...existingLogs, newLog];

    // Update booking with new GPS log
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        gpsLogs: updatedLogs,
      },
    });

    res.status(200).json({
      success: true,
      message: "Location updated",
      location: newLog,
    });
  } catch (error) {
    console.error("Update Location Error:", error);
    res.status(500).json({ message: "Failed to update location" });
  }
};

// End session
export const endSession = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        babysitter: { include: { user: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.babysitter.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Only babysitter can end the session" });
    }

    if (booking.status !== "LIVE") {
      return res.status(400).json({ message: "Session is not live" });
    }

    // Calculate actual duration
    const actualStart = booking.actualStart || booking.startTime;
    const actualEnd = new Date();
    const durationMs = actualEnd - actualStart;
    const durationHours = durationMs / (1000 * 60 * 60);

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "COMPLETED",
        actualEnd: actualEnd,
      },
      include: {
        parent: {
          include: { user: { select: { name: true, email: true } } },
        },
        babysitter: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Session ended successfully",
      booking: updatedBooking,
      duration: {
        hours: Math.round(durationHours * 100) / 100,
        minutes: Math.round((durationHours * 60) * 100) / 100,
      },
    });
  } catch (error) {
    console.error("End Session Error:", error);
    res.status(500).json({ message: "Failed to end session" });
  }
};

// Get session details
export const getSessionDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        parent: {
          include: { user: { select: { name: true, email: true } } },
        },
        babysitter: {
          include: { user: { select: { name: true, email: true } } },
        },
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

    // Calculate duration if session is live or completed
    let duration = null;
    if (booking.actualStart) {
      const endTime = booking.actualEnd || new Date();
      const durationMs = endTime - booking.actualStart;
      const durationHours = durationMs / (1000 * 60 * 60);
      duration = {
        hours: Math.round(durationHours * 100) / 100,
        minutes: Math.round((durationHours * 60) * 100) / 100,
      };
    }

    res.status(200).json({
      success: true,
      booking,
      duration,
      gpsLogs: booking.gpsLogs || [],
    });
  } catch (error) {
    console.error("Get Session Error:", error);
    res.status(500).json({ message: "Failed to get session details" });
  }
};

// Get live sessions (for parent to track)
export const getLiveSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let liveBookings;

    if (role === "PARENT") {
      const parent = await prisma.parent.findUnique({
        where: { userId },
      });

      if (!parent) {
        return res.status(404).json({ message: "Parent profile not found" });
      }

      liveBookings = await prisma.booking.findMany({
        where: {
          parentId: parent.id,
          status: "LIVE",
        },
        include: {
          babysitter: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phoneNumber: true,
                  profilePicture: true,
                },
              },
            },
          },
        },
        orderBy: { actualStart: "desc" },
      });
    } else if (role === "BABYSITTER") {
      const sitter = await prisma.babysitter.findUnique({
        where: { userId },
      });

      if (!sitter) {
        return res.status(404).json({ message: "Sitter profile not found" });
      }

      liveBookings = await prisma.booking.findMany({
        where: {
          babysitterId: sitter.id,
          status: "LIVE",
        },
        include: {
          parent: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phoneNumber: true,
                  profilePicture: true,
                },
              },
            },
          },
        },
        orderBy: { actualStart: "desc" },
      });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      sessions: liveBookings,
      count: liveBookings.length,
    });
  } catch (error) {
    console.error("Get Live Sessions Error:", error);
    res.status(500).json({ message: "Failed to get live sessions" });
  }
};

