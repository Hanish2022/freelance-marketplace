import { create } from "zustand";
import Axios from "../lib/Axios";
import { toast } from "react-toastify";

export const useServiceRequestStore = create((set) => ({
  serviceRequests: [],
  userServiceRequests: [],
  isLoading: false,
  error: null,

  // Fetch all service requests
  fetchAllServiceRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await Axios.get("/service-request");
      if (response.data.success) {
        set({ serviceRequests: response.data.serviceRequests });
        return response.data.serviceRequests;
      } else {
        throw new Error(response.data.message || "Failed to fetch service requests");
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
      set({ error: error.message });
      toast.error("Failed to fetch service requests");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch user's service requests
  fetchUserServiceRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await Axios.get("/service-request/user");
      if (response.data.success) {
        set({ userServiceRequests: response.data.serviceRequests });
        return response.data.serviceRequests;
      } else {
        throw new Error(response.data.message || "Failed to fetch your service requests");
      }
    } catch (error) {
      console.error("Error fetching user service requests:", error);
      set({ error: error.message });
      toast.error("Failed to fetch your service requests");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new service request
  createServiceRequest: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await Axios.post("/service-request", data);
      if (response.data.success) {
        set((state) => ({
          userServiceRequests: [...state.userServiceRequests, response.data.serviceRequest],
        }));
        toast.success("Service request created successfully");
        return response.data.serviceRequest;
      } else {
        throw new Error(response.data.message || "Failed to create service request");
      }
    } catch (error) {
      console.error("Error creating service request:", error);
      set({ error: error.message });
      toast.error("Failed to create service request");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update service request status
  updateServiceRequestStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      const response = await Axios.put(`/service-request/${id}`, { status });
      if (response.data.success) {
        set((state) => ({
          userServiceRequests: state.userServiceRequests.map((request) =>
            request._id === id ? response.data.serviceRequest : request
          ),
        }));
        toast.success("Service request status updated successfully");
        return response.data.serviceRequest;
      } else {
        throw new Error(response.data.message || "Failed to update service request status");
      }
    } catch (error) {
      console.error("Error updating service request status:", error);
      set({ error: error.message });
      toast.error("Failed to update service request status");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a service request
  deleteServiceRequest: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await Axios.delete(`/service-request/${id}`);
      if (response.data.success) {
        set((state) => ({
          userServiceRequests: state.userServiceRequests.filter(
            (request) => request._id !== id
          ),
        }));
        toast.success("Service request deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete service request");
      }
    } catch (error) {
      console.error("Error deleting service request:", error);
      set({ error: error.message });
      toast.error("Failed to delete service request");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 