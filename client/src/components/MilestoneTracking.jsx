import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";

const MilestoneTracking = () => {
  const { authUser } = useAuthStore();
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setMilestones([
        {
          id: 1,
          title: "Initial Design Draft",
          description: "Create wireframes and mockups",
          dueDate: "2023-06-01",
          status: "completed",
          progress: 100,
        },
        {
          id: 2,
          title: "Frontend Development",
          description: "Implement UI components",
          dueDate: "2023-06-15",
          status: "in-progress",
          progress: 60,
        },
        {
          id: 3,
          title: "Backend Integration",
          description: "Connect frontend with API",
          dueDate: "2023-06-30",
          status: "pending",
          progress: 0,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestone.title || !newMilestone.description || !newMilestone.dueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const milestone = {
      id: Date.now(),
      ...newMilestone,
      status: "pending",
      progress: 0,
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({ title: "", description: "", dueDate: "" });
    toast.success("Milestone added successfully!");
  };

  const handleUpdateProgress = (id, progress) => {
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === id
          ? {
              ...milestone,
              progress,
              status: progress === 100 ? "completed" : "in-progress",
            }
          : milestone
      )
    );
    toast.success("Progress updated!");
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
          onClick={() => window.location.reload()}
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
          Milestone Tracking
        </h2>

        {/* Add New Milestone Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Add New Milestone</h3>
          <form onSubmit={handleAddMilestone} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter milestone title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter milestone description"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, dueDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              }
            >
              Add Milestone
            </Button>
          </form>
        </div>

        {/* Milestones List */}
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{milestone.title}</h3>
                  <p className="text-gray-400 mt-1">{milestone.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    milestone.status === "completed"
                      ? "bg-green-900 text-green-300"
                      : milestone.status === "in-progress"
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {milestone.status.charAt(0).toUpperCase() +
                    milestone.status.slice(1)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      milestone.status === "completed"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Progress Controls */}
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    handleUpdateProgress(
                      milestone.id,
                      Math.max(0, milestone.progress - 25)
                    )
                  }
                  variant="secondary"
                  size="sm"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  -25%
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateProgress(
                      milestone.id,
                      Math.min(100, milestone.progress + 25)
                    )
                  }
                  variant="secondary"
                  size="sm"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  +25%
                </Button>
                <Button
                  onClick={() => handleUpdateProgress(milestone.id, 100)}
                  variant="success"
                  size="sm"
                  className="ml-auto"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Mark Complete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilestoneTracking;