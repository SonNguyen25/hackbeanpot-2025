"use client"

import Image from "next/image";
import Link from "next/link";
import { MapPin, Music, Leaf, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import GoogleMapComponent from "@/app/components/google-maps-api";
import { useRouter } from "next/navigation";

function Nav() {
  const router = useRouter();
  
  return (
      
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Image src="/logo.svg" alt="RoadTrip Companion Logo" width={150} height={50} />
        <div className="space-x-4">
          <Link href="/" className="hover:text-green-400">
            Home
          </Link>
          {/* <Link href="/friends" className="hover:text-green-400">
            Friends Matching
          </Link> */}
          <Link href="/map" className="hover:text-green-400">
            Eco Hotels & Restaurants
          </Link>
          {/* <Link href="/music" className="hover:text-green-400">
            Music
          </Link> */}
          <Link href="/login" className="text-primary hover:text-accent transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-dark transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function Hero() {
  return (
    <section className="container mx-auto px-6 py-24 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-6xl font-bold text-primary mb-6"
      >
        Your Eco-Friendly Road Trip Companion
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl text-primary-dark mb-8"
      >
        Plan your journey, discover green destinations, and groove to your favorite tunes.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link
          href="/register"
          className="bg-secondary text-white px-8 py-3 rounded-md text-lg hover:bg-secondary-dark transition-colors inline-flex items-center group"
        >
          Start Your Adventure
          <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
      <GoogleMapComponent />
    </section>
  );
}

function Features() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
  return (
    <section ref={ref} className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center text-primary mb-12">Features</h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <FeatureCard
          title="Eco-Friendly Routes"
          description="Discover the most environmentally conscious paths to your destination."
          icon={<MapPin className="w-12 h-12 text-secondary" />}
          variants={itemVariants}
        />
        <FeatureCard
          title="Green Accommodations"
          description="Find and book sustainable hotels and lodgings along your route."
          icon={<Leaf className="w-12 h-12 text-secondary" />}
          variants={itemVariants}
        />
        <FeatureCard
          title="Music Integration"
          description="Sync with Spotify and get personalized playlists for your journey."
          icon={<Music className="w-12 h-12 text-secondary" />}
          variants={itemVariants}
        />
      </motion.div>
    </section>
  );
}

function FeatureCard({ title, description, icon, variants }) {
  return (
    <motion.div variants={variants} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <p className="text-primary-dark">{description}</p>
    </motion.div>
  );
}

function CallToAction() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section ref={ref} className="bg-primary-light py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Hit the Road?</h2>
        <p className="text-xl text-tertiary-light mb-8">
          Join RoadTrip Companion today and start planning your eco-friendly adventure!
        </p>
        <Link
          href="/register"
          className="bg-secondary text-white px-6 py-3 rounded-md text-lg hover:bg-secondary-dark transition-colors"
        >
          Sign Up Now
        </Link>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="text-center text-xl">
        <p>&copy; 2023 RoadTrip Companion & EarthBeats. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement, changing color on the screen
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-tertiary-light relative">
      {/* Background Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1]"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgb(4 47 46), rgba(3, 7, 18, 0) 100%)`,
        }}
      ></div>

      {/* Interactive Content */}
      <Nav />
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
}
