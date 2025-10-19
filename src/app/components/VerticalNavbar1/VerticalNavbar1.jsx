"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const VerticalNavbar1 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { name: 'Projects', href: '/projects' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Blog', href: '/blog' },
        { name: 'Partnership', href: '/partnership' },
        { name: 'Contact', href: '/contact' },
    ];

    const socialLinks = [
        {
            name: 'Email', href: 'mailto:contact@booleanforce.com', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            )
        },
        {
            name: 'LinkedIn', href: 'https://linkedin.com/company/booleanforce', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        },
        {
            name: 'Twitter', href: 'https://twitter.com/booleanforce', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            )
        },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    {!isOpen ? (
                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    ) : (
                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Vertical Sidebar */}
            <nav className={`fixed top-0 left-0 h-full z-40 transition-all duration-500 bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-slate-700/30 ${isCollapsed ? 'w-20' : 'w-64'} md:block hidden`}>
                <div className="h-full flex flex-col relative">
                    {/* Orange Star Decoration */}
                    <div className="flex justify-center pt-6 pb-4">
                        <div className="relative">
                            <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-30"></div>
                        </div>
                    </div>

                    {/* Logo/Brand */}
                    <div className="flex items-center justify-center px-4 pb-6">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <div className="relative mr-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-110">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-xl tracking-tight relative transition-all duration-300 group-hover:scale-105">
                                        BooleanForce
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-500"></span>
                                    </span>
                                    <span className="text-xs text-blue-400 transition-all duration-300 group-hover:text-blue-300">Enterprise Solutions</span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative text-gray-300 hover:text-white px-3 py-3 rounded-md text-sm font-medium transition-all duration-300 group overflow-hidden flex items-center ${mounted && pathname === link.href ? 'text-white bg-slate-700/50' : ''
                                        }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md"></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="px-4 py-4 border-t border-slate-700/30">
                        <div className="flex justify-center space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-slate-700/30">
                        <div className="space-y-3">
                            {!isCollapsed ? (
                                <>
                                    <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full">
                                        <span className="relative z-10 flex items-center justify-center">
                                            Embed
                                        </span>
                                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                    </button>
                                    <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full">
                                        <span className="relative z-10 flex items-center justify-center">
                                            Export
                                        </span>
                                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                    </button>
                                    <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full">
                                        <span className="relative z-10 flex items-center justify-center">
                                            Share
                                        </span>
                                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2.5 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full flex justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                        </svg>
                                    </button>
                                    <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2.5 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full flex justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                    </button>
                                    <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2.5 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full flex justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"></path>
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Collapse Toggle */}
                    <div className="p-4 border-t border-slate-700/30 flex justify-center">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-gray-400 hover:text-white focus:outline-none transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`md:hidden fixed inset-0 z-50 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
                <div className={`absolute top-0 left-0 h-full w-64 transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className={`h-full bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-slate-700/30 flex flex-col`}>
                        {/* Orange Star Decoration */}
                        <div className="flex justify-center pt-6 pb-4">
                            <div className="relative">
                                <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-30"></div>
                            </div>
                        </div>

                        {/* Logo/Brand */}
                        <div className="flex items-center justify-center px-4 pb-6">
                            <Link href="/" className="flex-shrink-0 flex items-center group">
                                <div className="relative mr-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-110">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-xl tracking-tight relative transition-all duration-300 group-hover:scale-105">
                                        BooleanForce
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-500"></span>
                                    </span>
                                    <span className="text-xs text-blue-400 transition-all duration-300 group-hover:text-blue-300">Enterprise Solutions</span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="px-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`relative text-gray-300 hover:text-white px-3 py-3 rounded-md text-sm font-medium transition-all duration-300 group overflow-hidden flex items-center ${mounted && pathname === link.href ? 'text-white bg-slate-700/50' : ''
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md"></span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="px-4 py-4 border-t border-slate-700/30">
                            <div className="flex justify-center space-x-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors duration-300"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4 border-t border-slate-700/30">
                            <div className="space-y-3">
                                <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full">
                                    <span className="relative z-10 flex items-center justify-center">
                                        Embed
                                    </span>
                                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                </button>
                                <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full">
                                    <span className="relative z-10 flex items-center justify-center">
                                        Export
                                    </span>
                                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                </button>
                                <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group w-full">
                                    <span className="relative z-10 flex items-center justify-center">
                                        Share
                                    </span>
                                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerticalNavbar1;