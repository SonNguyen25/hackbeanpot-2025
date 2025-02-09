"use client";

import { useRouter } from "next/navigation";

export default function CreateProfile() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="mb-6 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-typewriter">
        Let&apos;s Build Your Profile
      </h2>

      <button
        onClick={() => router.push("/register")}
        className="px-6 py-3 text-lg font-bold text-white uppercase transition rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90"
      >
        Next
      </button>
    </div>
  );
}
