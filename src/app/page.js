"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Music, Leaf, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex justify-start ml-60">
      <NavBar />
      <main className="container mx-auto px-4 pt-24">
        <HomeContent />
      </main>
    </div>
  );
}


function NavBar() {
  return (
    <div className="fixed top-0 right-0 w-full py-4 px-8 flex justify-end shadow-md bg-black bg-transparent">
      <div className="flex space-x-6">
        <Link
          href="/login"
          className="text-white px-6 py-2 text-lg font-semibold hover:text-green-400 transition-all"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg hover:opacity-90 transition-all"
        >
          Register
        </Link>
      </div>
    </div>
  );
}


function HomeContent() {
  return (
    <div className="space-y-16">
      <WelcomeSection />
      <FeaturesSection />
    </div>
  );
}

function WelcomeSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-green-500">
        Welcome to EarthBeats
      </h1>
      <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
        Plan eco-friendly journeys, explore green destinations, and groove to your favorite tunes.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:opacity-90 transition-all"
      >
        Start Planning Your Trip
      </Link>
    </motion.section>
  );
}

function FeaturesSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-4xl font-bold text-gray-200 mb-8">Explore Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          title="Eco-Friendly Routes"
          description="Discover the most environmentally conscious paths to your destination."
          icon={<MapPin className="w-12 h-12 text-green-500" />}
        />
        <FeatureCard
          title="Green Accommodations"
          description="Find and book sustainable hotels and lodgings along your route."
          icon={<Leaf className="w-12 h-12 text-green-500" />}
        />
        <FeatureCard
          title="Music Integration"
          description="Sync with Spotify and get personalized playlists for your journey."
          icon={<Music className="w-12 h-12 text-green-500" />}
        />
        <FeatureCard
          title="Find Road Trip Buddies"
          description="Connect with like-minded travelers and plan your next adventure together."
          icon={<Users className="w-12 h-12 text-green-500" />}
        />
      </div>
    </motion.section>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-gray-900 border border-gray-700 shadow-md p-6 rounded-lg text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}