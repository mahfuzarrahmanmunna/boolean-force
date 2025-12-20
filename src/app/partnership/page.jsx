"use client"

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

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

    const partnershipOptions = [
        {
            id: 1,
            icon: "🤝",
            title: "Agency Partnership",
            description: "Partner with us to offer comprehensive IT solutions to your clients. White-label our services and expand your portfolio.",
            features: [
                "40% Revenue Share",
                "White-label Solutions",
                "Joint Marketing Support",
                "Dedicated Partner Manager"
            ],
            buttonText: "Apply for Partnership",
            buttonColor: "from-[#3B85FE] to-[#2B6FDE]",
            bgPattern: "radial-gradient(circle at 10% 20%, rgba(59, 133, 254, 0.1) 0%, transparent 50%)",
            accentColor: "#3B85FE",
            detailedInfo: "Our agency partnership program is designed for marketing agencies, web development firms, and IT consultants looking to expand their service offerings without additional overhead. We provide comprehensive training, marketing materials, and dedicated support to ensure your success."
        },
        {
            id: 2,
            icon: "👨‍💻",
            title: "Freelancer Network",
            description: "Join our elite network of freelancers and work on exciting projects with guaranteed payments and professional growth.",
            features: [
                "Premium Project Access",
                "Guaranteed Payments",
                "Skill Development Programs",
                "Performance Bonuses"
            ],
            buttonText: "Join Network",
            buttonColor: "from-[#3B85FE] to-[#2B6FDE]",
            bgPattern: "radial-gradient(circle at 90% 80%, rgba(169, 219, 220, 0.1) 0%, transparent 50%)",
            accentColor: "#A9DBDC",
            detailedInfo: "Our freelancer network connects talented professionals with high-value projects. We handle the client acquisition, billing, and project management so you can focus on what you do best. Members receive exclusive access to training resources and community events."
        },
        {
            id: 3,
            icon: "⚡",
            title: "Tech Integration",
            description: "Integrate your technology solutions with our platform. API partnerships and custom integrations available.",
            features: [
                "API Access & Documentation",
                "Custom Integration Support",
                "Co-marketing Opportunities",
                "Technical Support"
            ],
            buttonText: "Explore Integration",
            buttonColor: "from-[#3B85FE] to-[#2B6FDE]",
            bgPattern: "radial-gradient(circle at 50% 50%, rgba(59, 133, 254, 0.1) 0%, transparent 50%)",
            accentColor: "#3B85FE",
            detailedInfo: "Our technology integration program is perfect for SaaS providers, tool developers, and platform companies looking to expand their ecosystem. We offer comprehensive API documentation, dedicated technical support, and joint marketing opportunities to maximize integration success."
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            position: "CEO, Digital Innovations Agency",
            content: "Partnering with BooleanForce has transformed our business. The white-label solutions allowed us to expand our service offerings overnight, and the dedicated partner manager has been invaluable.",
            avatar: "https://picsum.photos/seed/person1/200/200.jpg",
            rating: 5
        },
        {
            id: 2,
            name: "Michael Chen",
            position: "Full-Stack Developer",
            content: "Joining the freelancer network was the best career move I've made. The projects are challenging, the payments are always on time, and the skill development programs have helped me stay ahead of the curve.",
            avatar: "https://picsum.photos/seed/person2/200/200.jpg",
            rating: 5
        },
        {
            id: 3,
            name: "Alex Rodriguez",
            position: "CTO, TechSolutions Inc.",
            content: "The API integration was seamless, and the technical support team was incredibly responsive. Our integration has opened up new revenue streams and expanded our market reach significantly.",
            avatar: "https://picsum.photos/seed/person3/200/200.jpg",
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

        // Here you would normally send the data to your backend
        // For now, we'll simulate a form submission
        setFormStatus({
            submitted: true,
            success: true,
            message: 'Thank you for your partnership inquiry. We will get back to you soon!'
        });

        // Reset form
        setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            partnershipType: '',
            message: ''
        });

        // Scroll to top of form
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
                <title>Partnership Opportunities | BooleanForce</title>
                <meta name="description" content="Explore partnership opportunities with BooleanForce. Join our agency partnership, freelancer network, or tech integration programs." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Header Section */}
                        <motion.div
                            className="text-center mb-16"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.h1
                                className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300"
                                variants={itemVariants}
                            >
                                Partnership & Collaboration Opportunities
                            </motion.h1>
                            <motion.p
                                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                                variants={itemVariants}
                            >
                                Join forces with BooleanForce to expand your reach, enhance your services, and create mutual growth opportunities.
                            </motion.p>
                            <motion.div
                                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                                variants={itemVariants}
                            >
                                <button className=" cursor-pointerbg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    Explore Partnerships
                                </button>
                                <button className=" cursor-pointerbg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                                    Schedule a Call
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Partnership Tabs */}
                        <motion.div
                            className="mb-16"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <div className="flex flex-wrap justify-center mb-8 border-b border-white/10">
                                {partnershipOptions.map((option, index) => (
                                    <button
                                        key={option.id}
                                        className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${activeTab === index ? 'text-white border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setActiveTab(index)}
                                    >
                                        {option.title}
                                    </button>
                                ))}
                            </div>

                            <motion.div
                                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
                                variants={itemVariants}
                                key={activeTab}
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/3">
                                        <div className="text-6xl mb-4 text-center md:text-left">{partnershipOptions[activeTab].icon}</div>
                                        <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-left">{partnershipOptions[activeTab].title}</h3>
                                        <p className="text-gray-300 mb-6 text-center md:text-left">{partnershipOptions[activeTab].detailedInfo}</p>
                                        <button
                                            className={`w-full bg-gradient-to-r ${partnershipOptions[activeTab].buttonColor} hover:from-opacity-90 hover:to-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg`}
                                            onClick={() => setFormData(prev => ({ ...prev, partnershipType: partnershipOptions[activeTab].title }))}
                                        >
                                            {partnershipOptions[activeTab].buttonText}
                                        </button>
                                    </div>
                                    <div className="md:w-2/3">
                                        <h4 className="text-xl font-semibold text-white mb-4">Key Benefits</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {partnershipOptions[activeTab].features.map((feature, index) => (
                                                <div key={index} className="flex items-start">
                                                    <svg className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    <span className="text-gray-200">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Partnership Cards */}
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
                                Why Partner With BooleanForce?
                            </motion.h2>
                            <motion.p
                                className="text-xl text-gray-300 max-w-2xl mx-auto"
                                variants={itemVariants}
                            >
                                We're committed to creating mutually beneficial partnerships that drive growth and innovation.
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
                                    className={`relative group backdrop-blur-lg bg-white/5 rounded-2xl shadow-xl overflow-hidden border border-white/10 hover:border-white/20 ${hoveredCard === option.id ? 'shadow-2xl' : ''}`}
                                    style={{ background: option.bgPattern }}
                                    onMouseEnter={() => setHoveredCard(option.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    variants={itemVariants}
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Animated border effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>

                                    {/* Card content */}
                                    <div className="p-8 h-full flex flex-col relative z-10">
                                        {/* Icon with animation */}
                                        <div className="text-5xl mb-6 flex justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                            {option.icon}
                                        </div>

                                        {/* Title with gradient effect */}
                                        <h3 className="text-2xl font-bold text-white mb-4 text-center">{option.title}</h3>

                                        {/* Description */}
                                        <p className="text-gray-300 mb-6 text-center">{option.description}</p>

                                        {/* Features list */}
                                        <div className="border-t border-white/10 pt-6 mb-8 flex-grow">
                                            <ul className="space-y-3">
                                                {option.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start transform transition-transform duration-300 hover:translate-x-1">
                                                        <span className="text-cyan-400 mr-3 mt-1">✓</span>
                                                        <span className="text-gray-200">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Button with enhanced hover effect */}
                                        <button
                                            className={`w-full bg-gradient-to-r ${option.buttonColor} hover:from-opacity-90 hover:to-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg relative overflow-hidden group`}
                                            onClick={() => setFormData(prev => ({ ...prev, partnershipType: option.title }))}
                                        >
                                            <span className="relative z-10">{option.buttonText}</span>
                                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials Section */}
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
                                What Our Partners Say
                            </motion.h2>
                            <motion.p
                                className="text-xl text-gray-300 max-w-2xl mx-auto"
                                variants={itemVariants}
                            >
                                Don't just take our word for it. Hear from our successful partners.
                            </motion.p>
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
                                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center mb-4">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
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
                <section className="py-16 px-4 sm:px-6 lg:px-8">
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
                                Start Your Partnership Journey
                            </motion.h2>
                            <motion.p
                                className="text-xl text-gray-300 max-w-2xl mx-auto"
                                variants={itemVariants}
                            >
                                Fill out the form below and our partnership team will get in touch with you within 24 hours.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={itemVariants}
                        >
                            {formStatus.submitted && (
                                <div className={`p-4 rounded-lg mb-6 ${formStatus.success ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                                    {formStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Your Company"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                                </svg>
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-300 mb-2">Partnership Type</label>
                                    <select
                                        id="partnershipType"
                                        name="partnershipType"
                                        value={formData.partnershipType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="" className="bg-slate-800">Select a partnership type</option>
                                        <option value="Agency Partnership" className="bg-slate-800">Agency Partnership</option>
                                        <option value="Freelancer Network" className="bg-slate-800">Freelancer Network</option>
                                        <option value="Tech Integration" className="bg-slate-800">Tech Integration</option>
                                        <option value="Other" className="bg-slate-800">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Tell us about your business</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                        </div>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Tell us about your business and why you're interested in partnering with us..."
                                        ></textarea>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                                >
                                    Submit Partnership Inquiry
                                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </section>

                {/* Enhanced CTA Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-lg border border-white/10 p-12 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                            </div>

                            <div className="relative z-10">
                                <motion.h2
                                    className="text-3xl md:text-4xl font-bold text-white mb-6"
                                    variants={itemVariants}
                                >
                                    Ready to Partner With Us?
                                </motion.h2>
                                <motion.p
                                    className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                                    variants={itemVariants}
                                >
                                    Whether you're an agency, freelancer, or tech provider, we have a partnership opportunity that fits your needs.
                                </motion.p>

                                <motion.div
                                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                                    variants={itemVariants}
                                >
                                    <button className=" cursor-pointerbg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg relative overflow-hidden group">
                                        <span className="relative z-10 flex items-center">
                                            Get in Touch
                                            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    </button>

                                    <button className=" cursor-pointerbg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center">
                                        Download Partnership Guide
                                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                        </svg>
                                    </button>
                                </motion.div>

                                {/* Stats */}
                                <motion.div
                                    className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8"
                                    variants={itemVariants}
                                >
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-cyan-300 mb-2">500+</div>
                                        <div className="text-gray-300">Active Partners</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-cyan-300 mb-2">$2M+</div>
                                        <div className="text-gray-300">Revenue Shared</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-cyan-300 mb-2">98%</div>
                                        <div className="text-gray-300">Satisfaction Rate</div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default PartnershipPage;