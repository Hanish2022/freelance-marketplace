import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";

const SecureAgreementSystem = () => {
  const { authUser } = useAuthStore();
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAgreement, setNewAgreement] = useState({
    title: "",
    description: "",
    terms: "",
    duration: "",
    skillCredits: "",
  });

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setAgreements([
        {
          id: 1,
          title: "Website Development Agreement",
          description: "Full-stack website development project",
          terms: "1. Deliverables: Responsive website with admin dashboard\n2. Timeline: 4 weeks\n3. Skill Credits: 500",
          duration: "4 weeks",
          skillCredits: 500,
          status: "active",
          parties: ["John Doe", "Jane Smith"],
          createdAt: "2023-05-15",
        },
        {
          id: 2,
          title: "Logo Design Agreement",
          description: "Brand identity design package",
          terms: "1. Deliverables: Logo, color palette, typography\n2. Timeline: 2 weeks\n3. Skill Credits: 200",
          duration: "2 weeks",
          skillCredits: 200,
          status: "pending",
          parties: ["Alice Johnson", "Bob Wilson"],
          createdAt: "2023-05-20",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateAgreement = (e) => {
    e.preventDefault();
    if (
      !newAgreement.title ||
      !newAgreement.description ||
      !newAgreement.terms ||
      !newAgreement.duration ||
      !newAgreement.skillCredits
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const agreement = {
      id: Date.now(),
      ...newAgreement,
      status: "pending",
      parties: [authUser?.name || "Current User", "Pending Partner"],
      createdAt: new Date().toISOString().split("T")[0],
    };

    setAgreements([...agreements, agreement]);
    setNewAgreement({
      title: "",
      description: "",
      terms: "",
      duration: "",
      skillCredits: "",
    });
    toast.success("Agreement created successfully!");
  };

  const handleAcceptAgreement = (id) => {
    setAgreements(
      agreements.map((agreement) =>
        agreement.id === id
          ? { ...agreement, status: "active" }
          : agreement
      )
    );
    toast.success("Agreement accepted!");
  };

  const handleRejectAgreement = (id) => {
    setAgreements(
      agreements.map((agreement) =>
        agreement.id === id
          ? { ...agreement, status: "rejected" }
          : agreement
      )
    );
    toast.success("Agreement rejected");
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
          Secure Agreement System
        </h2>

        {/* Create Agreement Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Create New Agreement</h3>
          <form onSubmit={handleCreateAgreement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newAgreement.title}
                onChange={(e) =>
                  setNewAgreement({ ...newAgreement, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agreement title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newAgreement.description}
                onChange={(e) =>
                  setNewAgreement({
                    ...newAgreement,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agreement description"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Terms and Conditions
              </label>
              <textarea
                value={newAgreement.terms}
                onChange={(e) =>
                  setNewAgreement({ ...newAgreement, terms: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter terms and conditions"
                rows="4"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration (weeks)
                </label>
                <input
                  type="number"
                  value={newAgreement.duration}
                  onChange={(e) =>
                    setNewAgreement({
                      ...newAgreement,
                      duration: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter duration in weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Skill Credits
                </label>
                <input
                  type="number"
                  value={newAgreement.skillCredits}
                  onChange={(e) =>
                    setNewAgreement({
                      ...newAgreement,
                      skillCredits: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter skill credits"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              }
            >
              Create Agreement
            </Button>
          </form>
        </div>

        {/* Agreements List */}
        <div className="space-y-6">
          {agreements.map((agreement) => (
            <div
              key={agreement.id}
              className="bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{agreement.title}</h3>
                  <p className="text-gray-400 mt-1">{agreement.description}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      Duration: {agreement.duration} weeks
                    </p>
                    <p className="text-sm text-gray-500">
                      Skill Credits: {agreement.skillCredits}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(agreement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    agreement.status === "active"
                      ? "bg-green-900 text-green-300"
                      : agreement.status === "pending"
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-red-900 text-red-300"
                  }`}
                >
                  {agreement.status.charAt(0).toUpperCase() +
                    agreement.status.slice(1)}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Terms and Conditions
                </h4>
                <pre className="text-sm text-gray-400 whitespace-pre-wrap bg-gray-700 p-4 rounded-md">
                  {agreement.terms}
                </pre>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Parties</h4>
                <div className="flex gap-2">
                  {agreement.parties.map((party, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {party}
                    </span>
                  ))}
                </div>
              </div>

              {agreement.status === "pending" && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAcceptAgreement(agreement.id)}
                    variant="success"
                    fullWidth
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Accept Agreement
                  </Button>
                  <Button
                    onClick={() => handleRejectAgreement(agreement.id)}
                    variant="danger"
                    fullWidth
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Reject Agreement
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecureAgreementSystem; 