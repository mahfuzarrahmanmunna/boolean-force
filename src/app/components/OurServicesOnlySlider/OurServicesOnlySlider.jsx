"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Brand colors
const PRIMARY_COLOR = "#F97316"; // orange
const SECONDARY_COLOR = "#1E3A8A"; // deep blue
const ACCENT_COLOR = "#FB923C"; // lighter orange accent
const DARK_BG = "#0A0A0A";
const LIGHT_TEXT = "#F1F5F9";

const OurServicesOnlySlider = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef(null);

  const services = [
    {
      id: 1,
      title: "Brand Visual Identity",
      description:
        "Create a powerful brand presence that resonates with your audience and drives recognition.",
      code: "IF (Brand != NULL) THEN (Recognition = TRUE)",
      features: [
        "Logo Design & Branding",
        "Brand Guidelines",
        "Marketing Materials",
        "Digital Asset Creation",
      ],
      detail:
        "Our brand identity services help you establish a memorable presence in your market. We create cohesive visual systems that communicate your values and resonate with your target audience.",
      image: "uploads/74d2debc-62cf-4ce2-ab80-7e68bb3bcd85_8bff4523-181f-4f1e-b8df-7cbf3c1c6aaf.png",
      icon: "🎨",
      color: PRIMARY_COLOR,
    },
    {
      id: 2,
      title: "Website Development",
      description:
        "Build responsive, SEO-optimized websites that convert visitors into customers.",
      code: "IF (Responsive AND SEO) THEN (Conversions++)",
      features: [
        "Custom Web Development",
        "E-commerce Solutions",
        "Mobile-First Design",
        "SEO Optimization",
      ],
      detail:
        "We develop high-performance websites that not only look stunning but also deliver exceptional user experiences and drive business growth through conversion-focused design.",
      image: "uploads/Tech-innovation-224.jpg",
      icon: "💻",
      color: SECONDARY_COLOR,
    },
    {
      id: 3,
      title: "ERP Software Solutions",
      description:
        "Streamline your business operations with custom ERP systems tailored to your needs.",
      code: "WHILE (Process != Automated) { Optimize() }",
      features: [
        "Custom ERP Development",
        "Business Process Automation",
        "Data Integration",
        "Cloud-Based Solutions",
      ],
      detail:
        "Our ERP solutions integrate all aspects of your business operations into a unified system, improving efficiency, data accuracy, and decision-making capabilities.",
      image: "uploads/digital-network-display-interaction-with-stylus-technology-interface-free-photo.jpg",
      icon: "⚙️",
      color: ACCENT_COLOR,
    },
    {
      id: 4,
      title: "POS System",
      description:
        "Modern point-of-sale solutions that enhance customer experience and boost sales.",
      code: "IF (POS == Modern) THEN (Sales = MAX)",
      features: [
        "Custom POS Development",
        "Inventory Management",
        "Payment Integration",
        "Analytics & Reporting",
      ],
      detail:
        "Transform your retail operations with our cutting-edge POS systems that streamline transactions, manage inventory, and provide valuable insights into your business performance.",
      image: "uploads/EXPERT-UX-optimized.webp",
      icon: "🛒",
      color: PRIMARY_COLOR,
    },
  ];

  // Track viewport size for mobile layout switch
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!swiperRef.current) return;
      if (e.key === "ArrowRight") {
        swiperRef.current.slideNext();
      } else if (e.key === "ArrowLeft") {
        swiperRef.current.slidePrev();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (!swiperRef.current) return;
    if (isPlaying) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
    setIsPlaying((prev) => !prev);
  };

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  const currentService = services[currentServiceIndex];

  return (
    <section
      className="relative min-h-screen overflow-hidden flex flex-col justify-center"
      style={{ backgroundColor: DARK_BG }}
    >
      {/*
        Minimal <style> block — only for things Tailwind can't express:
        - Google Fonts import
        - font-family overrides on descendant selectors
        - Swiper library class overrides (.swiper-slide, .swiper-slide-active, etc.)
        - ::after pseudo-element (section title underline)
        - Transition on gap property (.read-more-btn:hover gap)
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .services-section * { font-family: 'DM Sans', sans-serif; }
        .services-section h2,
        .services-section h3 { font-family: 'Syne', sans-serif; }

        /* Swiper overrides */
        .services-swiper { overflow: visible !important; width: 100%; }
        .services-swiper .swiper-slide {
          width: 85vw;
          max-width: 1080px;
          min-width: 320px;
          height: auto;
          transition: opacity 0.45s ease, transform 0.45s ease;
          opacity: 0.3;
          transform: scale(0.97);
          pointer-events: none;
        }
        .services-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }
        .services-swiper .swiper-slide-next { opacity: 0.5; }

        @media (max-width: 768px) {
          .services-swiper .swiper-slide { width: 90vw; min-width: 0; }
        }
        @media (max-width: 480px) {
          .services-swiper .swiper-slide { width: 92vw; min-width: 0; }
        }

        /* Section title ::after underline */
        .section-title-wrap { position: relative; display: inline-block; }
        .section-title-wrap::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 56px;
          height: 3px;
          background: ${PRIMARY_COLOR};
          border-radius: 2px;
        }

        /* read-more gap transition (Tailwind can't animate gap on hover) */
        .read-more-btn { gap: 0px; transition: gap 0.3s ease; }
        .read-more-btn:hover { gap: 6px; }
        .read-more-btn .arrow-box { transition: background-color 0.3s ease, transform 0.3s ease; }
        .read-more-btn:hover .arrow-box {
          background-color: ${SECONDARY_COLOR} !important;
          transform: translateX(3px);
        }
      `}</style>

      <div className="services-section relative z-10 w-full mx-auto py-16">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 px-6 text-center px-[6vw] md:px-[35vw]"
        >
          <div className="section-title-wrap">
            <h2
              className="text-4xl md:text-5xl font-bold leading-none"
              style={{ color: LIGHT_TEXT, fontFamily: "Syne, sans-serif" }}
            >
              Our Services
            </h2>
          </div>
        </motion.div>

        {/* ── Swiper ── */}
        <div className="relative w-full">
          <Swiper
            modules={[Autoplay, Navigation]}
            slidesPerView="auto"
            centeredSlides={false}
            spaceBetween={28}
            loop={true}
            speed={1000}
            autoplay={
              isPlaying ? { delay: 7000, disableOnInteraction: false } : false
            }
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={(swiper) => setCurrentServiceIndex(swiper.realIndex)}
            className="services-swiper"
          >
            {services.map((service, index) => (
              <SwiperSlide key={service.id}>

                {/* ── Card ── */}
                <div className="flex flex-col md:flex-row md:h-[400px] overflow-hidden rounded-none">

                  {/* Image — left on desktop, top on mobile */}
                  <div className="relative overflow-hidden w-full h-[220px] md:w-[52%] md:h-auto flex-shrink-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover block"
                    />
                    {/* Color tint overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(160deg, ${service.color}22 0%, transparent 60%)`,
                      }}
                    />
                  </div>

                  {/* Divider — vertical on desktop, horizontal on mobile */}
                  <div
                    className="flex-shrink-0 self-stretch"
                    style={{
                      width: isMobile ? "auto" : "3px",
                      height: isMobile ? "3px" : "auto",
                      background: isMobile
                        ? "linear-gradient(to right, transparent, #F97316, transparent)"
                        : "linear-gradient(to bottom, transparent, #F97316, transparent)",
                    }}
                  />

                  {/* Content — right on desktop, below image on mobile */}
                  <div className="flex-1 flex flex-col justify-center gap-0 overflow-y-hidden p-7 md:px-10 md:py-11">

                    {/* Label */}
                    <span
                      className="block mb-3.5 text-[0.72rem] font-bold tracking-[0.14em] uppercase"
                      style={{ color: service.color }}
                    >
                      Service {index + 1} / {services.length}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-2xl sm:text-[2rem] font-bold leading-[1.15] mb-3.5"
                      style={{ color: LIGHT_TEXT }}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-[0.93rem] leading-[1.7] mb-5 max-w-[420px]"
                      style={{ color: "rgba(241,245,249,0.72)" }}
                    >
                      {service.description}
                    </p>

                    {/* Code snippet */}
                    <div
                      className="mb-5 rounded px-3.5 py-2.5 text-[0.72rem] tracking-[0.01em] break-words"
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        border: `1px solid ${service.color}35`,
                        borderLeft: `3px solid ${service.color}`,
                        color: "#1E3A8A",
                      }}
                    >
                      {service.code}
                    </div>

                    {/* Features list */}
                    <ul className="list-none p-0 m-0 mb-6 flex flex-col gap-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span
                            className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: service.color }}
                          >
                            <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span
                            className="text-[0.875rem]"
                            style={{ color: "rgba(241,245,249,0.78)" }}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Read more button */}
                    <button
                      className="read-more-btn inline-flex items-center border-none bg-transparent cursor-pointer p-0"
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        letterSpacing: "0.02em",
                        color: LIGHT_TEXT,
                      }}
                    >
                      Learn More
                      <span
                        className="arrow-box w-9 h-9 flex items-center justify-center rounded ml-3 flex-shrink-0"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                      >
                        <ArrowRight size={16} color="white" />
                      </span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── Controls bar ── */}
        <div className="flex justify-between items-center mt-8 px-[6vw] md:px-[8vw]">

          {/* Play / Pause */}
          <button
            className="w-11 h-11 flex items-center justify-center rounded border border-white/[0.12] bg-white/[0.06] cursor-pointer transition-all duration-200 hover:bg-white/[0.14] hover:scale-[1.08]"
            style={{ color: LIGHT_TEXT }}
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Fraction + arrow nav */}
          <div className="flex items-center gap-2">

            {/* Prev */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded border border-white/[0.12] bg-white/[0.06] cursor-pointer transition-all duration-200 hover:scale-[1.08]"
              style={{ color: LIGHT_TEXT }}
              onClick={handlePrev}
              aria-label="Previous slide"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = PRIMARY_COLOR;
                e.currentTarget.style.borderColor = PRIMARY_COLOR;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Counter */}
            <div
              className="min-w-[64px] h-11 flex items-center justify-center border border-white/[0.12] rounded bg-white/[0.06] font-bold text-[0.95rem] tracking-[0.06em] select-none"
              style={{ color: LIGHT_TEXT }}
            >
              <motion.span
                key={`cur-${currentServiceIndex}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: currentService.color }}
              >
                {currentServiceIndex + 1}
              </motion.span>
              <span className="opacity-40 mx-1">/</span>
              <span className="opacity-65">{services.length}</span>
            </div>

            {/* Next */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded border border-white/[0.12] bg-white/[0.06] cursor-pointer transition-all duration-200 hover:scale-[1.08]"
              style={{ color: LIGHT_TEXT }}
              onClick={handleNext}
              aria-label="Next slide"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = PRIMARY_COLOR;
                e.currentTarget.style.borderColor = PRIMARY_COLOR;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesOnlySlider;