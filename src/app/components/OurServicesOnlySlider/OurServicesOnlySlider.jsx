"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Code,
  Terminal,
} from "lucide-react";
import Link from "next/link";

// Define your brand colors as constants
const PRIMARY_COLOR = "#3B85FE";
const SECONDARY_COLOR = "#A9DBDC";
const ACCENT_COLOR = "#6366F1";
const DARK_BG = "#0F172A";
const LIGHT_TEXT = "#F1F5F9";

const OurServicesOnlySlider = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);

  // Updated Services Array with specific images for each service
  const services = [
    {
      id: 1,
      title: "Brand Visual Identity = (Design + Emotion)",
      description:
        "Your brand deserves logic and love. We shape visual identities that connect emotionally and communicate clearly. In addition, we always ensure that your design meets precision.",
      code: "IF (Brand != NULL) THEN (Recognition = TRUE)",
      features: [
        "Logo Design & Branding",
        "Brand Guidelines",
        "Marketing Materials",
        "Digital Asset Creation",
      ],
      detail:
        "Our brand identity services help you establish a memorable presence in your market. We create cohesive visual systems that communicate your values and resonate with your target audience.",
      slug: "brand-visual-identity",
      icon: <Code className="w-5 h-5" />,
      color: PRIMARY_COLOR,
      image: "https://i.ibb.co.com/BMqCvf2/brand1.png", // Specific Brand Image
    },
    {
      id: 2,
      title: "Web Development = (Speed × Functionality)",
      description:
        "We build responsive, high-performing websites that speak your brand’s language. Because in our code, performance is always TRUE",
      code: "IF (Responsive AND SEO) THEN (Conversions++)",
      features: [
        "Custom Web Development",
        "E-commerce Solutions",
        "Mobile-First Design",
        "SEO Optimization",
      ],
      detail:
        "We develop high-performance websites that not only look stunning but also deliver exceptional user experiences and drive business growth through conversion-focused design.",
      slug: "website-development",
      icon: <Terminal className="w-5 h-5" />,
      color: SECONDARY_COLOR,
      image: "https://i.ibb.co.com/cs66DMT/web.png", // Specific Web Image
    },
    {
      id: 3,
      title: "ERP Software Solutions = (Automation + Control)",
      description:
        "We create intelligent ERP systems that streamline your workflow and give you full command.Because we believe that when operations are optimized, efficiency = TRUE.",
      code: "WHILE (Process != Automated) { Optimize() }",
      features: [
        "Custom ERP Development",
        "Business Process Automation",
        "Data Integration",
        "Cloud-Based Solutions",
      ],
      detail:
        "Our ERP solutions integrate all aspects of your business operations into a unified system, improving efficiency, data accuracy, and decision-making capabilities.",
      slug: "erp-software-solutions",
      icon: <Code className="w-5 h-5" />,
      color: ACCENT_COLOR,
      image: "https://i.ibb.co.com/QFsXBTH0/erp.png", // Specific ERP Image
    },
    {
      id: 4,
      title: "POS Systems = (Ease + Efficiency)",
      description:
        "We provide modern point-of-sale systems tailored for your business logic. Because smoothtransactions = Happy Customers.",
      code: "IF (POS == Modern) THEN (Sales = MAX)",
      features: [
        "Custom POS Development",
        "Inventory Management",
        "Payment Integration",
        "Analytics & Reporting",
      ],
      detail:
        "Transform your retail operations with our cutting-edge POS systems that streamline transactions, manage inventory, and provide valuable insights into your business performance.",
      slug: "pos-systems",
      icon: <Terminal className="w-5 h-5" />,
      color: PRIMARY_COLOR,
      image: "https://i.ibb.co.com/4RYw8mHD/pos.webp", // Specific POS Image
    },
    {
      id: 5,
      title: "AI Chat Bots = (Intelligence = Conversion)",
      description:
        "We build smart, conversational interfaces that understand user intent and automate engagement.Because when AI handles the noise, your team can focus on the signal.",
      code: "IF (AI == Intelligent) THEN (Engagement = MAX)",
      features: [
        "Custom AI Chat Bot Development",
        "Natural Language Processing",
        "Automated Customer Support",
        "Integration with Existing Systems",
      ],
      detail:
        "Our AI chatbots are designed to understand and respond to customer queries intelligently, providing seamless support and enhancing user engagement.",
      slug: "ai-chat-bots",
      icon: <Code className="w-5 h-5" />,
      color: ACCENT_COLOR,
      image: "https://i.ibb.co.com/TB4cL8nR/ai.png", // Specific AI Image
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentServiceIndex((prevIndex) =>
          prevIndex === services.length - 1 ? 0 : prevIndex + 1,
        );
      }, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isHovered, services.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setCurrentServiceIndex((prevIndex) =>
          prevIndex === services.length - 1 ? 0 : prevIndex + 1,
        );
      } else if (e.key === "ArrowLeft") {
        setCurrentServiceIndex((prevIndex) =>
          prevIndex === 0 ? services.length - 1 : prevIndex - 1,
        );
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, services.length]);

  const handleDotClick = (index) => {
    setCurrentServiceIndex(index);
  };

  const handlePrev = () => {
    setCurrentServiceIndex((prevIndex) =>
      prevIndex === 0 ? services.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentServiceIndex((prevIndex) =>
      prevIndex === services.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section
      ref={sliderRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-slate-950"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tight"
            style={{ color: LIGHT_TEXT }}
          >
            Our Services
          </h2>
          <div
            className="w-24 h-1 mx-auto rounded-full shadow-[0_0_15px_rgba(59,133,254,0.5)]"
            style={{ backgroundColor: PRIMARY_COLOR }}
          ></div>
        </motion.div>

        {/* Slider container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Slider content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentServiceIndex}
              initial={{ opacity: 0, x: 50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Service Image (Dynamic) */}
              <div className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group border border-white/10 bg-slate-900">
                  {/* Dynamic Image Source based on current slide */}
                  <img
                    src={services[currentServiceIndex].image}
                    alt={services[currentServiceIndex].title}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay"
                    style={{ background: services[currentServiceIndex].color }}
                  ></div>
                  {/* Floating Label on Image */}
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-white flex items-center gap-2">
                    {services[currentServiceIndex].icon}
                    <span>Service {currentServiceIndex + 1}</span>
                  </div>
                </div>
              </div>

              {/* Service content */}
              <div className="order-1 lg:order-2">
                <div className="mb-8">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border"
                    style={{
                      backgroundColor: `${services[currentServiceIndex].color}10`,
                      borderColor: `${services[currentServiceIndex].color}30`,
                      color: services[currentServiceIndex].color,
                    }}
                  >
                    Active Module
                  </span>
                  <h3
                    className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                    style={{ color: LIGHT_TEXT }}
                  >
                    {services[currentServiceIndex].title}
                  </h3>
                </div>

                <p
                  className="text-lg mb-8 leading-relaxed text-slate-400 border-l-2 pl-4"
                  style={{ borderColor: services[currentServiceIndex].color }}
                >
                  {services[currentServiceIndex].description}
                </p>

                {/* Professional Code Block */}
                <div className="rounded-xl p-5 mb-8 font-mono text-sm border border-white/10 bg-slate-950/50 backdrop-blur-sm shadow-inner overflow-hidden">
                  <div className="flex gap-2 mb-3 opacity-50">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <code>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">logic</span> = {"{"}
                    <br />
                    <span className="pl-4 text-green-400">
                      {services[currentServiceIndex].code}
                    </span>
                    <br />
                    {"}"}
                  </code>
                </div>

                <ul className="space-y-4 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services[currentServiceIndex].features.map(
                    (feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex items-center text-slate-300 text-sm"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0"
                          style={{
                            backgroundColor:
                              services[currentServiceIndex].color,
                            boxShadow: `0 0 10px ${services[currentServiceIndex].color}`,
                          }}
                        ></div>
                        {feature}
                      </motion.li>
                    ),
                  )}
                </ul>

                {/* Dynamic Link Button */}
                <Link
                  href={`/${services[currentServiceIndex].slug}`}
                  className="group inline-flex items-center px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${services[currentServiceIndex].color}, ${services[currentServiceIndex].color}80)`,
                    boxShadow: `0 10px 30px -10px ${services[currentServiceIndex].color}40`,
                  }}
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-12">
            {/* Previous button */}
            <button
              onClick={handlePrev}
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-3">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${index === currentServiceIndex ? "w-12" : "w-4 bg-white/20 hover:bg-white/40"}`}
                  style={{
                    backgroundColor:
                      index === currentServiceIndex
                        ? services[currentServiceIndex].color
                        : "",
                  }}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Play/Pause button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={togglePlayPause}
              className="p-3 rounded-full text-slate-500 hover:text-white transition-colors hover:bg-white/5"
              title={isPlaying ? "Pause Slider" : "Play Slider"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesOnlySlider;
