"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
    ArrowRight, 
    Check, 
    ChevronRight, 
    Users, 
    Network, 
    Cpu,
    Target,
    Zap,
    TrendingUp,
    BookOpen,
    Rocket,
    Mail,
    Phone,
    Calendar,
    Send,
    Linkedin,
    Twitter,
    Instagram
} from 'lucide-react';

const PartnershipPage = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        partnershipType: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({
        submitted: false,
        success: false,
        message: ''
    });
    const [activeTab, setActiveTab] = useState(0);

    // Partnership Types based on provided content
    const partnershipOptions = [
        {
            id: 1,
            icon: "🤝",
            title: "Strategic Alliance",
            formula: "(Shared_Vision + Joint_Execution) == Market_Leadership",
            description: "We team up with brands and businesses for long-term, high-velocity projects. This is deep-tier collaboration; think joint product development and cross-market disruption rather than simple outsourcing.",
            features: [
                "Shared Vision & Goals",
                "High-Impact Projects",
                "Innovation Together",
                "Relationship-Driven"
            ],
            buttonText: "Explore Strategic Alliance",
            buttonColor: "from-blue-500 to-purple-600",
            bgPattern: "radial-gradient(circle at 10% 20%, rgba(59, 133, 254, 0.1) 0%, transparent 50%)",
            accentColor: "#3B85FE",
            detailedInfo: "Perfect for established brands and businesses looking for deep collaboration on high-impact projects. We work as an extension of your team, sharing vision and goals to create market-leading solutions."
        },
        {
            id: 2,
            icon: "🔗",
            title: "Referral Network",
            formula: "(Your_Network + Our_Stack) == Mutual_ROI",
            description: "Ideal for consultants and agencies looking to integrate premium design and development into their own service offerings. Refer clients to a trusted technical partner and earn rewards through a transparent, win-win logic.",
            features: [
                "Earn While You Refer",
                "Expand Your Service Offerings",
                "Trusted Collaboration",
                "Win-Win Partnerships"
            ],
            buttonText: "Join Referral Network",
            buttonColor: "from-green-500 to-teal-600",
            bgPattern: "radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
            accentColor: "#10B981",
            detailedInfo: "Designed for consultants, agencies, and industry influencers who want to expand their service offerings. Earn rewards while providing your clients with premium technical solutions."
        },
        {
            id: 3,
            icon: "⚡",
            title: "Technology Integration",
            formula: "(Your_SaaS + Our_API) == Seamless_UX",
            description: "We collaborate with tech providers and tool-builders to create white-labeled solutions and native integrations. Let's combine your platform with our engineering force to build tools that work better together.",
            features: [
                "Seamless Integrations",
                "Co-Built Solutions",
                "Access to Technical Expertise",
                "Mutual Growth"
            ],
            buttonText: "Explore Integration",
            buttonColor: "from-purple-500 to-pink-600",
            bgPattern: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
            accentColor: "#8B5CF6",
            detailedInfo: "Perfect for SaaS providers, platform companies, and tool-builders looking to expand their ecosystem through seamless integrations and co-built solutions."
        }
    ];

    // Why Partner With Us section based on provided content
    const whyPartnerFeatures = [
        {
            icon: <Target className="w-6 h-6 text-blue-400" />,
            title: "Shared Ambition",
            description: "We integrate with founders and creators who treat design and tech as non-negotiables. We don't just add value; we multiply your market impact through shared objectives.",
            result: "Impact = (Your_Vision * Boolean_Force)"
        },
        {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: "Flexible Collaboration",
            description: "Our partnership model is built to be elastic. Whether you need an end-to-end digital studio or a specialized development ally, we adapt our workflow to fit your internal logic.",
            result: "Structure = Dynamic"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-green-400" />,
            title: "Growth Through Innovation",
            description: "We fuse strategic foresight with technical execution. By mapping your vision to our engineering stack, we deliver scalable solutions that provide measurable, real-world ROI.",
            result: "Efficiency = MAX"
        },
        {
            icon: <BookOpen className="w-6 h-6 text-purple-400" />,
            title: "Mutual Learning",
            description: "We treat every partnership as a two-way data exchange. As we architect your product, we iterate and evolve together, ensuring the final deployment is smarter than the initial brief.",
            result: "Evolution = Constant"
        }
    ];

    // How We Work section based on provided content
    const howWeWorkSteps = [
        {
            step: 1,
            title: "Discovery",
            description: "We deep-dive into your vision to map the variables, solve for pain points, and define your core objectives.",
            icon: "🔍"
        },
        {
            step: 2,
            title: "Strategic Logic",
            description: "We co-create a high-velocity roadmap, establishing clear milestones, success metrics, and delivery timelines.",
            icon: "🧠"
        },
        {
            step: 3,
            title: "Iterative Execution",
            description: "Our team engineers the solution through transparent feedback loops, rapid prototyping, and constant design reviews.",
            icon: "⚙️"
        },
        {
            step: 4,
            title: "Deployment & Scale",
            description: "We push to production and stay synced; optimizing, evolving, and scaling your system as your user base grows.",
            icon: "🚀"
        }
    ];

    // Testimonials based on provided content
    const testimonials = [
        {
            id: 1,
            name: "Ayan Rahman",
            position: "Founder, BusinessNest",
            content: "Collaborating with BooleanForce was refreshing. They brought fresh ideas, technical expertise, and a real sense of ownership to our project.",
            avatar: null,
            rating: 5
        },
        {
            id: 2,
            name: "Farzana Akter",
            position: "CEO, BrandHive",
            content: "As a referral partner, working with them is seamless. They deliver quality work, communicate clearly, and always respect timelines.",
            avatar: null,
            rating: 5
        },
        {
            id: 3,
            name: "Rafiul Islam",
            position: "CTO, TechBridge",
            content: "BooleanForce helped us integrate our platform with their design and development solutions smoothly. Their team is professional, flexible, and solution-oriented.",
            avatar: null,
            rating: 5
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({
            submitted: true,
            success: true,
            message: 'Thank you for your partnership inquiry. We will get back to you within one business cycle!'
        });
        setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            partnershipType: '',
            message: ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <>
            <Head>
                <title>Partnership Opportunities | BooleanForce - Initialize a High-Impact Partnership</title>
                <meta name="description" content="BooleanForce is seeking visionary partners, bold innovators, and technical experts to scale the next generation of digital products. Explore strategic alliances, referral networks, and technology integrations." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                {/* Hero Section - Using provided content */}
                <section className="relative overflow-hidden pt-20  px-4 sm:px-6 lg:px-8">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div
                            className="text-center mb-16"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.h1
                                className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
                                variants={itemVariants}
                            >
                                Initialize a High-Impact Partnership
                            </motion.h1>
                            <motion.p
                                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
                                variants={itemVariants}
                            >
                                We don't just provide services; we build ecosystems. BooleanForce is seeking visionary partners, bold innovators, and technical experts to scale the next generation of digital products.
                            </motion.p>
                            <motion.div
                                className="bg-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 max-w-2xl mx-auto mb-8 font-mono text-left"
                                variants={itemVariants}
                            >
                                <p className="text-blue-300 text-lg">
                                    <span className="text-yellow-300">IF</span> (Your_Ambition == TRUE) <span className="text-yellow-300">&amp;&amp;</span> (Our_Logic == TRUE) <span className="text-yellow-300">THEN</span><br />
                                    <span className="text-green-400 text-xl ml-4">Impact = UNSTOPPABLE</span>
                                </p>
                            </motion.div>
                            <motion.div
                                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                                variants={itemVariants}
                            >
                                <a
                                    href="#partnership-form"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                                >
                                    Initialize Connection
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                                <a
                                    href="#why-partner"
                                    className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Learn More
                                </a>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Partnership Types Section - Using provided content */}
                <section id="partnership-types" className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                variants={itemVariants}
                            >
                                The Collaboration Framework
                            </motion.h2>
                            <motion.p
                                className="text-xl text-gray-300 max-w-2xl mx-auto"
                                variants={itemVariants}
                            >
                                Choose the partnership model that aligns with your goals
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {partnershipOptions.map((option) => (
                                <motion.div
                                    key={option.id}
                                    className={`relative group backdrop-blur-lg bg-white/5 rounded-2xl shadow-xl overflow-hidden border border-white/10 hover:border-white/20 ${hoveredCard === option.id ? 'shadow-2xl scale-[1.02]' : ''}`}
                                    style={{ background: option.bgPattern }}
                                    onMouseEnter={() => setHoveredCard(option.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    variants={itemVariants}
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Animated border effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>

                                    <div className="p-8 h-full flex flex-col relative z-10">
                                        {/* Icon */}
                                        <div className="text-5xl mb-4 flex justify-center transform transition-transform duration-300 group-hover:scale-110">
                                            {option.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-bold text-white mb-3 text-center">{option.title}</h3>

                                        {/* Formula */}
                                        <div className="bg-black/30 rounded-lg p-3 mb-4 border border-white/10">
                                            <p className="text-cyan-300 text-sm font-mono text-center">
                                                {option.formula}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-300 mb-6 text-sm">{option.description}</p>

                                        {/* Features */}
                                        <div className="border-t border-white/10 pt-6 mb-6 flex-grow">
                                            <h4 className="text-white font-semibold mb-3">Key Benefits:</h4>
                                            <ul className="space-y-2">
                                                {option.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <Check className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                                                        <span className="text-gray-200 text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Button */}
                                        <a
                                            href="#partnership-form"
                                            className={`w-full bg-gradient-to-r ${option.buttonColor} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg text-center`}
                                            onClick={() => setFormData(prev => ({ ...prev, partnershipType: option.title }))}
                                        >
                                            {option.buttonText}
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Why Partner With Us Section - Using provided content */}
                <section id="why-partner" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                variants={itemVariants}
                            >
                                The Force Multiplier for Your Vision
                            </motion.h2>
                            <motion.p
                                className="text-xl text-gray-300 max-w-2xl mx-auto"
                                variants={itemVariants}
                            >
                                Why Sync with BooleanForce?
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {whyPartnerFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
                                    variants={itemVariants}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                                            {feature.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                            <p className="text-gray-300 mb-3">{feature.description}</p>
                                            <div className="bg-black/30 rounded-lg p-2 inline-block">
                                                <p className="text-cyan-300 font-mono text-sm">{feature.result}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* How We Work Section - The Build Pipeline */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                variants={itemVariants}
                            >
                                From Initialization to Scale
                            </motion.h2>
                            <motion.p
                                className="text-xl text-gray-300 max-w-2xl mx-auto"
                                variants={itemVariants}
                            >
                                Our proven build pipeline ensures successful partnerships
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {howWeWorkSteps.map((step) => (
                                <motion.div
                                    key={step.step}
                                    className="relative bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
                                    variants={itemVariants}
                                >
                                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {step.step}
                                    </div>
                                    <div className="text-4xl mb-4 mt-2">{step.icon}</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                                    <p className="text-gray-300 text-sm">{step.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials Section - Using provided content */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                variants={itemVariants}
                            >
                                What Our Partners Say About Us
                            </motion.h2>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {testimonials.map((testimonial) => (
                                <motion.div
                                    key={testimonial.id}
                                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{testimonial.name}</h4>
                                            <p className="text-gray-400 text-sm">{testimonial.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 italic">"{testimonial.content}"</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Partnership Form Section */}
                <section id="partnership-form" className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            className="text-center mb-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                variants={itemVariants}
                            >
                                Let's Grow Together
                            </motion.h2>
                            <motion.p
                                className="text-xl text-gray-300 max-w-2xl mx-auto"
                                variants={itemVariants}
                            >
                                If you're ready to build something more than just a website, if you want to create experiences, solve real problems, and grow with purpose - we would love to talk.
                            </motion.p>
                             <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                                    >
                                        Partner With Us
                                        <Send className="ml-2 w-4 h-4" />
                                    </button>
                                    <a
                                        href="#consult"
                                        className="flex-1 py-3 px-4 bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                                    >
                                        Talk To Our Team
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </a>
                                </div>
                        </motion.div>

                      
                    </div>
                </section>

              
            </div>
        </>
    );
};

export default PartnershipPage;