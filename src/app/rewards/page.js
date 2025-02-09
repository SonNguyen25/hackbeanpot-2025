"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RewardsList() {
  const [rewards, setRewards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedRewards = localStorage.getItem("rewards");
    if (storedRewards) {
      setRewards(JSON.parse(storedRewards));
    } else {
      setRewards([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-green-500">Rewards</h1>
        <Link
          href="/rewards/create"
          className="bg-green-500 text-black px-6 py-2 rounded-md text-xl font-semibold"
        >
          Create Reward
        </Link>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            onClick={() => router.push(`/rewards/claim/${reward.id}`)}
            className="bg-green-200 text-black rounded-xl border-2 border-green-500 flex flex-row overflow-hidden aspect-square cursor-pointer hover:scale-105 transition-transform"
          >
            {/* Left Half: Details */}
            <div className="w-1/2 p-4 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-2">{reward.title}</h2>
              <p className="text-xl mb-1">{reward.description}</p>
              <p className="text-lg mb-1">Owner: {reward.owner}</p>
              <p className="text-lg font-bold">Qty: {reward.quantity}</p>
            </div>
            {/* Right Half: Image */}
            <div className="w-1/2 flex items-center justify-center p-2">
              {reward.image && (
                <img
                  src={reward.image}
                  alt={reward.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
