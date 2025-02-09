import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function FeatureCard({ title, description, icon, link }) {
  return (
    <Link
      href={link}
      className="bg-gray-800 border border-gray-700 shadow-md p-6 rounded-lg text-center hover:bg-gray-700 transition-colors"
    >
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="flex items-center justify-center text-green-500">
        <span className="mr-2">Get Started</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  )
}

