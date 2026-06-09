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
      image: "https://picsum.photos/seed/brandidentity/1200/800.jpg",
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
      image: "https://picsum.photos/seed/webdevelopment/1200/800.jpg",
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
      image: "https://picsum.photos/seed/erpsolutions/1200/800.jpg",
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
      image: "https://picsum.photos/seed/possystem/1200/800.jpg",
      icon: "🛒",
      color: PRIMARY_COLOR,
    },
  ];

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
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
 
                .services-section * {
                    font-family: 'DM Sans', sans-serif;
                }
                .services-section h2,
                .services-section h3 {
                    font-family: 'Syne', sans-serif;
                }
 
                /* Swiper overrides — peek layout */
                .services-swiper {
                    overflow: visible !important;
                    width: 100%;
                }
 
                /* Each slide: image (left, ~42%) + content (right) side by side */
                .services-swiper .swiper-slide {
                    /* Show roughly 85% of current + peek ~15% of next */
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
                .services-swiper .swiper-slide-next {
                    opacity: 0.5;
                }
 
                @media (max-width: 768px) {
                    .services-swiper .swiper-slide {
                        width: 92vw;
                    }
                }
 
                /* Divider line accent */
                .slide-divider {
                    width: 3px;
                    background: linear-gradient(to bottom, transparent, #F97316, transparent);
                    align-self: stretch;
                    flex-shrink: 0;
                }
 
                /* "Read more" button */
                .read-more-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0px;
                    font-family: 'Syne', sans-serif;
                    font-weight: 600;
                    font-size: 0.95rem;
                    letter-spacing: 0.02em;
                    color: ${LIGHT_TEXT};
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    transition: gap 0.3s ease;
                }
                .read-more-btn:hover {
                    gap: 6px;
                }
                .read-more-btn .arrow-box {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    margin-left: 12px;
                    background-color: ${PRIMARY_COLOR};
                    transition: background-color 0.3s ease, transform 0.3s ease;
                    flex-shrink: 0;
                }
                .read-more-btn:hover .arrow-box {
                    background-color: ${SECONDARY_COLOR};
                    transform: translateX(3px);
                }
 
                /* nav buttons */
                .nav-btn {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.06);
                    color: ${LIGHT_TEXT};
                    cursor: pointer;
                    transition: background 0.25s, border-color 0.25s, transform 0.2s;
                }
                .nav-btn:hover {
                    background: ${PRIMARY_COLOR};
                    border-color: ${PRIMARY_COLOR};
                    transform: scale(1.08);
                }
 
                .pause-btn {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.06);
                    color: ${LIGHT_TEXT};
                    cursor: pointer;
                    transition: background 0.25s, border-color 0.25s, transform 0.2s;
                }
                .pause-btn:hover {
                    background: rgba(255,255,255,0.14);
                    transform: scale(1.08);
                }
 
                /* orange underline on section title */
                .section-title-wrap {
                    position: relative;
                    display: inline-block;
                }
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
            `}</style>

      <div className="services-section relative z-10 w-full mx-auto py-16">
        {/* Section header — left-aligned like the screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 px-6 text-center"
          style={{ paddingLeft: "35vw", paddingRight: "35vw" }}
        >
          {/* <p
                        className="text-xs font-semibold tracking-widest uppercase mb-3"
                        style={{ color: PRIMARY_COLOR, fontFamily: 'Syne, sans-serif' }}
                    >
                        What We Offer
                    </p> */}
          <div className="section-title-wrap">
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{
                color: LIGHT_TEXT,
                fontFamily: "Syne, sans-serif",
                lineHeight: 1.1,
              }}
            >
              Our Services
            </h2>
          </div>
        </motion.div>

        {/* Swiper — left-anchored, peek on right */}
        <div className="relative w-full" style={{ paddingLeft: "0vw" }}>
          <Swiper
            modules={[Autoplay, Navigation]}
            slidesPerView="auto"
            centeredSlides={false}
            spaceBetween={28}
            loop={true}
            speed={1000} // 1 second transition
            autoplay={
              isPlaying ? { delay: 7000, disableOnInteraction: false } : false
            }
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setCurrentServiceIndex(swiper.realIndex)}
            className="services-swiper"
          >
            {services.map((service, index) => (
              <SwiperSlide key={service.id}>
                {/* Card: horizontal split — image left, content right */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "400px",
                    borderRadius: "0px",
                    overflow: "hidden",
                    // background: '#111111',
                    // border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* IMAGE — left side, fixed ~42% */}
                  <div
                    style={{
                      width: "52%",
                      flexShrink: 0,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {/* subtle color tint overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(160deg, ${service.color}22 0%, transparent 60%)`,
                      }}
                    />
                  </div>

                  {/* Thin vertical divider */}
                  <div className="slide-divider" />

                  {/* CONTENT — right side */}
                  <div
                    style={{
                      flex: 1,
                      padding: "44px 40px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "0",
                      overflowY: "hidden",
                    }}
                  >
                    {/* Label */}
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: service.color,

                        marginBottom: "14px",
                        display: "block",
                      }}
                    >
                      Service {index + 1} / {services.length}
                    </span>

                    {/* Title */}
                    <h3
                      style={{
                        // fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        // fontSize: 'clamp(1.4rem, 2vw, 2rem)',
                        fontSize: "2rem",
                        color: LIGHT_TEXT,
                        lineHeight: 1.15,
                        marginBottom: "14px",
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "0.93rem",
                        lineHeight: 1.7,
                        color: "rgba(241,245,249,0.72)",
                        marginBottom: "20px",
                        maxWidth: "420px",
                      }}
                    >
                      {service.description}
                    </p>

                    {/* Code snippet */}
                    <div
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        border: `1px solid ${service.color}35`,
                        borderLeft: `3px solid ${service.color}`,
                        borderRadius: "4px",
                        padding: "10px 14px",
                        fontSize: "0.72rem",
                        color: "#1E3A8A",
                        marginBottom: "20px",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {service.code}
                    </div>

                    {/* Features list */}
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0 0 26px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              background: service.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 20 20"
                              fill="white"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span
                            style={{
                              fontSize: "0.875rem",
                              color: "rgba(241,245,249,0.78)",
                            }}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Read more — matches screenshot style */}
                    <button className="read-more-btn">
                      Learn More
                      <span className="arrow-box">
                        <ArrowRight size={16} color="white" />
                      </span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Controls bar */}
        <div
          className="flex justify-between items-center mt-8"
          style={{ paddingLeft: "8vw", paddingRight: "8vw" }}
        >
          {/* Play / Pause */}
          <button
            className="pause-btn"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Fraction + arrow nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="nav-btn"
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              style={{
                minWidth: "64px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.06)",

                fontWeight: 700,
                fontSize: "0.95rem",
                color: LIGHT_TEXT,
                letterSpacing: "0.06em",
                userSelect: "none",
              }}
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
              <span style={{ opacity: 0.4, margin: "0 4px" }}>/</span>
              <span style={{ opacity: 0.65 }}>{services.length}</span>
            </div>

            <button
              className="nav-btn"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesOnlySlider;
