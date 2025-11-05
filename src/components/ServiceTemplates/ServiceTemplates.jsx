// components/ServiceTemplate.jsx
"use client";

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaArrowRight, FaStar, FaLightbulb } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import DarkVeil from '../ui/ServiceTemplate/DarkVeil';
// import DarkVeil from './DarkVeil';

const ServiceTemplates = ({ serviceData }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Render different section types based on data
    const renderSection = (section, index) => {
        switch (section.type) {
            case 'hero':
                return (
                    <section key={index} className="relative h-screen flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <DarkVeil
                                hueShift={section.data.hueShift}
                                noiseIntensity={0.05}
                                scanlineIntensity={0.1}
                                speed={0.5}
                                scanlineFrequency={100}
                                warpAmount={0.05}
                            />
                        </div>

                        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                            <div className="mb-6 flex justify-center">
                                <div className={`w-20 h-20 bg-gradient-to-br ${section.data.iconGradient} rounded-full flex items-center justify-center`}>
                                    <div className="text-3xl text-white">
                                        {section.data.icon}
                                    </div>
                                </div>
                            </div>
                            <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${section.data.textGradient}`}>
                                {section.data.title}
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
                                {section.data.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact" className={`px-8 py-3 ${section.data.primaryButtonColor} text-white rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center`}>
                                    {section.data.primaryButtonText}
                                    <FaArrowRight className="ml-2" />
                                </Link>
                                <Link href={section.data.secondaryButtonLink} className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center">
                                    {section.data.secondaryButtonText}
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
                    <section key={index} className="py-20 px-6">
                        <div className="container mx-auto max-w-6xl">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
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
                                            <div key={i} className="flex items-start">
                                                <FaCheckCircle className={`${serviceData.colors.accent} mt-1 mr-3`} />
                                                <div>
                                                    <h3 className="font-semibold mb-1">{point.title}</h3>
                                                    <p className="text-gray-400 text-sm">{point.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="w-full h-96 rounded-lg overflow-hidden">
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
                    <section key={index} className="py-20 px-6 bg-gray-800 bg-opacity-50">
                        <div className="container mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold mb-4">{section.data.title}</h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    {section.data.subtitle}
                                </p>
                            </div>
                            <div className="grid md:grid-cols-4 gap-8">
                                {section.data.steps.map((step, i) => (
                                    <div key={i} className="text-center">
                                        <div className={`w-16 h-16 ${serviceData.colors.accentBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                            <span className={`text-2xl font-bold ${serviceData.colors.accent}`}>{i + 1}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                        <p className="text-gray-400">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'features':
                return (
                    <section key={index} className="py-20 px-6">
                        <div className="container mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold mb-4">{section.data.title}</h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    {section.data.subtitle}
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.data.items.map((item, i) => (
                                    <div key={i} className="bg-gray-800 rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                                        <div className={`w-16 h-16 ${serviceData.colors.accentBg} rounded-lg flex items-center justify-center mb-4`}>
                                            <div className={`text-2xl ${serviceData.colors.accent}`}>
                                                {item.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{item.name}</h3>
                                        <p className="text-gray-400">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'benefits':
                return (
                    <section key={index} className="py-20 px-6 bg-gray-800 bg-opacity-50">
                        <div className="container mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold mb-4">{section.data.title}</h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    {section.data.subtitle}
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.data.items.map((benefit, i) => (
                                    <div key={i} className="bg-gray-800 rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                                        <div className={`w-12 h-12 ${serviceData.colors.accentBg} rounded-lg flex items-center justify-center mb-4`}>
                                            <FaLightbulb className={`text-xl ${serviceData.colors.accent}`} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                        <p className="text-gray-400">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'testimonials':
                return (
                    <section key={index} className="py-20 px-6">
                        <div className="container mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    What our clients say about our {serviceData?.hero?.title?.toLowerCase()} services
                                </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                {section.data.items.map((testimonial, i) => (
                                    <div key={i} className="bg-gray-800 rounded-lg p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, j) => <FaStar key={j} />)}
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
                    <section key={index} className={`py-20 px-6 bg-gradient-to-r ${section.data.gradient}`}>
                        <div className="container mx-auto max-w-4xl text-center">
                            <h2 className="text-4xl font-bold mb-6">{section.data.title}</h2>
                            <p className="text-xl mb-8 text-gray-200">
                                {section.data.subtitle}
                            </p>
                            <Link href="/contact" className="px-8 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center font-semibold">
                                {section.data.buttonText}
                                <FaArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </section>
                );

            case 'custom':
                // For custom sections, render the provided JSX
                return <div key={index}>{section.data}</div>;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {serviceData.sections.map((section, index) => renderSection(section, index))}
        </div>
    );
};

export default ServiceTemplates;