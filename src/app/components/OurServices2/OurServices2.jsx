"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Zap, Shield, Globe, Cpu } from 'lucide-react';

const OurServices2 = () => {
    const [activeService, setActiveService] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            id: 1,
            icon: <Zap className="w-6 h-6" />,
            title: "Brand Visual Identity",
            description: "Create a powerful brand presence that resonates with your audience and drives recognition.",
            code: "IF (Brand != NULL) THEN (Recognition = TRUE)",
            features: [
                "Logo Design & Branding",
                "Brand Guidelines",
                "Marketing Materials",
                "Digital Asset Creation"
            ],
            color: "from-purple-600 to-pink-600",
            bgGlow: "shadow-purple-500/20",
            detail: "Our brand identity services help you establish a memorable presence in your market. We create cohesive visual systems that communicate your values and resonate with your target audience."
        },
        {
            id: 2,
            icon: <Globe className="w-6 h-6" />,
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
            bgGlow: "shadow-blue-500/20",
            detail: "We develop high-performance websites that not only look stunning but also deliver exceptional user experiences and drive business growth through conversion-focused design."
        },
        {
            id: 3,
            icon: <Cpu className="w-6 h-6" />,
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
            bgGlow: "shadow-green-500/20",
            detail: "Our ERP solutions integrate all aspects of your business operations into a unified system, improving efficiency, data accuracy, and decision-making capabilities."
        },
        {
            id: 4,
            icon: <Shield className="w-6 h-6" />,
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
            bgGlow: "shadow-orange-500/20",
            detail: "Transform your retail operations with our cutting-edge POS systems that streamline transactions, manage inventory, and provide valuable insights into your business performance."
        }
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full mb-6"
                    >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-blue-400 text-sm font-medium">Our Services</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                    >
                        What We Offer
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        We provide comprehensive digital solutions to help your business thrive in the modern landscape
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onMouseEnter={() => setActiveService(service.id)}
                            onMouseLeave={() => setActiveService(null)}
                            className="relative group"
                        >
                            {/* Card background with glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 ${activeService === service.id ? 'opacity-20' : ''}`}></div>

                            {/* Card content */}
                            <div className="relative h-full bg-slate-800/40 backdrop-blur-md rounded-2xl p-7 border border-slate-700/50 transition-all duration-300 hover:border-slate-600/50">
                                {/* Icon and Title */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-5 transform transition-transform duration-300 group-hover:scale-110`}>
                                    {service.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>

                                {/* Description */}
                                <p className="text-gray-400 mb-5 text-sm leading-relaxed">{service.description}</p>

                                {/* Code Statement */}
                                <div className="bg-slate-900/70 rounded-lg p-3 mb-5 font-mono text-xs text-green-400 border border-slate-700/50">
                                    {service.code}
                                </div>

                                {/* Features List */}
                                <ul className="space-y-2 mb-6">
                                    {service.features.slice(0, 2).map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <Check className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                    {service.features.length > 2 && (
                                        <li className="text-gray-500 text-sm">+{service.features.length - 2} more</li>
                                    )}
                                </ul>

                                {/* View Details Button */}
                                <button
                                    onClick={() => setSelectedService(service)}
                                    className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${service.color} text-white font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center group`}
                                >
                                    Explore Service
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
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
                    className="text-center"
                >
                    <div className="inline-flex flex-col items-center p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                        <h3 className="text-2xl font-bold text-white mb-3">Need a custom solution?</h3>
                        <p className="text-gray-400 mb-6 max-w-md">We're here to help bring your unique vision to life with tailored solutions.</p>
                        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 flex items-center">
                            Get In Touch
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Service Detail Modal */}
            <AnimatePresence>
                {selectedService && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedService(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`h-2 bg-gradient-to-r ${selectedService.color} rounded-t-2xl`}></div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedService.color} flex items-center justify-center text-white`}>
                                        {selectedService.icon}
                                    </div>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4">{selectedService.title}</h3>

                                <p className="text-gray-300 mb-6 leading-relaxed">{selectedService.detail}</p>

                                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 font-mono text-sm text-green-400 border border-slate-700/50">
                                    {selectedService.code}
                                </div>

                                <h4 className="text-xl font-semibold text-white mb-4">Key Features</h4>
                                <ul className="space-y-3 mb-8">
                                    {selectedService.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <Check className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className={`flex-1 py-3 px-6 rounded-lg bg-gradient-to-r ${selectedService.color} text-white font-medium transition-all duration-300 hover:shadow-lg`}>
                                        Get Started
                                    </button>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="flex-1 py-3 px-6 rounded-lg bg-slate-800 text-white font-medium transition-all duration-300 hover:bg-slate-700 border border-slate-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default OurServices2;