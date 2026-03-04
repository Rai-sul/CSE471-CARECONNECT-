import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { AppError } from "./errorMiddleware.js";

/**
 * JWT Authentication Middleware
 * - Verifies JWT token from Authorization header
 * - Fetches user from database
 * - Attaches user to request object
 * - Handles token expiration and invalid tokens
 */

// @desc    Protect routes (Verify JWT Token)
export const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (fresh user data)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          isApproved: true,
          isBanned: true,
        },
      });

      // Check if user exists
      if (!user) {
        return next(new AppError("User not found", 401, "USER_NOT_FOUND"));
      }

      // Check if user is banned
      if (user.isBanned) {
        return next(
          new AppError("Your account has been banned", 403, "ACCOUNT_BANNED")
        );
      }

      // Attach user to request object
      req.user = user;

      // Success: Continue to next middleware
      next();
    } catch (error) {
      // Handle JWT errors
      if (error.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token", 401, "INVALID_TOKEN"));
      }
      if (error.name === "TokenExpiredError") {
        return next(
          new AppError("Token expired. Please log in again", 401, "TOKEN_EXPIRED")
        );
      }
      // Other errors
      console.error("Auth Middleware Error:", error);
      return next(new AppError("Authentication failed", 401, "AUTH_FAILED"));
    }
  } else {
    // No token found
    return next(
      new AppError("Not authorized. No token provided", 401, "NO_TOKEN")
    );
  }
};

// @desc    Admin only middleware (must be used after protect)
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
  }

  if (req.user.role === "ADMIN") {
    next();
  } else {
    return next(
      new AppError("Admin access required", 403, "ADMIN_REQUIRED")
    );
  }
};

// @desc    Parent only middleware (must be used after protect)
export const parentOnly = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
  }

  if (req.user.role === "PARENT") {
    next();
  } else {
    return next(
      new AppError("Parent access required", 403, "PARENT_REQUIRED")
    );
  }
};

// @desc    Babysitter only middleware (must be used after protect)
export const babysitterOnly = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
  }

  if (req.user.role === "BABYSITTER") {
    next();
  } else {
    return next(
      new AppError("Babysitter access required", 403, "BABYSITTER_REQUIRED")
    );
  }
};

// @desc    Check if user is approved (must be used after protect)
export const requireApproval = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
  }

  if (!req.user.isApproved && req.user.role !== "ADMIN") {
    return next(
      new AppError(
        "Your account is pending approval",
        403,
        "ACCOUNT_PENDING"
      )
    );
  }

  next();
};

// @desc    Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          isApproved: true,
        },
      });

      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      // Don't set req.user if token is invalid
    }
  }

  next();
};
