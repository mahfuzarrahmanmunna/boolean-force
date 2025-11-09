// components/PricingCard.jsx
import React, { useState, useEffect } from 'react';
import { FaCheck, FaCode, FaRocket, FaShieldAlt, FaUsers, FaBolt, FaClock, FaStar, FaInfinity, FaHeadset, FaDatabase, FaCloud, FaGitAlt, FaReact, FaNodeJs } from 'react-icons/fa';

const PricingCard = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [hoveredCard, setHoveredCard] = useState(null);

    // Enhanced pricing data with more developer-focused details
    const pricingData = [
        {
            id: 1,
            name: "Starter",
            subtitle: "Perfect for indie developers",
            price: "$2,999",
            priceUnit: "/project",
            originalPrice: "$4,999",
            description: "Launch your project with professional-grade development and modern tech stack.",
            badge: {
                text: "MOST POPULAR",
                color: "from-purple-600 to-indigo-600"
            },
            features: [
                { text: "Custom Web Application", icon: <FaCode /> },
                { text: "React/Vue.js Frontend", icon: <FaReact /> },
                { text: "Node.js/Python Backend", icon: <FaNodeJs /> },
                { text: "MongoDB/PostgreSQL Database", icon: <FaDatabase /> },
                { text: "Basic CI/CD Pipeline", icon: <FaGitAlt /> },
                { text: "3 Months Technical Support", icon: <FaHeadset /> },
                { text: "48hr Delivery Guarantee", icon: <FaClock /> }
            ],
            buttonText: "Start Building",
            buttonColor: "from-purple-600 to-indigo-600",
            isPopular: true,
            gradient: "from-purple-900/20 to-indigo-900/20"
        },
        {
            id: 2,
            name: "Professional",
            subtitle: "For growing tech teams",
            price: "$7,999",
            priceUnit: "/project",
            originalPrice: "$12,999",
            description: "Complete solution for scaling applications with enterprise architecture.",
            badge: {
                text: "BEST VALUE",
                color: "from-cyan-600 to-blue-600"
            },
            features: [
                { text: "Everything in Starter", icon: <FaCheck /> },
                { text: "Microservices Architecture", icon: <FaCloud /> },
                { text: "Advanced CI/CD with Testing", icon: <FaGitAlt /> },
                { text: "Containerization (Docker)", icon: <FaBolt /> },
                { text: "Cloud Deployment (AWS/Azure)", icon: <FaCloud /> },
                { text: "12 Months Priority Support", icon: <FaHeadset /> },
                { text: "24hr Priority Delivery", icon: <FaClock /> },
                { text: "Performance Optimization", icon: <FaRocket /> }
            ],
            buttonText: "Scale Up",
            buttonColor: "from-cyan-600 to-blue-600",
            isBestValue: true,
            gradient: "from-cyan-900/20 to-blue-900/20"
        },
        {
            id: 3,
            name: "Enterprise",
            subtitle: "For large organizations",
            price: "Custom",
            priceUnit: "",
            originalPrice: "",
            description: "Tailored enterprise solutions with dedicated development teams.",
            badge: {
                text: "ENTERPRISE",
                color: "from-gray-700 to-gray-900"
            },
            features: [
                { text: "Everything in Professional", icon: <FaCheck /> },
                { text: "Dedicated Development Team", icon: <FaUsers /> },
                { text: "Multi-region Infrastructure", icon: <FaCloud /> },
                { text: "Advanced Security & Compliance", icon: <FaShieldAlt /> },
                { text: "Custom API Development", icon: <FaCode /> },
                { text: "Unlimited Support & Maintenance", icon: <FaInfinity /> },
                { text: "On-site Team Option", icon: <FaUsers /> },
                { text: "Custom SLA Agreements", icon: <FaStar /> }
            ],
            buttonText: "Contact Sales",
            buttonColor: "from-gray-700 to-gray-900",
            isEnterprise: true,
            gradient: "from-gray-800/20 to-gray-900/20"
        }
    ];

    useEffect(() => {
        // Set the target date to 7 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            {/* <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            </div> */}

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center mb-6">
                        <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-cyan-500 mr-4"></div>
                        <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">Pricing Plans</span>
                        <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-purple-500 ml-4"></div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Developer-Focused Solutions
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Build, scale, and deploy with confidence. Our plans are designed for developers who value quality, performance, and clean code.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {pricingData.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-gradient-to-br ${plan.gradient} backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border ${plan.isBestValue
                                ? 'border-2 border-cyan-500/50 shadow-cyan-500/20'
                                : 'border border-gray-700/50'
                                }`}
                            onMouseEnter={() => setHoveredCard(plan.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Badge */}
                            <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.badge.color} text-white px-4 py-2 rounded-bl-lg text-sm font-semibold z-10`}>
                                {plan.badge.text}
                            </div>

                            {/* Card Content */}
                            <div className="p-8 h-full flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                                    <p className="text-gray-400 text-sm">{plan.subtitle}</p>
                                </div>

                                <div className="mb-6 flex items-baseline">
                                    {plan.originalPrice && (
                                        <span className="text-gray-500 line-through mr-2 text-lg">{plan.originalPrice}</span>
                                    )}
                                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                                    {plan.priceUnit && <span className="text-gray-300 ml-2">{plan.priceUnit}</span>}
                                </div>

                                <p className="text-gray-300 mb-8">{plan.description}</p>

                                <div className="border-t border-gray-700/50 pt-6 mb-8 flex-grow">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-cyan-400 mr-3 mt-1 flex-shrink-0">
                                                    {feature.icon}
                                                </span>
                                                <span className="text-gray-200">{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    className={`w-full bg-gradient-to-r ${plan.buttonColor} hover:from-opacity-90 hover:to-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg ${hoveredCard === plan.id ? 'shadow-white/20' : ''
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Limited Time Offer Section */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-center shadow-2xl border border-gray-700/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-3xl mr-3">🔥</span>
                            <h2 className="text-3xl font-bold text-white">LIMITED TIME OFFER</h2>
                        </div>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Get 50% OFF your first project + FREE consultation with our senior developers
                        </p>
                        <div className="flex items-center justify-center mb-6">
                            <span className="text-2xl text-orange-400 mr-3">⏰</span>
                            <p className="text-xl text-white">Offer expires in:</p>
                        </div>
                        <div className="flex justify-center space-x-4 mb-8">
                            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 min-w-[90px] border border-gray-700/50">
                                <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                                <div className="text-sm text-gray-400">Days</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 min-w-[90px] border border-gray-700/50">
                                <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                                <div className="text-sm text-gray-400">Hours</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 min-w-[90px] border border-gray-700/50">
                                <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                                <div className="text-sm text-gray-400">Minutes</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 min-w-[90px] border border-gray-700/50">
                                <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                                <div className="text-sm text-gray-400">Seconds</div>
                            </div>
                        </div>
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-red-500/20">
                            Claim Your Discount
                        </button>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400">
                    <div className="flex items-center">
                        <FaShieldAlt className="text-cyan-400 mr-2" />
                        <span>Secure Development</span>
                    </div>
                    <div className="flex items-center">
                        <FaRocket className="text-purple-400 mr-2" />
                        <span>Fast Deployment</span>
                    </div>
                    <div className="flex items-center">
                        <FaHeadset className="text-blue-400 mr-2" />
                        <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-2" />
                        <span>5-Star Rated</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingCard;