import React, { useState } from "react";

const MilestoneTracking = () => {
  // Sample data for milestones
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "Logo Design Sketch",
      status: "Completed",
      progress: 100,
    },
    {
      id: 2,
      title: "Final Design Delivery",
      status: "In Progress",
      progress: 50,
    },
    {
      id: 3,
      title: "Feedback and Revisions",
      status: "Not Started",
      progress: 0,
    },
  ]);

  // State for adding a new milestone
  const [newMilestone, setNewMilestone] = useState("");

  // Function to add a new milestone
  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      const milestone = {
        id: milestones.length + 1,
        title: newMilestone,
        status: "Not Started",
        progress: 0,
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone("");
    }
  };

  return (
    <section className="bg-gray-900 min-h-screen text-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Milestone-Based Task Tracking
        </h2>

        {/* Add Milestone Form */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Add a New Milestone</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter milestone title..."
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAddMilestone}
              className="bg-green-500 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-green-400 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{milestone.title}</h3>
                <span
                  className={`text-sm font-semibold ${
                    milestone.status === "Completed"
                      ? "text-green-500"
                      : milestone.status === "In Progress"
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  {milestone.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Progress: {milestone.progress}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilestoneTracking;