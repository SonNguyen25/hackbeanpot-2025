"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usersGenders, usersInterests, usersLocations } from "@/app/constants/user-constants";

export default function CreateAccount() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [credentials, setCredentials] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    phone: "",
    password: "",
    gender: "",
    location: "",
    interests: [],
  });

  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Register failed");

      router.push("/home");
    } catch (error) {
      alert(error.message || "Registration failed. Try again.");
    }
  };

  const handleInterestChange = (interest) => {
    setCredentials((prev) => {
      const updatedInterests = prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest) // Remove if already selected
        : [...prev.interests, interest]; // Add if not selected
      return { ...prev, interests: updatedInterests };
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Create Your Account
      </h2>

      {step === 1 ? (
        // **Step 1: Basic Information**
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">First Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={credentials.firstname}
              onChange={(e) => setCredentials({ ...credentials, firstname: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Last Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={credentials.lastname}
              onChange={(e) => setCredentials({ ...credentials, lastname: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Phone Number</label>
            <input
              type="tel"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={credentials.phone}
              onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
            <input
              type="date"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={credentials.dob}
              onChange={(e) => setCredentials({ ...credentials, dob: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </form>
      ) : (
        // **Step 2: Gender, Location, Interests**
        <form className="space-y-4" onSubmit={register}>
          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={credentials.gender}
              onChange={(e) => setCredentials({ ...credentials, gender: e.target.value })}
              required
            >
              <option value="" disabled>Select Gender</option>
              {usersGenders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Location</label>
            <select
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={credentials.location}
              onChange={(e) => setCredentials({ ...credentials, location: e.target.value })}
              required
            >
              <option value="" disabled>Select Location</option>
              {usersLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
                        <label className="block font-semibold text-white">Interests (Select multiple)</label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-md bg-gray-800 text-white">
                            {usersInterests.map((interest) => (
                                <label key={interest} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        value={interest}
                                        checked={credentials.interests.includes(interest)}
                                        onChange={() => handleInterestChange(interest)}
                                        className="mr-2"
                                    />
                                    {interest}
                                </label>
                            ))}
                        </div>
                    </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition"
              onClick={() => setStep(1)}
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
