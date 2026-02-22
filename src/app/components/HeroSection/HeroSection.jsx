// components/HeroSection.jsx
"use client";

import { useState, useEffect } from "react";

function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Boolean logic terms to display in background
  const booleanTerms = [
    "true",
    "false",
    "&&",
    "||",
    "!",
    "null",
    "undefined",
    "return",
    "const",
    "let",
    "if",
    "else",
    "function",
    "=>",
  ];

  // Track mouse position for interactive effects
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Set loaded state for entrance animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden py-20 px-8 md:px-16 lg:px-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* 1. Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-40"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%23050508'/%3E%3C/svg%3E"
        >
          {/* Using the direct mp4 source for best compatibility */}
          <source
            src="https://cdn-cf-east.streamable.com/video/mp4/m68w6x.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Overlay gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* 2. Animated Background Layers & Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Interactive light effect following mouse */}
        {isHovered && (
          <>
            <div
              className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
              style={{
                left: `${mousePosition.x - 192}px`,
                top: `${mousePosition.y - 192}px`,
                transition: "all 0.3s ease-out",
              }}
            ></div>
            <div
              className="absolute w-64 h-64 rounded-full bg-purple-500/8 blur-2xl pointer-events-none"
              style={{
                left: `${mousePosition.x - 128}px`,
                top: `${mousePosition.y - 128}px`,
                transition: "all 0.5s ease-out",
              }}
            ></div>
          </>
        )}

        {/* Animated boolean terms floating */}
        {booleanTerms.map((term, index) => (
          <div
            key={index}
            className={`absolute text-blue-300/20 font-mono text-lg md:text-xl transition-all duration-500 ${isHovered ? "text-blue-300/40" : ""}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0.2 + Math.random() * 0.3,
              textShadow: isHovered
                ? "0 0 10px rgba(147, 197, 253, 0.5)"
                : "none",
            }}
          >
            {term}
          </div>
        ))}

        {/* Grid pattern overlay with animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={`h-line-${i}`}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
              style={{
                top: `${20 * i}%`,
                animation: `pulse ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            ></div>
          ))}
          {[...Array(5)].map((_, i) => (
            <div
              key={`v-line-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400/10 to-transparent"
              style={{
                left: `${20 * i}%`,
                animation: `pulse ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Particles that appear on hover */}
        {isHovered &&
          [...Array(30)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className={`absolute rounded-full ${
                i % 3 === 0
                  ? "bg-blue-400/20"
                  : i % 3 === 1
                    ? "bg-purple-400/20"
                    : "bg-pink-400/20"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

        {/* Glowing lines that appear on hover */}
        {isHovered && (
          <>
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
            <div
              className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </>
        )}
      </div>

      {/* 3. Main Content */}
      <div
        className={`relative z-10 text-center text-white max-w-6xl mx-auto transition-all duration-1000 flex flex-col items-center justify-center min-h-[80vh] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* Main Heading - Logic Expression styled with gradient */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-mono tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            IF (Business == Ambition)
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            THEN (BooleanForce == Growth)
          </span>
        </h1>

        {/* Sub-heading */}
        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-white/90 leading-relaxed drop-shadow-md font-sans">
          Engineering high-performance identities and software for{" "}
          <span className="text-blue-400 font-semibold">
            Businesses that refuse to stay small
          </span>
          . We turn your variables into constants through precision code and
          emotive design.
        </p>

        {/* CTA Button */}
        <div className="mb-16">
          <button className="cursor-pointer px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:to-purple-700 font-mono tracking-wider group">
            <span className="flex items-center gap-2">
              <span className="transition-transform duration-300 group-hover:rotate-90">{`>`}</span>
              Execute Project
            </span>
          </button>
        </div>

        {/* Code Block Container (Following the pattern of AnimatedLogicExpression container) */}
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="font-mono text-sm md:text-base text-left text-gray-300 overflow-x-auto">
              <div className="flex flex-col gap-1">
                <code>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-blue-300">yourBusiness</span> = {"{"}{" "}
                  <span className="text-green-300">status</span>:{" "}
                  <span className="text-yellow-300">&apos;ready&apos;</span>{" "}
                  {"}"};
                </code>
                <code>
                  <span className="text-purple-400">import</span>{" "}
                  <span className="text-blue-300">{`{ BooleanForce }`}</span>{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-yellow-300">&apos;solutions&apos;</span>
                  ;
                </code>
                <code>
                  <span className="text-purple-400">await</span>{" "}
                  <span className="text-blue-300">BooleanForce</span>.
                  <span className="text-green-300">transform</span>(
                  <span className="text-blue-300">yourBusiness</span>);
                </code>
              </div>
            </div>
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

export default HeroSection;
