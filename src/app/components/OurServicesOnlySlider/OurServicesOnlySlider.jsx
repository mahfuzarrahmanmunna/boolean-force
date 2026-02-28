"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from 'lucide-react';

// Define your brand colors as constants
const PRIMARY_COLOR = '#3B85FE';
const SECONDARY_COLOR = '#A9DBDC';
const ACCENT_COLOR = '#6366F1';
const DARK_BG = '#0F172A';
const LIGHT_TEXT = '#F1F5F9';

const OurServicesOnlySlider = () => {
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();
    const intervalRef = useRef(null);
    const sliderRef = useRef(null);

    const services = [
        {
            id: 1,
            title: "Brand Visual Identity = (Design + Emotion)",
            description:  "Your brand deserves logic and love. We shape visual identities that connect emotionally and communicate clearly. In addition, we always ensure that your design meets precision.",

            code: "IF (Brand != NULL) THEN (Recognition = TRUE)",
            features: [
                "Logo Design & Branding",
                "Brand Guidelines",
                "Marketing Materials",
                "Digital Asset Creation"
            ],
            detail: "Our brand identity services help you establish a memorable presence in your market. We create cohesive visual systems that communicate your values and resonate with your target audience.",
            image: "https://picsum.photos/seed/brandidentity/1200/800.jpg",
            icon: "🎨",
            color: PRIMARY_COLOR
        },
        {
            id: 2,
            title: "Web Development = (Speed × Functionality)",
            description: "We build responsive, high-performing websites that speak your brand’s language. Because in our code, performance is always TRUE",
            code: "IF (Responsive AND SEO) THEN (Conversions++)",
            features: [
                "Custom Web Development",
                "E-commerce Solutions",
                "Mobile-First Design",
                "SEO Optimization"
            ],
            detail: "We develop high-performance websites that not only look stunning but also deliver exceptional user experiences and drive business growth through conversion-focused design.",
            image: "https://picsum.photos/seed/webdevelopment/1200/800.jpg",
            icon: "💻",
            color: SECONDARY_COLOR
        },
        {
            id: 3,
            title: "ERP Software Solutions = (Automation + Control)",
            description: "We create intelligent ERP systems that streamline your workflow and give you full command.Because we believe that when operations are optimized, efficiency = TRUE.",
            code: "WHILE (Process != Automated) { Optimize() }",
            features: [
                "Custom ERP Development",
                "Business Process Automation",
                "Data Integration",
                "Cloud-Based Solutions"
            ],
            detail: "Our ERP solutions integrate all aspects of your business operations into a unified system, improving efficiency, data accuracy, and decision-making capabilities.",
            image: "https://picsum.photos/seed/erpsolutions/1200/800.jpg",
            icon: "⚙️",
            color: ACCENT_COLOR
        },
        {
            id: 4,
            title: "POS Systems = (Ease + Efficiency)",
            description: "We provide modern point-of-sale systems tailored for your business logic. Because smoothtransactions = Happy Customers.",
            code: "IF (POS == Modern) THEN (Sales = MAX)",
            features: [
                "Custom POS Development",
                "Inventory Management",
                "Payment Integration",
                "Analytics & Reporting"
            ],
            detail: "Transform your retail operations with our cutting-edge POS systems that streamline transactions, manage inventory, and provide valuable insights into your business performance.",
            image: "https://picsum.photos/seed/possystem/1200/800.jpg",
            icon: "🛒",
            color: PRIMARY_COLOR
        },

        {
            id: 5,
            title: "AI Chat Bots = (Intelligence = Conversion)",
            description: "We build smart, conversational interfaces that understand user intent and automate engagement.Because when AI handles the noise, your team can focus on the signal.",
            code: "IF (AI == Intelligent) THEN (Engagement = MAX)",
            features: [
                "Custom AI Chat Bot Development",
                "Natural Language Processing",
                "Automated Customer Support",
                "Integration with Existing Systems"
            ],
            detail: "Our AI chatbots are designed to understand and respond to customer queries intelligently, providing seamless support and enhancing user engagement.",
            image: "https://picsum.photos/seed/aichatbot/1200/800.jpg",
            icon: "🤖",
            color: ACCENT_COLOR
        }
    ];

    // Auto-play functionality
    useEffect(() => {
        if (isPlaying && !isHovered) {
            intervalRef.current = setInterval(() => {
                setCurrentServiceIndex((prevIndex) =>
                    prevIndex === services.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, isHovered, services.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                setCurrentServiceIndex((prevIndex) =>
                    prevIndex === services.length - 1 ? 0 : prevIndex + 1
                );
            } else if (e.key === 'ArrowLeft') {
                setCurrentServiceIndex((prevIndex) =>
                    prevIndex === 0 ? services.length - 1 : prevIndex - 1
                );
            } else if (e.key === ' ') {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, services.length]);

    const handleDotClick = (index) => {
        setCurrentServiceIndex(index);
    };

    const handlePrev = () => {
        setCurrentServiceIndex((prevIndex) =>
            prevIndex === 0 ? services.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentServiceIndex((prevIndex) =>
            prevIndex === services.length - 1 ? 0 : prevIndex + 1
        );
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <section
            ref={sliderRef}
            className="relative min-h-screen overflow-hidden flex items-center justify-center"
        >

            {/* Main content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: LIGHT_TEXT }}>
                        Our Services
                    </h2>
                    <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: PRIMARY_COLOR }}></div>
                </motion.div>

                {/* Slider container */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Slider content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentServiceIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                        >
                            {/* Service image */}
                            <div className="relative order-2 lg:order-1">
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                                    <img
                                        src={services[currentServiceIndex].image}
                                        alt={services[currentServiceIndex].title}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div
                                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                                        style={{ background: `linear-gradient(135deg, ${services[currentServiceIndex].color}, transparent)` }}
                                    ></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex items-center">
                                            <span className="text-4xl mr-3">{services[currentServiceIndex].icon}</span>
                                            <h3 className="text-2xl font-bold text-white">{services[currentServiceIndex].title}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service content */}
                            <div className="order-1 lg:order-2">
                                <div className="mb-6">
                                    <span
                                        className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                                        style={{
                                            backgroundColor: `${services[currentServiceIndex].color}20`,
                                            color: services[currentServiceIndex].color
                                        }}
                                    >
                                        Service {currentServiceIndex + 1} of {services.length}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: LIGHT_TEXT }}>
                                        {services[currentServiceIndex].title}
                                    </h3>
                                </div>

                                <p className="text-lg mb-8 leading-relaxed" style={{ color: LIGHT_TEXT, opacity: 0.8 }}>
                                    {services[currentServiceIndex].description}
                                </p>

                                <div className="rounded-lg p-4 mb-8 font-mono text-sm border backdrop-blur-sm"
                                    style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        borderColor: `${services[currentServiceIndex].color}40`,
                                        color: '#4ade80'
                                    }}
                                >
                                    {services[currentServiceIndex].code}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {services[currentServiceIndex].features.map((feature, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                                            className="flex items-start"
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center"
                                                style={{ backgroundColor: services[currentServiceIndex].color }}
                                            >
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span style={{ color: LIGHT_TEXT, opacity: 0.8 }}>{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                <button
                                    className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex items-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${services[currentServiceIndex].color}, ${services[currentServiceIndex].color}80)`,
                                        boxShadow: `0 10px 25px -5px ${services[currentServiceIndex].color}40`
                                    }}
                                >
                                    Learn More
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation controls */}
                    <div className="flex justify-between items-center mt-8">
                        {/* Previous button */}
                        <button
                            onClick={handlePrev}
                            className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            <ChevronLeft className="w-6 h-6" style={{ color: LIGHT_TEXT }} />
                        </button>

                        {/* Dots indicator */}
                        <div className="flex items-center gap-2">
                            {services.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`transition-all duration-300 ${index === currentServiceIndex
                                        ? 'w-10 h-2 rounded-full'
                                        : 'w-2 h-2 rounded-full opacity-50 hover:opacity-100'
                                        }`}
                                    style={{
                                        backgroundColor: index === currentServiceIndex
                                            ? services[currentServiceIndex].color
                                            : LIGHT_TEXT
                                    }}
                                />
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={handleNext}
                            className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            <ChevronRight className="w-6 h-6" style={{ color: LIGHT_TEXT }} />
                        </button>
                    </div>

                    {/* Play/Pause button */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={togglePlayPause}
                            className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6" style={{ color: LIGHT_TEXT }} />
                            ) : (
                                <Play className="w-6 h-6" style={{ color: LIGHT_TEXT }} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurServicesOnlySlider;