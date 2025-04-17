import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/User.js";

// Create a new service request
export const createServiceRequest = async (req, res) => {
  try {
    const { title, description, budget, deadline, skills } = req.body;

    const serviceRequest = await ServiceRequest.create({
      title,
      description,
      budget,
      deadline,
      skills,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      serviceRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all service requests
export const getAllServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find()
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      serviceRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get service requests by user
export const getUserServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({ user: req.user._id })
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      serviceRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update service request status
export const updateServiceRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const serviceRequest = await ServiceRequest.findById(id);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    // Allow negotiation if the request is open
    if (serviceRequest.status === "Open") {
      serviceRequest.assignedTo = req.user._id;
      serviceRequest.status = "In Progress";
    } else {
      // For other status updates, check authorization
      if (
        serviceRequest.user.toString() !== req.user._id.toString() &&
        serviceRequest.assignedTo?.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this service request",
        });
      }
    }

    serviceRequest.status = status || serviceRequest.status;
    if (assignedTo) {
      serviceRequest.assignedTo = assignedTo;
    }

    await serviceRequest.save();
    
    // Populate the user and assignedTo fields before sending the response
    const updatedServiceRequest = await ServiceRequest.findById(id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Service request updated successfully",
      serviceRequest: updatedServiceRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete service request
export const deleteServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const serviceRequest = await ServiceRequest.findById(id);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    // Only the creator can delete the service request
    if (serviceRequest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this service request",
      });
    }

    await serviceRequest.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 