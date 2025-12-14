import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1", // Default to localhost:3000 if not set
  withCredentials: true, // to send cookies with requests
});
