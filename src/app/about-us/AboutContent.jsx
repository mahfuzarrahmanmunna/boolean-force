"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Users,
  Award,
  Target,
  Lightbulb,
  Twitter,
  Linkedin,
  Github,
  Star,
  Quote,
  Calendar,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart,
  Briefcase,
  Code,
  Palette,
  Megaphone,
  ChevronUp,
  ArrowUpRight,
  Sparkles,
  Layers,
  Cpu,
  Cloud,
  Database,
  Smartphone,
  Bot,
  Palette as PaletteIcon,
  Code as CodeIcon,
  Database as DatabaseIcon,
  Smartphone as SmartphoneIcon,
  Bot as BotIcon,
  Cpu as CpuIcon,
  GitBranch,
  MapPin,
  Mail,
  Phone,
  Send,
  X,
  Linkedin as LinkedinIcon,
  Twitter as TwitterIcon,
  Instagram,
} from "lucide-react";

// ==================== What We Do Section Component ====================
const WhatWeDoSection = () => {
  const [activeService, setActiveService] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: 1,
      number: "01",
      title: "Brand Visual Identity",
      formula:
        "IF (Architecture == Precise) && (Story == Emotive) THEN (Impact = TRUE)",
      description:
        "We engineer identities where strategic logic meets human connection, ensuring your brand is both seen and felt.",
      icon: <PaletteIcon className="w-8 h-8" />,
      gradient: "from-pink-500/20 to-purple-500/20",
      borderColor: "border-pink-500/30",
      accentColor: "text-pink-400",
      features: [
        "Strategic Brand Architecture",
        "Emotive Visual Storytelling",
        "Comprehensive Identity Systems",
        "Brand Guidelines & Assets",
      ],
      metrics: [
        { label: "Brand Recall", value: "+85%" },
        { label: "Engagement", value: "+70%" },
      ],
    },
    {
      id: 2,
      number: "02",
      title: "Web Development",
      formula:
        "IF (Load_Time < 2s) && (UX == Frictionless) THEN (Engagement = TRUE)",
      description:
        "We deploy high-performance digital hubs that prioritize velocity and scalability to keep your users locked in.",
      icon: <CodeIcon className="w-8 h-8" />,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      accentColor: "text-blue-400",
      features: [
        "High-Performance Architecture",
        "Frictionless UX Design",
        "Scalable Infrastructure",
        "SEO-Optimized Development",
      ],
      metrics: [
        { label: "Load Time", value: "<2s" },
        { label: "Conversion", value: "+60%" },
      ],
    },
    {
      id: 3,
      number: "03",
      title: "ERP Software Solutions",
      formula:
        "IF (Workflow == Automated) || (Data == Unified) THEN (Efficiency = TRUE)",
      description:
        "We replace operational chaos with centralized intelligence, building custom ERPs that act as your business's central nervous system.",
      icon: <DatabaseIcon className="w-8 h-8" />,
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      accentColor: "text-green-400",
      features: [
        "Automated Workflows",
        "Unified Data Architecture",
        "Real-time Analytics",
        "Custom Module Development",
      ],
      metrics: [
        { label: "Efficiency", value: "+95%" },
        { label: "Cost Reduction", value: "-40%" },
      ],
    },
    {
      id: 4,
      number: "04",
      title: "POS Systems",
      formula:
        "IF (Transaction == Instant) && (Stock == Realtime) THEN (Satisfaction = TRUE)",
      description:
        "We streamline the point of purchase with smart POS logic, turning every transaction into a seamless data point.",
      icon: <SmartphoneIcon className="w-8 h-8" />,
      gradient: "from-orange-500/20 to-amber-500/20",
      borderColor: "border-orange-500/30",
      accentColor: "text-orange-400",
      features: [
        "Instant Transaction Processing",
        "Real-time Inventory Sync",
        "Multi-location Management",
        "Customer Analytics",
      ],
      metrics: [
        { label: "Speed", value: "<1s" },
        { label: "Accuracy", value: "99.9%" },
      ],
    },
    {
      id: 5,
      number: "05",
      title: "AI Chat Bots",
      formula:
        "IF (Intelligence == Adaptive) && (Response == Instant) THEN (Conversion = TRUE)",
      description:
        "We deploy smart conversational interfaces that automate engagement and resolve queries in real-time, turning every interaction into a growth opportunity.",
      icon: <BotIcon className="w-8 h-8" />,
      gradient: "from-purple-500/20 to-indigo-500/20",
      borderColor: "border-purple-500/30",
      accentColor: "text-purple-400",
      features: [
        "Adaptive AI Intelligence",
        "Instant Response Systems",
        "Multi-channel Integration",
        "Conversational Analytics",
      ],
      metrics: [
        { label: "Response Time", value: "<0.5s" },
        { label: "Resolution Rate", value: "85%" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Decoding{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Complex Problems
            </span>
          </motion.h2>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8"
            variants={itemVariants}
          >
            Delivering{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Logical Solutions
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="relative group"
              variants={itemVariants}
              onHoverStart={() => setHoveredService(service.id)}
              onHoverEnd={() => setHoveredService(null)}
              onClick={() =>
                setActiveService(
                  activeService === service.id ? null : service.id,
                )
              }
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
              ></div>

              <div
                className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border ${service.borderColor} hover:border-opacity-100 transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <span
                        className={`text-4xl font-bold ${service.accentColor} opacity-50`}
                      >
                        {service.number}
                      </span>
                      <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {service.icon}
                      </div>
                      <h3
                        className={`text-2xl font-bold text-white group-hover:${service.accentColor} transition-colors duration-300`}
                      >
                        {service.title}
                      </h3>
                    </div>

                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 font-mono text-sm lg:text-base">
                      <code>
                        <span className="text-blue-300">IF</span>
                        <span className="text-gray-400">
                          {service.formula.split("IF")[1]}{" "}
                        </span>
                      </code>
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                    {service.description}
                  </p>

                  <AnimatePresence>
                    {(hoveredService === service.id ||
                      activeService === service.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                          <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                              <CheckCircle
                                className={`w-4 h-4 mr-2 ${service.accentColor}`}
                              />
                              Key Capabilities
                            </h4>
                            <ul className="space-y-2">
                              {service.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <ArrowRight
                                    className={`w-4 h-4 ${service.accentColor} mr-2 mt-1 flex-shrink-0`}
                                  />
                                  <span className="text-gray-300 text-sm">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                              <Zap
                                className={`w-4 h-4 mr-2 ${service.accentColor}`}
                              />
                              Performance Metrics
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              {service.metrics.map((metric, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white/5 rounded-lg p-3"
                                >
                                  <div
                                    className={`text-2xl font-bold ${service.accentColor}`}
                                  >
                                    {metric.value}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {metric.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ==================== Main AboutUs Component ====================
const AboutContent = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      position: "CEO & Founder",
      bio: "Visionary leader with 15+ years of experience in digital transformation and business strategy. Harvard MBA with a track record of successful exits.",
      image: "https://picsum.photos/seed/alexjohnson/400/400.jpg",
      social: { twitter: "#", linkedin: "#", github: "#" },
      skills: ["Vision", "Product Strategy", "Innovation"],
      achievements: [
        "Forbes 30 Under 30",
        "TechCrunch Disrupt Winner",
        "3x Founder",
      ],
    },
    {
      id: 2,
      name: "Sarah Williams",
      position: "Creative Director",
      bio: "Tech enthusiast passionate about building scalable solutions and leading development teams. Former Google engineer with expertise in distributed systems.",
      image: "https://picsum.photos/seed/sarahwilliams/400/400.jpg",
      social: { twitter: "#", linkedin: "#", github: "#" },
      skills: ["Branding", "Design Systems & Visual Identity"],
      achievements: [
        "AWS Certified Architect",
        "Kubernetes Contributor",
        "Patent Holder",
      ],
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "Lead Developer",
      bio: "Creative mind focused on user experience and creating visually stunning interfaces. Former Apple designer with multiple design awards.",
      image: "https://picsum.photos/seed/michaelchen/400/400.jpg",
      social: { twitter: "#", linkedin: "#", github: "#" },
      skills: ["Web Development", "API Architecture"],
      achievements: [
        "Red Dot Design Award",
        "Awwwards Site of the Day",
        "D&AD Pencil Winner",
      ],
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      position: "Project Manager",
      bio: "Strategic marketer with a proven track record of growing brands and reaching audiences. Former VP of Marketing at a unicorn startup.",
      image: "https://picsum.photos/seed/emilyrodriguez/400/400.jpg",
      social: { twitter: "#", linkedin: "#", github: "#" },
      skills: ["Client Communication & Workflow Optimization"],
      achievements: [
        "Clio Award Winner",
        "AdAge 40 Under 40",
        "Marketing Book Author",
      ],
    },
  ];

  const values = [
    {
      id: 1,
      title: "Impact > Hype",
      description:
        "We bypass fleeting trends to engineer meaningful work with long-term survival logic.",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "#3B85FE",
    },
    {
      id: 2,
      title: "Human-First Input",
      description:
        "We prioritize empathy and user experience, because technology is only as powerful as the people it serves.",
      icon: <Award className="w-8 h-8" />,
      color: "#A9DBDC",
    },
    {
      id: 3,
      title: "Infinite Loop Learning",
      description:
        "Our relentless curiosity ensures every project is a new opportunity to master emerging frontiers.",
      icon: <Target className="w-8 h-8" />,
      color: "#6366F1",
    },
    {
      id: 4,
      title: "Atomic Collaboration",
      description:
        "We build with you in a synchronized partnership, turning shared vision into hardcoded reality.",
      icon: <Users className="w-8 h-8" />,
      color: "#3B85FE",
    },
  ];

  const timeline = [
    {
      year: "2015",
      title: "Company Founded",
      description:
        "Started with a small team and a big vision to transform digital experiences. Initial investment of $500K from angel investors.",
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      year: "2017",
      title: "First Major Client",
      description:
        "Landed our first enterprise client, marking our entry into the big league. Revenue grew 300% in the first year.",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      year: "2019",
      title: "Expansion",
      description:
        "Opened new offices in three cities and expanded our team to 50+ professionals. Series A funding of $5M secured.",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      year: "2021",
      title: "Product Launch",
      description:
        "Launched our flagship SaaS product, serving over 10,000 users worldwide. Reached profitability in Q3.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      year: "2023",
      title: "Industry Recognition",
      description:
        "Received multiple industry awards and recognized as a market leader. Series B funding of $20M at $100M valuation.",
      icon: <Award className="w-6 h-6" />,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Redwan Hasan",
      position: "Founder, StudioNest",
      image: "https://picsum.photos/seed/client1/50/50.jpg",
      content:
        "Working with BooleanForce felt effortless. They understood our idea from day one and delivered a design that finally matched our brand's personality.",
      rating: 5,
      project: "Enterprise Cloud Migration",
    },
    {
      id: 2,
      name: "Farzana Hossain",
      position: "Owner, Bliss Organics",
      image: "https://picsum.photos/seed/client2/50/50.jpg",
      content:
        "They're new, but their work speaks like a seasoned team. Clean design, clear communication, and a genuine passion for what they do",
      rating: 5,
      project: "E-commerce Platform Redesign",
    },
    {
      id: 3,
      name: "Maisha Rahman",
      position: "Co-founder, Bloom Hub",
      image: "https://picsum.photos/seed/client3/50/50.jpg",
      content:
        "A young team with fresh ideas. They gave our business the push it needed with a beautiful brand identity and a smart digital layout.",
      rating: 5,
      project: "MVP Development & Launch",
    },
  ];

  const stats = [
    {
      value: "10+",
      label: "Successful Projects",
      icon: <Users className="w-6 h-6" />,
    },
    {
      value: "6+",
      label: "Happy Clients",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      value: "100%",
      label: "Dedication",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      value: "120+",
      label: "Hours of Research & Brainstorming",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black"
      id="about"
    >
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 backdrop-blur-sm rounded-full mb-6 border border-white/20 bg-white/5"
          >
            <Users className="w-4 h-4 mr-2 text-blue-300" />
            <span className="text-sm font-medium text-blue-300">About Us</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            Where Human Logic Meets
            <span className="text-blue-400"> Digital Force</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto text-gray-300 mb-8"
          >
            At BooleanForce, we believe IF (Brave_Ideas == TRUE) &&
            (Cutting_Edge_Tech == TRUE) THEN (Market_Evolution = INEVITABLE)
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl max-w-5xl mx-auto text-gray-300 mb-8"
          >
            BooleanForce is a new-age creative technology business born to
            bridge the gap between high-level imagination and binary
            intelligence. Our mindset is simple: Like Boolean logic, a digital
            solution should be clear, precise, and purposeful. We specialize in
            transforming abstract concepts into high-performance digital
            realities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              The BooleanForce Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
            <motion.button
              className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10 border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Start Your Project
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Our <span className="text-blue-400">Impact</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every business begins small but the right work creates results
              that matter.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
                whileHover={{ y: -10 }}
              >
                <div className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5 h-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-500/20">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-blue-400">
                    {stat.value}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-20 px-6 bg-gray-900">
        <div className="container mx-auto max-w-6xl z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Our <span className="text-blue-400">Story</span>
              </h2>

              <h2 className="text-gray-300 mb-6 font-bold text-3xl">
                Building Beyond the Deliverable
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                BooleanForce was founded by a collective of creators who
                realized that the world didn't need more finished projects; it
                needed more meaningful experiences. We launched with a singular
                mission: to provide the technical force and creative logic
                required to move businesses from potential to production. For
                us, every project isn't just a task; it's the next logical step
                in our shared evolution.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Today, we continue to push boundaries and explore new
                possibilities, always staying true to our core values of
                innovation, excellence, and integrity.
              </p>
              <motion.button
                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center bg-gradient-to-r from-blue-500 to-purple-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://picsum.photos/seed/ourstory/800/600.jpg"
                  alt="Our Story"
                  className="w-full h-auto object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 px-6 bg-black">
        <div className="container mx-auto max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Our <span className="text-blue-400">Values</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide our work and define our culture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5"
                whileHover={{ y: -10 }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${value.color}20` }}
                >
                  <div style={{ color: value.color }}>{value.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {value.title}
                </h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* What We Do Section */}
      <WhatWeDoSection />
      {/* Team Section */}
      <section className="relative py-20 px-6 bg-gray-900">
        <div className="container mx-auto max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Meet Our <span className="text-blue-400">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Behind every BooleanForce project is a passionate team of
              creators, thinkers, and innovators; each dedicated to turning
              ideas into real, logical outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
                onMouseEnter={() => setActiveTeamMember(member.id)}
                onMouseLeave={() => setActiveTeamMember(null)}
              >
                <div
                  className="rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 bg-white/5"
                  style={{
                    transform:
                      activeTeamMember === member.id
                        ? "translateY(-10px)"
                        : "translateY(0)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: activeTeamMember === member.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1 text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm mb-4 text-blue-400">
                      {member.position}
                    </p>
                    <p className="text-sm text-gray-300 mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      <motion.a
                        href={member.social.twitter}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                        whileHover={{ scale: 1.2, backgroundColor: "#3B85FE" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <TwitterIcon className="w-4 h-4 text-white" />
                      </motion.a>
                      <motion.a
                        href={member.social.linkedin}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                        whileHover={{ scale: 1.2, backgroundColor: "#3B85FE" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <LinkedinIcon className="w-4 h-4 text-white" />
                      </motion.a>
                      <motion.a
                        href={member.social.github}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                        whileHover={{ scale: 1.2, backgroundColor: "#3B85FE" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Github className="w-4 h-4 text-white" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-gray-300 text-center mt-4 text-xl">
            <i>
              Our team operates with a shared principle: IF (Teamwork = TRUE)
              THEN (Success = CERTAIN)
            </i>
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-20 px-6 bg-black">
        <div className="container mx-auto max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white">
              Our <span className="text-blue-400">Journey</span>
            </h2>

            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-start">
              Initializing the Force
            </h2>
            <p className="text-xl text-gray-300 text-start mb-10">
              BooleanForce was initialized in 2025 with a clear intent: to fuse
              architectural logic with emotive design. We are a lean team of
              builders and strategists who believe that high-tier digital
              experiences shouldn't just be viewed; they should be felt. As a
              2025 business, we are currently in our high-growth phase, refining
              our vision through real-world deployments and rapid iteration.
              Every collaboration is a new data point that makes our framework
              stronger.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-700"></div>

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}
                >
                  <div className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5">
                    <div
                      className="flex items-center mb-2"
                      style={{
                        justifyContent:
                          index % 2 === 0 ? "flex-end" : "flex-start",
                      }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-blue-500/20">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-blue-400">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 bg-blue-500">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 px-6 bg-gray-900">
        <div className="container mx-auto max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What Our <span className="text-blue-400">Clients Say</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our clients have to
              say about working with us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-6 backdrop-blur-sm border border-white/10 bg-white/5"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 mr-1 text-blue-400"
                      fill="#3B85FE"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 mb-4 text-blue-400 opacity-30" />
                <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-bold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-blue-400">{testimonial.project}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 bg-black">
        <div className="container mx-auto max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl p-12 text-center backdrop-blur-sm border border-white/10"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 133, 254, 0.1), rgba(169, 219, 220, 0.1))",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Your Next Big Idea{" "}
              <span className="text-blue-400">Starts Here</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Tell us what you're dreaming of. We will shape it, design it, and
              bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#contact"
                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Connect
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.a>
              <motion.a
                href="#projects"
                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 border flex items-center justify-center hover:bg-white/10 border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Projects
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center z-40 bg-blue-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown className="w-5 h-5 text-white rotate-180" />
        </motion.button>
      )}
    </div>
  );
};

export default AboutContent;
