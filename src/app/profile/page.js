"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, User, Mail, Phone, Calendar, MapPin, Heart, Music } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-green-500 text-2xl">Loading...</div>
      </div>
    );
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
    <div className="space-y-16 text-center">
      <ProfileHeader />
      <ProfileDetails user={user} />
      <LogoutButton logout={logout} router={router} />
    </div>
  );
}

function ProfileHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-5xl font-bold text-green-400">Your Profile</h1>
      <p className="text-lg text-gray-300 mt-4">
        Discover how your personality shapes your journey
      </p>
    </motion.section>
  );
}

function ProfileDetails({ user }) {
  const details = [
    { label: "Name", value: `${user.firstname} ${user.lastname}`, icon: User },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Phone", value: user.phone, icon: Phone },
    { label: "Date of Birth", value: new Date(user.dob).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), icon: Calendar },
    { label: "Gender", value: user.gender, icon: Heart },
    { label: "Location", value: user.location, icon: MapPin },
    { label: "Interests", value: user.interests.join(", "), icon: Music },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center" 
    >
      <h2 className="text-3xl font-bold text-gray-200 mb-8">Profile Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg">
            <detail.icon className="text-green-400 w-8 h-8" />
            <div className="text-left"> {/* Ensure this text stays aligned left */}
              <p className="text-gray-400 text-sm">{detail.label}</p>
              <p className="text-white font-semibold">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
  
}

function LogoutButton({ logout, router }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <button
        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        <LogOut className="mr-2" size={20} />
        Logout
      </button>
    </motion.section>
  );
}
