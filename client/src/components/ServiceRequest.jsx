import React, { useState } from "react";

const ServiceRequest = () => {
  // State for the service request form
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");

  // State for active service requests
  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 1,
      title: "Need a logo design for my startup",
      description: "Looking for a minimalist logo in black and white.",
      status: "Open",
    },
    {
      id: 2,
      title: "Require a blog post on AI trends",
      description: "1000-word article on the latest AI trends in 2023.",
      status: "Open",
    },
  ]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (serviceTitle && serviceDescription) {
      const newRequest = {
        id: serviceRequests.length + 1,
        title: serviceTitle,
        description: serviceDescription,
        status: "Open",
      };
      setServiceRequests([...serviceRequests, newRequest]);
      setServiceTitle("");
      setServiceDescription("");
    }
  };

  return (
    <section className="bg-gray-900 min-h-screen text-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Service Requests & Negotiations
        </h2>

        {/* Service Request Form */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Submit a Service Request
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Service Title"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Service Description"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Active Service Requests */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Active Service Requests
          </h3>
          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h4 className="text-lg font-medium text-green-400">
                  {request.title}
                </h4>
                <p className="text-gray-400 mt-2">{request.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Status: {request.status}
                  </span>
                  <button className="bg-green-500 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-green-400 transition">
                    Negotiate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceRequest;
