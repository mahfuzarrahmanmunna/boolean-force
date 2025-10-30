"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Palette, Globe, Cpu, ShoppingBag } from 'lucide-react';

const Navbar1 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [servicesModalOpen, setServicesModalOpen] = useState(false);
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const servicesTimeoutRef = useRef(null);
    const aboutTimeoutRef = useRef(null);
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
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleServicesMouseEnter = () => {
        if (servicesTimeoutRef.current) {
            clearTimeout(servicesTimeoutRef.current);
        }
        setServicesModalOpen(true);
    };

    const handleServicesMouseLeave = () => {
        servicesTimeoutRef.current = setTimeout(() => {
            setServicesModalOpen(false);
        }, 200);
    };

    const handleAboutMouseEnter = () => {
        if (aboutTimeoutRef.current) {
            clearTimeout(aboutTimeoutRef.current);
        }
        setAboutModalOpen(true);
    };

    const handleAboutMouseLeave = () => {
        aboutTimeoutRef.current = setTimeout(() => {
            setAboutModalOpen(false);
        }, 200);
    };

    const navLinks = [
        { name: "Services", href: "/services" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Blog", href: "/blog" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    const services = [
        {
            name: "Brand Visual Identity",
            href: "/brand-visual-identity",
            description: "Creating memorable brand experiences",
            icon: <Palette className="w-5 h-5" />
        },
        {
            name: "Website Development",
            href: "/website-development",
            description: "Building responsive, high-performance websites",
            icon: <Globe className="w-5 h-5" />
        },
        {
            name: "ERP Software Solutions",
            href: "/erp-software-solutions",
            description: "Streamlining business operations",
            icon: <Cpu className="w-5 h-5" />
        },
        {
            name: "POS Systems",
            href: "/pos-systems",
            description: "Modern point-of-sale solutions",
            icon: <ShoppingBag className="w-5 h-5" />
        }
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                ? "bg-slate-900/90 bg-gray-700 backdrop-blur-xl shadow-2xl border-b border-slate-700/30"
                : "bg-transparent"
                }`}
        >
            {/* subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <div className="relative mr-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-110">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-xl md:text-2xl tracking-tight relative transition-all duration-300 group-hover:scale-105">
                                    BooleanForce
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-500"></span>
                                </span>
                                <span className="text-xs text-blue-400 hidden md:block transition-all duration-300 group-hover:text-blue-300">
                                    Enterprise Solutions
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            {navLinks.map((link) => (
                                <div
                                    key={link.name}
                                    className="relative group"
                                    onMouseEnter={link.name === "Services" ? handleServicesMouseEnter : link.name === "About" ? handleAboutMouseEnter : undefined}
                                    onMouseLeave={link.name === "Services" ? handleServicesMouseLeave : link.name === "About" ? handleAboutMouseLeave : undefined}
                                >
                                    <Link
                                        href={link.href}
                                        className={`relative text-gray-300 hover:text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 overflow-hidden ${mounted && pathname === link.href ? "text-white" : ""
                                            }`}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md"></span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-500"></span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link href="/contact" className="relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                            <button className="relative bg-slate-800 border border-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group-hover:border-transparent">
                                <span className="relative z-10 flex items-center">
                                    Let's Talk
                                    <svg
                                        className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        ></path>
                                    </svg>
                                </span>
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300 ${scrolled ? "backdrop-blur-md" : ""
                                }`}
                        >
                            {!isOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Modal */}
            <div
                className={`absolute left-0 right-0 transition-all duration-300 ${servicesModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
            >
                <div className="bg-slate-800/95 backdrop-blur-md shadow-2xl border border-slate-700/50 rounded-b-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {services.map((service, index) => (
                                <Link
                                    key={index}
                                    href={service.href}
                                    className="group p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-blue-500/30"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">{service.name}</h3>
                                            <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                                            <div className="flex items-center mt-2 text-blue-400 text-sm group-hover:text-blue-300">
                                                <span>Learn more</span>
                                                <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* About Modal */}
            <div
                className={`absolute left-0 right-0 transition-all duration-300 ${aboutModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseEnter={handleAboutMouseEnter}
                onMouseLeave={handleAboutMouseLeave}
            >
                <div className="bg-slate-800/95 backdrop-blur-md shadow-2xl border border-slate-700/50 rounded-b-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                href="/about"
                                className="group p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-blue-500/30"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">About Us</h3>
                                        <p className="text-gray-400 text-sm mt-1">Learn more about our company and team</p>
                                        <div className="flex items-center mt-2 text-blue-400 text-sm group-hover:text-blue-300">
                                            <span>Learn more</span>
                                            <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link
                                href="/partnership"
                                className="group p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 hover:border-blue-500/30"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">Partnership</h3>
                                        <p className="text-gray-400 text-sm mt-1">Explore partnership opportunities with us</p>
                                        <div className="flex items-center mt-2 text-blue-400 text-sm group-hover:text-blue-300">
                                            <span>Learn more</span>
                                            <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <div
                    className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${scrolled
                        ? "bg-slate-900/90 backdrop-blur-xl"
                        : "bg-slate-800/90 backdrop-blur-md"
                        }`}
                >
                    {navLinks.map((link) => (
                        <div key={link.name}>
                            <Link
                                href={link.href}
                                className={`block text-gray-300 hover:text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${mounted && pathname === link.href ? "text-white" : ""
                                    }`}
                            >
                                {link.name}
                            </Link>

                            {/* Show Services dropdown under mobile */}
                            {link.name === "Services" && (
                                <div className="pl-6 space-y-1">
                                    {services.map((service, index) => (
                                        <Link
                                            key={index}
                                            href={service.href}
                                            className="block text-gray-400 hover:text-white text-sm py-2 px-4 rounded-md hover:bg-slate-700/30 transition-all"
                                        >
                                            {service.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Show About dropdown under mobile */}
                            {link.name === "About" && (
                                <div className="pl-6 space-y-1">
                                    <Link
                                        href="/about"
                                        className="block text-gray-400 hover:text-white text-sm py-2 px-4 rounded-md hover:bg-slate-700/30 transition-all"
                                    >
                                        About Us
                                    </Link>
                                    <Link
                                        href="/partnership"
                                        className="block text-gray-400 hover:text-white text-sm py-2 px-4 rounded-md hover:bg-slate-700/30 transition-all"
                                    >
                                        Partnership
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Mobile CTA Button */}
                    <div className="px-4 py-3">
                        <Link href="/contact" className="relative overflow-hidden group block">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                            <button className="relative w-full bg-slate-800 border border-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group-hover:border-transparent">
                                <span className="relative z-10 flex items-center justify-center">
                                    Let's Talk
                                    <svg
                                        className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        ></path>
                                    </svg>
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar1;