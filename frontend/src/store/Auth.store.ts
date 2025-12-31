import { create } from "zustand";
import { axiosInstance, getApiErrorMessage } from "../lib/axios";
import { toast } from "react-hot-toast";
import type {
  IUser,
  ISignupRequest,
  ILoginRequest,
  IUpdatePasswordRequest,
  IUpdateProfileRequest,
} from "@resumer/shared-types";
import type { ApiResponse } from "@resumer/shared-types";

/**
 * Auth store state interface
 */
interface AuthState {
  authUser: IUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isCheckingAuth: boolean;
  isUpdatingPassword: boolean;
}

/**
 * Auth store actions interface
 */
interface AuthActions {
  checkAuth: () => Promise<void>;
  signup: (data: ISignupRequest) => Promise<boolean>;
  login: (data: ILoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (data: IUpdateProfileRequest) => Promise<boolean>;
}

/**
 * Combined Auth store type
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Initial state for auth store
 */
const initialState: AuthState = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: true,
  isUpdatingPassword: false,
};

/**
 * Auth store with typed state and actions
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<ApiResponse<{ user: IUser }>>(
        "/auth/check"
      );
      set({ authUser: res.data.data.user });
    } catch {
      console.log("Error in checkAuth, attempting refresh...");
      try {
        await axiosInstance.post("/auth/refresh-token");
        const res = await axiosInstance.get<ApiResponse<{ user: IUser }>>(
          "/auth/check"
        );
        set({ authUser: res.data.data.user });
      } catch {
        set({ authUser: null });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: ISignupRequest) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<ApiResponse<IUser>>(
        "/auth/register",
        data
      );
      set({ authUser: res.data.data });
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Signup failed"));
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: ILoginRequest) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<ApiResponse<{ user: IUser }>>(
        "/auth/login",
        data
      );
      set({ authUser: res.data.data.user });
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Login failed"));
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
      toast.error(getApiErrorMessage(error, "Logout failed"));
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    set({ isUpdatingPassword: true });
    try {
      const user = get().authUser;
      if (!user) {
        toast.error("Failed to get the user");
        return;
      }
      const payload: IUpdatePasswordRequest = { oldPassword, newPassword };
      const res = await axiosInstance.post("/auth/updatepassword", payload);
      if (!res) {
        toast.error("Backend not responding");
        return;
      }
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to change the password"));
    } finally {
      set({ isUpdatingPassword: false });
    }
  },

  updateProfile: async (data: IUpdateProfileRequest) => {
    try {
      const res = await axiosInstance.put<ApiResponse<IUser>>(
        "/auth/updateprofile",
        data
      );
      set({ authUser: res.data.data });
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile"));
      return false;
    }
  },
}));
