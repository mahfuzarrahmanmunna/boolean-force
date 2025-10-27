"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const VerticalNavbar3 = () => {
    const [mounted, setMounted] = useState(false);
    const [sparkles, setSparkles] = useState([]);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);

        // Create sparkles
        const colors = ['#edabd2', '#ffae57', '#fcf577', '#bae67e', '#5ccfe6', '#9cc6f4', '#aa72c5', '#ffffff'];
        const newSparkles = [];

        for (let i = 0; i < 100; i++) {
            newSparkles.push({
                id: i,
                size: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                top: Math.random() * 100,
                left: Math.random() * 100,
                animationDelay: Math.random() * 3
            });
        }

        setSparkles(newSparkles);
    }, []);

    const navLinks = [
        { name: 'Services', href: '/services' },
        { name: 'Blog', href: '/blog' },
        { name: 'Partnership', href: '/partnership' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const socialLinks = [
        { name: 'GitHub', href: 'https://github.com', icon: 'fab fa-github' },
        { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'fab fa-linkedin' },
        { name: 'Twitter', href: 'https://twitter.com', icon: 'fab fa-twitter' },
    ];

    return (
        <>
            {/* Sparkle Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                {sparkles.map((sparkle) => (
                    <div
                        key={sparkle.id}
                        className="absolute rounded-full opacity-0 animate-pulse"
                        style={{
                            width: `${sparkle.size}px`,
                            height: `${sparkle.size}px`,
                            backgroundColor: sparkle.color,
                            top: `${sparkle.top}vh`,
                            left: `${sparkle.left}vw`,
                            animationDelay: `${sparkle.animationDelay}s`,
                            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
                            animation: 'twinkle 3s infinite'
                        }}
                    />
                ))}
            </div>

            {/* Vertical Navbar */}
            <nav className="fixed top-0 right-0 h-screen w-36 flex flex-col justify-start items-center bg-transparent z-50 p-8">
                {/* Logo at top */}
                <div className="flex w-12 h-12 justify-center items-center flex-shrink-0 mt-2 mb-2 transition-transform duration-300 cursor-pointer hover:scale-110">
                    <span style={{ fontSize: '48px' }}>✨</span>
                </div>

                {/* Top decorative line */}
                <div className="w-px bg-gray-300 flex-1"></div>

                {/* Navigation Links */}
                <ul className="flex flex-col items-end gap-4 list-none pr-16">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className={`text-gray-300 font-medium text-lg uppercase transition-colors duration-300 cursor-pointer bg-transparent border-0 no-underline hover:text-[#3B85FE] ${mounted && pathname === link.href ? 'text-[#3B85FE]' : ''
                                    }`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Middle decorative line */}
                <div className="w-px bg-gray-300 flex-1"></div>

                {/* Social Links */}
                <ul className="flex flex-col items-end gap-5 list-none mb-1 mt-2">
                    {socialLinks.map((social) => (
                        <li key={social.name}>
                            <a
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 transition-colors duration-300 cursor-pointer bg-transparent no-underline text-lg hover:text-[#3B85FE]"
                            >
                                <i className={social.icon}></i>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Bottom decorative line */}
                <div className="w-px bg-gray-300 h-8"></div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-xl hidden">
                <div className="h-full flex flex-col justify-center items-center">
                    {/* Logo */}
                    <div className="flex w-12 h-12 justify-center items-center mb-8">
                        <span style={{ fontSize: '48px' }}>✨</span>
                    </div>

                    {/* Navigation Links */}
                    <ul className="flex flex-col items-center gap-6 list-none mb-8">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`text-gray-300 font-medium text-xl uppercase transition-colors duration-300 hover:text-[#3B85FE] ${mounted && pathname === link.href ? 'text-[#3B85FE]' : ''
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Social Links */}
                    <ul className="flex flex-row gap-6 list-none">
                        {socialLinks.map((social) => (
                            <li key={social.name}>
                                <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 transition-colors duration-300 text-xl hover:text-[#3B85FE]"
                                >
                                    <i className={social.icon}></i>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* CSS for twinkle animation */}
            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default VerticalNavbar3;