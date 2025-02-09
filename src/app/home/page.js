"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Music, Leaf, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";

import FeatureCard from "@/app/components/FeatureCard";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex justify-start ml-60">
      <main className="container mx-auto px-4 pt-20">
        <HomeContent />
      </main>
    </div>
  );
}

function HomeContent() {
  return (
    <div className="space-y-16 text-center">
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
      <h1 className="text-5xl font-bold text-green-400">Welcome to EarthBeats!</h1>
      <p className="text-lg text-gray-300 mt-4">Plan your journey, discover green destinations, and groove to your favorite tunes.</p>
      <Link href="/map" className="mt-6 inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-lg hover:opacity-80 transition-all">
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
      <h2 className="text-3xl font-bold text-gray-200 mb-8">What would you like to do?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <FeatureCard 
          title="Find Road Trip Buddies" 
          description="Connect with like-minded travelers and plan your next adventure together."
          icon={<Users className="w-10 h-10 text-green-500" />}
          link="/friends"
        />
        <FeatureCard 
          title="Eco-Map Planner" 
          description="Plan your route with eco-friendly stops and earn rewards for visiting green businesses."
          icon={<Leaf className="w-10 h-10 text-green-500" />}
          link="/map"
        />
        <FeatureCard 
          title="Mood Music" 
          description="Get personalized Spotify playlists based on your voice-detected mood."
          icon={<Music className="w-10 h-10 text-green-500" />}
          link="/voices"
        />
        <FeatureCard 
          title="Green Accommodations" 
          description="Find and book sustainable hotels and lodgings along your route."
          icon={<MapPin className="w-10 h-10 text-green-500" />}
          link="/map"
        />
      </div>
    </motion.section>
  );
}
