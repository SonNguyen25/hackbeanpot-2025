import Image from "next/image"
import Link from "next/link"
import { MapPin, Music, Leaf } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary to-tertiary-light">
      <nav className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <Image src="/logo.svg" alt="RoadTrip Companion Logo" width={150} height={50} />
          <div className="space-x-4">
            <Link href="/login" className="text-primary-dark hover:text-primary transition-colors">
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
      </nav>

      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Your Eco-Friendly Road Trip Companion</h1>
        <p className="text-xl text-primary-dark mb-8">
          Plan your journey, discover green destinations, and groove to your favorite tunes.
        </p>
        <Link
          href="/register"
          className="bg-secondary-dark text-white px-6 py-3 rounded-md text-lg hover:bg-secondary transition-colors"
        >
          Start Your Adventure
        </Link>
      </section>

      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Eco-Friendly Routes"
            description="Discover the most environmentally conscious paths to your destination."
            icon={<MapPin className="w-12 h-12 text-secondary" />}
          />
          <FeatureCard
            title="Green Accommodations"
            description="Find and book sustainable hotels and lodgings along your route."
            icon={<Leaf className="w-12 h-12 text-secondary" />}
          />
          <FeatureCard
            title="Music Integration"
            description="Sync with Spotify and get personalized playlists for your journey."
            icon={<Music className="w-12 h-12 text-secondary" />}
          />
        </div>
      </section>

      <section className="bg-primary-light py-16">
        <div className="container mx-auto px-6 text-center">
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
        </div>
      </section>

      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2023 RoadTrip Companion & EarthBeats. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <p className="text-primary-dark">{description}</p>
    </div>
  )
}


// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               src/app/page.js
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
