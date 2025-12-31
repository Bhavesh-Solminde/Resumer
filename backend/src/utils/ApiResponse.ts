/**
 * Standard API Response wrapper for consistent response structure.
 * @template T The type of data being returned
 */
class ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T | null;
  success: boolean;

  constructor(statusCode: number, message = "Success", data: T | null = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
