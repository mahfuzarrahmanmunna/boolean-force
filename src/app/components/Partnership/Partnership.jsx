// components/Partnership.jsx
import React, { useState } from 'react';

const Partnership = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

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

    return (
        <div className=" py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
                                >
                                    <span className="relative z-10">{option.buttonText}</span>
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced CTA Section */}
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
                            <button classname=" cursor-pointerbg-gradient-to-r from-[#A9DBDC] to-[#3B85FE] hover:from-opacity-90 hover:to-opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg relative overflow-hidden group">
                                <span className="relative z-10">Get in Touch</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </button>

                            <button classname=" cursor-pointerbg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
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
        </div>
    );
};

export default Partnership;