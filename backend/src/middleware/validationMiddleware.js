/**
 * Request Validation Middleware
 * - Validates request body, query, and params
 * - Provides detailed error messages
 * - Supports common validation patterns
 */

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate required fields
export const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = [];

    for (const field of fields) {
      if (
        !req.body[field] ||
        (typeof req.body[field] === "string" && !req.body[field].trim())
      ) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
        missingFields: missing,
      });
    }

    next();
  };
};

// Validate email format
export const validateEmail = (field = "email") => {
  return (req, res, next) => {
    if (req.body[field] && !isValidEmail(req.body[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid email format for field: ${field}`,
      });
    }
    next();
  };
};

// Validate numeric fields
export const validateNumeric = (fields) => {
  return (req, res, next) => {
    const invalid = [];

    for (const field of fields) {
      if (req.body[field] && isNaN(parseFloat(req.body[field]))) {
        invalid.push(field);
      }
    }

    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid numeric values for fields: ${invalid.join(", ")}`,
        invalidFields: invalid,
      });
    }

    next();
  };
};

// Validate string length
export const validateLength = (field, min, max) => {
  return (req, res, next) => {
    if (!req.body[field]) {
      return next();
    }

    const length = req.body[field].length;

    if (min && length < min) {
      return res.status(400).json({
        success: false,
        message: `${field} must be at least ${min} characters`,
      });
    }

    if (max && length > max) {
      return res.status(400).json({
        success: false,
        message: `${field} must be at most ${max} characters`,
      });
    }

    next();
  };
};

// Validate enum values
export const validateEnum = (field, allowedValues) => {
  return (req, res, next) => {
    if (!req.body[field]) {
      return next();
    }

    if (!allowedValues.includes(req.body[field])) {
      return res.status(400).json({
        success: false,
        message: `${field} must be one of: ${allowedValues.join(", ")}`,
        allowedValues,
      });
    }

    next();
  };
};

// Validate date format
export const validateDate = (field) => {
  return (req, res, next) => {
    if (!req.body[field]) {
      return next();
    }

    const date = new Date(req.body[field]);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: `Invalid date format for field: ${field}`,
      });
    }

    next();
  };
};

// Validate phone number (basic)
export const validatePhone = (field = "phoneNumber") => {
  return (req, res, next) => {
    if (!req.body[field]) {
      return next();
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(req.body[field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid phone number format for field: ${field}`,
      });
    }

    next();
  };
};

// Custom validation function
export const customValidation = (validator) => {
  return (req, res, next) => {
    try {
      const result = validator(req);
      if (result && result.error) {
        return res.status(400).json({
          success: false,
          message: result.error,
        });
      }
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }
  };
};

// Combine multiple validators
export const combineValidators = (...validators) => {
  return (req, res, next) => {
    let index = 0;
    const runNext = () => {
      if (index < validators.length) {
        const validator = validators[index++];
        validator(req, res, (err) => {
          if (err) {
            return next(err);
          }
          runNext();
        });
      } else {
        next();
      }
    };
    runNext();
  };
};

