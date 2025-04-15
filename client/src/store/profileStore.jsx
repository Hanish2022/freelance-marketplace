import { create } from "zustand";
import Axios from "../lib/Axios";
import { toast } from "react-toastify";

export const useProfileStore = create((set) => ({
  userProfile: null,

  fetchUserProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await Axios.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile response:", response.data); // Debug log

      if (response.data && response.data.user) {
        set({ userProfile: response.data.user });
        return response.data.user;
      } else {
        throw new Error("Invalid profile data received");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      throw error;
    }
  },

  updateUserProfile: async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await Axios.put("/auth/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.user) {
        set({ userProfile: response.data.user });
        toast.success("Profile updated successfully!");
        return response.data.user;
      } else {
        throw new Error("Invalid profile data received");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    }
  },
}));
