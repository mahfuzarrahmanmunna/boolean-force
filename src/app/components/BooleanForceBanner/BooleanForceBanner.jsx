"use client";

import Link from "next/link";
import { useState } from "react";
import { GL } from "../../components/gl"; // adjust path if needed
import { Pill } from "../../components/pill"

export default function BooleanForceBanner() {
  const [hovering, setHovering] = useState(false);

  return (
   <div className="flex flex-col justify-between relative overflow-hidden min-h-screen">
      
      {/* 🔥 WebGL Background */}
      <div className="absolute inset-0 -z-10">
        <GL hovering={hovering} />
      </div>

      {/* 🔥 Content */}
      <div className="pb-16 mt-auto text-center relative z-10 px-4">
        
        <Pill className="mb-6">BETA RELEASE</Pill>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold">
          Unlock your <br />
          <span className="font-light italic">future</span> growth
        </h1>

        <p className="text-sm sm:text-base text-white/60 mt-8 max-w-[440px] mx-auto">
          Through perpetual investment strategies that outperform the market
        </p>

        {/* Desktop Button */}
        <Link href="/#contact" className="hidden sm:block">
          <button
            className="mt-14 px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            [Contact Us]
          </button>
        </Link>

        {/* Mobile Button */}
        <Link href="/#contact" className="block sm:hidden">
          <button
            className="mt-14 px-6 py-2 border border-white/20 rounded-full text-sm hover:bg-white/10 transition"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            [Contact Us]
          </button>
        </Link>
      </div>
    </div>
  );
}