import React from "react";

const SkillCreditSystem = () => {
  // Sample data for credits and transactions
  const userCredits = 150;
  const transactions = [
    {
      id: 1,
      type: "earned",
      amount: 50,
      description: "Completed Web Design for Rahul",
    },
    {
      id: 2,
      type: "spent",
      amount: 30,
      description: "Requested Content Writing from Priya",
    },
    {
      id: 3,
      type: "earned",
      amount: 100,
      description: "Completed Mobile App Development for Vikram",
    },
  ];

  return (
    <section className="bg-gray-900 min-h-screen text-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Skill Credit System
        </h2>

        {/* Credit Dashboard */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Your Credits</h3>
              <p className="text-gray-400">
                Earn credits by offering services and spend them to request
                services.
              </p>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {userCredits} Credits
            </div>
          </div>

          {/* Badge System */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold">Achievements</h4>
            <div className="mt-4 flex gap-4">
              <div className="bg-green-500 text-gray-900 font-semibold py-2 px-4 rounded-full">
                Top Contributor
              </div>
              <div className="bg-green-500 text-gray-900 font-semibold py-2 px-4 rounded-full">
                Active Trader
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-100">{transaction.description}</p>
                    <p className="text-sm text-gray-400">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      transaction.type === "earned"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {transaction.amount} Credits
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillCreditSystem;
