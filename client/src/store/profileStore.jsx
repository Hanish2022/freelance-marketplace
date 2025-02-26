import { create } from "zustand";
import Axios from "../lib/Axios";
import { toast } from "react-toastify";

export const useProfileStore = create((set) => ({
  userProfile: null,

  fetchUserProfile: async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get token from storage
      if (!token) {
        console.warn("No token found in local storage.");
        return;
      }

      const res = await Axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
          },
        }
      );

      set({ userProfile: res.data.user });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.response?.data?.message || "Failed to load profile.");
    }
  },

  updateUserProfile: async (data) => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get token from storage
      if (!token) {
        console.warn("No token found in local storage.");
        return;
      }

      const res = await Axios.put(
        `${import.meta.env.VITE_BASE_API_URL}/auth/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token
          },
        }
      );

      set({ userProfile: res.data.user });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  },
}));
