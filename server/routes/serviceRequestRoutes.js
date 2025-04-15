import express from "express";
import {
  createServiceRequest,
  getAllServiceRequests,
  getUserServiceRequests,
  updateServiceRequestStatus,
  deleteServiceRequest,
} from "../controllers/serviceRequestController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Create a new service request
router.post("/", isAuthenticated, createServiceRequest);

// Get all service requests
router.get("/", isAuthenticated, getAllServiceRequests);

// Get user's service requests
router.get("/user", isAuthenticated, getUserServiceRequests);

// Update service request status
router.put("/:id", isAuthenticated, updateServiceRequestStatus);

// Delete service request
router.delete("/:id", isAuthenticated, deleteServiceRequest);

export default router; 