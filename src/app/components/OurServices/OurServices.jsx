"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const OurServices = () => {
    const [activeService, setActiveService] = useState(null);

    const services = [
        {
            id: 1,
            icon: "🎨",
            title: "Brand Visual Identity123",
            description: "Create a powerful brand presence that resonates with your audience and drives recognition.",
            code: "IF (Brand != NULL) THEN (Recognition = TRUE)",
            features: [
                "Logo Design & Branding",
                "Brand Guidelines",
                "Marketing Materials",
                "Digital Asset Creation"
            ],
            color: "from-purple-600 to-pink-600",
            bgGlow: "shadow-purple-500/20"
        },
        {
            id: 2,
            icon: "💻",
            title: "Website Development",
            description: "Build responsive, SEO-optimized websites that convert visitors into customers.",
            code: "IF (Responsive AND SEO) THEN (Conversions++)",
            features: [
                "Custom Web Development",
                "E-commerce Solutions",
                "Mobile-First Design",
                "SEO Optimization"
            ],
            color: "from-blue-600 to-cyan-600",
            bgGlow: "shadow-blue-500/20"
        },
        {
            id: 3,
            icon: "⚙️",
            title: "ERP Software Solutions",
            description: "Streamline your business operations with custom ERP systems tailored to your needs.",
            code: "WHILE (Process != Automated) { Optimize() }",
            features: [
                "Custom ERP Development",
                "Business Process Automation",
                "Data Integration",
                "Cloud-Based Solutions"
            ],
            color: "from-green-600 to-teal-600",
            bgGlow: "shadow-green-500/20"
        },
        {
            id: 4,
            icon: "🛒",
            title: "POS System",
            description: "Modern point-of-sale solutions that enhance customer experience and boost sales.",
            code: "IF (POS == Modern) THEN (Sales = MAX)",
            features: [
                "Custom POS Development",
                "Inventory Management",
                "Payment Integration",
                "Analytics & Reporting"
            ],
            color: "from-orange-600 to-red-600",
            bgGlow: "shadow-orange-500/20"
        }
    ];

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Our Core Services
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        whileInView={{ opacity: 1, width: "100px" }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"
                    ></motion.div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onMouseEnter={() => setActiveService(service.id)}
                            onMouseLeave={() => setActiveService(null)}
                            className="relative"
                        >
                            <div className={`h-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl ${activeService === service.id ? service.bgGlow : ''}`}>
                                {/* Icon and Title */}
                                <div className="flex items-center mb-4">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center text-2xl mr-3`}>
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 mb-4 text-sm">{service.description}</p>

                                {/* Code Statement */}
                                <div className="bg-slate-900/70 rounded-lg p-3 mb-4 font-mono text-xs text-green-400 border border-slate-700/50">
                                    {service.code}
                                </div>

                                {/* Features List */}
                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="text-blue-400 mr-2 mt-1">›</span>
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* View Details Button */}
                                <button className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${service.color} text-white font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center group`}>
                                    View Details
                                    <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-gray-300 mb-6">Need a custom solution? We're here to help.</p>
                    <button className=" cursor-pointerpx-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105">
                        Contact Us
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default OurServices;