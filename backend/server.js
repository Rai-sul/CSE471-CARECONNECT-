import dotenv from "dotenv";
dotenv.config();

import cors from 'cors';
import app from "./src/app.js";
import {
  handleUnhandledRejection,
  handleUncaughtException,
} from "./src/middleware/errorMiddleware.js";

const PORT = process.env.PORT || 5000;

// --- Error Handling Setup ---
// Handle unhandled promise rejections
handleUnhandledRejection();

// Handle uncaught exceptions
handleUncaughtException();

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`👉 Test API: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});

export default server;