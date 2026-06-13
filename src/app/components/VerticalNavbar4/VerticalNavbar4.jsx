"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Sub-components for better organization
const SparkleBackground = () => {
    const [sparkles, setSparkles] = useState([]);

    useEffect(() => {
        // Optimize sparkle generation with fewer elements
        const newSparkles = [];

        for (let i = 0; i < 30; i++) { // Reduced from 100 for better performance
            newSparkles.push({
                id: i,
                size: Math.random() * 2 + 0.5, // Smaller size
                top: Math.random() * 100,
                left: Math.random() * 100,
                animationDelay: Math.random() * 5 // Longer animation cycle
            });
        }

        setSparkles(newSparkles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {sparkles.map((sparkle) => (
                <div
                    key={sparkle.id}
                    className="absolute rounded-full opacity-70"
                    style={{
                        width: `${sparkle.size}px`,
                        height: `${sparkle.size}px`,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        top: `${sparkle.top}%`,
                        left: `${sparkle.left}%`,
                        animationDelay: `${sparkle.animationDelay}s`,
                        boxShadow: `0 0 ${sparkle.size * 2}px rgba(255, 255, 255, 0.5)`,
                        animation: 'twinkle 5s infinite'
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.7; transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

const HoverIndicator = ({ onExpand }) => {
    return (
        <div
            className="hidden md:block fixed top-1/2 right-0 h-64 w-12 bg-gradient-to-l from-gray-900/90 to-transparent z-40 cursor-pointer transform -translate-y-1/2 rounded-l-2xl backdrop-blur-sm"
            onMouseEnter={onExpand}
            aria-label="Expand navigation menu"
        >
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"
                        animate={{ height: ["24px", "32px", "24px"] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    <motion.div
                        className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"
                        animate={{ height: ["24px", "32px", "24px"] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                    />
                    <motion.div
                        className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"
                        animate={{ height: ["24px", "32px", "24px"] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                    />
                </div>
            </div>
        </div>
    );
};

const DesktopNav = ({
    isExpanded,
    navLinks,
    socialLinks,
    pathname,
    onExpand,
    onCollapse
}) => {
    const [activeTooltip, setActiveTooltip] = useState(null);

    return (
        <motion.nav
            className="hidden md:flex fixed top-4/9 items-center right-0 transform -translate-y-2/4 z-50 shadow-lg"
            style={{
                height: 'min( )',
                borderTopLeftRadius: isExpanded ? '1.5rem' : '0',
                borderBottomLeftRadius: isExpanded ? '1.5rem' : '0',
                borderTopRightRadius: isExpanded ? '0' : '0',
                borderBottomRightRadius: isExpanded ? '0' : '0',
            }}
            initial={false}
            animate={{ width: isExpanded ? 120 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onMouseEnter={onExpand}
            onMouseLeave={onCollapse}
        >
            {isExpanded && (
                <motion.div
                    className="flex flex-col h-full p-6 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    {/* Logo */}
                    {/* <div className="flex justify-center mb-6">
                        <motion.div
                            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-white font-bold text-2xl">BF</span>
                        </motion.div>
                    </div> */}

                    {/* Decorative line */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6"></div>

                    {/* Navigation Links */}
                    <ul className="flex flex-col items-center gap-3 mb-6">
                        {navLinks.map((link) => (
                            <li key={link.name} className="relative w-full">
                                <Link
                                    href={link.href}
                                    className={`group flex items-center justify-center w-full transition-all duration-300 ${pathname === link.href ? 'text-white' : 'text-gray-300 hover:text-white'
                                        }`}
                                    onMouseEnter={() => setActiveTooltip(link.name)}
                                    onMouseLeave={() => setActiveTooltip(null)}
                                    aria-label={`Navigate to ${link.name}`}
                                >
                                    <motion.div
                                        className={`p-3 rounded-xl w-full flex items-center justify-center ${pathname === link.href
                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 shadow-lg border border-blue-500/30'
                                            : 'hover:bg-gray-700/30'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {link.icon}
                                    </motion.div>
                                </Link>

                                {/* Tooltip */}
                                <AnimatePresence>
                                    {activeTooltip === link.name && (
                                        <motion.div
                                            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm py-2 px-3 rounded-lg whitespace-nowrap shadow-xl"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {link.name}
                                            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        ))}
                    </ul>

                    {/* Decorative line */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6"></div>

                    {/* Social Links */}
                    <ul className="flex flex-col items-center gap-3 mb-6">
                        {socialLinks.map((social) => (
                            <li key={social.name} className="relative w-full">
                                <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 transition-all duration-300 hover:text-white group flex items-center justify-center w-full"
                                    aria-label={`Visit our ${social.name} profile`}
                                >
                                    <motion.div
                                        className="p-3 rounded-xl transition-all duration-300 hover:bg-gray-700/30 w-full flex items-center justify-center"
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {social.icon}
                                    </motion.div>
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Decorative line */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mt-auto"></div>
                </motion.div>
            )}
        </motion.nav>
    );
};

const MobileMenu = ({
    isOpen,
    navLinks,
    socialLinks,
    pathname,
    onClose
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl z-50 md:hidden"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        <div className="flex flex-col h-full p-6">
                            {/* Close button */}
                            <div className="flex justify-end mb-8">
                                <motion.button
                                    onClick={onClose}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none transition-all duration-300"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Close menu"
                                >
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </div>

                            {/* Logo */}
                            <div className="flex justify-center mb-8">
                                <motion.div
                                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <span className="text-white font-bold text-2xl">BF</span>
                                </motion.div>
                            </div>

                            {/* Navigation Links */}
                            <ul className="flex flex-col gap-2 mb-8">
                                {navLinks.map((link, index) => (
                                    <motion.li
                                        key={link.name}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 font-medium text-lg p-3 rounded-xl transition-all duration-300 ${pathname === link.href
                                                ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30'
                                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="p-2 rounded-lg transition-all duration-300">
                                                {link.icon}
                                            </div>
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Social Links */}
                            <div className="mt-auto">
                                <p className="text-gray-400 text-sm mb-4">Connect with us</p>
                                <ul className="flex gap-4">
                                    {socialLinks.map((social, index) => (
                                        <motion.li
                                            key={social.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                        >
                                            <a
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-300 transition-colors duration-300 text-xl hover:text-white p-2 rounded-lg hover:bg-white/10"
                                                aria-label={`Visit our ${social.name} profile`}
                                            >
                                                {social.icon}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const MobileMenuButton = ({ isOpen, onClick }) => {
    return (
        <div className="md:hidden fixed top-4 right-4 z-50">
            <motion.button
                onClick={onClick}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300 backdrop-blur-sm"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
            </motion.button>
        </div>
    );
};

const VerticalNavbar4 = () => {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const timeoutRef = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleExpand = useCallback(() => {
        setIsExpanded(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const handleCollapse = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 300);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }, [isMobileMenuOpen]);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    // Navigation links data
    const navLinks = [
        {
            name: 'Services',
            href: '#services',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            )
        },
        {
            name: 'Blog',
            href: '/blog',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
            )
        },
        {
            name: 'Partnership',
            href: '/partnership',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
            )
        },
        {
            name: 'About',
            href: '/about',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            )
        },
        {
            name: 'Contact',
            href: '/contact',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            )
        },
    ];

    // Social links data
    const socialLinks = [
        {
            name: 'GitHub',
            href: 'https://github.com',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            )
        },
        {
            name: 'LinkedIn',
            href: 'https://linkedin.com',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            )
        },
    ];

    return (
        <>
            {/* Sparkle Background */}
            <SparkleBackground />

            {/* Mobile Menu Button */}
            <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />

            {/* Hover Indicator for Desktop */}
            {!isExpanded && <HoverIndicator onExpand={handleExpand} />}

            {/* Desktop Navigation */}
            <DesktopNav
                isExpanded={isExpanded}
                navLinks={navLinks}
                socialLinks={socialLinks}
                pathname={pathname}
                onExpand={handleExpand}
                onCollapse={handleCollapse}
            />

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                navLinks={navLinks}
                socialLinks={socialLinks}
                pathname={pathname}
                onClose={closeMobileMenu}
            />
        </>
    );
};

export default VerticalNavbar4;