// components/ServiceTemplate.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaArrowRight, FaStar, FaLightbulb } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import DarkVeil from '../ui/ServiceTemplate/DarkVeil';
import AnimatedBanner from './AnimatedBanner';

const ServiceTemplates = ({ serviceData }) => {
    const [mounted, setMounted] = useState(false);
    const [visibleSections, setVisibleSections] = useState({});
    const sectionRefs = useRef([]);

    useEffect(() => {
        setMounted(true);

        // Set up intersection observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => ({
                            ...prev,
                            [entry.target.dataset.section]: true
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe all sections
        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    // Render different section types based on data
    const renderSection = (section, index) => {
        const isVisible = visibleSections[`section-${index}`];
        const sectionKey = `section-${index}`;

        switch (section.type) {
            case 'hero':
                return (
                    <section
                        key={index}
                        className="relative h-screen flex items-center justify-center overflow-hidden"
                        ref={(el) => (sectionRefs.current[index] = el)}
                        data-section={sectionKey}
                    >
                        <div className="absolute inset-0 z-0">
                            {/* <DarkVeil
                                hueShift={section.data.hueShift}
                                noiseIntensity={0.05}
                                scanlineIntensity={0.1}
                                speed={0.5}
                                scanlineFrequency={100}
                                warpAmount={0.05}
                            /> */}
                            <AnimatedBanner />
                        </div>

                        <div className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}>
                            <div className={`mb-6 flex justify-center transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                                }`}>
                                <div className={`w-20 h-20 bg-gradient-to-br ${section.data.iconGradient} rounded-full flex items-center justify-center animate-pulse`}>
                                    <div className="text-3xl text-white">
                                        {section.data.icon}
                                    </div>
                                </div>
                            </div>
                            <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${section.data.textGradient} transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}>
                                {section.data.title}
                            </h1>
                            <p className={`text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto transition-all duration-1000 delay-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}>
                                {section.data.subtitle}
                            </p>
                            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}>
                                <Link href="/contact" className={`px-8 py-3 ${section.data.primaryButtonColor} text-white rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group`}>
                                    {section.data.primaryButtonText}
                                    <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                                <Link href={section.data.secondaryButtonLink} className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center group">
                                    {section.data.secondaryButtonText}
                                    <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
                                </Link>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </section>
                );

            case 'overview':
                return (
                    <section
                        key={index}
                        className="py-20 px-6"
                        ref={(el) => (sectionRefs.current[index] = el)}
                        data-section={sectionKey}
                    >
                        <div className="container mx-auto max-w-6xl">
                            <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                                }`}>
                                <div>
                                    <h2 className="text-4xl font-bold mb-6">{section.data.title}</h2>
                                    <p className="text-lg text-gray-300 mb-6">
                                        {section.data.description1}
                                    </p>
                                    <p className="text-lg text-gray-300 mb-8">
                                        {section.data.description2}
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        {section.data.keyPoints.map((point, i) => (
                                            <div key={i} className={`flex items-start transition-all duration-500 delay-${i * 100} transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                                                }`}>
                                                <FaCheckCircle className={`${serviceData.colors.accent} mt-1 mr-3`} />
                                                <div>
                                                    <h3 className="font-semibold mb-1">{point.title}</h3>
                                                    <p className="text-gray-400 text-sm">{point.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-lg">
                                    <div className={`w-full h-96 rounded-lg overflow-hidden transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                        }`}>
                                        <Image
                                            src={section.data.image}
                                            alt={section.data.imageAlt}
                                            fill
                                            className="object-cover"
                                            unoptimized={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );

            case 'process':
                return (
                    <section
                        key={index}
                        className="py-20 px-6 bg-gray-800 bg-opacity-50"
                        ref={(el) => (sectionRefs.current[index] = el)}
                        data-section={sectionKey}
                    >
                        <div className="container mx-auto max-w-6xl">
                            <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}>
                                <h2 className="text-4xl font-bold mb-4">{section.data.title}</h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    {section.data.subtitle}
                                </p>
                            </div>
                            <div className="grid md:grid-cols-4 gap-8">
                                {section.data.steps.map((step, i) => (
                                    <div
                                        key={i}
                                        className={`text-center transition-all duration-700 delay-${i * 150} transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                            }`}
                                    >
                                        <div className={`w-16 h-16 ${serviceData.colors.accentBg} rounded-full flex items-center justify-center mx-auto mb-4 relative group`}>
                                            <span className={`text-2xl font-bold ${serviceData.colors.accent}`}>{i + 1}</span>
                                            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors duration-300">{step.title}</h3>
                                        <p className="text-gray-400">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'features':
                return (
                    <section
                        key={index}
                        className="py-20 px-6"
                        ref={(el) => (sectionRefs.current[index] = el)}
                        data-section={sectionKey}
                    >
                        <div className="container mx-auto max-w-6xl">
                            <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}>
                                <h2 className="text-4xl font-bold mb-4">{section.data.title}</h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    {section.data.subtitle}
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.data.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`bg-gray-800 rounded-lg p-6 transition-all duration-700 delay-${i * 100} transform hover:scale-105 hover:shadow-xl hover:bg-gray-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                            }`}
                                    >
                                        <div className={`w-16 h-16 ${serviceData.colors.accentBg} rounded-lg flex items-center justify-center mb-4 relative group`}>
                                            <div className={`text-2xl ${serviceData.colors.accent} transition-transform duration-300 group-hover:scale-110`}>
                                                {item.icon}
                                            </div>
                                            <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors duration-300">{item.name}</h3>
                                        <p className="text-gray-400">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'benefits':
                return (
                    <section
                        key={index}
                        className="py-20 px-6 bg-gray-800 bg-opacity-50"
                        ref={(el) => (sectionRefs.current[index] = el)}
                        data-section={sectionKey}
                    >
                        <div className="container mx-auto max-w-6xl">
                            <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}>
                                <h2 className="text-4xl font-bold mb-4">{section.data.title}</h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    {section.data.subtitle}
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.data.items.map((benefit, i) => (
                                    <div
                                        key={i}
                                        className={`bg-gray-800 rounded-lg p-6 transition-all duration-700 delay-${i * 100} transform hover:scale-105 hover:shadow-xl hover:bg-gray-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 ${serviceData.colors.accentBg} rounded-lg flex items-center justify-center mb-4 relative group`}>
                                            <FaLightbulb className={`text-xl ${serviceData.colors.accent} transition-transform duration-300 group-hover:rotate-12`} />
                                            <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors duration-300">{benefit.title}</h3>
                                        <p className="text-gray-400">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'testimonials':
                return (
                    <section
                        key={index}
                        className="py-20 px-6"
                        ref={(el) => (sectionRefs.current[index] = el)}
                        data-section={sectionKey}
                    >
                        <div className="container mx-auto max-w-6xl">
                            <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}>
                                <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    What our clients say about our {serviceData?.hero?.title?.toLowerCase()} services
                                </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                {section.data.items.map((testimonial, i) => (
                                    <div
                                        key={i}
                                        className={`bg-gray-800 rounded-lg p-6 transition-all duration-700 delay-${i * 100} transform hover:scale-105 hover:shadow-xl hover:bg-gray-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                            }`}
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, j) => (
                                                    <FaStar key={j} className="transition-transform duration-300 hover:scale-110" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-300 italic mb-4">
                                            "{testimonial.text}"
                                        </p>
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-700 mr-3"></div>
                                            <div>
                                                <h4 className="font-semibold">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-400">{testimonial.position}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'cta':
                return (
                    <section
                        key={index}
                        className={`py-20 px-6 bg-gradient-to-r ${section.data.gradient}`}
                        ref={(el) => (sectionRefs.current[index] = el)}
                        data-section={sectionKey}
                    >
                        <div className={`container mx-auto max-w-4xl text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}>
                            <h2 className="text-4xl font-bold mb-6">{section.data.title}</h2>
                            <p className="text-xl mb-8 text-gray-200">
                                {section.data.subtitle}
                            </p>
                            <Link href="/contact" className="px-8 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center font-semibold group">
                                {section.data.buttonText}
                                <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </section>
                );

            case 'custom':
                // For custom sections, render the provided JSX with animation
                return (
                    <div
                        key={index}
                        className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100' : 'opacity-0'
                            }`}
                        ref={(el) => (sectionRefs.current[index] = el)}
                        data-section={sectionKey}
                    >
                        {section.data}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {serviceData.sections.map((section, index) => renderSection(section, index))}

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slideLeft {
                    from { transform: translateX(-20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideRight {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
                
                .animate-slideUp {
                    animation: slideUp 0.5s ease-in-out;
                }
                
                .animate-slideLeft {
                    animation: slideLeft 0.5s ease-in-out;
                }
                
                .animate-slideRight {
                    animation: slideRight 0.5s ease-in-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.5s ease-in-out;
                }
                
                .animate-bounce {
                    animation: bounce 2s infinite;
                }
                
                .animate-pulse {
                    animation: pulse 2s infinite;
                }
                
                /* Delay classes */
                .delay-100 { transition-delay: 100ms; }
                .delay-200 { transition-delay: 200ms; }
                .delay-300 { transition-delay: 300ms; }
                .delay-400 { transition-delay: 400ms; }
                .delay-500 { transition-delay: 500ms; }
                .delay-600 { transition-delay: 600ms; }
                .delay-700 { transition-delay: 700ms; }
                .delay-800 { transition-delay: 800ms; }
                .delay-900 { transition-delay: 900ms; }
                .delay-1000 { transition-delay: 1000ms; }
            `}</style>
        </div>
    );
};

export default ServiceTemplates;