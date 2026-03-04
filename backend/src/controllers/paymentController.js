import prisma from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Payment System
 * - Process payments from parents
 * - Payment history tracking
 * - Transaction ID generation
 * - Payment amount recording
 * - Payment date and timestamp logging
 * - Payment confirmation
 */

// Create payment
export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, currency = "BDT" } = req.body;
    const userId = req.user.id;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify booking belongs to user (parent)
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        parent: { include: { user: true } },
        payment: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.parent.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to pay for this booking" });
    }

    if (booking.payment) {
      return res
        .status(400)
        .json({ message: "Payment already exists for this booking" });
    }

    // Generate unique transaction ID
    const transactionId = `TXN-${uuidv4().substring(0, 8).toUpperCase()}-${Date.now()}`;

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        transactionId,
        amount: parseFloat(amount),
        currency,
        method: method || "Cash",
        status: "PENDING",
      },
      include: {
        booking: {
          include: {
            parent: { include: { user: { select: { name: true } } } },
            babysitter: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ message: "Failed to create payment" });
  }
};

// Confirm payment (update status to COMPLETED)
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(paymentId) },
      include: {
        booking: {
          include: {
            parent: { include: { user: true } },
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Only parent or admin can confirm
    if (
      payment.booking.parent.userId !== userId &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paymentDate: new Date(),
      },
      include: {
        booking: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment confirmed",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Confirm Payment Error:", error);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let payments;

    if (role === "PARENT") {
      const parent = await prisma.parent.findUnique({
        where: { userId },
      });

      if (!parent) {
        return res.status(200).json({ success: true, payments: [] });
      }

      payments = await prisma.payment.findMany({
        where: {
          booking: {
            parentId: parent.id,
          },
        },
        include: {
          booking: {
            include: {
              babysitter: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { paymentDate: "desc" },
      });
    } else if (role === "BABYSITTER") {
      const sitter = await prisma.babysitter.findUnique({
        where: { userId },
      });

      if (!sitter) {
        return res.status(200).json({ success: true, payments: [] });
      }

      payments = await prisma.payment.findMany({
        where: {
          booking: {
            babysitterId: sitter.id,
          },
        },
        include: {
          booking: {
            include: {
              parent: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { paymentDate: "desc" },
      });
    } else if (role === "ADMIN") {
      payments = await prisma.payment.findMany({
        include: {
          booking: {
            include: {
              parent: {
                include: {
                  user: { select: { name: true, email: true } },
                },
              },
              babysitter: {
                include: {
                  user: { select: { name: true, email: true } },
                },
              },
            },
          },
        },
        orderBy: { paymentDate: "desc" },
      });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      payments,
      total: payments.length,
    });
  } catch (error) {
    console.error("Get Payment History Error:", error);
    res.status(500).json({ message: "Failed to get payment history" });
  }
};

// Get single payment details
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        booking: {
          include: {
            parent: {
              include: {
                user: { select: { name: true, email: true, phoneNumber: true } },
              },
            },
            babysitter: {
              include: {
                user: { select: { name: true, email: true, phoneNumber: true } },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check authorization
    const isAuthorized =
      payment.booking.parent.userId === userId ||
      payment.booking.babysitter.userId === userId ||
      req.user.role === "ADMIN";

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get Payment Error:", error);
    res.status(500).json({ message: "Failed to get payment" });
  }
};

