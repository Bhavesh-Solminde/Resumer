/**
 * Custom API Error class that extends the native Error.
 * Used for consistent error handling across the application.
 */
class ApiError extends Error {
  statusCode: number;
  data: null;
  errors: string[];
  success: false;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: string[] = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
