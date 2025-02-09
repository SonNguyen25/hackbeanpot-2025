"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import LoginSidebar from "@/app/components/sidebar/LoginSidebar"
import CreateAccount from "@/app/components/sidebar/CreateAccount"

export default function Login() {
  const searchParams = useSearchParams()
  const [page, setPage] = useState("Login")

  useEffect(() => {
    if (searchParams) {
      const param = searchParams.get("page")
      setPage(param === "CreateAccount" ? "CreateAccount" : "Login")
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen w-full bg-black text-white" style={{ position: "absolute", top: 0, left: 0, margin: 0, padding: 0, overflow: "hidden" }}>
      {/* Main Content */}
      <div className="hidden md:flex flex-col justify-center px-12 text-center bg-black w-1/2" style={{ flexGrow: 1 }}
>
        <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-green-500">
          EarthBeats
        </h1>
        <p className="text-xl mt-4 text-gray-300">
          Plan eco-friendly journeys, explore green destinations, 
          and track your environmental impact—all with personalized music for the road. 
          Stay connected, join eco-challenges, and get AI-driven insights
          to make every trip more sustainable and fun!
        </p>
      </div>

      {/* Sidebar */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-6 bg-gray-900">
        <div className="w-full max-w-md">
          {page === "CreateAccount" ? <CreateAccount /> : <LoginSidebar />}
        </div>
      </div>
    </div>
  )
}
