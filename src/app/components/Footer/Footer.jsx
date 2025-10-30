"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Footer = () => {
    const [emailHovered, setEmailHovered] = useState(false);
    const [phoneHovered, setPhoneHovered] = useState(false);

    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

            {/* Background decorative elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

            <div className="relative z-10 container mx-auto px-2 py-2 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Company Info */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white relative inline-block group">
                            BooleanForce
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Transforming businesses through innovative IT solutions. Your success is our TRUE statement.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 pt-2">
                            <div
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer group"
                                onMouseEnter={() => setEmailHovered(true)}
                                onMouseLeave={() => setEmailHovered(false)}
                            >
                                <svg className={`w-5 h-5 transition-all duration-300 ${emailHovered ? 'text-purple-400 translate-x-1' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                <span className="text-sm">info@booleanforce.com</span>
                            </div>

                            <div
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer group"
                                onMouseEnter={() => setPhoneHovered(true)}
                                onMouseLeave={() => setPhoneHovered(false)}
                            >
                                <svg className={`w-5 h-5 transition-all duration-300 ${phoneHovered ? 'text-cyan-400 translate-x-1' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                </svg>
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white relative inline-block group">
                            Services
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-2">
                            {[
                                'Brand Visual Identity',
                                'Website Development',
                                'ERP Software Solutions',
                                'POS Systems'
                            ].map((service, index) => (
                                <li key={index} className="group">
                                    <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 inline-flex items-center group/item">
                                        <span className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 mr-0 group-hover/item:w-4 group-hover/item:mr-2 transition-all duration-300"></span>
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white relative inline-block group">
                            Company
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-2">
                            {[
                                'About Us',
                                'Our Services'
                            ].map((item, index) => (
                                <li key={index} className="group">
                                    <Link href="#" className="text-gray-300 hover:text-white transition-all duration-300 inline-flex items-center group/item">
                                        <span className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 mr-0 group-hover/item:w-4 group-hover/item:mr-2 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white relative inline-block group">
                            Stay Connected
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </h3>
                        <p className="text-gray-300 text-sm">Subscribe to our newsletter for the latest updates.</p>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} BooleanForce. All rights reserved.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transform hover:scale-110 transition-all duration-300"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"></div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
