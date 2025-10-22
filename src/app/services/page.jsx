"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { X, Check, ArrowRight, ChevronDown, Maximize2, Grid3x3, Sparkles, Play, Pause, SkipBack, SkipForward, Layers, Zap, Shield, Globe, Cpu, Code, BarChart, Users, Lightbulb, TrendingUp, Award, Clock, Target } from 'lucide-react';

// Define your brand colors as constants for easy management
const PRIMARY_COLOR = '#3B85FE';
const SECONDARY_COLOR = '#A9DBDC';
const ACCENT_COLOR = '#6366F1';
const DARK_BG = '#0F172A';
const LIGHT_TEXT = '#F1F5F9';

const OurServicesSlider = ({ onNavigateToSection }) => {
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [selectedService, setSelectedService] = useState(null);
    const [showAllServices, setShowAllServices] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isFirstService, setIsFirstService] = useState(true);
    const [isLastService, setIsLastService] = useState(false);
    const [isSectionInView, setIsSectionInView] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    const containerRef = useRef(null);
    const backgroundRef = useRef(null);
    const isScrolling = useRef(false);
    const scrollTimeout = useRef(null);
    const lastScrollTime = useRef(0);
    const accumulatedScroll = useRef(0);
    const autoPlayInterval = useRef(null);
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

    // Update first/last service states when index changes
    useEffect(() => {
        setIsFirstService(currentServiceIndex === 0);
        setIsLastService(currentServiceIndex === services.length - 1);
    }, [currentServiceIndex, services.length]);

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

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying && !showAllServices) {
            autoPlayInterval.current = setInterval(() => {
                setCurrentServiceIndex((prevIndex) =>
                    prevIndex === services.length - 1 ? 0 : prevIndex + 1
                );
                setProgress(0);
            }, 5000);

            // Progress animation
            const progressInterval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
            }, 100);

            return () => {
                clearInterval(autoPlayInterval.current);
                clearInterval(progressInterval);
            };
        } else {
            clearInterval(autoPlayInterval.current);
            setProgress(0);
        }
    }, [isAutoPlaying, showAllServices, services.length]);

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

    const handleScroll = (e) => {
        if (showAllServices) return;

        // Only handle scroll if we're in the services section
        if (!isSectionInView) return;

        e.preventDefault();

        // Clear any existing timeout
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        // Add to accumulated scroll
        accumulatedScroll.current += e.deltaY;

        // Set a timeout to process the scroll after scrolling stops
        scrollTimeout.current = setTimeout(() => {
            // Only process if we're not already scrolling
            if (!isScrolling.current) {
                isScrolling.current = true;

                // Determine scroll direction based on accumulated scroll
                const scrollDirection = accumulatedScroll.current > 0 ? 1 : -1;
                const newIndex = currentServiceIndex + scrollDirection;

                if (newIndex >= 0 && newIndex < services.length) {
                    setCurrentServiceIndex(newIndex);
                    setProgress(0);
                } else if (newIndex >= services.length && onNavigateToSection) {
                    // Navigate to next section if available
                    onNavigateToSection('next');
                } else if (newIndex < 0 && onNavigateToSection) {
                    // Navigate to previous section if available
                    onNavigateToSection('prev');
                }

                // Reset accumulated scroll
                accumulatedScroll.current = 0;

                // Allow scrolling again after animation completes
                setTimeout(() => {
                    isScrolling.current = false;
                }, 1000); // Match this with your animation duration
            }
        }, 100); // Short delay to detect when scrolling stops
    };

    const handleDotClick = (index) => {
        setCurrentServiceIndex(index);
        setProgress(0);
    };

    const handleKeyDown = (e) => {
        if (showAllServices) return;

        if (e.key === 'ArrowDown' && currentServiceIndex < services.length - 1) {
            setCurrentServiceIndex(currentServiceIndex + 1);
            setProgress(0);
        } else if (e.key === 'ArrowDown' && currentServiceIndex === services.length - 1 && onNavigateToSection) {
            onNavigateToSection('next');
        } else if (e.key === 'ArrowUp' && currentServiceIndex > 0) {
            setCurrentServiceIndex(currentServiceIndex - 1);
            setProgress(0);
        } else if (e.key === 'ArrowUp' && currentServiceIndex === 0 && onNavigateToSection) {
            onNavigateToSection('prev');
        }
    };

    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying);
        setProgress(0);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            // Only add wheel listener when section is in view
            if (isSectionInView) {
                container.addEventListener('wheel', handleScroll, { passive: false });
            }
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                container.removeEventListener('wheel', handleScroll);
                window.removeEventListener('keydown', handleKeyDown);
                if (scrollTimeout.current) {
                    clearTimeout(scrollTimeout.current);
                }
            };
        }
    }, [currentServiceIndex, showAllServices, onNavigateToSection, isSectionInView]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen overflow-hidden"
            id="services"
        >
            {/* Enhanced Interactive Background */}
            <div ref={backgroundRef} className="absolute inset-0 overflow-hidden">
                {/* Animated gradient orbs that follow mouse */}
                <motion.div
                    className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${PRIMARY_COLOR} 0%, transparent 70%)`,
                    }}
                    animate={{
                        x: smoothMousePosition.x - 400,
                        y: smoothMousePosition.y - 400,
                    }}
                    transition={{ type: "spring", stiffness: 20, damping: 15 }}
                />
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${ACCENT_COLOR} 0%, transparent 70%)`,
                    }}
                    animate={{
                        x: smoothMousePosition.x * 0.5 - 300,
                        y: smoothMousePosition.y * 0.5 - 300,
                    }}
                    transition={{ type: "spring", stiffness: 15, damping: 10 }}
                />

                {/* Animated floating particles */}
                {isClient && [...Array(40)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 6 + 2,
                            height: Math.random() * 6 + 2,
                            backgroundColor: i % 2 === 0 ? PRIMARY_COLOR : ACCENT_COLOR,
                            opacity: Math.random() * 0.5 + 0.1,
                        }}
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Animated geometric shapes */}
                {isClient && [...Array(5)].map((_, i) => (
                    <motion.div
                        key={`shape-${i}`}
                        className="absolute border"
                        style={{
                            width: Math.random() * 200 + 100,
                            height: Math.random() * 200 + 100,
                            borderColor: i % 2 === 0 ? PRIMARY_COLOR : SECONDARY_COLOR,
                            borderWidth: 1,
                            opacity: 0.1,
                            borderRadius: Math.random() > 0.5 ? '50%' : '10%',
                        }}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 30 + 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
            </div>

            {/* View Toggle - Circular Grid Button - Only show when section is in view */}
            {isSectionInView && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed top-8 left-8 z-30"
                >
                    <button
                        onClick={() => setShowAllServices(!showAllServices)}
                        className="w-14 h-14 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 hover:bg-white/10 flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                        {showAllServices ? (
                            <Maximize2 className="w-6 h-6 text-white" />
                        ) : (
                            <Grid3x3 className="w-6 h-6 text-white" />
                        )}
                    </button>
                </motion.div>
            )}

            {/* Enhanced Section Header - Fixed positioning to prevent overlap */}
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

            {/* Service Slider / Grid View - Added proper spacing to prevent overlap */}
            <div className="relative z-10 pt-8 pb-32">
                <AnimatePresence mode="wait">
                    {!showAllServices ? (
                        <motion.div
                            key="slider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative h-full flex items-center justify-center"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentServiceIndex}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl"
                                >
                                    {/* Service Image */}
                                    <div className="relative order-2 lg:order-1">
                                        <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                                            <img
                                                src={services[currentServiceIndex].image}
                                                alt={services[currentServiceIndex].title}
                                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div
                                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                                style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})` }}
                                            ></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                                                <div className="flex items-center">
                                                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white mr-3" style={{ backgroundColor: services[currentServiceIndex].color }}>
                                                        {services[currentServiceIndex].icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white">{services[currentServiceIndex].title}</h3>
                                                        <p className="text-sm text-gray-300">{services[currentServiceIndex].subtitle}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service Content */}
                                    <div className="order-1 lg:order-2">
                                        <div className="mb-6">
                                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                                                style={{ backgroundColor: `${services[currentServiceIndex].color}20`, color: services[currentServiceIndex].color }}
                                            >
                                                Service {currentServiceIndex + 1} of {services.length}
                                            </span>
                                            <h3 className="text-4xl font-bold mb-2 text-white">
                                                {services[currentServiceIndex].title}
                                            </h3>
                                            <p className="text-xl text-gray-300 mb-4">{services[currentServiceIndex].subtitle}</p>
                                        </div>

                                        <p className="text-lg mb-8 leading-relaxed text-gray-300">
                                            {services[currentServiceIndex].description}
                                        </p>

                                        {/* Tab Navigation */}
                                        <div className="flex border-b border-gray-700 mb-6">
                                            {['overview', 'benefits', 'process'].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`px-4 py-2 font-medium transition-colors capitalize ${activeTab === tab
                                                        ? 'text-white border-b-2'
                                                        : 'text-gray-400 hover:text-white'
                                                        }`}
                                                    style={{ borderColor: activeTab === tab ? services[currentServiceIndex].color : 'transparent' }}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Tab Content */}
                                        <div className="mb-8">
                                            {activeTab === 'overview' && (
                                                <div>
                                                    <div className="rounded-lg p-4 mb-6 font-mono text-sm border backdrop-blur-sm"
                                                        style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#4ade80' }}
                                                    >
                                                        {services[currentServiceIndex].code}
                                                    </div>

                                                    <ul className="space-y-3">
                                                        {services[currentServiceIndex].features.map((feature, idx) => (
                                                            <motion.li
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                                className="flex items-start"
                                                            >
                                                                <Check className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: services[currentServiceIndex].color }} />
                                                                <span className="text-gray-300">{feature}</span>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {activeTab === 'benefits' && (
                                                <div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                        {services[currentServiceIndex].stats.map((stat, idx) => (
                                                            <div key={idx} className="rounded-lg p-4 backdrop-blur-sm border"
                                                                style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-gray-400 text-sm">{stat.label}</span>
                                                                    <TrendingUp className="w-4 h-4" style={{ color: services[currentServiceIndex].color }} />
                                                                </div>
                                                                <div className="text-2xl font-bold mt-2" style={{ color: services[currentServiceIndex].color }}>
                                                                    {stat.value}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <ul className="space-y-3">
                                                        {services[currentServiceIndex].benefits.map((benefit, idx) => (
                                                            <motion.li
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                                className="flex items-start"
                                                            >
                                                                <Award className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: services[currentServiceIndex].color }} />
                                                                <span className="text-gray-300">{benefit}</span>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {activeTab === 'process' && (
                                                <div>
                                                    <div className="space-y-4">
                                                        {services[currentServiceIndex].timeline.map((step, idx) => (
                                                            <div key={idx} className="flex items-start">
                                                                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4"
                                                                    style={{ backgroundColor: services[currentServiceIndex].color }}
                                                                >
                                                                    <span className="text-white font-bold">{idx + 1}</span>
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <h4 className="text-white font-medium">{step.phase}</h4>
                                                                        <span className="text-sm text-gray-400 flex items-center">
                                                                            <Clock className="w-3 h-3 mr-1" />
                                                                            {step.duration}
                                                                        </span>
                                                                    </div>
                                                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            className="h-full"
                                                                            style={{ backgroundColor: services[currentServiceIndex].color }}
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: '100%' }}
                                                                            transition={{ duration: 1, delay: idx * 0.2 }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                onClick={() => setSelectedService(services[currentServiceIndex])}
                                                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                                                style={{ background: `linear-gradient(135deg, ${services[currentServiceIndex].color}, ${services[currentServiceIndex].color}80)`, boxShadow: `0 10px 25px -5px ${services[currentServiceIndex].color}40` }}
                                            >
                                                Learn More
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </button>
                                            <button className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10"
                                                style={{ background: 'rgba(51, 65, 85, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                                            >
                                                Contact Us
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="container mx-auto px-8 py-24 max-w-6xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {services.map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className={`relative group cursor-pointer ${index === currentServiceIndex ? 'ring-2' : ''}`}
                                        style={{
                                            ringColor: index === currentServiceIndex ? service.color : 'transparent',
                                            transform: index === currentServiceIndex ? 'scale(1.03)' : 'scale(1)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => {
                                            setCurrentServiceIndex(index);
                                            setShowAllServices(false);
                                        }}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl border h-64 group"
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
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mr-3" style={{ backgroundColor: service.color }}>
                                                        {service.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                                        <p className="text-sm text-gray-300">{service.subtitle}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-300">{service.description}</p>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="px-6 py-3 rounded-lg backdrop-blur-md border"
                                                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                                                >
                                                    <span className="text-white font-medium">View Details</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {!showAllServices && (
                <>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 z-20">
                        <motion.div
                            className="h-full"
                            style={{ backgroundColor: services[currentServiceIndex].color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
                        <div className="flex items-center gap-2">
                            {services.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentServiceIndex
                                        ? 'w-8'
                                        : 'opacity-40 hover:opacity-100'
                                        }`}
                                    style={{ backgroundColor: index === currentServiceIndex ? services[currentServiceIndex].color : '#FFFFFF' }}
                                />
                            ))}
                        </div>
                        <div className="ml-4 text-sm text-gray-300">
                            {currentServiceIndex + 1} / {services.length}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute bottom-24 left-0 right-0 flex justify-between px-8 z-20">
                        <button
                            onClick={() => {
                                setCurrentServiceIndex(currentServiceIndex > 0 ? currentServiceIndex - 1 : services.length - 1);
                                setProgress(0);
                            }}
                            className="w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 hover:bg-white/10 flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            <SkipBack className="w-5 h-5 text-white" />
                        </button>

                        <button
                            onClick={toggleAutoPlay}
                            className="w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 hover:bg-white/10 flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            {isAutoPlaying ? (
                                <Pause className="w-5 h-5 text-white" />
                            ) : (
                                <Play className="w-5 h-5 text-white" />
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setCurrentServiceIndex(currentServiceIndex < services.length - 1 ? currentServiceIndex + 1 : 0);
                                setProgress(0);
                            }}
                            className="w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 hover:bg-white/10 flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            <SkipForward className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Scroll Hint for First Service */}
                    {currentServiceIndex === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1 }}
                            className="absolute bottom-40 left-0 right-0 flex justify-center z-20"
                        >
                            <div className="flex flex-col items-center text-sm text-gray-300">
                                <span className="mb-2">Scroll to explore</span>
                                <ChevronDown className="w-5 h-5 animate-bounce" />
                            </div>
                        </motion.div>
                    )}
                </>
            )}

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
                                        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white mr-4" style={{ backgroundColor: selectedService.color }}>
                                            {selectedService.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-white">{selectedService.title}</h3>
                                            <p className="text-lg text-gray-300">{selectedService.subtitle}</p>
                                            <span className="text-sm text-gray-400">Service {selectedService.id}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="transition-colors text-gray-400 hover:text-white"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
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
                                        <div key={idx} className="rounded-lg p-4 backdrop-blur-sm border"
                                            style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">{stat.label}</span>
                                                <TrendingUp className="w-4 h-4" style={{ color: selectedService.color }} />
                                            </div>
                                            <div className="text-2xl font-bold mt-2" style={{ color: selectedService.color }}>
                                                {stat.value}
                                            </div>
                                        </div>
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
                                                <li key={idx} className="flex items-start">
                                                    <Check className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: selectedService.color }} />
                                                    <span className="text-gray-300">{feature}</span>
                                                </li>
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
                                                <li key={idx} className="flex items-start">
                                                    <Target className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: selectedService.color }} />
                                                    <span className="text-gray-300">{benefit}</span>
                                                </li>
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
                                            <div key={idx} className="flex items-start">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4"
                                                    style={{ backgroundColor: selectedService.color }}
                                                >
                                                    <span className="text-white font-bold">{idx + 1}</span>
                                                </div>
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
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg`}
                                        style={{ background: `linear-gradient(135deg, ${selectedService.color}, ${selectedService.color}80)` }}
                                    >
                                        Get Started
                                    </button>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="flex-1 py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 border hover:bg-white/10"
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

export default OurServicesSlider;