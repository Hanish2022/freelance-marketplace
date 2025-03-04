import React, { useState } from "react";

const SkillExchangeMatching = () => {
  // Sample data for skill exchangers
  const skillExchangers = [
    {
      id: 1,
      name: "Rahul Sharma",
      skill: "Web Development",
      description: "Experienced in React, Node.js, and MongoDB.",
      location: "Mumbai, India",
      image: "https://via.placeholder.com/100", // Placeholder image
    },
    {
      id: 2,
      name: "Priya Patel",
      skill: "Graphic Design",
      description: "Specializes in logos, banners, and illustrations.",
      location: "Delhi, India",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Amit Singh",
      skill: "Content Writing",
      description: "Creates engaging content for blogs and websites.",
      location: "Bangalore, India",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Neha Gupta",
      skill: "Digital Marketing",
      description: "Expert in SEO, SEM, and social media marketing.",
      location: "Hyderabad, India",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 5,
      name: "Vikram Joshi",
      skill: "Mobile App Development",
      description: "Proficient in Flutter and React Native.",
      location: "Pune, India",
      image: "https://via.placeholder.com/100",
    },
  ];

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filter skill exchangers based on search query
  const filteredExchangers = skillExchangers.filter(
    (exchanger) =>
      exchanger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchanger.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchanger.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Skill Exchangers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExchangers.length > 0 ? (
            filteredExchangers.map((exchanger) => (
              <div
                key={exchanger.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={exchanger.image}
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
                  <h4 className="text-lg font-medium text-green-400">
                    {exchanger.skill}
                  </h4>
                  <p className="text-gray-400 mt-2">{exchanger.description}</p>
                </div>
                <button className="mt-6 w-full bg-green-500 text-gray-900 font-semibold py-2 rounded-lg hover:bg-green-400 transition">
                  Connect
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
    </section>
  );
};

export default SkillExchangeMatching;
