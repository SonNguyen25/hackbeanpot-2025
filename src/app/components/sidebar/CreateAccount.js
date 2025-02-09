"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usersGenders, usersInterests, usersLocations } from "@/app/constants/user-constants";
import { useAuth } from "@/app/context/AuthContext";

export default function CreateAccount() {
    const { login } = useAuth(); // ✅ Use AuthContext to store user
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

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Handle mouse movement effect
    const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

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

            login(data.user); // ✅ Store user in AuthContext
            router.push("/profile");
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
        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg w-full max-w-sm bg-green-700">
            <h1 className="text-3xl font-bold text-gradient mb-4">Welcome!</h1>

            {step === 1 ? (
                // Step 1: Basic Information
                <form className="w-full">
                    <div className="mb-4">
                        <label className="block font-semibold text-white">First Name</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            value={credentials.firstname}
                            onChange={(e) => setCredentials({ ...credentials, firstname: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-white">Last Name</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            value={credentials.lastname}
                            onChange={(e) => setCredentials({ ...credentials, lastname: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-white">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-white">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-white">Phone Number</label>
                        <input
                            type="tel"
                            className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            value={credentials.phone}
                            onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-white">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            value={credentials.dob}
                            onChange={(e) => setCredentials({ ...credentials, dob: e.target.value })}
                        />
                    </div>

                    <button
                        type="button"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition"
                        onClick={() => setStep(2)}
                    >
                        Next
                    </button>
                </form>
            ) : (
                // Step 2: Gender, Location, Interests
                <form className="w-full" onSubmit={register}>
                    <div className="mb-4">
                        <label className="block font-semibold text-white">Gender</label>
                        <select
                            className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            value={credentials.gender}
                            onChange={(e) => setCredentials({ ...credentials, gender: e.target.value })}
                        >
                            <option value="" disabled>Select Gender</option>
                            {usersGenders.map((gender) => (
                                <option key={gender} value={gender}>
                                    {gender}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-white">Location</label>
                        <select
                            className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            value={credentials.location}
                            onChange={(e) => setCredentials({ ...credentials, location: e.target.value })}
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
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-4 text-sm text-gray-400">
                <Link href="/login" className="hover:underline text-purple-400">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
