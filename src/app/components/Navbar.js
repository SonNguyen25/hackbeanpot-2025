"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; 
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Home, Compass, Music, User, Users, Gift } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const isLandingPage = pathname === "/" || pathname === "/about";

  return (
    <div className="flex border border-green-500">
      {/* Sidebar for larger screens */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="bg-black hidden md:flex flex-col h-screen bg-primary text-white shadow-lg fixed left-0 top-0"
      >
        <div className="p-3 flex flex-col items-center">
          <Image src="/logo.svg" alt="RoadTrip Companion" width={250} height={50} />
        </div>

        <nav className="flex flex-col mt-8 space-y-4 px-4">
          {isLandingPage && (
            <>
              <SidebarLink href="/" icon={<Home />} text="Home" />
              <SidebarLink href="/about" icon={<Compass />} text="About" />
            </>
          )}
          {!isLandingPage && (
            <>
              <SidebarLink href="/home" icon={<Home />} text="Home" />
              <SidebarLink href="/profile" icon={<User />} text="Profile" />
              <SidebarLink
                href="/find-friends"
                icon={<Users />}
                text="Find Friends"
              />
              <SidebarLink href="/map" icon={<Compass />} text="Map" />
              <SidebarLink href="/music" icon={<Music />} text="Music" />
              <SidebarLink href="/rewards" icon={<Gift />} text="Rewards" />
            </>
          )}
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
            <Image
              src="/logo.svg"
              alt="RoadTrip Companion"
              width={150}
              height={50}
            />
          </div>

          <nav className="flex flex-col mt-8 space-y-4 px-4">
            <SidebarLink href="/" icon={<Home />} text="Home" />
            <SidebarLink href="/about" icon={<Compass />} text="About" />

            {!isLandingPage && (
              <>
                <SidebarLink href="/home" icon={<Home />} text="Home" />
                <SidebarLink href="/profile" icon={<User />} text="Profile" />
                <SidebarLink
                  href="/find-friends"
                  icon={<Users />}
                  text="Find Friends"
                />
                <SidebarLink href="/map" icon={<Compass />} text="Map" />
                <SidebarLink href="/music" icon={<Music />} text="Music" />
                <SidebarLink href="/rewards" icon={<Gift />} text="Rewards" />
              </>
            )}
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
    <Link
      href={href}
      className="flex items-center space-x-3 p-3 hover:bg-secondary-dark rounded-md transition"
    >
      {icon}
      <span className="text-lg">{text}</span>
    </Link>
  );
}
