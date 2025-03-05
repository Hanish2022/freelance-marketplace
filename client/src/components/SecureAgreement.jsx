import React, { useState } from "react";

const SecureAgreement = () => {
  // State for agreement terms
  const [terms, setTerms] = useState("");
  const [party1Signature, setParty1Signature] = useState("");
  const [party2Signature, setParty2Signature] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (terms && party1Signature && party2Signature) {
      alert("Agreement created successfully!");
      // Simulate PDF generation (to be implemented)
      generatePDF();
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Simulate PDF generation
  const generatePDF = () => {
    // This is a placeholder for PDF generation logic
    console.log("Generating PDF...");
  };

  return (
    <section className="bg-gray-900 min-h-screen text-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Secure Agreement System
        </h2>

        {/* Agreement Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Create an Agreement</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <textarea
                placeholder="Enter agreement terms..."
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="6"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">
                    Party 1 Signature
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your signature"
                    value={party1Signature}
                    onChange={(e) => setParty1Signature(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">
                    Party 2 Signature
                  </label>
                  <input
                    type="text"
                    placeholder="Enter counterparty's signature"
                    value={party2Signature}
                    onChange={(e) => setParty2Signature(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Create Agreement
            </button>
          </form>
        </div>

        {/* Agreement Preview */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Agreement Preview</h3>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-100 whitespace-pre-wrap">{terms}</p>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-gray-400">Party 1 Signature:</p>
                <p className="text-gray-100">{party1Signature}</p>
              </div>
              <div>
                <p className="text-gray-400">Party 2 Signature:</p>
                <p className="text-gray-100">{party2Signature}</p>
              </div>
            </div>
          </div>
          <button
            onClick={generatePDF}
            className="mt-6 w-full bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
          >
            Download Agreement as PDF
          </button>
        </div>
      </div>
    </section>
  );
};

export default SecureAgreement;
