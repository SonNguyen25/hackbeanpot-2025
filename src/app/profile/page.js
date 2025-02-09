"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return <p className="text-white text-center mt-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-start ml-60">
      <main className="container mx-auto px-4 pt-20">
        <ProfileContent user={user} logout={logout} router={router} />
      </main>
    </div>
  );
}

function ProfileContent({ user, logout, router }) {
  return (
    <div className="space-y-8">
      <ProfileHeader />
      <ProfileDetails user={user} />
      <LogoutButton logout={logout} router={router} />
    </div>
  );
}

function ProfileHeader() {
  return (
    <section className="text-left">
      <h1 className="text-5xl font-bold text-green-400">Your Profile</h1>
      <p className="text-lg text-gray-300 mt-2">Manage your account details and settings.</p>
    </section>
  );
}

function ProfileDetails({ user }) {
  return (
    <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
        <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Date of Birth:</strong> {new Date(user.dob).toDateString()}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Location:</strong> {user.location}</p>
        <p><strong>Interests:</strong> {user.interests}</p>
      </div>
    </section>
  );
}

function LogoutButton({ logout, router }) {
  return (
    <section>
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </section>
  );
}
