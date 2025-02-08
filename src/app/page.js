"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Music, Leaf, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import GoogleMapComponent from "@/app/components/google-maps-api";
import { useRouter } from "next/navigation";

function Sidebar() {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-black border-r shadow-lg p-6 flex flex-col justify-between">
      <div>
        <Image src="/logo.svg" alt="RoadTrip Companion Logo" width={200} height={80} />
        <nav className="mt-6">
          <ul className="space-y-4">
            <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
            <li><Link href="/features" className="text-gray-300 hover:text-white">Features</Link></li>
            <li><Link href="/plans" className="text-gray-300 hover:text-white">Plans</Link></li>
            <li><Link href="/social" className="text-gray-300 hover:text-white">Social</Link></li>
            <li><Link href="/flights" className="text-gray-300 hover:text-white">Flights</Link></li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function NavBar() {
  return (
    <div className="fixed top-0 left-64 right-0 bg-black shadow-md p-4 flex justify-end">
      <div className="space-x-4">
        <Link href="/login" className="text-green-500 hover:text-white transition-colors">Login</Link>
        <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">Register</Link>
      </div>
    </div>
  );
}

function HomeContent() {
  return (
    <div className="ml-64 pt-16 p-6">
      <section className="text-center">
        <h1 className="text-5xl font-bold text-green-500">Your Road Trip Companion</h1>
        <p className="text-lg text-gray-300 mt-4">Plan your journey, discover green destinations, and groove to your favorite tunes.</p>
        <Link href="/register" className="mt-6 inline-block bg-green-500 text-white px-6 py-3 rounded-md text-lg hover:bg-green-600 transition-colors">Start Your Adventure</Link>
      </section>
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-200">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <FeatureCard title="Eco-Friendly Routes" description="Discover the most environmentally conscious paths to your destination." icon={<MapPin className="w-12 h-12 text-green-500" />} />
          <FeatureCard title="Green Accommodations" description="Find and book sustainable hotels and lodgings along your route." icon={<Leaf className="w-12 h-12 text-green-500" />} />
          <FeatureCard title="Music Integration" description="Sync with Spotify and get personalized playlists for your journey." icon={<Music className="w-12 h-12 text-green-500" />} />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-black border shadow-md p-6 rounded-lg text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-black">
        <NavBar />
        <HomeContent />
      </div>
    </div>
  );
}