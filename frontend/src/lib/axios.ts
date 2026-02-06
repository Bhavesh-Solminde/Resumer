import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * Typed axios instance for API requests
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
});

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  message: string;
  success: false;
  errors?: string[];
}

/**
 * Extended error type for axios errors with our API error shape
 */
export interface TypedAxiosError extends AxiosError<ApiErrorResponse> {}

/**
 * Type guard to check if error is an axios error with response data
 */
export function isApiError(error: unknown): error is TypedAxiosError {
  return axios.isAxiosError(error) && error.response?.data !== undefined;
}

/**
 * Helper to extract error message from API error
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "An error occurred"
): string {
  if (isApiError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

// Request interceptor (can add auth headers, logging, etc.)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Can add auth token here if needed
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor (can handle global error responses)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Redirect to pricing page when user has insufficient credits
    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.toLowerCase().includes("insufficient credits")
    ) {
      // Use window.location for navigation outside React tree
      window.location.href = "/pricing";
      return new Promise(() => {}); // Never resolve — page is navigating away
    }
    return Promise.reject(error);
  }
);
