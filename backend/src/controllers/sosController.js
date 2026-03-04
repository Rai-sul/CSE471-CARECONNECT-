import prisma from "../config/db.js";

/**
 * Emergency & SOS Alerts System
 * - SOS alert system with location sharing
 * - Emergency contact management
 * - Alert status tracking (active/resolved)
 * - Real-time alert notifications
 */

// Create SOS Alert
export const createSOSAlert = async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;
    const userId = req.user.id;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    // Create SOS alert
    const sosAlert = await prisma.sOSAlert.create({
      data: {
        userId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "SOS alert created successfully",
      alert: sosAlert,
    });
  } catch (error) {
    console.error("Create SOS Alert Error:", error);
    res.status(500).json({ message: "Failed to create SOS alert" });
  }
};

// Get active SOS alerts (for admin and emergency contacts)
export const getActiveAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let alerts;

    if (role === "ADMIN") {
      // Admin can see all active alerts
      alerts = await prisma.sOSAlert.findMany({
        where: {
          status: "ACTIVE",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              profilePicture: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Users can see their own alerts
      alerts = await prisma.sOSAlert.findMany({
        where: {
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.status(200).json({
      success: true,
      alerts,
      activeCount: alerts.filter((a) => a.status === "ACTIVE").length,
    });
  } catch (error) {
    console.error("Get Alerts Error:", error);
    res.status(500).json({ message: "Failed to get alerts" });
  }
};

// Resolve SOS alert
export const resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const alert = await prisma.sOSAlert.findUnique({
      where: { id: parseInt(alertId) },
    });

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // Only admin or the user who created it can resolve
    if (role !== "ADMIN" && alert.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedAlert = await prisma.sOSAlert.update({
      where: { id: alert.id },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Alert resolved successfully",
      alert: updatedAlert,
    });
  } catch (error) {
    console.error("Resolve Alert Error:", error);
    res.status(500).json({ message: "Failed to resolve alert" });
  }
};

// Get alert by ID
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const alert = await prisma.sOSAlert.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // Check authorization
    if (role !== "ADMIN" && alert.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error("Get Alert Error:", error);
    res.status(500).json({ message: "Failed to get alert" });
  }
};

