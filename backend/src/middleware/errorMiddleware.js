/**
 * Global Error Handling Middleware
 * - Centralized error handling
 * - Consistent error response format
 * - Error logging
 * - Development vs Production error details
 */

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle Prisma errors
const handlePrismaError = (error) => {
  let message = "Database error occurred";
  let statusCode = 500;

  switch (error.code) {
    case "P2002":
      // Unique constraint violation
      message = "A record with this value already exists";
      statusCode = 409;
      break;
    case "P2025":
      // Record not found
      message = "Record not found";
      statusCode = 404;
      break;
    case "P2003":
      // Foreign key constraint violation
      message = "Invalid reference to related record";
      statusCode = 400;
      break;
    case "P2014":
      // Required relation violation
      message = "Required relation missing";
      statusCode = 400;
      break;
    default:
      message = "Database operation failed";
  }

  return { message, statusCode };
};

// Handle JWT errors
const handleJWTError = (error) => {
  if (error.name === "JsonWebTokenError") {
    return {
      message: "Invalid token. Please log in again.",
      statusCode: 401,
    };
  }
  if (error.name === "TokenExpiredError") {
    return {
      message: "Your token has expired. Please log in again.",
      statusCode: 401,
    };
  }
  return {
    message: "Token verification failed",
    statusCode: 401,
  };
};

// Handle validation errors
const handleValidationError = (error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return {
      message: "Validation failed",
      statusCode: 400,
      errors,
    };
  }
  return null;
};

// Global error handler middleware
export const globalErrorHandler = (err, req, res, next) => {
  // Set default error values
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  console.error("Error:", {
    message: error.message,
    statusCode: error.statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle specific error types
  // Prisma errors
  if (err.code && err.code.startsWith("P")) {
    const prismaError = handlePrismaError(err);
    error.message = prismaError.message;
    error.statusCode = prismaError.statusCode;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    const jwtError = handleJWTError(err);
    error.message = jwtError.message;
    error.statusCode = jwtError.statusCode;
  }

  // Validation errors
  const validationError = handleValidationError(err);
  if (validationError) {
    error.message = validationError.message;
    error.statusCode = validationError.statusCode;
    error.errors = validationError.errors;
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
      code: err.code,
    }),
    ...(error.errors && { errors: error.errors }),
    ...(error.code && { errorCode: error.code }),
  });
};

// 404 handler (must be after all routes)
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    "ROUTE_NOT_FOUND"
  );
  next(error);
};

// Async handler wrapper (catches async errors)
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Unhandled rejection handler (should be in server.js)
export const handleUnhandledRejection = () => {
  process.on("unhandledRejection", (err, promise) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error("Error:", err);
    // Close server gracefully
    process.exit(1);
  });
};

// Uncaught exception handler (should be in server.js)
export const handleUncaughtException = () => {
  process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error("Error:", err);
    // Close server gracefully
    process.exit(1);
  });
};

