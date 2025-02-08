// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
import "./globals.css"
import { Inter } from "next/font/google"
import React from "react" 
import Sidebar from "@/app/components/Navbar";


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RoadTrip Companion & EarthBeats",
  description: "Your eco-friendly road trip planner with music integration",
};





export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-white text-primary">
        <Sidebar />
        <main className="flex-grow p-6">{children}</main>
      </body>
    </html>
  );
}


