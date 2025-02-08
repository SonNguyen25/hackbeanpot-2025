"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoginSidebar from "@/app/components/sidebar/LoginSidebar";
import CreateAccount from "@/app/components/sidebar/CreateAccount";

export default function Login() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState("Login");

  useEffect(() => {
    if (searchParams) {
      const param = searchParams.get("page");
      setPage(param === "CreateAccount" ? "CreateAccount" : "Login");
    }
  }, [searchParams]); // Depend on searchParams

  return (
    <div className="flex h-screen w-full bg-[#0b0b0e]">
      {/* Main Content */}
      <div className="hidden md:flex flex-col justify-center px-12 text-center w-1/2">
        <h1 className="text-gradient text-[60px] font-bold">EarthBeats</h1>
        <p className="text-gradient text-[25px] mt-4">
          Your ultimate eco-friendly road trip companion! Plan sustainable
          journeys, discover green destinations, and track your environmental
          impact—all while enjoying personalized music recommendations for the
          road. Stay connected with friends, compete in eco-challenges, and get
          AI-driven insights to make every trip more sustainable and fun!
        </p>
      </div>

      {/* Sidebar */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-black p-6">
        {page === "CreateAccount" ? <CreateAccount /> : <LoginSidebar />}
      </div>
    </div>
  );
}
