"use client";

import { useState } from "react";

function TechBanner() {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Tech terms to display instead of boolean terms
    const techTerms = ["React", "Next.js", "Tailwind", "API", "Cloud", "DevOps", "Frontend", "Backend", "Fullstack"];

    // Track mouse position for interactive effects
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div
            className="relative overflow-hidden py-16 px-8 md:px-16 lg:px-24 h-screen flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            {/* Animated Background Layers */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Gradient overlay that responds to hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Interactive light effect following mouse */}
                {isHovered && (
                    <div
                        className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
                        style={{
                            left: `${mousePosition.x - 192}px`,
                            top: `${mousePosition.y - 192}px`,
                            transition: 'all 0.3s ease-out'
                        }}
                    ></div>
                )}

                {/* Animated tech terms */}
                {techTerms.map((term, index) => (
                    <div
                        key={index}
                        className={`absolute text-blue-400/20 font-mono text-lg md:text-xl transition-all duration-300 ${isHovered ? 'text-blue-400/40' : ''}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${10 + Math.random() * 20}s linear infinite`,
                            animationDelay: `${Math.random() * 10}s`,
                            opacity: 0.2 + Math.random() * 0.3
                        }}
                    >
                        {term}
                    </div>
                ))}

                {/* Additional floating elements for more depth */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={`float-${i}`}
                        className={`absolute w-1 h-1 bg-blue-500/30 rounded-full transition-all duration-300 ${isHovered ? 'bg-blue-400/50' : ''}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${8 + Math.random() * 15}s linear infinite`,
                            animationDelay: `${Math.random() * 8}s`
                        }}
                    />
                ))}

                {/* Grid pattern overlay */}
                <div className={`absolute inset-0 bg-grid-pattern transition-opacity duration-500 ${isHovered ? 'opacity-10' : 'opacity-5'}`}></div>

                {/* Particles that appear on hover */}
                {isHovered && [...Array(20)].map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}

                {/* Glowing lines that appear on hover */}
                {isHovered && (
                    <>
                        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
                        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </>
                )}
            </div>

            {/* TechBanner Content */}
            <div className="relative z-10 text-center text-white max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
                    Effective web solutions for business of any scale
                </h1>

                {/* Tech buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"></path>
                        </svg>
                        Official Partner
                    </button>

                    <button className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                        </svg>
                        Selectel
                    </button>

                    <button className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                        </svg>
                        per.py
                    </button>

                    <button className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                        timeweb&gt;
                    </button>
                </div>

                {/* CTA Button */}
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                    Start your project today
                </button>
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
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0.6;
                    }
                }
                
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
            `}</style>
        </div>
    );
}

export default TechBanner;