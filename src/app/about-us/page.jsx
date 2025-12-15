"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    ChevronDown,
    Users,
    Award,
    Target,
    Lightbulb,
    Twitter,
    Linkedin,
    Github,
    Star,
    Quote,
    Calendar,
    Globe,
    Zap,
    Shield,
    TrendingUp,
    Clock,
    CheckCircle,
    BarChart,
    Briefcase,
    Code,
    Palette,
    Megaphone,
    ChevronUp,
    ArrowUpRight,
    Sparkles,
    Layers,
    Cpu,
    Cloud,
    Database,
    Smartphone
} from 'lucide-react';
// import OrbAnimation from './OrbAnimation';

const AboutUs = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [activeTeamMember, setActiveTeamMember] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activeTab, setActiveTab] = useState('mission');

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

    useEffect(() => {
        setIsClient(true);

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Enhanced Data
    const teamMembers = [
        {
            id: 1,
            name: "Alex Johnson",
            position: "CEO & Founder",
            bio: "Visionary leader with 15+ years of experience in digital transformation and business strategy. Harvard MBA with a track record of successful exits.",
            image: "https://picsum.photos/seed/alexjohnson/400/400.jpg",
            social: {
                twitter: "#",
                linkedin: "#",
                github: "#"
            },
            skills: ["Leadership", "Strategy", "Innovation"],
            achievements: ["Forbes 30 Under 30", "TechCrunch Disrupt Winner", "3x Founder"]
        },
        {
            id: 2,
            name: "Sarah Williams",
            position: "CTO",
            bio: "Tech enthusiast passionate about building scalable solutions and leading development teams. Former Google engineer with expertise in distributed systems.",
            image: "https://picsum.photos/seed/sarahwilliams/400/400.jpg",
            social: {
                twitter: "#",
                linkedin: "#",
                github: "#"
            },
            skills: ["Architecture", "Cloud", "AI/ML"],
            achievements: ["AWS Certified Architect", "Kubernetes Contributor", "Patent Holder"]
        },
        {
            id: 3,
            name: "Michael Chen",
            position: "Head of Design",
            bio: "Creative mind focused on user experience and creating visually stunning interfaces. Former Apple designer with multiple design awards.",
            image: "https://picsum.photos/seed/michaelchen/400/400.jpg",
            social: {
                twitter: "#",
                linkedin: "#",
                github: "#"
            },
            skills: ["UI/UX", "Branding", "Animation"],
            achievements: ["Red Dot Design Award", "Awwwards Site of the Day", "D&AD Pencil Winner"]
        },
        {
            id: 4,
            name: "Emily Rodriguez",
            position: "Marketing Director",
            bio: "Strategic marketer with a proven track record of growing brands and reaching audiences. Former VP of Marketing at a unicorn startup.",
            image: "https://picsum.photos/seed/emilyrodriguez/400/400.jpg",
            social: {
                twitter: "#",
                linkedin: "#",
                github: "#"
            },
            skills: ["Strategy", "Content", "Analytics"],
            achievements: ["Clio Award Winner", "AdAge 40 Under 40", "Marketing Book Author"]
        }
    ];

    const values = [
        {
            id: 1,
            title: "Innovation",
            description: "We constantly push boundaries and explore new possibilities to deliver cutting-edge solutions that transform industries.",
            icon: <Lightbulb className="w-8 h-8" />,
            color: "#3B85FE"
        },
        {
            id: 2,
            title: "Excellence",
            description: "We are committed to delivering the highest quality in everything we do, exceeding expectations at every turn.",
            icon: <Award className="w-8 h-8" />,
            color: "#A9DBDC"
        },
        {
            id: 3,
            title: "Integrity",
            description: "We conduct business with honesty, transparency, and ethical principles that build lasting trust with our clients.",
            icon: <Target className="w-8 h-8" />,
            color: "#6366F1"
        },
        {
            id: 4,
            title: "Collaboration",
            description: "We believe in the power of teamwork and diverse perspectives to create solutions that no single individual could achieve alone.",
            icon: <Users className="w-8 h-8" />,
            color: "#3B85FE"
        }
    ];

    const timeline = [
        {
            year: "2015",
            title: "Company Founded",
            description: "Started with a small team and a big vision to transform digital experiences. Initial investment of $500K from angel investors.",
            icon: <Sparkles className="w-6 h-6" />
        },
        {
            year: "2017",
            title: "First Major Client",
            description: "Landed our first enterprise client, marking our entry into the big league. Revenue grew 300% in the first year.",
            icon: <Briefcase className="w-6 h-6" />
        },
        {
            year: "2019",
            title: "Expansion",
            description: "Opened new offices in three cities and expanded our team to 50+ professionals. Series A funding of $5M secured.",
            icon: <Globe className="w-6 h-6" />
        },
        {
            year: "2021",
            title: "Product Launch",
            description: "Launched our flagship SaaS product, serving over 10,000 users worldwide. Reached profitability in Q3.",
            icon: <Zap className="w-6 h-6" />
        },
        {
            year: "2023",
            title: "Industry Recognition",
            description: "Received multiple industry awards and recognized as a market leader. Series B funding of $20M at $100M valuation.",
            icon: <Award className="w-6 h-6" />
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: "John Smith",
            position: "CEO, TechCorp",
            image: "https://picsum.photos/seed/client1/50/50.jpg",
            content: "Working with this team has been an absolute game-changer for our business. Their expertise and dedication are unmatched. They delivered our complex project ahead of schedule and under budget.",
            rating: 5,
            project: "Enterprise Cloud Migration"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            position: "Marketing Director, InnovateCo",
            image: "https://picsum.photos/seed/client2/50/50.jpg",
            content: "The team delivered exceptional results beyond our expectations. They truly understand our needs and deliver solutions that work. Our conversion rates increased by 40% after their redesign.",
            rating: 5,
            project: "E-commerce Platform Redesign"
        },
        {
            id: 3,
            name: "Michael Brown",
            position: "Founder, StartupXYZ",
            image: "https://picsum.photos/seed/client3/50/50.jpg",
            content: "From concept to execution, they were with us every step of the way. Our new platform has transformed how we do business. We couldn't have launched without their expertise.",
            rating: 5,
            project: "MVP Development & Launch"
        }
    ];

    const stats = [
        { value: "500+", label: "Happy Clients", icon: <Users className="w-6 h-6" /> },
        { value: "1000+", label: "Projects Completed", icon: <CheckCircle className="w-6 h-6" /> },
        { value: "50+", label: "Team Members", icon: <Briefcase className="w-6 h-6" /> },
        { value: "8", label: "Years of Excellence", icon: <Clock className="w-6 h-6" /> }
    ];

    const services = [
        {
            id: 1,
            title: "Web Development",
            description: "Custom web applications built with cutting-edge technologies",
            icon: <Code className="w-8 h-8" />,
            color: "#3B85FE"
        },
        {
            id: 2,
            title: "UI/UX Design",
            description: "Beautiful, intuitive interfaces that users love",
            icon: <Palette className="w-8 h-8" />,
            color: "#A9DBDC"
        },
        {
            id: 3,
            title: "Digital Marketing",
            description: "Strategic campaigns that drive growth and engagement",
            icon: <Megaphone className="w-8 h-8" />,
            color: "#6366F1"
        },
        {
            id: 4,
            title: "Cloud Solutions",
            description: "Scalable infrastructure that grows with your business",
            icon: <Cloud className="w-8 h-8" />,
            color: "#3B85FE"
        }
    ];

    const technologies = [
        { name: "React", level: 95 },
        { name: "Node.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Python", level: 80 },
        { name: "AWS", level: 88 },
        { name: "Docker", level: 75 }
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black" id="about">
            {/* Hero Section with Enhanced Orb Animation */}
            <motion.section
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{ opacity: heroOpacity, y: heroY }}
            >
                {/* Enhanced Orb Animation Background */}
                <div className="absolute inset-0 z-0">
                    {/* <OrbAnimation
                        hue={220}
                        hoverIntensity={0.3}
                        rotateOnHover={true}
                        forceHoverState={isHovered}
                        scale={1.2}
                        opacity={0.8}
                        autoRotate={true}
                        rotationSpeed={0.2}
                    /> */}
                </div>

                {/* Enhanced Content Overlay */}
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center px-4 py-2 backdrop-blur-sm rounded-full mb-6 border border-white/20 bg-white/5"
                    >
                        <Users className="w-4 h-4 mr-2 text-blue-300" />
                        <span className="text-sm font-medium text-blue-300">About Us</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 text-white"
                    >
                        We Create <span className="text-blue-400">Digital</span> Experiences
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl max-w-3xl mx-auto text-gray-300 mb-8"
                    >
                        We are a team of passionate creators, developers, and strategists dedicated to transforming ideas into powerful digital solutions that drive growth and innovation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Our Story
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </motion.button>
                        <motion.button
                            className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10 border-white/20"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Contact Us
                        </motion.button>
                    </motion.div>
                </div>

                {/* Enhanced Animated scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Enhanced Stats Section */}
            <section className="relative py-20 px-6 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Our <span className="text-blue-400">Impact</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Numbers that speak for themselves
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                                whileHover={{ y: -10 }}
                            >
                                <div className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5 h-full">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-500/20">
                                        {stat.icon}
                                    </div>
                                    <div className="text-4xl md:text-5xl font-bold mb-2 text-blue-400">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-300">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Our Story Section */}
            <section className="relative py-20 px-6 bg-gray-900">
                <div className="container mx-auto max-w-6xl z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                                Our <span className="text-blue-400">Story</span>
                            </h2>
                            <p className="text-lg text-gray-300 mb-6">
                                Founded in 2015, our journey began with a simple mission: to bridge the gap between innovative ideas and practical digital solutions. What started as a small team of passionate individuals has grown into a full-service digital agency serving clients worldwide.
                            </p>
                            <p className="text-lg text-gray-300 mb-6">
                                Over the years, we've helped hundreds of businesses transform their digital presence, streamline operations, and achieve remarkable growth. Our success is built on a foundation of technical expertise, creative thinking, and a deep understanding of our clients' needs.
                            </p>
                            <p className="text-lg text-gray-300 mb-8">
                                Today, we continue to push boundaries and explore new possibilities, always staying true to our core values of innovation, excellence, and integrity.
                            </p>
                            <motion.button
                                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center bg-gradient-to-r from-blue-500 to-purple-600"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Learn More
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </motion.button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative overflow-hidden rounded-2xl">
                                <img
                                    src="https://picsum.photos/seed/ourstory/800/600.jpg"
                                    alt="Our Story"
                                    className="w-full h-auto object-cover"
                                />
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"
                                    whileHover={{ opacity: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Enhanced Values Section */}
            <section className="relative py-20 px-6 bg-black">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Our <span className="text-blue-400">Values</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The principles that guide our work and define our culture.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5"
                                whileHover={{ y: -10 }}
                            >
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `${value.color}20` }}
                                >
                                    <div style={{ color: value.color }}>{value.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{value.title}</h3>
                                <p className="text-gray-300">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Team Section */}
            <section className="relative py-20 px-6 bg-gray-900">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Meet Our <span className="text-blue-400">Team</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The talented individuals behind our success.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative"
                                onMouseEnter={() => setActiveTeamMember(member.id)}
                                onMouseLeave={() => setActiveTeamMember(null)}
                            >
                                <div className="rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 bg-white/5"
                                    style={{
                                        transform: activeTeamMember === member.id ? 'translateY(-10px)' : 'translateY(0)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div className="relative overflow-hidden h-64">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: activeTeamMember === member.id ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                                        <p className="text-sm mb-4 text-blue-400">{member.position}</p>
                                        <p className="text-sm text-gray-300 mb-4">{member.bio}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {member.skills.map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex space-x-3">
                                            <motion.a
                                                href={member.social.twitter}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                                                whileHover={{ scale: 1.2, backgroundColor: '#3B85FE' }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Twitter className="w-4 h-4 text-white" />
                                            </motion.a>
                                            <motion.a
                                                href={member.social.linkedin}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                                                whileHover={{ scale: 1.2, backgroundColor: '#3B85FE' }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Linkedin className="w-4 h-4 text-white" />
                                            </motion.a>
                                            <motion.a
                                                href={member.social.github}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                                                whileHover={{ scale: 1.2, backgroundColor: '#3B85FE' }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Github className="w-4 h-4 text-white" />
                                            </motion.a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Timeline Section */}
            <section className="relative py-20 px-6 bg-black">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Our <span className="text-blue-400">Journey</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The milestones that shaped our company.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-700"></div>

                        {timeline.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                    <div className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5">
                                        <div className="flex items-center mb-2" style={{ justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-blue-500/20">
                                                {item.icon}
                                            </div>
                                            <span className="text-sm font-medium text-blue-400">{item.year}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                                        <p className="text-gray-300">{item.description}</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 bg-blue-500">
                                    <div className="w-3 h-3 rounded-full bg-white"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Testimonial Section */}
            <section className="relative py-20 px-6 bg-gray-900">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            What Our <span className="text-blue-400">Clients Say</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Don't just take our word for it. Here's what our clients have to say about working with us.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5"
                                whileHover={{ y: -10 }}
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 mr-1 text-blue-400" fill="#3B85FE" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 mb-4 text-blue-400 opacity-30" />
                                <p className="text-gray-300 mb-4">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-3"
                                        />
                                        <div>
                                            <h4 className="font-bold text-white">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-400">{testimonial.position}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-xs text-blue-400">{testimonial.project}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="relative py-20 px-6 bg-black">
                <div className="container mx-auto max-w-6xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="rounded-2xl p-12 text-center backdrop-blur-sm border border-white/10"
                        style={{
                            background: 'linear-gradient(135deg, rgba(59, 133, 254, 0.1), rgba(169, 219, 220, 0.1))'
                        }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                            Ready to Start Your <span className="text-blue-400">Journey</span> With Us?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Let's work together to bring your ideas to life and create something amazing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get In Touch
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </motion.button>
                            <motion.button
                                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10 border-white/20"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View Our Work
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center z-40 bg-blue-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronDown className="w-5 h-5 text-white rotate-180" />
                </motion.button>
            )}
        </div>
    );
};

export default AboutUs;