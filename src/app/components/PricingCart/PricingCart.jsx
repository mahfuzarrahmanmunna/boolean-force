// components/PricingCard.jsx
import React, { useState, useEffect } from 'react';
import { FaCheck, FaCode, FaRocket, FaShieldAlt, FaUsers, FaBolt, FaClock, FaStar, FaInfinity, FaHeadset, FaDatabase, FaCloud, FaGitAlt, FaReact, FaNodeJs, FaArrowRight, FaSpinner } from 'react-icons/fa';

// Icon mapping to convert string names to components
const iconMap = {
    FaCheck, FaCode, FaRocket, FaShieldAlt, FaUsers, FaBolt, FaClock, FaStar,
    FaInfinity, FaHeadset, FaDatabase, FaCloud, FaGitAlt, FaReact, FaNodeJs
};

// Helper function to render icon
const renderIcon = (iconName) => {
    if (typeof iconName === 'object') {
        // If it's already a component, return it
        return iconName;
    }

    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : <FaCheck />;
};

const PricingCard = () => {
    const [pricingData, setPricingData] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/pricing-plans');

                if (!response.ok) {
                    throw new Error('Failed to fetch pricing plans');
                }

                const data = await response.json();
                setPricingData(data);
            } catch (err) {
                console.error("Error fetching pricing plans:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPricingData();
    }, []);

    if (isLoading) {
        return (
            <div className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-cyan-400 mx-auto mb-4" />
                    <p className="text-white text-lg">Loading pricing plans...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center mb-6 gap-4">
                        <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                        <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">Pricing Plans</span>
                        <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Developer-Focused Solutions
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Build, scale, and deploy with confidence. Our plans are designed for developers who value quality, performance, and clean code.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {pricingData.map((plan) => {
                        const isMiddle = plan.highlight;
                        const isHovered = hoveredCard === plan._id;

                        return (
                            <div
                                key={plan._id}
                                className={`relative group ${isMiddle ? 'md:col-span-1 md:row-span-1' : ''}`}
                                onMouseEnter={() => setHoveredCard(plan._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Card Container with different sizes */}
                                <div
                                    className={`relative bg-gradient-to-br ${plan.gradient} backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 
                    hover:shadow-2xl border border-gray-700/50 h-full
                    ${isMiddle ? 'md:scale-105 md:shadow-2xl border-cyan-500/50 z-10' : 'hover:scale-[1.02]'}`}
                                >
                                    {/* Badge */}
                                    {plan.badge && plan.badge.text && (
                                        <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.badge.color} text-white px-4 py-2 rounded-bl-lg text-sm font-semibold z-10`}>
                                            {plan.badge.text}
                                        </div>
                                    )}

                                    {/* Glow effect for middle card */}
                                    {isMiddle && (
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                    )}

                                    {/* Card Content */}
                                    <div className={`p-6 md:p-8 flex flex-col h-full ${isMiddle ? 'md:p-10' : ''}`}>
                                        <div className="mb-6">
                                            <h3 className={`text-xl md:text-2xl font-bold text-white mb-1 ${isMiddle ? 'md:text-3xl' : ''}`}>{plan.name}</h3>
                                            <p className="text-gray-400 text-sm">{plan.subtitle}</p>
                                        </div>

                                        <div className="mb-6 flex items-baseline gap-2">
                                            {plan.originalPrice && <span className="text-gray-500 line-through text-lg">{plan.originalPrice}</span>}
                                            <span className={`text-4xl md:text-5xl font-bold text-white ${isMiddle ? 'md:text-6xl' : ''}`}>{plan.price}</span>
                                            {plan.priceUnit && <span className="text-gray-300">{plan.priceUnit}</span>}
                                        </div>

                                        <p className="text-gray-300 mb-8">{plan.description}</p>

                                        <div className={`border-t border-gray-700/50 pt-6 mb-8 flex-grow ${isMiddle ? 'md:pt-8' : ''}`}>
                                            <ul className="space-y-3">
                                                {plan.features && plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <span className={`text-cyan-400 mt-1 ${isMiddle ? 'text-lg' : ''}`}>
                                                            {renderIcon(feature.icon)}
                                                        </span>
                                                        <span className="text-gray-200">{feature.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            className={`w-full bg-gradient-to-r ${plan.buttonColor} hover:from-opacity-90 hover:to-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg group
                      ${isMiddle ? 'md:py-4 md:px-6 md:text-lg' : ''}`}
                                        >
                                            <span className="flex items-center justify-center">
                                                {plan.buttonText}
                                                <FaArrowRight className={`ml-2 transition-transform duration-300 group-hover:translate-x-1 ${isHovered ? 'translate-x-1' : ''}`} />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Additional Info Section */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center justify-center p-1 bg-gray-800/50 backdrop-blur-sm rounded-full">
                        <div className="flex items-center space-x-2 px-6 py-3">
                            <FaShieldAlt className="text-cyan-400" />
                            <span className="text-white font-medium">30-day money-back guarantee</span>
                        </div>
                        <div className="h-8 w-px bg-gray-700"></div>
                        <div className="flex items-center space-x-2 px-6 py-3">
                            <FaHeadset className="text-cyan-400" />
                            <span className="text-white font-medium">24/7 customer support</span>
                        </div>
                        <div className="h-8 w-px bg-gray-700"></div>
                        <div className="flex items-center space-x-2 px-6 py-3">
                            <FaBolt className="text-cyan-400" />
                            <span className="text-white font-medium">No hidden fees</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingCard;