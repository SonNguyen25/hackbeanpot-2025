"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Home, Compass, Music, User } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar for larger screens */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="bg-black hidden md:flex flex-col h-screen bg-primary text-white shadow-lg fixed left-0 top-0"
      >
        <div className="p-6 flex flex-col items-center">
          <Image src="/logo.svg" alt="RoadTrip Companion" width={150} height={50} />
        </div>

        <nav className="flex flex-col mt-8 space-y-4 px-4">
          <SidebarLink href="/" icon={<Home />} text="Home" />
          <SidebarLink href="/features" icon={<Compass />} text="Features" />
          <SidebarLink href="/music" icon={<Music />} text="Music" />
          <SidebarLink href="/profile" icon={<User />} text="Profile" />
        </nav>
      </motion.aside>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 bg-primary text-white p-2 rounded-md shadow-md z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          exit={{ x: -250 }}
          className="md:hidden flex flex-col w-64 h-screen bg-primary text-white shadow-lg fixed left-0 top-0 z-40"
        >
          <div className="p-6 flex flex-col items-center">
            <Image src="/logo.svg" alt="RoadTrip Companion" width={150} height={50} />
          </div>

          <nav className="flex flex-col mt-8 space-y-4 px-4">
            <SidebarLink href="/" icon={<Home />} text="Home" />
            <SidebarLink href="/features" icon={<Compass />} text="Features" />
            <SidebarLink href="/music" icon={<Music />} text="Music" />
            <SidebarLink href="/profile" icon={<User />} text="Profile" />
          </nav>
        </motion.aside>
      )}

      {/* Page content with padding to avoid overlap */}
      <div className="w-full md:w-auto p-6">{/* Page content goes here */}</div>
    </div>
  );
}

function SidebarLink({ href, icon, text }) {
  return (
    <Link href={href} className="flex items-center space-x-3 p-3 hover:bg-secondary-dark rounded-md transition">
      {icon}
      <span className="text-lg">{text}</span>
    </Link>
  );
}
