import prisma from "../config/db.js";

/**
 * Activity Logging & Daily Reports System
 * - Daily activity logging with photos
 * - Meal tracking
 * - Nap time logging
 * - Activity descriptions
 * - Mood rating (1–5 scale)
 * - Babysitter notes
 * - Daily report generation
 */

// Create or update daily report
export const createDailyReport = async (req, res) => {
  try {
    const { bookingId, notes, moodRating } = req.body;
    const userId = req.user.id;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Verify booking and authorization (only babysitter can create reports)
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        babysitter: { include: { user: true } },
        dailyReport: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.babysitter.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Only babysitter can create daily reports" });
    }

    // Create or update daily report
    let dailyReport;
    if (booking.dailyReport) {
      dailyReport = await prisma.dailyReport.update({
        where: { id: booking.dailyReport.id },
        data: {
          notes: notes || booking.dailyReport.notes,
          moodRating: moodRating
            ? parseInt(moodRating)
            : booking.dailyReport.moodRating,
        },
        include: {
          activities: {
            orderBy: { timestamp: "desc" },
          },
        },
      });
    } else {
      dailyReport = await prisma.dailyReport.create({
        data: {
          bookingId: booking.id,
          notes: notes || null,
          moodRating: moodRating ? parseInt(moodRating) : null,
        },
        include: {
          activities: {
            orderBy: { timestamp: "desc" },
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Daily report created/updated successfully",
      report: dailyReport,
    });
  } catch (error) {
    console.error("Create Daily Report Error:", error);
    res.status(500).json({ message: "Failed to create daily report" });
  }
};

// Add activity log
export const addActivityLog = async (req, res) => {
  try {
    const { bookingId, type, description, photoUrl } = req.body;
    const userId = req.user.id;

    if (!bookingId || !type) {
      return res
        .status(400)
        .json({ message: "Booking ID and activity type are required" });
    }

    // Verify booking and authorization
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        babysitter: { include: { user: true } },
        dailyReport: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.babysitter.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Only babysitter can add activity logs" });
    }

    // Ensure daily report exists
    let reportId = booking.dailyReport?.id;
    if (!reportId) {
      const newReport = await prisma.dailyReport.create({
        data: {
          bookingId: booking.id,
        },
      });
      reportId = newReport.id;
    }

    // Create activity log
    const activity = await prisma.activityLog.create({
      data: {
        reportId,
        type, // "Meal", "Nap", "Play", "Diaper", "Bath", etc.
        description: description || null,
        photoUrl: photoUrl || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Activity logged successfully",
      activity,
    });
  } catch (error) {
    console.error("Add Activity Log Error:", error);
    res.status(500).json({ message: "Failed to add activity log" });
  }
};

// Get daily report
export const getDailyReport = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        parent: { include: { user: true } },
        babysitter: { include: { user: true } },
        dailyReport: {
          include: {
            activities: {
              orderBy: { timestamp: "desc" },
            },
          },
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

    res.status(200).json({
      success: true,
      report: booking.dailyReport || null,
      booking: {
        id: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Get Daily Report Error:", error);
    res.status(500).json({ message: "Failed to get daily report" });
  }
};

// Get all activities for a report
export const getActivities = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        parent: { include: { user: true } },
        babysitter: { include: { user: true } },
        dailyReport: {
          include: {
            activities: {
              orderBy: { timestamp: "desc" },
            },
          },
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

    res.status(200).json({
      success: true,
      activities: booking.dailyReport?.activities || [],
    });
  } catch (error) {
    console.error("Get Activities Error:", error);
    res.status(500).json({ message: "Failed to get activities" });
  }
};

// Delete activity log
export const deleteActivityLog = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;

    const activity = await prisma.activityLog.findUnique({
      where: { id: parseInt(activityId) },
      include: {
        report: {
          include: {
            booking: {
              include: {
                babysitter: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Only babysitter who created it can delete
    if (activity.report.booking.babysitter.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.activityLog.delete({
      where: { id: activity.id },
    });

    res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Delete Activity Error:", error);
    res.status(500).json({ message: "Failed to delete activity" });
  }
};

