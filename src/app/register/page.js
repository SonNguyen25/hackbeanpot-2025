"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoginSidebar from "@/app/components/sidebar/LoginSidebar";
import CreateAccount from "@/app/components/sidebar/CreateAccount";

export default function Register() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState("CreateAccount");

  useEffect(() => {
    if (searchParams) {
      const param = searchParams.get("page");
      setPage(param === "Login" ? "Login" : "CreateAccount");
    }
  }, [searchParams]); // Depend on searchParams

  return (
    <div className="flex h-screen w-full bg-[#0b0b0e]">
      {/* Main Content */}
      <div className="hidden md:flex flex-col justify-center px-12 text-center bg-black w-1/2">
        <h1 className="text-gradient text-[60px] font-bold">EarthBeats</h1>
        <p className="text-gradient text-[25px] mt-4">
        Plan eco-friendly journeys, explore green destinations, 
        and track your environmental impact—all with personalized music for the road. 
        Stay connected, join eco-challenges, and get AI-driven insights
        to make every trip more sustainable and fun!
        </p>
      </div>

      {/* Sidebar */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-6">
        {page === "Login" ? <LoginSidebar /> : <CreateAccount />}
      </div>
    </div>
  );
}
