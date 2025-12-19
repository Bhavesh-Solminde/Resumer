import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: true,
  isUpdatingPassword: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      try {
        await axiosInstance.post("/auth/refresh-token");
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data.user });
      } catch (refreshError) {
        set({ authUser: null });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.data });
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data.user });
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updatePassword: async (oldPassword, newPassword) => {
    set({ isUpdatingPassword: true });
    try {
      const user = get().authUser;
      if (!user) {
        toast.error("Failed to get the user");
        return;
      }
      const res = await axiosInstance.post(`/auth/updatepassword`, {
        oldPassword,
        newPassword,
      });
      if (!res) {
        toast.error("Backend not responding");
        return;
      }
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change the password"
      );
    } finally {
      set({ isUpdatingPassword: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/updateprofile", data);
      set({ authUser: res.data.data });
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    }
  },
}));
