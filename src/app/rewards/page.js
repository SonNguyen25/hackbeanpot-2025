"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, Gift, Search } from "lucide-react";

export default function RewardsList() {
  const { user, logout } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedRewards = localStorage.getItem("rewards");
    if (storedRewards) {
      setRewards(JSON.parse(storedRewards));
    } else {
      setRewards([]);
    }
  }, []);

  const filteredRewards = rewards.filter((reward) =>
    reward.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-5xl font-bold text-green-500 mb-4 md:mb-0">
            Rewards
          </h1>
          {user?.firstname?.includes("Jonathan") && (
            <Link
              href="/rewards/create"
              className="bg-gradient-to-r from-green-400 to-blue-500 font-bold text-white px-6 py-3 rounded-full flex items-center hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="mr-2" />
              Create Reward
            </Link>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Rewards Grid */}
      {filteredRewards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              onClick={() => router.push(`/rewards/claim/${reward.id}`)}
              className="bg-gradient-to-br from-green-200 to-blue-200 text-black rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden">
                {reward.image ? (
                  <img
                    src={reward.image || "/placeholder.svg"}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <Gift size={48} className="text-white" />
                  </div>
                )}
              </div>
              {/* Details */}
              <div className="p-4 flex-grow">
                <h2 className="text-2xl font-bold mb-2 line-clamp-1">
                  {reward.title}
                </h2>
                <p className="text-sm mb-2 line-clamp-2">
                  {reward.description}
                </p>
                <p className="text-sm mb-1">Owner: {reward.owner}</p>
                <p className="text-sm font-bold">Quantity: {reward.quantity}</p>
                <p className="text-sm font-bold">Coins Required: {reward.coins}</p>
              </div>
              <div className="p-4 bg-green-300 text-center">
                <span className="font-bold">Claim Reward</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-12">
          <Gift size={64} className="mx-auto mb-4" />
          <p className="text-xl">
            No rewards found. Create a new reward to get started!
          </p>
        </div>
      )}
      {/*  */}
    </div>
  );
}
