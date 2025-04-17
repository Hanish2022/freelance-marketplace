import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";

const SkillCreditSystem = () => {
  const { authUser } = useAuthStore();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // This would be replaced with an API call to fetch credits and transactions
    setTimeout(() => {
      setCredits(150);
      setTransactions([
        { id: 1, type: "earned", amount: 50, description: "Web Development for John", date: "2023-05-15" },
        { id: 2, type: "spent", amount: 30, description: "Logo Design from Sarah", date: "2023-05-10" },
        { id: 3, type: "earned", amount: 100, description: "Content Writing for Mike", date: "2023-05-05" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

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
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
          size="md"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          }
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <section className="bg-gray-900 min-h-screen text-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Skill Credit Dashboard
        </h2>

        {/* Credit Balance Card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Your Credit Balance</h3>
              <p className="text-4xl font-bold text-green-500 mt-2">{credits} Credits</p>
            </div>
            <div className="bg-green-900 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
              <div className="bg-yellow-500 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Top Contributor</h4>
                <p className="text-sm text-gray-400">Earned 100+ credits</p>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
              <div className="bg-blue-500 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Trusted Partner</h4>
                <p className="text-sm text-gray-400">5+ successful exchanges</p>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
              <div className="bg-purple-500 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Quick Responder</h4>
                <p className="text-sm text-gray-400">Responds within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === "earned" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                      }`}>
                        {transaction.type === "earned" ? "Earned" : "Spent"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${
                        transaction.type === "earned" ? "text-green-500" : "text-red-500"
                      }`}>
                        {transaction.type === "earned" ? "+" : "-"}{transaction.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillCreditSystem;
