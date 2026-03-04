import Stripe from "stripe";
import prisma from "../config/db.js";
import { sendPaymentConfirmationEmail } from "../services/emailService.js";

// Initialize Stripe with error handling
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "⚠️  STRIPE_SECRET_KEY not found in environment variables. Stripe payments will not work."
  );
}

/**
 * Stripe Payment Integration
 * - Create payment intent
 * - Confirm payment
 * - Handle webhooks
 */

// Create Stripe Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    console.log("Payment Intent Request:", { bookingId, userId, role: req.user.role });

    // Check if Stripe is configured
    if (!stripe) {
      console.error("Stripe not configured - STRIPE_SECRET_KEY missing");
      return res
        .status(500)
        .json({ 
          message: "Stripe is not configured. Please add STRIPE_SECRET_KEY to backend/.env file.",
          code: "STRIPE_NOT_CONFIGURED"
        });
    }

    // Verify booking
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        parent: { include: { user: true } },
        babysitter: { include: { user: true } },
        payment: true,
      },
    });

    if (!booking) {
      console.error("Booking not found:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking found:", {
      id: booking.id,
      status: booking.status,
      parentUserId: booking.parent?.userId,
      currentUserId: userId,
      hasPayment: !!booking.payment
    });

    // Check if user is the parent who made the booking
    // Also allow admin to process payments
    const isAuthorized =
      booking.parent?.userId === userId || req.user.role === "ADMIN";

    if (!isAuthorized) {
      console.error(
        `Authorization failed: booking.parent.userId=${booking.parent?.userId}, userId=${userId}, role=${req.user.role}`
      );
      return res
        .status(403)
        .json({ message: "Not authorized to pay for this booking" });
    }

    if (booking.status !== "CONFIRMED") {
      return res
        .status(400)
        .json({ 
          message: "Booking must be confirmed before payment",
          currentStatus: booking.status
        });
    }

    if (booking.payment && booking.payment.status === "COMPLETED") {
      return res
        .status(400)
        .json({ message: "Payment already completed for this booking" });
    }

    // Get amount safely
    const totalAmount = parseFloat(booking.totalAmount?.toString() || "0");
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid booking amount" });
    }

    const amountInCents = Math.round(totalAmount * 100); // Convert to cents/paisa

    // Create or get existing payment record
    let payment = booking.payment;
    if (!payment) {
      try {
        payment = await prisma.payment.create({
          data: {
            bookingId: booking.id,
            transactionId: `TXN-${Date.now()}`,
            amount: totalAmount,
            currency: "BDT",
            method: "Stripe",
            status: "PENDING",
          },
        });
        console.log("Payment record created:", payment.id);
      } catch (paymentError) {
        console.error("Error creating payment record:", paymentError);
        return res.status(500).json({ 
          message: "Failed to create payment record",
          error: paymentError.message 
        });
      }
    }

    // Create Stripe Payment Intent
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents, // Amount in smallest currency unit
        currency: "bdt", // BDT for Bangladesh Taka
        metadata: {
          bookingId: booking.id.toString(),
          paymentId: payment.id.toString(),
          userId: userId.toString(),
        },
        description: `Payment for booking #${booking.id}`,
      });

      console.log("Payment Intent created:", paymentIntent.id);

      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalAmount,
        bookingId: booking.id,
      });
    } catch (stripeError) {
      console.error("Stripe API Error:", stripeError);
      return res.status(500).json({
        message: "Failed to create payment intent with Stripe",
        error: stripeError.message,
        code: stripeError.type || "STRIPE_ERROR",
      });
    }
  } catch (error) {
    console.error("Create Payment Intent Error:", error);
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

// Confirm Payment (Webhook handler)
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const { bookingId, paymentId } = paymentIntent.metadata;

    // Update payment status
    const payment = await prisma.payment.update({
      where: { id: parseInt(paymentId) },
      data: {
        status: "COMPLETED",
        paymentDate: new Date(),
        transactionId: paymentIntent.id,
      },
      include: {
        booking: {
          include: {
            parent: { include: { user: true } },
            babysitter: { include: { user: true } },
          },
        },
      },
    });

    // Send confirmation email
    try {
      await sendPaymentConfirmationEmail(
        payment,
        payment.booking.parent.user
      );
    } catch (emailError) {
      console.error("Failed to send payment email:", emailError);
    }

    console.log(`Payment successful for booking ${bookingId}`);
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
};

// Handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  try {
    const { paymentId } = paymentIntent.metadata;

    await prisma.payment.update({
      where: { id: parseInt(paymentId) },
      data: {
        status: "FAILED",
      },
    });

    console.log(`Payment failed for payment ${paymentId}`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
};

// Verify payment status
export const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update payment in database
      const { bookingId, paymentId } = paymentIntent.metadata;

      const payment = await prisma.payment.update({
        where: { id: parseInt(paymentId) },
        data: {
          status: "COMPLETED",
          paymentDate: new Date(),
          transactionId: paymentIntent.id,
        },
        include: {
          booking: {
            include: {
              parent: { include: { user: true } },
              babysitter: { include: { user: true } },
            },
          },
        },
      });

      // Send confirmation email
      try {
        await sendPaymentConfirmationEmail(
          payment,
          payment.booking.parent.user
        );
      } catch (emailError) {
        console.error("Failed to send payment email:", emailError);
      }

      return res.status(200).json({
        success: true,
        payment,
        message: "Payment successful",
      });
    }

    res.status(200).json({
      success: false,
      status: paymentIntent.status,
      message: "Payment not completed yet",
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};

