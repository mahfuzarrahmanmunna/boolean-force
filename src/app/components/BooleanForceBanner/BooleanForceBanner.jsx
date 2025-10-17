"use client";

import { useState } from "react";
import AnimatedLogicExpression from "../AnimatedLogicExpression/AnimatedLogicExpression";

function BooleanForceBanner() {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Boolean logic terms to display
    const booleanTerms = ["TRUE", "FALSE", "XOR", "NOR", "AND", "OR", "NOT", "NAND", "XNOR"];

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
            className="relative overflow-hidden py-16 px-8 md:px-16 lg:px-24"
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

                {/* Animated boolean terms */}
                {booleanTerms.map((term, index) => (
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

            {/* Your existing banner content - no hover effects on content */}
            <div className="relative z-10 text-center text-white max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    Transform Your Business with BooleanForce
                </h1>
                <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto">
                    Premier IT solutions that deliver TRUE results. We combine cutting-edge technology with strategic thinking to power your digital transformation.
                </p>

                {/* Stats - no hover effects */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="text-center p-4">
                        <div className="text-3xl md:text-4xl font-bold mb-2">4.9/5</div>
                        <div className="text-sm md:text-base">Rating</div>
                    </div>
                    <div className="text-center p-4">
                        <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                        <div className="text-sm md:text-base">Happy Clients</div>
                    </div>
                    <div className="text-center p-4">
                        <div className="text-3xl md:text-4xl font-bold mb-2">24-48hr</div>
                        <div className="text-sm md:text-base">Delivery</div>
                    </div>
                    <div className="text-center p-4">
                        <div className="text-3xl md:text-4xl font-bold mb-2">ROI</div>
                        <div className="text-sm md:text-base">Guaranteed</div>
                    </div>
                </div>

                {/* Logic expression - no hover effects */}
                <div>
                    <AnimatedLogicExpression />
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

export default BooleanForceBanner;