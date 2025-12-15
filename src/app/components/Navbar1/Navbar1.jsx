"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Palette, Globe, Cpu, ShoppingBag, Search, Menu, X, ArrowRight, Sparkles, Users, Award, Target, Zap, Briefcase, Lightbulb } from 'lucide-react';

const Navbar1 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [servicesModalOpen, setServicesModalOpen] = useState(false);
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const servicesTimeoutRef = useRef(null);
    const aboutTimeoutRef = useRef(null);
    const searchInputRef = useRef(null);
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

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    const handleServicesMouseEnter = () => {
        if (servicesTimeoutRef.current) {
            clearTimeout(servicesTimeoutRef.current);
        }
        setServicesModalOpen(true);
        setAboutModalOpen(false);
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
        setServicesModalOpen(false);
    };

    const handleAboutMouseLeave = () => {
        aboutTimeoutRef.current = setTimeout(() => {
            setAboutModalOpen(false);
        }, 200);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Handle search functionality
        console.log("Searching for:", searchQuery);
        setSearchOpen(false);
        setSearchQuery('');
    };

    const navLinks = [
        { name: "Services", href: "/services" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Blog", href: "/blog" },
        { name: "About", href: "/about-us" },
        { name: "Contact", href: "/contact" },
    ];

    const services = [
        {
            name: "Brand Visual Identity",
            href: "/brand-visual-identity",
            description: "Creating memorable brand experiences",
            icon: <Palette className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500"
        },
        {
            name: "Website Development",
            href: "/website-development",
            description: "Building responsive, high-performance websites",
            icon: <Globe className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500"
        },
        {
            name: "ERP Software Solutions",
            href: "/erp-software-solutions",
            description: "Streamlining business operations",
            icon: <Cpu className="w-5 h-5" />,
            color: "from-indigo-500 to-purple-500"
        },
        {
            name: "POS Systems",
            href: "/pos-systems",
            description: "Modern point-of-sale solutions",
            icon: <ShoppingBag className="w-5 h-5" />,
            color: "from-green-500 to-teal-500"
        }
    ];

    const aboutLinks = [
        {
            name: "About Us",
            href: "/about-us",
            description: "Learn more about our company and team",
            icon: <Users className="w-5 h-5" />,
            color: "from-blue-500 to-indigo-500"
        },
        {
            name: "Partnership",
            href: "/partnership",
            description: "Explore partnership opportunities with us",
            icon: <Award className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500"
        },
        {
            name: "Careers",
            href: "/careers",
            description: "Join our team of talented professionals",
            icon: <Target className="w-5 h-5" />,
            color: "from-green-500 to-teal-500"
        },
        {
            name: "Our Process",
            href: "/our-process",
            description: "How we deliver exceptional results",
            icon: <Zap className="w-5 h-5" />,
            color: "from-yellow-500 to-orange-500"
        }
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                ? "bg-slate-900/95 bg-gray-900 backdrop-blur-xl shadow-2xl border-b border-slate-700/30"
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

                    {/* Desktop Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700/30 transition-all duration-300"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* CTA Button */}
                        <Link href="/contact" className="relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                            <button className="relative bg-slate-800 border border-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group-hover:border-transparent">
                                <span className="relative z-10 flex items-center">
                                    Let's Talk
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
                                <Menu className="block h-6 w-6" />
                            ) : (
                                <X className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <div className={`absolute inset-x-0 top-0 transition-all duration-300 ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <div className="flex items-center">
                                <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for services, articles, and more..."
                                    className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="absolute right-3 p-1 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {services.map((service, index) => (
                                <Link
                                    key={index}
                                    href={service.href}
                                    className="group p-5 rounded-xl bg-slate-700/20 hover:bg-slate-700/40 transition-all duration-300 border border-slate-600/20 hover:border-blue-500/30 transform hover:scale-105 hover:-translate-y-1"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-base group-hover:text-blue-300 transition-colors duration-300">{service.name}</h3>
                                            <p className="text-gray-400 text-sm mt-2">{service.description}</p>
                                            <div className="flex items-center mt-3 text-blue-400 text-sm group-hover:text-blue-300 font-medium">
                                                <span>Learn more</span>
                                                <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-2">Need help choosing?</h3>
                                <p className="text-gray-400 text-sm">Our team is here to guide you to the perfect solution for your business.</p>
                            </div>
                            <Link href="/contact" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                                Get Consultation
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {aboutLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="group p-5 rounded-xl bg-slate-700/20 hover:bg-slate-700/40 transition-all duration-300 border border-slate-600/20 hover:border-blue-500/30 transform hover:scale-105 hover:-translate-y-1"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                            {link.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-base group-hover:text-blue-300 transition-colors duration-300">{link.name}</h3>
                                            <p className="text-gray-400 text-sm mt-2">{link.description}</p>
                                            <div className="flex items-center mt-3 text-blue-400 text-sm group-hover:text-blue-300 font-medium">
                                                <span>Learn more</span>
                                                <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-2">Join our community</h3>
                                <p className="text-gray-400 text-sm">Connect with us and stay updated on the latest trends and innovations.</p>
                            </div>
                            <div className="flex space-x-3">
                                <Link href="/newsletter" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                                    Subscribe
                                    <Sparkles className="ml-2 w-4 h-4" />
                                </Link>
                                <Link href="/community" className="inline-flex items-center px-5 py-2.5 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all duration-300 transform hover:scale-105">
                                    Join Community
                                    <Users className="ml-2 w-4 h-4" />
                                </Link>
                            </div>
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
                        ? "bg-slate-900/95 backdrop-blur-xl"
                        : "bg-slate-800/95 backdrop-blur-md"
                        }`}
                >
                    {/* Mobile Search */}
                    <div className="px-4 py-3">
                        <div className="relative">
                            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

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
                                            className="flex items-center text-gray-400 hover:text-white text-sm py-2 px-4 rounded-md hover:bg-slate-700/30 transition-all"
                                        >
                                            <div className={`w-8 h-8 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                                                {service.icon}
                                            </div>
                                            <div>
                                                <div className="font-medium">{service.name}</div>
                                                <div className="text-xs text-gray-500">{service.description}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Show About dropdown under mobile */}
                            {link.name === "About" && (
                                <div className="pl-6 space-y-1">
                                    {aboutLinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.href}
                                            className="flex items-center text-gray-400 hover:text-white text-sm py-2 px-4 rounded-md hover:bg-slate-700/30 transition-all"
                                        >
                                            <div className={`w-8 h-8 bg-gradient-to-br ${link.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                                                {link.icon}
                                            </div>
                                            <div>
                                                <div className="font-medium">{link.name}</div>
                                                <div className="text-xs text-gray-500">{link.description}</div>
                                            </div>
                                        </Link>
                                    ))}
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
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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