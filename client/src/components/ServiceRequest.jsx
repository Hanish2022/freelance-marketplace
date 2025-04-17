import React, { useState, useEffect } from "react";
import { useServiceRequestStore } from "../store/useServiceRequestStore";
import { useAuthStore } from "../store/useAuthStore";
import Chat from "./Chat";
import { toast } from "react-hot-toast";

const ServiceRequest = () => {
  const { 
    userServiceRequests, 
    serviceRequests,
    isLoading, 
    error, 
    fetchUserServiceRequests, 
    fetchAllServiceRequests,
    createServiceRequest, 
    updateServiceRequestStatus 
  } = useServiceRequestStore();
  const { authUser } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: [],
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "my", "available"

  useEffect(() => {
    fetchUserServiceRequests();
    fetchAllServiceRequests();
  }, [fetchUserServiceRequests, fetchAllServiceRequests]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createServiceRequest({
        ...formData,
        budget: Number(formData.budget),
        deadline: new Date(formData.deadline).toISOString(),
      });
      setFormData({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        skills: [],
      });
    } catch (error) {
      console.error("Error creating service request:", error);
    }
  };

  const handleNegotiate = async (request) => {
    try {
      // First update the service request status to allow chat access
      await updateServiceRequestStatus(request._id, "In Progress");
      setSelectedRequest(request);
      setShowChat(true);
    } catch (error) {
      console.error("Error starting negotiation:", error);
      toast.error("Failed to start negotiation. Please try again.");
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedRequest(null);
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await updateServiceRequestStatus(requestId, newStatus);
    } catch (error) {
      console.error("Error updating service request status:", error);
    }
  };

  const filteredRequests = () => {
    switch (activeTab) {
      case "my":
        return userServiceRequests;
      case "available":
        return serviceRequests.filter(request => 
          request.user && request.user._id !== authUser._id && 
          request.status === "Open"
        );
      default:
        return serviceRequests;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => {
            fetchUserServiceRequests();
            fetchAllServiceRequests();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="bg-gray-900 min-h-screen text-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Service Requests & Negotiations
        </h2>

        {/* Service Request Form */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Submit a Service Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Service Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <textarea
              name="description"
              placeholder="Service Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              required
            />
            <input
              type="number"
              name="budget"
              placeholder="Budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              name="skills"
              placeholder="Required Skills (comma-separated)"
              value={formData.skills.join(", ")}
              onChange={handleSkillChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "all"
                ? "bg-green-500 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "my"
                ? "bg-green-500 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "available"
                ? "bg-green-500 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Available Requests
          </button>
        </div>

        {/* Service Requests List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {activeTab === "all"
              ? "All Service Requests"
              : activeTab === "my"
              ? "My Service Requests"
              : "Available Service Requests"}
          </h3>
          <div className="space-y-4">
            {filteredRequests().length > 0 ? (
              filteredRequests().map((request) => (
                <div
                  key={request._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-green-400">
                      {request.title}
                    </h4>
                    <span className="text-sm text-gray-400">
                      By: {request.user?.name || "Unknown User"}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-2">{request.description}</p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">
                      Budget: ${request.budget}
                    </p>
                    <p className="text-sm text-gray-400">
                      Deadline: {new Date(request.deadline).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {request.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Status: {request.status}
                    </span>
                    <div className="flex space-x-2">
                      {request.status === "Open" && (
                        <>
                          {request.user && request.user._id === authUser._id ? (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(request._id, "Cancelled")}
                                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-400 transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleNegotiate(request)}
                              className="bg-green-500 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-green-400 transition"
                            >
                              Negotiate
                            </button>
                          )}
                        </>
                      )}
                      {request.status === "In Progress" && request.user && request.user._id === authUser._id && (
                        <button 
                          onClick={() => handleUpdateStatus(request._id, "Completed")}
                          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-400 transition"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No service requests found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-[80vh]">
            <Chat 
              serviceRequestId={selectedRequest._id} 
              onClose={handleCloseChat} 
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceRequest;
