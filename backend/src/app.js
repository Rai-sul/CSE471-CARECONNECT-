import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./config/db.js";
import {
  globalErrorHandler,
  notFoundHandler,
  handleUnhandledRejection,
  handleUncaughtException,
} from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import userRoutes from "./routes/userRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import sitterRoutes from "./routes/sitterRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import matchingRoutes from "./routes/matchingRoutes.js";
import messagingRoutes from "./routes/messagingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";

const app = express();

// --- Security Middlewares ---
// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.31.224:3000", // Added user's specific origin
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Authorization"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Helmet for security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow image/file serving
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Limit URL-encoded payload size

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- Route Mounting ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/children", childRoutes);
app.use("/api/sitters", sitterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/messaging", messagingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/stripe", stripeRoutes);
// --- Health Check ---
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CareConnect API is running successfully! 🚀",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 Handler (must be before error handler)
app.use(notFoundHandler);

// --- Global Error Handler (must be last) ---
app.use(globalErrorHandler);

// --- Database Connection Check ---
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully to 'new-care'");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

connectDB();

// --- Error Handling for Unhandled Rejections ---
// Should be called in server.js
export { handleUnhandledRejection, handleUncaughtException };

export default app;
