"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { X, Check, ArrowRight, Grid3x3, Sparkles, Layers, Shield, Globe, Cpu, TrendingUp, Award, Clock, Target } from 'lucide-react';

// Define your brand colors as constants for easy management
const PRIMARY_COLOR = '#3B85FE';
const SECONDARY_COLOR = '#A9DBDC';
const ACCENT_COLOR = '#6366F1';
const DARK_BG = '#0F172A';
const LIGHT_TEXT = '#F1F5F9';

const ServicesPage = ({ onNavigateToSection }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isSectionInView, setIsSectionInView] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [hoveredServiceIndex, setHoveredServiceIndex] = useState(null);
    const [backgroundGradient, setBackgroundGradient] = useState({ from: PRIMARY_COLOR, to: ACCENT_COLOR });

    const containerRef = useRef(null);
    const backgroundRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0]);

    // Use useEffect to set isClient to true after mounting
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Smooth mouse tracking
    const smoothMousePosition = {
        x: useSpring(mousePosition.x, { stiffness: 100, damping: 30 }),
        y: useSpring(mousePosition.y, { stiffness: 100, damping: 30 })
    };

    const services = [
        {
            id: 1,
            title: "Brand Visual Identity",
            subtitle: "Crafting Memorable Experiences",
            description: "Create a powerful brand presence that resonates with your audience and drives recognition.",
            code: "IF (Brand != NULL) THEN (Recognition = TRUE)",
            features: [
                "Logo Design & Branding",
                "Brand Guidelines",
                "Marketing Materials",
                "Digital Asset Creation"
            ],
            benefits: [
                "Increased brand recognition",
                "Consistent visual identity",
                "Improved customer loyalty",
                "Competitive market advantage"
            ],
            process: [
                "Research & Discovery",
                "Concept Development",
                "Design Refinement",
                "Final Implementation"
            ],
            stats: [
                { label: "Brand Recognition", value: "85%" },
                { label: "Customer Loyalty", value: "76%" },
                { label: "Market Growth", value: "64%" }
            ],
            detail: "Our brand identity services help you establish a memorable presence in your market. We create cohesive visual systems that communicate your values and resonate with your target audience.",
            image: "https://picsum.photos/seed/brandidentity/1200/800.jpg",
            icon: <Layers className="w-8 h-8" />,
            color: PRIMARY_COLOR,
            timeline: [
                { phase: "Discovery", duration: "1-2 weeks" },
                { phase: "Concept", duration: "2-3 weeks" },
                { phase: "Design", duration: "3-4 weeks" },
                { phase: "Implementation", duration: "2-3 weeks" }
            ]
        },
        {
            id: 2,
            title: "Website Development",
            subtitle: "Building Digital Experiences",
            description: "Build responsive, SEO-optimized websites that convert visitors into customers.",
            code: "IF (Responsive AND SEO) THEN (Conversions++)",
            features: [
                "Custom Web Development",
                "E-commerce Solutions",
                "Mobile-First Design",
                "SEO Optimization"
            ],
            benefits: [
                "Enhanced user experience",
                "Higher conversion rates",
                "Improved search rankings",
                "Mobile accessibility"
            ],
            process: [
                "Requirements Analysis",
                "UI/UX Design",
                "Development & Testing",
                "Launch & Optimization"
            ],
            stats: [
                { label: "Conversion Rate", value: "42%" },
                { label: "Page Speed", value: "95+" },
                { label: "Mobile Traffic", value: "68%" }
            ],
            detail: "We develop high-performance websites that not only look stunning but also deliver exceptional user experiences and drive business growth through conversion-focused design.",
            image: "https://picsum.photos/seed/webdevelopment/1200/800.jpg",
            icon: <Globe className="w-8 h-8" />,
            color: SECONDARY_COLOR,
            timeline: [
                { phase: "Planning", duration: "1-2 weeks" },
                { phase: "Design", duration: "2-3 weeks" },
                { phase: "Development", duration: "4-6 weeks" },
                { phase: "Testing", duration: "1-2 weeks" }
            ]
        },
        {
            id: 3,
            title: "ERP Software Solutions",
            subtitle: "Streamlining Business Operations",
            description: "Streamline your business operations with custom ERP systems tailored to your needs.",
            code: "WHILE (Process != Automated) { Optimize() }",
            features: [
                "Custom ERP Development",
                "Business Process Automation",
                "Data Integration",
                "Cloud-Based Solutions"
            ],
            benefits: [
                "Operational efficiency",
                "Data-driven decisions",
                "Cost reduction",
                "Scalable infrastructure"
            ],
            process: [
                "Business Analysis",
                "System Architecture",
                "Development & Integration",
                "Training & Support"
            ],
            stats: [
                { label: "Efficiency Gain", value: "58%" },
                { label: "Cost Reduction", value: "32%" },
                { label: "Data Accuracy", value: "97%" }
            ],
            detail: "Our ERP solutions integrate all aspects of your business operations into a unified system, improving efficiency, data accuracy, and decision-making capabilities.",
            image: "https://picsum.photos/seed/erpsolutions/1200/800.jpg",
            icon: <Cpu className="w-8 h-8" />,
            color: ACCENT_COLOR,
            timeline: [
                { phase: "Analysis", duration: "2-3 weeks" },
                { phase: "Architecture", duration: "2-3 weeks" },
                { phase: "Development", duration: "6-8 weeks" },
                { phase: "Deployment", duration: "2-3 weeks" }
            ]
        },
        {
            id: 4,
            title: "POS System",
            subtitle: "Modern Retail Solutions",
            description: "Modern point-of-sale solutions that enhance customer experience and boost sales.",
            code: "IF (POS == Modern) THEN (Sales = MAX)",
            features: [
                "Custom POS Development",
                "Inventory Management",
                "Payment Integration",
                "Analytics & Reporting"
            ],
            benefits: [
                "Faster transactions",
                "Real-time inventory",
                "Sales insights",
                "Customer satisfaction"
            ],
            process: [
                "Requirements Gathering",
                "System Design",
                "Development & Testing",
                "Deployment & Training"
            ],
            stats: [
                { label: "Transaction Speed", value: "3x" },
                { label: "Inventory Accuracy", value: "99%" },
                { label: "Customer Satisfaction", value: "92%" }
            ],
            detail: "Transform your retail operations with our cutting-edge POS systems that streamline transactions, manage inventory, and provide valuable insights into your business performance.",
            image: "https://picsum.photos/seed/possystem/1200/800.jpg",
            icon: <Shield className="w-8 h-8" />,
            color: PRIMARY_COLOR,
            timeline: [
                { phase: "Consultation", duration: "1 week" },
                { phase: "Design", duration: "2 weeks" },
                { phase: "Development", duration: "3-4 weeks" },
                { phase: "Implementation", duration: "1-2 weeks" }
            ]
        }
    ];

    // Track if services section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSectionInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    // Track mouse position for interactive background
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (backgroundRef.current) {
                const rect = backgroundRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Update background gradient based on hovered service
    useEffect(() => {
        if (hoveredServiceIndex !== null && services[hoveredServiceIndex]) {
            const service = services[hoveredServiceIndex];
            setBackgroundGradient({
                from: service.color,
                to: service.color === PRIMARY_COLOR ? ACCENT_COLOR :
                    service.color === SECONDARY_COLOR ? PRIMARY_COLOR : SECONDARY_COLOR
            });
        } else {
            setBackgroundGradient({
                from: PRIMARY_COLOR,
                to: ACCENT_COLOR
            });
        }
    }, [hoveredServiceIndex]);

    const sliderImages = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            title: 'Our Core Logic',
            subtitle: ' We don\'t just provide services; we solve for growth using a refined digital stack'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            title: 'Expert Development',
            subtitle: 'Our team of professionals is here to help'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            title: 'Digital Transformation',
            subtitle: 'Elevate your business to the next level'
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
            title: 'Strategic Partnership',
            subtitle: 'Building success through collaboration'
        }
    ];

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen overflow-hidden"
            id="services"
        >

            {/* Hero Section with Slider */}
            <section className="relative h-[50vh] md:h-[55vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={sliderImages[0].url}
                        alt={sliderImages[0].title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex items-center">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl">
                            <div className="overflow-hidden">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 transform transition-all duration-1000 translate-y-0 opacity-100">
                                    {sliderImages[0].title}
                                </h1>
                            </div>

                            <div className="overflow-hidden">
                                <p className="text-lg md:text-xl text-gray-300 mb-6 transform transition-all duration-1000 delay-300 translate-y-0 opacity-100">
                                    {sliderImages[0].subtitle}
                                </p>
                            </div>

                            <div className="overflow-hidden">
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 transform transition-all duration-1000 delay-500 translate-y-0 opacity-100">
                                    <a
                                        href="#contact-form"
                                        className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
                                    >
                                        Contact Us
                                    </a>
                                    <a
                                        href="#services"
                                        className="px-6 py-2 md:px-8 md:py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border-2 border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
                                    >
                                        Our Services
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 z-10 pointer-events-none"></div>
            </section>

            {/* Enhanced Interactive Background with Hover Effects */}
            <div ref={backgroundRef} className="absolute inset-0 overflow-hidden">
                {/* Dynamic gradient background that changes on hover */}
                <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at ${smoothMousePosition.x}px ${smoothMousePosition.y}px, ${backgroundGradient.from} 0%, transparent 50%)`,
                    }}
                    animate={{
                        scale: hoveredServiceIndex !== null ? 1.5 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                />

                {/* Secondary gradient orb */}
                <motion.div
                    className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${backgroundGradient.to} 0%, transparent 70%)`,
                    }}
                    animate={{
                        x: smoothMousePosition.x - 400,
                        y: smoothMousePosition.y - 400,
                        scale: hoveredServiceIndex !== null ? 1.2 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 20, damping: 15 }}
                />

                {/* Tertiary gradient orb */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${backgroundGradient.from} 0%, transparent 70%)`,
                    }}
                    animate={{
                        x: smoothMousePosition.x * 0.5 - 300,
                        y: smoothMousePosition.y * 0.5 - 300,
                        scale: hoveredServiceIndex !== null ? 1.3 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 15, damping: 10 }}
                />

                {/* Animated floating particles with hover effect */}
                {isClient && [...Array(40)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 6 + 2,
                            height: Math.random() * 6 + 2,
                            backgroundColor: i % 2 === 0 ? backgroundGradient.from : backgroundGradient.to,
                            opacity: Math.random() * 0.5 + 0.1,
                        }}
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                            scale: hoveredServiceIndex !== null ? [0, 1.5, 0] : [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Animated geometric shapes with hover effect */}
                {isClient && [...Array(5)].map((_, i) => (
                    <motion.div
                        key={`shape-${i}`}
                        className="absolute border"
                        style={{
                            width: Math.random() * 200 + 100,
                            height: Math.random() * 200 + 100,
                            borderColor: i % 2 === 0 ? backgroundGradient.from : backgroundGradient.to,
                            borderWidth: 1,
                            opacity: 0.1,
                            borderRadius: Math.random() > 0.5 ? '50%' : '10%',
                        }}
                        animate={{
                            rotate: [0, 360],
                            scale: hoveredServiceIndex !== null ? [1, 1.5, 1] : [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 30 + 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Grid pattern overlay with hover effect */}
                <motion.div
                    className="absolute inset-0 opacity-5"
                    animate={{
                        opacity: hoveredServiceIndex !== null ? 0.1 : 0.05,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </motion.div>

                {/* Hover effect overlay */}
                {hoveredServiceIndex !== null && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, ${services[hoveredServiceIndex].color}10 0%, transparent 70%)`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                )}
            </div>

            {/* Enhanced Section Header */}
            <motion.div
                style={{ opacity }}
                className="relative z-20 p-8 pt-16"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center px-4 py-2 backdrop-blur-sm rounded-full mb-6 border"
                        style={{ backgroundColor: `${PRIMARY_COLOR}15`, borderColor: `${PRIMARY_COLOR}40` }}
                    >
                        <Sparkles className="w-4 h-4 mr-2" style={{ color: PRIMARY_COLOR }} />
                        <span className="text-sm font-medium" style={{ color: SECONDARY_COLOR }}>Our Services</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                        What We Offer
                    </h2>

                    <p className="text-xl max-w-3xl mx-auto text-gray-300">
                        We provide comprehensive digital solutions to help your business thrive in the modern landscape
                    </p>
                </motion.div>
            </motion.div>

            {/* Service Cards Grid */}
            <div className="relative z-10 pt-8 pb-32">
                <div className="container mx-auto px-8 py-24 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group cursor-pointer"
                                onClick={() => setSelectedService(service)}
                                onMouseEnter={() => setHoveredServiceIndex(index)}
                                onMouseLeave={() => setHoveredServiceIndex(null)}
                                whileHover={{ y: -10 }}
                            >
                                <div className="relative overflow-hidden rounded-2xl border h-80"
                                    style={{ background: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                                >
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="flex items-center mb-2">
                                            <motion.div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white mr-3"
                                                style={{ backgroundColor: service.color }}
                                                whileHover={{ scale: 1.2, rotate: 10 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                            >
                                                {service.icon}
                                            </motion.div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                                <p className="text-sm text-gray-300">{service.subtitle}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-300 mb-4">{service.description}</p>
                                        <motion.button
                                            className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-300"
                                            style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}80)` }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Learn More
                                        </motion.button>
                                    </div>
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: `linear-gradient(135deg, ${service.color}20, transparent)` }}
                                    >
                                        <div className="px-6 py-3 rounded-lg backdrop-blur-md border"
                                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                                        >
                                            <span className="text-white font-medium">View Details</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Service Detail Modal */}
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
                            className="rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border"
                            style={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="h-2 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${selectedService.color}, ${selectedService.color}80)` }}></div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center">
                                        <motion.div
                                            className="w-16 h-16 rounded-xl flex items-center justify-center text-white mr-4"
                                            style={{ backgroundColor: selectedService.color }}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                        >
                                            {selectedService.icon}
                                        </motion.div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-white">{selectedService.title}</h3>
                                            <p className="text-lg text-gray-300">{selectedService.subtitle}</p>
                                            <span className="text-sm text-gray-400">Service {selectedService.id}</span>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => setSelectedService(null)}
                                        className="transition-colors text-gray-400 hover:text-white"
                                        whileHover={{ scale: 1.2, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>

                                <div className="mb-6 rounded-xl overflow-hidden">
                                    <img
                                        src={selectedService.image}
                                        alt={selectedService.title}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                <p className="mb-6 leading-relaxed text-lg text-gray-300">{selectedService.detail}</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {selectedService.stats.map((stat, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="rounded-lg p-4 backdrop-blur-sm border"
                                            style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">{stat.label}</span>
                                                <TrendingUp className="w-4 h-4" style={{ color: selectedService.color }} />
                                            </div>
                                            <div className="text-2xl font-bold mt-2" style={{ color: selectedService.color }}>
                                                {stat.value}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="rounded-lg p-4 mb-6 font-mono text-sm border backdrop-blur-sm"
                                    style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#4ade80' }}
                                >
                                    {selectedService.code}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-white flex items-center">
                                            <Layers className="w-5 h-5 mr-2" style={{ color: selectedService.color }} />
                                            Key Features
                                        </h4>
                                        <ul className="space-y-3">
                                            {selectedService.features.map((feature, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    className="flex items-start"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <Check className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: selectedService.color }} />
                                                    <span className="text-gray-300">{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-white flex items-center">
                                            <Award className="w-5 h-5 mr-2" style={{ color: selectedService.color }} />
                                            Benefits
                                        </h4>
                                        <ul className="space-y-3">
                                            {selectedService.benefits.map((benefit, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    className="flex items-start"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <Target className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: selectedService.color }} />
                                                    <span className="text-gray-300">{benefit}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-xl font-semibold mb-4 text-white flex items-center">
                                        <Clock className="w-5 h-5 mr-2" style={{ color: selectedService.color }} />
                                        Project Timeline
                                    </h4>
                                    <div className="space-y-4">
                                        {selectedService.timeline.map((step, idx) => (
                                            <motion.div
                                                key={idx}
                                                className="flex items-start"
                                                whileHover={{ x: 5 }}
                                            >
                                                <motion.div
                                                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4"
                                                    style={{ backgroundColor: selectedService.color }}
                                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                                >
                                                    <span className="text-white font-bold">{idx + 1}</span>
                                                </motion.div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-white font-medium">{step.phase}</h4>
                                                        <span className="text-sm text-gray-400">{step.duration}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full"
                                                            style={{ backgroundColor: selectedService.color }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: '100%' }}
                                                            transition={{ duration: 1, delay: idx * 0.2 }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <motion.button
                                        className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg`}
                                        style={{ background: `linear-gradient(135deg, ${selectedService.color}, ${selectedService.color}80)` }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Get Started
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setSelectedService(null)}
                                        className="flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 border hover:bg-white/10"
                                        style={{ background: 'rgba(51, 65, 85, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ServicesPage;