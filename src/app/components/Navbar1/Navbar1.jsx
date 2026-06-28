"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Palette,
  Globe,
  Cpu,
  ShoppingBag,
  Search,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Target,
  Zap,
} from "lucide-react";

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  const servicesTimeoutRef = useRef(null);
  const aboutTimeoutRef = useRef(null);
  const searchBarInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        setNavHidden(true);
      } else if (currentScroll < lastScroll) {
        setNavHidden(false);
      }
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Collapse search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setSearchExpanded(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus input when expanded
  useEffect(() => {
    if (searchExpanded) {
      setTimeout(() => searchBarInputRef.current?.focus(), 50);
    }
  }, [searchExpanded]);

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesModalOpen(true);
    setAboutModalOpen(false);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesModalOpen(false);
    }, 200);
  };

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setAboutModalOpen(true);
    setServicesModalOpen(false);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutModalOpen(false);
    }, 200);
  };

  const handleSearchBarSubmit = () => {
    console.log("Searching for:", searchQuery);
    setSearchQuery("");
    setSearchExpanded(false);
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
      accent: "orange",
    },
    {
      name: "Website Development",
      href: "/website-development",
      description: "Building responsive, high-performance websites",
      icon: <Globe className="w-5 h-5" />,
      accent: "blue",
    },
    {
      name: "ERP Software Solutions",
      href: "/erp-software-solutions",
      description: "Streamlining business operations",
      icon: <Cpu className="w-5 h-5" />,
      accent: "blue",
    },
    {
      name: "POS Systems",
      href: "/pos-systems",
      description: "Modern point-of-sale solutions",
      icon: <ShoppingBag className="w-5 h-5" />,
      accent: "orange",
    },
  ];

  const aboutLinks = [
    {
      name: "About Us",
      href: "/about-us",
      description: "Learn more about our company and team",
      icon: <Users className="w-5 h-5" />,
      accent: "blue",
    },
    {
      name: "Partnership",
      href: "/partnership",
      description: "Explore partnership opportunities with us",
      icon: <Award className="w-5 h-5" />,
      accent: "orange",
    },
    {
      name: "Careers",
      href: "/careers",
      description: "Join our team of talented professionals",
      icon: <Target className="w-5 h-5" />,
      accent: "blue",
    },
    {
      name: "Our Process",
      href: "/our-process",
      description: "How we deliver exceptional results",
      icon: <Zap className="w-5 h-5" />,
      accent: "orange",
    },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 text-white transition-all duration-300
        bg-black/35 backdrop-blur-2xl
        shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        ${navHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="relative w-full">
        <div className="mx-auto flex h-[76px] max-w-[1720px] items-center justify-between px-6 md:px-12 lg:px-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img
              src="/logo.png"
              alt="BooleanForce Logo"
              className="h-3 md:h-5 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const hasDropdown = link.name === "Services" || link.name === "About";
                const isActive = mounted && pathname === link.href;
                const isDropdownOpen =
                  link.name === "Services"
                    ? servicesModalOpen
                    : link.name === "About"
                    ? aboutModalOpen
                    : false;

                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={
                      link.name === "Services"
                        ? handleServicesMouseEnter
                        : link.name === "About"
                        ? handleAboutMouseEnter
                        : undefined
                    }
                    onMouseLeave={
                      link.name === "Services"
                        ? handleServicesMouseLeave
                        : link.name === "About"
                        ? handleAboutMouseLeave
                        : undefined
                    }
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 text-[12px] lg:text-[14px] font-medium tracking-wide transition-colors duration-200 ${
                        isActive || isDropdownOpen
                          ? "text-white"
                          : "text-white/85 hover:text-white"
                      }`}
                    >
                      <span>{link.name}</span>
                      {hasDropdown && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isDropdownOpen ? "-rotate-90" : "rotate-90"
                          }`}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">

            {/* Expanding Search Bar */}
            <div
              ref={searchWrapperRef}
              onMouseEnter={() => setSearchExpanded(true)}
              onMouseLeave={() => { if (!searchQuery) setSearchExpanded(false); }}
              className={`relative flex items-center h-10 rounded-lg overflow-hidden transition-all duration-[350ms] ease-in-out
                ${searchExpanded
                  ? "w-[220px] border border-[#F97316]/60  bg-[#0a0f1e] shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                  : "w-10  bg-white/10 hover:bg-[#F97316]/10 hover:shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                }`}
            >
              {/* Search Icon */}
              <button
                onClick={() => setSearchExpanded(true)}
                className="flex-shrink-0 flex items-center justify-center h-10 w-10 text-[#F97316] transition-colors duration-300"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Input Field */}
              <input
                ref={searchBarInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchBarSubmit();
                  if (e.key === "Escape") {
                    setSearchExpanded(false);
                    setSearchQuery("");
                  }
                }}
                placeholder="Search..."
                className={`bg-transparent text-sm text-white placeholder:text-white/40 outline-none transition-all duration-[350ms] ease-in-out
                  ${searchExpanded ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
              />

              {/* Arrow Submit — only when text is typed */}
              <div
                className={`flex-shrink-0 transition-all duration-200 ${
                  searchExpanded && searchQuery ? "w-8 opacity-100 mr-1" : "w-0 opacity-0 overflow-hidden"
                }`}
              >
                <button
                  onClick={handleSearchBarSubmit}
                  className="flex items-center justify-center h-7 w-7 rounded-md bg-[#F97316] text-white hover:bg-orange-500 transition-all duration-200 hover:scale-105"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Let's Talk Button */}
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#1E3A8A] backdrop-blur px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#F97316] transition-all duration-300"
            >
              Let&apos;s Talk
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* ── Services Mega Menu ── */}
        <div
          className={`absolute left-0 right-0 top-[76px] z-50 transition-all duration-300 ${
            servicesModalOpen
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 -translate-y-2"
          }`}
          onMouseEnter={handleServicesMouseEnter}
          onMouseLeave={handleServicesMouseLeave}
        >
          <div className="relative overflow-hidden bg-[#020617] border-t border-white/5 border-b border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(249,115,22,0.18),transparent_30%),radial-gradient(circle_at_85%_55%,rgba(30,58,138,0.30),transparent_35%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:56px_56px]" />

            <div className="relative mx-auto max-w-[1720px] px-6 md:px-12 lg:px-20 py-12">
              <div className="mb-8 flex items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1.5 text-xs font-semibold tracking-widest text-[#F97316]">
                  <Sparkles className="h-3.5 w-3.5" />
                  SERVICES
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                  Services
                </h2>
                <Link
                  href="/services"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F97316] text-white shadow-[0_0_25px_rgba(249,115,22,0.50)] hover:bg-orange-500 transition-all duration-300 hover:scale-105"
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#F97316]">
                  Capabilities
                </p>
                <span className="h-px flex-1 bg-gradient-to-r from-[#F97316]/50 to-transparent" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((service) => {
                  const isOrange = service.accent === "orange";
                  return (
                    <Link
                      key={service.name}
                      href={service.href}
                      className={`group relative overflow-hidden rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                        isOrange
                          ? "border-[#F97316]/30 hover:border-[#F97316]/80 hover:shadow-[0_20px_60px_rgba(249,115,22,0.14)]"
                          : "border-[#1E3A8A]/60 hover:border-blue-500 hover:shadow-[0_20px_60px_rgba(30,58,138,0.22)]"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          isOrange
                            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.15),transparent_40%)]"
                            : "bg-[radial-gradient(circle_at_20%_20%,rgba(30,58,138,0.30),transparent_40%)]"
                        }`}
                      />
                      <div className="relative flex items-center gap-5">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${
                            isOrange
                              ? "border-[#F97316]/70 bg-[#F97316]/15 text-[#F97316]"
                              : "border-blue-500/70 bg-[#1E3A8A]/40 text-blue-300"
                          }`}
                        >
                          <span className="[&>svg]:h-6 [&>svg]:w-6">{service.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold tracking-tight text-white">
                            {service.name}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-white/55">
                            {service.description}
                          </p>
                        </div>
                        <div
                          className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:translate-x-1 md:flex ${
                            isOrange
                              ? "border-[#F97316]/70 text-[#F97316]"
                              : "border-blue-500/70 text-blue-300"
                          }`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Need help choosing?</h3>
                  <p className="mt-1 text-sm text-white/55">
                    Our team is here to guide you to the perfect solution for your business.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-all duration-300 hover:scale-105 hover:bg-orange-500 whitespace-nowrap"
                >
                  Get Consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── About Mega Menu ── */}
        <div
          className={`absolute left-0 right-0 top-[76px] z-50 transition-all duration-300 ${
            aboutModalOpen
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 -translate-y-2"
          }`}
          onMouseEnter={handleAboutMouseEnter}
          onMouseLeave={handleAboutMouseLeave}
        >
          <div className="relative overflow-hidden bg-[#020617] border-t border-white/5 border-b border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(30,58,138,0.30),transparent_30%),radial-gradient(circle_at_15%_65%,rgba(249,115,22,0.14),transparent_35%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:56px_56px]" />

            <div className="relative mx-auto max-w-[1720px] px-6 md:px-12 lg:px-20 py-12">
              <div className="mb-8 flex items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1.5 text-xs font-semibold tracking-widest text-[#F97316]">
                  <Sparkles className="h-3.5 w-3.5" />
                  COMPANY
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                  About
                </h2>
                <Link
                  href="/about-us"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F97316] text-white shadow-[0_0_25px_rgba(249,115,22,0.50)] hover:bg-orange-500 transition-all duration-300 hover:scale-105"
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#F97316]">
                  Company
                </p>
                <span className="h-px flex-1 bg-gradient-to-r from-[#F97316]/50 to-transparent" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {aboutLinks.map((link) => {
                  const isOrange = link.accent === "orange";
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`group relative overflow-hidden rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                        isOrange
                          ? "border-[#F97316]/30 hover:border-[#F97316]/80 hover:shadow-[0_20px_60px_rgba(249,115,22,0.14)]"
                          : "border-[#1E3A8A]/60 hover:border-blue-500 hover:shadow-[0_20px_60px_rgba(30,58,138,0.22)]"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          isOrange
                            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.15),transparent_40%)]"
                            : "bg-[radial-gradient(circle_at_20%_20%,rgba(30,58,138,0.30),transparent_40%)]"
                        }`}
                      />
                      <div className="relative flex items-center gap-5">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${
                            isOrange
                              ? "border-[#F97316]/70 bg-[#F97316]/15 text-[#F97316]"
                              : "border-blue-500/70 bg-[#1E3A8A]/40 text-blue-300"
                          }`}
                        >
                          <span className="[&>svg]:h-6 [&>svg]:w-6">{link.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold tracking-tight text-white">
                            {link.name}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-white/55">
                            {link.description}
                          </p>
                        </div>
                        <div
                          className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:translate-x-1 md:flex ${
                            isOrange
                              ? "border-[#F97316]/70 text-[#F97316]"
                              : "border-blue-500/70 text-blue-300"
                          }`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <span className="h-2 w-2 rounded-full bg-[#1E3A8A] shadow-[0_0_12px_rgba(30,58,138,0.8)]" />
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400">
                  Connect
                </p>
                <span className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/newsletter"
                  className="group relative overflow-hidden rounded-2xl border border-[#1E3A8A]/60 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_20px_60px_rgba(30,58,138,0.22)]"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_20%_20%,rgba(30,58,138,0.30),transparent_40%)]" />
                  <div className="relative flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-blue-500/70 bg-[#1E3A8A]/40 text-blue-300">
                      <span className="[&>svg]:h-6 [&>svg]:w-6">
                        <Sparkles className="w-5 h-5" />
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold tracking-tight text-white">Subscribe</h3>
                      <p className="mt-1 text-sm leading-6 text-white/55">
                        Stay updated with our latest news
                      </p>
                    </div>
                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/70 text-blue-300 transition-all duration-300 group-hover:translate-x-1 md:flex">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/community"
                  className="group relative overflow-hidden rounded-2xl border border-[#F97316]/30 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F97316]/80 hover:shadow-[0_20px_60px_rgba(249,115,22,0.14)]"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.15),transparent_40%)]" />
                  <div className="relative flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#F97316]/70 bg-[#F97316]/15 text-[#F97316]">
                      <span className="[&>svg]:h-6 [&>svg]:w-6">
                        <Users className="w-5 h-5" />
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold tracking-tight text-white">
                        Join Community
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-white/55">
                        Connect with us and stay in touch
                      </p>
                    </div>
                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F97316]/70 text-[#F97316] transition-all duration-300 group-hover:translate-x-1 md:flex">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>

              <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Join our community</h3>
                  <p className="mt-1 text-sm text-white/55">
                    Connect with us and stay updated on the latest trends and innovations.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-all duration-300 hover:scale-105 hover:bg-orange-500 whitespace-nowrap"
                >
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden bg-black/55 backdrop-blur-2xl border-t border-white/10 transition-all duration-500 ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 space-y-5">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent border-b border-white/20 py-3 pl-8 pr-4 text-white placeholder:text-white/45 outline-none"
              />
            </div>

            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-white/10 pb-4">
                <Link
                  href={link.href}
                  className={`block text-xl font-semibold ${
                    mounted && pathname === link.href ? "text-white" : "text-white/85"
                  }`}
                >
                  {link.name}
                </Link>

                {link.name === "Services" && (
                  <div className="mt-4 space-y-4 pl-4">
                    {services.map((service, index) => {
                      const isOrange = service.accent === "orange";
                      return (
                        <Link key={index} href={service.href} className="flex items-start gap-3 text-white/75">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                              isOrange
                                ? "border-[#F97316]/70 bg-[#F97316]/15 text-[#F97316]"
                                : "border-blue-500/70 bg-[#1E3A8A]/40 text-blue-300"
                            }`}
                          >
                            <span className="[&>svg]:h-4 [&>svg]:w-4">{service.icon}</span>
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-white">{service.name}</span>
                            <span className="block text-xs text-white/45">{service.description}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {link.name === "About" && (
                  <div className="mt-4 space-y-4 pl-4">
                    {aboutLinks.map((link, index) => {
                      const isOrange = link.accent === "orange";
                      return (
                        <Link key={index} href={link.href} className="flex items-start gap-3 text-white/75">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                              isOrange
                                ? "border-[#F97316]/70 bg-[#F97316]/15 text-[#F97316]"
                                : "border-blue-500/70 bg-[#1E3A8A]/40 text-blue-300"
                            }`}
                          >
                            <span className="[&>svg]:h-4 [&>svg]:w-4">{link.icon}</span>
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-white">{link.name}</span>
                            <span className="block text-xs text-white/45">{link.description}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-full bg-[#1E3A8A] px-6 py-3 font-semibold text-white hover:bg-[#F97316] transition-all duration-300"
            >
              Let&apos;s Talk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar1;