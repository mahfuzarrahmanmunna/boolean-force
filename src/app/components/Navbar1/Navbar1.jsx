"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navLinks = [
        { name: 'Services', href: '/services' },
        { name: 'Blog', href: '/blog' },
        { name: 'Partnership', href: '/partnership' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
            ? 'bg-slate-900/20 backdrop-blur-xl shadow-2xl border-b border-slate-700/30'
            : 'bg-transparent'}`}>
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between h-20">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
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
                                <span className="text-white font-bold text-xl md:text-2xl tracking-tight relative transition-all duration-300 group-hover:scale-105">
                                    BooleanForce
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-500"></span>
                                </span>
                                <span className="text-xs text-blue-400 hidden md:block transition-all duration-300 group-hover:text-blue-300">Enterprise Solutions</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative text-gray-300 hover:text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 group overflow-hidden ${mounted && pathname === link.href ? 'text-white' : ''
                                        }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md"></span>
                                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-500`}></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-3">
                            <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group">
                                <span className="relative z-10 flex items-center">
                                    Get Started
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </span>
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            </button>
                            <button className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 group">
                                <span className="relative z-10 flex items-center">
                                    Live Dashboard
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                                </span>
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            </button>
                            <button className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 group">
                                <span className="relative z-10 flex items-center">
                                    Affiliate Program
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </span>
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300 ${scrolled ? 'backdrop-blur-md' : ''}`}
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
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${scrolled ? 'bg-slate-900/90 backdrop-blur-xl' : 'bg-slate-800/90 backdrop-blur-md'}`}>
                    <div className="pt-4 pb-3 border-t border-slate-700/50">
                        <div className="flex items-center px-3">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">BooleanForce</div>
                                <div className="text-sm font-medium text-blue-400">Enterprise Solutions</div>
                            </div>
                        </div>
                    </div>

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative text-gray-300 hover:text-white hover:bg-slate-700/50 block px-3 py-3 rounded-md text-base font-medium transition-all duration-300 group overflow-hidden ${mounted && pathname === link.href ? 'text-white bg-slate-700/50' : ''
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="relative z-10">{link.name}</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md"></span>
                        </Link>
                    ))}

                    <div className="pt-4 pb-3 border-t border-slate-700/50">
                        <div className="flex flex-col space-y-3 px-3">
                            <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group">
                                <span className="relative z-10 flex items-center justify-center">
                                    Get Started
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </span>
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            </button>
                            <button className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 group">
                                <span className="relative z-10 flex items-center justify-center">
                                    Live Dashboard
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                                </span>
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            </button>
                            <button className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 group">
                                <span className="relative z-10 flex items-center justify-center">
                                    Affiliate Program
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </span>
                                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;