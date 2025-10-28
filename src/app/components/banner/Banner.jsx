"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedLogicExpression from "../AnimatedLogicExpression/AnimatedLogicExpression";

function Banner() {
    const [isLoaded, setIsLoaded] = useState(false);
    const stats = [
        { value: "4.9/5", label: "Rating", icon: "⭐" },
        { value: "500+", label: "Happy Clients", icon: "👥" },
        { value: "24-48hr", label: "Delivery", icon: "⚡" },
        { value: "ROI", label: "Guaranteed", icon: "📈" },
    ];

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-28 px-6 md:px-12">
            {/* Soft gradient glow background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_60%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.1),_transparent_60%)]"></div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center max-w-5xl mx-auto"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Transform Your Business with BooleanForce
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                    Premier IT solutions that deliver true results. We combine innovation,
                    precision, and technology to power your digital transformation.
                </p>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-400/40 transition-all"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-2xl font-semibold text-blue-400">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                    Get Started
                </motion.button>

                {/* Animated Logic Expression */}
                <div className="mt-16 relative max-w-3xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-2xl"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <AnimatedLogicExpression />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

export default Banner;
