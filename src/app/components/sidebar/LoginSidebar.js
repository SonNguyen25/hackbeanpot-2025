"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import * as client from "@/app/profile/client"; // Update this path as needed

export default function LoginSidebar() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    _id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    displayName: "",
    role: "USER",
    email: "",
    dob: new Date(), // Fix: Keep Date format
    profilePicture: "",
    bio: "",
    yearOfExperience: 0,
    sex: "",
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
  

  const signin = async (e) => {
    e.preventDefault(); // Prevents page refresh
    try {
      const user = await client.signin(credentials);
      alert(`Welcome, ${user.displayName}!`); // Replace with toast notification
      router.push("/Home/Community"); // Navigate to Home
    } catch (error) {
      alert("Login Failed! Try again."); // Replace with toast notification
    }
  };

  return (
    <div className="flex flex-col items-center bg-black p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h1 className="text-3xl font-bold text-gradient mb-4">Welcome Back! 🦁</h1>

      <form className="w-full" onSubmit={signin}>
        <div className="mb-4">
          <label className="block font-semibold text-white">Username</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
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

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-400">
        <Link href="/Main/CreateAccount" className="hover:underline text-purple-400">
          Register an account
        </Link>
        <br />
        <Link href="/Home/Community" className="hover:underline text-purple-400">
          Just visiting?
        </Link>
      </div>
    </div>
  );
}
