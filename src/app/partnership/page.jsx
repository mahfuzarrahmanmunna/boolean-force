"use client"

import React, { useState } from 'react';
import Head from 'next/head';

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
            accentColor: "#3B85FE"
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
            accentColor: "#A9DBDC"
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
            accentColor: "#3B85FE"
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
    };

    return (
        <>
            <Head>
                <title>Partnership Opportunities | BooleanForce</title>
                <meta name="description" content="Explore partnership opportunities with BooleanForce. Join our agency partnership, freelancer network, or tech integration programs." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen ">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3B85FE] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A9DBDC] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Header Section */}
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#A9DBDC]">
                                Partnership & Collaboration Opportunities
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Join forces with BooleanForce to expand your reach, enhance your services, and create mutual growth opportunities.
                            </p>
                        </div>

                        {/* Partnership Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {partnershipOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`relative group backdrop-blur-lg bg-white/5 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 border border-white/10 hover:border-white/20 ${hoveredCard === option.id ? 'shadow-2xl' : ''
                                        }`}
                                    style={{ background: option.bgPattern }}
                                    onMouseEnter={() => setHoveredCard(option.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
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
                                                        <span className="text-[#A9DBDC] mr-3 mt-1">✅</span>
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
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Partnership Form Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Partnership Journey</h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Fill out the form below and our partnership team will get in touch with you within 24 hours.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                            {formStatus.submitted && (
                                <div className={`p-4 rounded-lg mb-6 ${formStatus.success ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                                    {formStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Your Company"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="+1 (555) 123-4567"
                                        />
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
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Tell us about your business and why you're interested in partnering with us..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-[#3B85FE] to-[#2B6FDE] text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Submit Partnership Inquiry
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Enhanced CTA Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3B85FE]/20 to-[#A9DBDC]/20 backdrop-blur-lg border border-white/10 p-12 text-center">
                            {/* Background decoration */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#3B85FE] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#A9DBDC] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Partner With Us?</h2>
                                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    Whether you're an agency, freelancer, or tech provider, we have a partnership opportunity that fits your needs.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <button className="bg-gradient-to-r from-[#A9DBDC] to-[#3B85FE] hover:from-opacity-90 hover:to-opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg relative overflow-hidden group">
                                        <span className="relative z-10">Get in Touch</span>
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    </button>

                                    <button className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                                        Download Partnership Guide
                                    </button>
                                </div>

                                {/* Stats or testimonials could go here */}
                                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#A9DBDC] mb-2">500+</div>
                                        <div className="text-gray-300">Active Partners</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#A9DBDC] mb-2">$2M+</div>
                                        <div className="text-gray-300">Revenue Shared</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#A9DBDC] mb-2">98%</div>
                                        <div className="text-gray-300">Satisfaction Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default PartnershipPage;