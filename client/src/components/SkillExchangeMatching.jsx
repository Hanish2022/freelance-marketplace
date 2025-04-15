import React, { useState, useEffect } from "react";
import { useSkillExchangeStore } from "../store/useSkillExchangeStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";

const SkillExchangeMatching = () => {
  const { skillExchangers, isLoading, error, fetchSkillExchangeMatches, createSkillExchange } = useSkillExchangeStore();
  const { authUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState({
    offeredSkill: "",
    requestedSkill: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedExchanger, setSelectedExchanger] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(new Set());

  useEffect(() => {
    fetchSkillExchangeMatches();
  }, [fetchSkillExchangeMatches]);

  const filteredExchangers = skillExchangers.filter(
    (exchanger) =>
      exchanger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchanger.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      exchanger.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnectClick = (exchanger) => {
    if (connectedUsers.has(exchanger._id)) {
      return;
    }
    
    if (!selectedSkills.offeredSkill || !selectedSkills.requestedSkill) {
      toast.error("Please select both skills before connecting");
      return;
    }
    
    setSelectedExchanger(exchanger);
    setShowConfirmation(true);
  };

  const handleConfirmConnect = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log("Sending skill exchange request with data:", {
        partnerId: selectedExchanger._id,
        skill1: selectedSkills.offeredSkill,
        skill2: selectedSkills.requestedSkill,
      });
      
      await createSkillExchange({
        partnerId: selectedExchanger._id,
        skill1: selectedSkills.offeredSkill,
        skill2: selectedSkills.requestedSkill,
      });
      
      // Add user to connected set
      setConnectedUsers(prev => new Set([...prev, selectedExchanger._id]));
      
      toast.success("Connection request sent successfully!");
      setShowConfirmation(false);
      setSelectedExchanger(null);
      setSelectedSkills({ offeredSkill: "", requestedSkill: "" });
    } catch (error) {
      console.error("Error creating skill exchange:", error);
      toast.error(error.response?.data?.message || "Failed to send connection request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelConnect = () => {
    setShowConfirmation(false);
    setSelectedExchanger(null);
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
          onClick={() => fetchSkillExchangeMatches()}
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
          Skill Exchange Matching
        </h2>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, skill, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Skill Selection */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Skill You'll Offer</label>
            <select
              value={selectedSkills.offeredSkill}
              onChange={(e) => setSelectedSkills(prev => ({ ...prev, offeredSkill: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a skill</option>
              {authUser?.skills?.map((skill, index) => (
                <option key={index} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Skill You Want to Learn</label>
            <select
              value={selectedSkills.requestedSkill}
              onChange={(e) => setSelectedSkills(prev => ({ ...prev, requestedSkill: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a skill</option>
              {skillExchangers.flatMap(exchanger => exchanger.skills).filter((skill, index, self) => self.indexOf(skill) === index).map((skill, index) => (
                <option key={index} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Skill Exchangers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExchangers.length > 0 ? (
            filteredExchangers.map((exchanger) => (
              <div
                key={exchanger._id}
                className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={exchanger.profileImage || "https://via.placeholder.com/100"}
                    alt={exchanger.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{exchanger.name}</h3>
                    <p className="text-sm text-gray-400">
                      {exchanger.location}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {exchanger.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 mt-2">{exchanger.bio}</p>
                </div>
                <button
                  onClick={() => handleConnectClick(exchanger)}
                  disabled={connectedUsers.has(exchanger._id)}
                  className={`mt-6 w-full font-semibold py-2 rounded-lg transition ${
                    connectedUsers.has(exchanger._id)
                      ? "bg-red-500 text-white cursor-not-allowed"
                      : "bg-green-500 text-gray-900 hover:bg-green-400"
                  }`}
                >
                  {connectedUsers.has(exchanger._id) ? "Connected" : "Connect"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">
              No matching skill exchangers found.
            </p>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && selectedExchanger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Skill Exchange</h3>
            <p className="mb-4">
              You are about to connect with <span className="font-medium">{selectedExchanger.name}</span>
              {selectedExchanger.email && ` (${selectedExchanger.email})`}
            </p>
            <div className="mb-4">
              <p className="text-sm text-gray-400">You will offer: <span className="text-green-400">{selectedSkills.offeredSkill}</span></p>
              <p className="text-sm text-gray-400">You will learn: <span className="text-green-400">{selectedSkills.requestedSkill}</span></p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelConnect}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConnect}
                className="px-4 py-2 bg-green-500 text-gray-900 rounded hover:bg-green-400 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SkillExchangeMatching;

