"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import * as client from "@/app/profile/client"; // Update this path as needed

export default function LoginSidebar() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const signin = async (e) => {
    e.preventDefault();
    try {

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const responseText = await res.text();

        try {
            const data = JSON.parse(responseText);

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/profile");

        } catch (parseError) {
            throw new Error("Invalid server response");
        }

    } catch (error) {
        alert(error.message || "Login failed. Try again.");
    }
};


  return (
    <div className="flex flex-col items-center bg-black p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h1 className="text-3xl font-bold text-gradient mb-4">Welcome Back!</h1>

      <form className="w-full" onSubmit={signin}>
        <div className="mb-4">
          <label className="block font-semibold text-white">Username</label>
          <input
            type="email"
            className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
        <Link href="/register" className="hover:underline text-purple-400">
          Register
        </Link>
        <br />
      </div>
    </div>
  );
}
