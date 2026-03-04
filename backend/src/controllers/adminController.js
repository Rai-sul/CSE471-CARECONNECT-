import prisma from "../config/db.js";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "../services/emailService.js";

// @desc    Get Admin Dashboard Stats (Real Data)
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    // ১. মোট ইউজার সংখ্যা
    const totalUsers = await prisma.user.count();

    // ২. পেন্ডিং সিটার (যাদের isApproved: false)
    const pendingSitters = await prisma.user.count({
      where: {
        role: "BABYSITTER",
        isApproved: false,
      },
    });

    // ৩. অ্যাক্টিভ বুকিং (যেগুলো CONFIRMED)
    const activeBookings = await prisma.booking.count({
      where: {
        status: "CONFIRMED",
      },
    });

    // ৪. মোট আয় (Total Revenue from Completed Bookings)
    // Prisma Aggregate ব্যবহার করে যোগফল বের করা
    const revenueAgg = await prisma.booking.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: "COMPLETED", // অথবা 'CONFIRMED' দিতে পারেন যদি অ্যাডভান্স পেমেন্ট ধরেন
      },
    });

    // ৫. সাম্প্রতিক ৫টি বুকিং (Recent Activity)
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        parent: { include: { user: { select: { name: true } } } },
        babysitter: { include: { user: { select: { name: true } } } },
      },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        pendingSitters,
        activeBookings,
        totalRevenue: revenueAgg._sum.totalAmount || 0,
      },
      recentActivity: recentBookings,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get Pending Approvals List
// @route   GET /api/admin/approvals
export const getPendingApprovals = async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        role: "BABYSITTER",
        isApproved: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        babysitter: {
          select: { experienceYears: true, locationAddress: true },
        },
      },
    });

    res.status(200).json({ success: true, users: pendingUsers });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Approve a Sitter
// @route   PUT /api/admin/approve/:id
export const approveSitter = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
    });

    // Send approval email
    try {
      await sendApprovalEmail(user);
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
    }

    res
      .status(200)
      .json({ success: true, message: "User approved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve user" });
  }
};

// @desc    Reject a Sitter
// @route   PUT /api/admin/reject/:id
export const rejectSitter = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { reason } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send rejection email
    try {
      await sendRejectionEmail(user, reason);
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "User rejection email sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject user" });
  }
};

// @desc    Get All Users (Search & Filter)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
        isBanned: true, // Prisma Schema আপডেট করার পর এটি আসবে
        createdAt: true,
        parentProfile: { select: { id: true } },
        babysitter: { select: { id: true } },
      },
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Manage User (Delete or Ban)
// @route   PATCH /api/admin/users/:id
export const manageUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'delete', 'ban', 'unban'

    if (action === "delete") {
      await prisma.user.delete({ where: { id: parseInt(id) } });
      return res
        .status(200)
        .json({ success: true, message: "User deleted permanently." });
    }

    if (action === "ban") {
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { isBanned: true },
      });
      return res
        .status(200)
        .json({ success: true, message: "User has been banned." });
    }

    if (action === "unban") {
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { isBanned: false },
      });
      return res
        .status(200)
        .json({ success: true, message: "User unbanned successfully." });
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Action failed" });
  }
};

// @desc    Get Single User Details (For Admin Review)
// @route   GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        babysitter: { include: { availabilities: true } }, // সিটার ডিটেইলস + শিডিউল
        parentProfile: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get All Bookings for Admin
// @route   GET /api/admin/bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        parent: { include: { user: { select: { name: true, email: true } } } },
        babysitter: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update Booking Status (Admin Only)
// @route   PATCH /api/admin/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "REJECTED",
      "CANCELLED",
      "LIVE",
      "COMPLETED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        parent: { include: { user: true } },
        babysitter: { include: { user: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: status },
      include: {
        parent: { include: { user: { select: { name: true, email: true } } } },
        babysitter: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    // Log admin action
    try {
      await prisma.adminLog.create({
        data: {
          adminId: req.user.id,
          action: `Updated booking #${id} status to ${status}${reason ? ` - Reason: ${reason}` : ""}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log admin action:", logError);
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};
