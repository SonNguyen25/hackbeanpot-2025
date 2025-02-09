"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

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
      console.log(currentUserId);
      try {
        const res = await fetch(
          `http://localhost:8080/friends?userId=${currentUserId}`
        );
        const data = await res.json();
        if (data.recommendedFriends) {
          // Remove logged-in user from the friends list
          const filteredFriends = data.recommendedFriends.filter(
            (friend) => friend.firstname.toString() !== user.firstname.toString()
            
          );
          setFriends(filteredFriends);
        } else {
          setFriends([]);
        }
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

  const filteredFriends = friends.filter((friend) =>
    `${friend.firstname} ${friend.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-5xl font-bold text-green-500 mb-4 md:mb-0">
            Recommended Friends
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredFriends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => router.push(`/friends/${friend._id}`)}
              className="bg-gradient-to-br from-green-200 to-blue-200 text-black rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Icon */}
              <div className="h-48 flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
                <Users size={48} className="text-white" />
              </div>

              {/* Details */}
              <div className="p-4 flex-grow">
                <h2 className="text-2xl font-bold mb-2 line-clamp-1">
                  {friend.firstname} {friend.lastname}
                </h2>
                <p className="text-sm mb-2">Gender: {friend.gender}</p>
                <p className="text-sm mb-2">
                  DOB:{" "}
                  {new Date(friend.dob).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm mb-2">Location: {friend.location}</p>
                <p className="text-sm mb-2">Email: {friend.email}</p>
                <p className="text-sm mb-2">Phone Number: {friend.phone}</p>
                <p className="text-sm font-bold">
                  Similarity: {(friend.similarity * 100).toFixed(1)}%
                </p>
              </div>

              {/* View Profile Button */}
              <div className="p-4 bg-green-300 text-center">
                <span className="font-bold">View Profile</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-12">
          <Users size={64} className="mx-auto mb-4" />
          <p className="text-xl">No recommended friends found.</p>
        </div>
      )}
    </div>
  );
}
