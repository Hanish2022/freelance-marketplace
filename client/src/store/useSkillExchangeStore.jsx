import { create } from "zustand";
import Axios from "../lib/Axios";
import { toast } from "react-hot-toast";

export const useSkillExchangeStore = create((set) => ({
  skillExchangers: [],
  userSkillExchanges: [],
  isLoading: false,
  error: null,

  // Fetch all potential skill exchange matches
  fetchSkillExchangeMatches: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await Axios.get("/skill-exchange/matches");
      set({ skillExchangers: response.data.skillExchangers });
      return response.data.skillExchangers;
    } catch (error) {
      console.error("Error fetching skill exchange matches:", error);
      set({ error: error.message });
      toast.error("Failed to fetch skill exchange matches");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new skill exchange request
  createSkillExchange: async (data) => {
    try {
      set({ isLoading: true, error: null });
      console.log("Creating skill exchange with data:", data); // Debug log
      const response = await Axios.post("/skill-exchange", data);
      console.log("Skill exchange response:", response.data); // Debug log
      set((state) => ({
        userSkillExchanges: [...state.userSkillExchanges, response.data.skillExchange],
      }));
      toast.success("Skill exchange request created successfully");
      return response.data.skillExchange;
    } catch (error) {
      console.error("Error creating skill exchange:", error);
      set({ error: error.message });
      toast.error(error.response?.data?.message || "Failed to create skill exchange request");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch user's skill exchanges
  fetchUserSkillExchanges: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await Axios.get("/skill-exchange/user");
      set({ userSkillExchanges: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching user skill exchanges:", error);
      set({ error: error.message });
      toast.error("Failed to fetch your skill exchanges");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update skill exchange status
  updateSkillExchangeStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      const response = await Axios.put(`/skill-exchange/${id}`, { status });
      set((state) => ({
        userSkillExchanges: state.userSkillExchanges.map((exchange) =>
          exchange._id === id ? response.data : exchange
        ),
      }));
      toast.success("Skill exchange status updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating skill exchange status:", error);
      set({ error: error.message });
      toast.error("Failed to update skill exchange status");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a skill exchange
  deleteSkillExchange: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await Axios.delete(`/skill-exchange/${id}`);
      set((state) => ({
        userSkillExchanges: state.userSkillExchanges.filter(
          (exchange) => exchange._id !== id
        ),
      }));
      toast.success("Skill exchange deleted successfully");
    } catch (error) {
      console.error("Error deleting skill exchange:", error);
      set({ error: error.message });
      toast.error("Failed to delete skill exchange");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
