"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usersGenders, usersInterests, usersLocations } from "@/app/constants/user-constants";
// import * as client from "@/app/profile/client"; // Update this path as needed

export default function CreateAccount() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        firstname: "",
        lastname: "",
        email: "",
        dob: "",
        phone: "",
        password: "",
        gender: "",
        location: "",
        interests: "",
    });

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Handle mouse movement, changing color on the screen
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Register failed");
            }

            router.push("/home");
        } catch (error) {
            console.log("This payload failed even more")
            alert(error.message || "Login failed. Try again.");
        }
    };

    return (
        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h1 className="text-3xl font-bold text-gradient mb-4">Welcome!</h1>

            <form className="w-full" onSubmit={register}>
                <div className="mb-4">
                    <label className="block font-semibold text-white">First Name</label>
                    <input
                        type="text"
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={credentials.firstname}
                        onChange={(e) => setCredentials({ ...credentials, firstname: e.target.value })}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-white">Last Name</label>
                    <input
                        type="text"
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={credentials.lastname}
                        onChange={(e) => setCredentials({ ...credentials, lastname: e.target.value })}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-white">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-white">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-white">Phone Number</label>
                    <input
                        type="tel"
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={credentials.phone}
                        onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-white">Date of Birth</label>
                    <input
                        type="date"
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={credentials.dob}
                        onChange={(e) => setCredentials({ ...credentials, dob: e.target.value })}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-white">Gender</label>
                    <select
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={credentials.location}
                        onChange={(e) => setCredentials({ ...credentials, location: e.target.value })}
                    >
                        <option value="" disabled>Location</option>
                        {usersLocations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
    <label className="block font-semibold text-white">Interests</label>
    <select
        className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={credentials.interests}
        onChange={(e) => setCredentials({ ...credentials, interests: e.target.value })}
    >
        <option value="" disabled>Interests</option>
        {[...new Set(usersInterests)].map((interest, index) => (
            <option key={`${interest}-${index}`} value={interest}>
                {interest}
            </option>
        ))}
    </select>
</div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition"
                >
                    Register
                </button>
            </form>

            <div className="mt-4 text-sm text-gray-400">
                <Link href="/login" className="hover:underline text-purple-400">
                    Sign in
                </Link>
                <br />
            </div>
        </div>
    );
}
