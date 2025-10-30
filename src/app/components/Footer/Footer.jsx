"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Footer = () => {
    const [emailHovered, setEmailHovered] = useState(false);
    const [phoneHovered, setPhoneHovered] = useState(false);

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({
        days: 6,
        hours: 23,
        minutes: 58,
        seconds: 25
    });

    // Update countdown timer every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                const { days, hours, minutes, seconds } = prevTime;

                // Calculate total seconds
                let totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;

                // Decrease by 1 second
                totalSeconds = Math.max(0, totalSeconds - 1);

                // Calculate new time values
                const newDays = Math.floor(totalSeconds / 86400);
                const newHours = Math.floor((totalSeconds % 86400) / 3600);
                const newMinutes = Math.floor((totalSeconds % 3600) / 60);
                const newSeconds = totalSeconds % 60;

                return {
                    days: newDays,
                    hours: newHours,
                    minutes: newMinutes,
                    seconds: newSeconds
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white relative inline-block group">
                            BooleanForce
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Transforming businesses through innovative IT solutions. Your success is our TRUE statement.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 pt-4">
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
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white relative inline-block group">
                            Services
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { name: 'Brand Visual Identity', path: 'brand-visual-identity' },
                                { name: 'Website Development', path: 'website-development' },
                                { name: 'ERP Software Solutions', path: 'erp-software-solutions' },
                                { name: 'POS Systems', path: 'pos-systems' }
                            ].map((service, index) => (
                                <li key={index} className="group">
                                    <Link href={`/${service.path}`} className="text-gray-300 hover:text-white transition-all duration-300 inline-flex items-center group/item">
                                        <span className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 mr-0 group-hover/item:w-4 group-hover/item:mr-2 transition-all duration-300"></span>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white relative inline-block group">
                            Company
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { name: 'About Us', path: 'about' },
                                { name: 'Our Services', path: 'services' }
                            ].map((item, index) => (
                                <li key={index} className="group">
                                    <Link href={`/${item.path}`} className="text-gray-300 hover:text-white transition-all duration-300 inline-flex items-center group/item">
                                        <span className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 mr-0 group-hover/item:w-4 group-hover/item:mr-2 transition-all duration-300"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Limited Time Offer - Now integrated into footer */}
                    <div className="bg-gradient-to-br from-purple-800/40 to-cyan-800/40 backdrop-blur-md rounded-lg p-6 border border-white/10">
                        <div className="flex items-center mb-3">
                            <span className="text-2xl mr-2">🔥</span>
                            <h3 className="text-xl font-bold text-white">LIMITED TIME OFFER</h3>
                        </div>
                        <p className="text-sm text-gray-200 mb-4">
                            Get 50% OFF your first project + FREE consultation
                        </p>

                        <div className="flex items-center mb-3">
                            <span className="text-lg mr-2">⏰</span>
                            <p className="text-white text-sm font-medium">Offer expires in:</p>
                        </div>

                        <div className="grid grid-cols-4 gap-1 mb-4">
                            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded p-1">
                                <span className="text-lg font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                                <span className="text-xs text-gray-300">Days</span>
                            </div>
                            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded p-1">
                                <span className="text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                                <span className="text-xs text-gray-300">Hours</span>
                            </div>
                            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded p-1">
                                <span className="text-lg font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                <span className="text-xs text-gray-300">Minutes</span>
                            </div>
                            <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded p-1">
                                <span className="text-lg font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                <span className="text-xs text-gray-300">Seconds</span>
                            </div>
                        </div>

                        <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/25">
                            Claim Your Discount
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10">
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