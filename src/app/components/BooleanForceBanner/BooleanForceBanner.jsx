"use client";

import { useState, useEffect } from "react";
import AnimatedLogicExpression from "../AnimatedLogicExpression/AnimatedLogicExpression";

function BooleanForceBanner() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state for entrance animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative overflow-hidden py-20 px-8 md:px-16 lg:px-24">
      {/* Banner content with semi-transparent background for readability */}
      <div
        className={`relative z-10 text-center text-white max-w-6xl mx-auto transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* Enhanced heading with gradient text and better spacing */}
        <h1 className="text-5xl  md:text-6xl lg:text-7xl font-bold mb-6  text-gray-300 drop-shadow-lg">
          IF (Business == Ambition) <br /> THEN (BooleanForce == Growth)
        </h1>

        {/* Enhanced description with better typography and max-width */}
        <p className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto text-white/90 leading-relaxed drop-shadow-md">
          Engineering high-performance identities and software for Businesses
          that refuse to stay small. We turn your variables into constants
          through precision code and emotive design.
        </p>

        {/* Enhanced CTA button */}
        <div className="mb-16">
          <button className="px-8 cursor-pointerpx-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ">
            Execute Project
          </button>
        </div>

        {/* Enhanced logic expression with better container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <AnimatedLogicExpression />
          </div>
        </div>
      </div>

      {/* Custom styles for animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}

export default BooleanForceBanner;
