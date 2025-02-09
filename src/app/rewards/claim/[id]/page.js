"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import QRCode from "react-qr-code"

export default function ClaimRewardPage() {
  const { id } = useParams()
  const router = useRouter()
  const [reward, setReward] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qrValue, setQrValue] = useState(null)
export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // For this prototype, we'll use a dummy current user id.
  // Replace "67a805dbf1f5534fde989cc2" with a valid ObjectId string from your database.
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedUserId = localStorage.getItem("currentUserId");
      if (!storedUserId || storedUserId === "YOUR_TEST_USER_ID") {
        storedUserId = "67a805dbf1f5534fde989cc2";
        localStorage.setItem("currentUserId", storedUserId);
      }
      setCurrentUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const res = await fetch(`/api/friends?userId=${currentUserId}`);
        const data = await res.json();
        setFriends(data.recommendedFriends || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
      setLoading(false);
    }
    if (currentUserId) {
      fetchFriends();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Please log in to view friend recommendations.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-green-500 text-center mb-8">Recommended Friends</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {friends.map((friend) => (
          <div
            key={friend._id}
            onClick={() => router.push(`/friends/${friend._id}`)}
            className="bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            <h2 className="text-3xl font-bold mb-2">
              {friend.firstname} {friend.lastname}
            </h2>
            <p className="text-xl mb-2">Gender: {friend.gender}</p>
            <p className="text-xl mb-2">DOB: {friend.dob}</p>
            <p className="text-xl mb-2">Location: {friend.location}</p>
            <p className="text-xl">
              Similarity: {(friend.similarity * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
