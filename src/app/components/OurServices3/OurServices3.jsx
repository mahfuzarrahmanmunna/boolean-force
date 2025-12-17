"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Zap, Globe, Cpu, Shield } from 'lucide-react';

// Define your brand colors as constants for easy management
const PRIMARY_COLOR = '#3B85FE';
const SECONDARY_COLOR = '#A9DBDC';

const OurServices3 = () => {
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
            detail: "Transform your retail operations with our cutting-edge POS systems that streamline transactions, manage inventory, and provide valuable insights into your business performance."
        }
    ];

    return (
        <section className="relative py-24 px-4 overflow-hidden">
            {/* The background is now handled by the BinaryBackground component */}
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-2 backdrop-blur-sm rounded-full mb-6 border"
                        style={{ backgroundColor: `${PRIMARY_COLOR}15`, borderColor: `${PRIMARY_COLOR}40` }}
                    >
                        <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: PRIMARY_COLOR }}></span>
                        <span className="text-sm font-medium" style={{ color: SECONDARY_COLOR }}>Our Services</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold mb-6"
                        style={{ color: '#FFFFFF' }}
                    >
                        What We Offer
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl max-w-3xl mx-auto"
                        style={{ color: '#A9DBDC' }}
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
                            className="relative group"
                        >
                            {/* Card glow effect on hover */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500"
                                style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})` }}
                            ></div>

                            {/* Card Content */}
                            <div className="relative h-full p-7 rounded-2xl border transition-all duration-300 hover:border-white/20"
                                style={{ background: 'rgba(15, 23, 42, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-5 transform transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})` }}
                                >
                                    {service.icon}
                                </div>

                                <h3 className="text-xl font-bold mb-3" style={{ color: '#FFFFFF' }}>{service.title}</h3>

                                <p className="mb-5 text-sm leading-relaxed" style={{ color: '#A9DBDC' }}>{service.description}</p>

                                {/* Code Statement */}
                                <div className="rounded-lg p-3 mb-5 font-mono text-xs border"
                                    style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#4ade80' }}
                                >
                                    {service.code}
                                </div>

                                {/* Features List */}
                                <ul className="space-y-2 mb-6">
                                    {service.features.slice(0, 2).map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                                            <span className="text-sm" style={{ color: '#CBD5E1' }}>{feature}</span>
                                        </li>
                                    ))}
                                    {service.features.length > 2 && (
                                        <li className="text-sm" style={{ color: '#64748B' }}>+{service.features.length - 2} more</li>
                                    )}
                                </ul>

                                {/* View Details Button */}
                                <button
                                    onClick={() => setSelectedService(service)}
                                    className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center group"
                                    style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})` }}
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
                    <div className="inline-flex flex-col items-center p-8 rounded-2xl border backdrop-blur-sm"
                        style={{ background: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                        <h3 className="text-2xl font-bold mb-3" style={{ color: '#FFFFFF' }}>Need a custom solution?</h3>
                        <p className="mb-6 max-w-md" style={{ color: '#A9DBDC' }}>We're here to help bring your unique vision to life with tailored solutions.</p>
                        <button classname=" cursor-pointerpx-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex items-center"
                            style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`, boxShadow: `0 10px 25px -5px ${PRIMARY_COLOR}40` }}
                        >
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
                        className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                        onClick={() => setSelectedService(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border"
                            style={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="h-2 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})` }}></div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div
                                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white"
                                        style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})` }}
                                    >
                                        {selectedService.icon}
                                    </div>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="transition-colors"
                                        style={{ color: '#94a3b8' }}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <h3 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF' }}>{selectedService.title}</h3>

                                <p className="mb-6 leading-relaxed" style={{ color: '#A9DBDC' }}>{selectedService.detail}</p>

                                <div className="rounded-lg p-4 mb-6 font-mono text-sm border"
                                    style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#4ade80' }}
                                >
                                    {selectedService.code}
                                </div>

                                <h4 className="text-xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>Key Features</h4>
                                <ul className="space-y-3 mb-8">
                                    {selectedService.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <Check className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                                            <span style={{ color: '#CBD5E1' }}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg`}
                                        style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})` }}
                                    >
                                        Get Started
                                    </button>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 border"
                                        style={{ background: 'rgba(51, 65, 85, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
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

export default OurServices3;