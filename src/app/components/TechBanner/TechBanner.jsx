'use client';
import { useState } from "react";

const TechBanner = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative w-full h-screen overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated Glowing Background Effects */}
            <div className="absolute inset-0">
                {/* Animated gradient orbs */}
                <div className="absolute inset-0">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                    <div className="gradient-orb orb-4"></div>
                </div>

                {/* Animated light rays */}
                <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={`ray-${i}`}
                            className="light-ray"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                                animationDelay: `${Math.random() * 5}s`,
                                width: `${Math.random() * 300 + 100}px`,
                                height: '2px'
                            }}
                        ></div>
                    ))}
                </div>

                {/* Animated particles */}
                <div className="absolute inset-0">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={`particle-${i}`}
                            className="glowing-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                width: `${Math.random() * 6 + 2}px`,
                                height: `${Math.random() * 6 + 2}px`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Animated grid lines */}
                <div className="absolute inset-0 grid-lines"></div>

                {/* Growing circles */}
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={`circle-${i}`}
                            className="growing-circle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 4}s`,
                                width: `${Math.random() * 100 + 50}px`,
                                height: `${Math.random() * 100 + 50}px`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Pulse effect overlay */}
                <div className={`pulse-overlay ${isHovered ? 'pulse-active' : ''}`}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 max-w-4xl">
                    Effective web solutions for business of any scale
                </h1>

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

                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                    Start your project today
                </button>
            </div>

            <style jsx>{`
                .gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(40px);
                    opacity: 0.7;
                }
                
                .orb-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.4) 40%, transparent 70%);
                    top: -200px;
                    left: -200px;
                    animation: float-orb 20s infinite ease-in-out;
                }
                
                .orb-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(59, 130, 246, 0.4) 40%, transparent 70%);
                    bottom: -150px;
                    right: -150px;
                    animation: float-orb 25s infinite ease-in-out reverse;
                }
                
                .orb-3 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(59, 130, 246, 0.4) 40%, transparent 70%);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: float-orb 30s infinite ease-in-out;
                }
                
                .orb-4 {
                    width: 350px;
                    height: 350px;
                    background: radial-gradient(circle, rgba(251, 146, 60, 0.8) 0%, rgba(236, 72, 153, 0.4) 40%, transparent 70%);
                    top: 20%;
                    right: 10%;
                    animation: float-orb 22s infinite ease-in-out reverse;
                }
                
                @keyframes float-orb {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    25% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    50% {
                        transform: translate(-20px, 30px) scale(0.9);
                    }
                    75% {
                        transform: translate(40px, 20px) scale(1.05);
                    }
                }
                
                .light-ray {
                    position: absolute;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
                    transform-origin: center;
                    animation: ray-sweep 10s infinite linear;
                }
                
                @keyframes ray-sweep {
                    0% {
                        transform: translateX(-100%) rotate(var(--rotation));
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.7;
                    }
                    90% {
                        opacity: 0.7;
                    }
                    100% {
                        transform: translateX(100%) rotate(var(--rotation));
                        opacity: 0;
                    }
                }
                
                .glowing-particle {
                    position: absolute;
                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.5);
                    animation: particle-float 15s infinite ease-in-out;
                }
                
                @keyframes particle-float {
                    0%, 100% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) translateX(50px) scale(1.5);
                        opacity: 0;
                    }
                }
                
                .grid-lines {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                    animation: grid-move 30s linear infinite;
                }
                
                @keyframes grid-move {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: 40px 40px;
                    }
                }
                
                .growing-circle {
                    position: absolute;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: grow-circle 8s infinite ease-out;
                }
                
                @keyframes grow-circle {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(3);
                        opacity: 0;
                    }
                }
                
                .pulse-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, transparent 0%, rgba(59, 130, 246, 0.1) 50%, rgba(147, 51, 234, 0.1) 100%);
                    opacity: 0.3;
                    animation: pulse 4s infinite ease-in-out;
                }
                
                .pulse-overlay.pulse-active {
                    opacity: 0.5;
                    animation: pulse-active 2s infinite ease-in-out;
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.5;
                    }
                }
                
                @keyframes pulse-active {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.7;
                    }
                }
            `}</style>
        </div>
    );
};

export default TechBanner;