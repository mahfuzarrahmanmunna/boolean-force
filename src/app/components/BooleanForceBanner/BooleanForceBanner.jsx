"use client";

import { useState, useEffect } from "react";
import AnimatedLogicExpression from "../AnimatedLogicExpression/AnimatedLogicExpression";

function BooleanForceBanner() {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeStatIndex, setActiveStatIndex] = useState(-1);
    const [isLoaded, setIsLoaded] = useState(false);

    // Boolean logic terms to display
    const booleanTerms = ["TRUE", "FALSE", "XOR", "NOR", "AND", "OR", "NOT", "NAND", "XNOR"];

    // Enhanced stats with icons
    const stats = [
        { value: "4.9/5", label: "Rating", icon: "⭐" },
        { value: "500+", label: "Happy Clients", icon: "👥" },
        { value: "24-48hr", label: "Delivery", icon: "⚡" },
        { value: "ROI", label: "Guaranteed", icon: "📈" }
    ];

    // Track mouse position for interactive effects
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // Set loaded state for entrance animations
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div
            className="relative overflow-hidden py-20 px-8 md:px-16 lg:px-24"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            {/* Animated Background Layers - No background colors */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Interactive light effect following mouse */}
                {isHovered && (
                    <>
                        <div
                            className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
                            style={{
                                left: `${mousePosition.x - 192}px`,
                                top: `${mousePosition.y - 192}px`,
                                transition: 'all 0.3s ease-out'
                            }}
                        ></div>
                        <div
                            className="absolute w-64 h-64 rounded-full bg-purple-500/8 blur-2xl pointer-events-none"
                            style={{
                                left: `${mousePosition.x - 128}px`,
                                top: `${mousePosition.y - 128}px`,
                                transition: 'all 0.5s ease-out'
                            }}
                        ></div>
                    </>
                )}

                {/* Animated boolean terms with better styling */}
                {booleanTerms.map((term, index) => (
                    <div
                        key={index}
                        className={`absolute text-blue-300/20 font-mono text-lg md:text-xl transition-all duration-500 ${isHovered ? 'text-blue-300/40' : ''}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${10 + Math.random() * 20}s linear infinite`,
                            animationDelay: `${Math.random() * 10}s`,
                            opacity: 0.2 + Math.random() * 0.3,
                            textShadow: isHovered ? '0 0 10px rgba(147, 197, 253, 0.5)' : 'none'
                        }}
                    >
                        {term}
                    </div>
                ))}

                {/* Floating elements with different sizes and colors */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`float-${i}`}
                        className={`absolute rounded-full transition-all duration-300 ${isHovered ? 'bg-blue-400/30' : 'bg-blue-500/20'}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            animation: `float ${8 + Math.random() * 15}s linear infinite`,
                            animationDelay: `${Math.random() * 8}s`,
                            boxShadow: isHovered ? '0 0 10px rgba(147, 197, 253, 0.5)' : 'none'
                        }}
                    />
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
                                animationDelay: `${i * 0.5}s`
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
                                animationDelay: `${i * 0.5}s`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Particles that appear on hover with different sizes and colors */}
                {isHovered && [...Array(30)].map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className={`absolute rounded-full ${i % 3 === 0 ? 'bg-blue-400/20' :
                            i % 3 === 1 ? 'bg-purple-400/20' :
                                'bg-pink-400/20'
                            }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}

                {/* Glowing lines that appear on hover with better gradients */}
                {isHovered && (
                    <>
                        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
                        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </>
                )}
            </div>

            {/* Banner content with semi-transparent background for readability */}
            <div className={`relative z-10 text-center text-white max-w-6xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Enhanced heading with gradient text and better spacing */}
                <h1 className="text-5xl  md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                    Transform Your Business with BooleanForce
                </h1>

                {/* Enhanced description with better typography and max-width */}
                <p className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto text-white/90 leading-relaxed drop-shadow-md">
                    Premier IT solutions that deliver TRUE results. We combine cutting-edge technology with strategic thinking to power your digital transformation.
                </p>

                {/* Enhanced stats with better design and hover effects */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-500 cursor-pointer ${activeStatIndex === index ? 'bg-white/20 scale-105 shadow-xl' : 'hover:bg-white/20 hover:scale-105'
                                }`}
                            onMouseEnter={() => setActiveStatIndex(index)}
                            onMouseLeave={() => setActiveStatIndex(-1)}
                        >
                            <div className="text-4xl mb-3">{stat.icon}</div>
                            <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base text-white/80">{stat.label}</div>

                            {/* Decorative element that appears on hover */}
                            {activeStatIndex === index && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Enhanced CTA button */}
                <div className="mb-16">
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:to-purple-700">
                        Get Started Today
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
                    0%, 100% {
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