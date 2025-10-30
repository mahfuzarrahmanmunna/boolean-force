"use client";

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    ExternalLink,
    Github,
    Globe,
    Layers,
    Code,
    Palette,
    Zap,
    Smartphone,
    Database,
    Cloud,
    Mail,
    ChevronRight,
    Star,
    Play,
    Calendar,
    Clock,
    Award,
    TrendingUp,
    Users,
    Target,
    Lightbulb
} from 'lucide-react';

const Portfolio = () => {
    const [filter, setFilter] = useState('all');
    const [activeProject, setActiveProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [hoveredProject, setHoveredProject] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    const projects = [
        {
            id: 1,
            title: "E-Commerce Platform",
            category: "web",
            image: "https://images.unsplash.com/photo-1556740730-6d39d11e85dba5a6d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            description: "A modern e-commerce platform with advanced features including inventory management, payment processing, and analytics. Built with scalability and user experience in mind.",
            technologies: ["Next.js", "React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
            featured: true,
            link: "/portfolio/ecommerce-platform",
            demoUrl: "https://demo.booleanforce.com/ecommerce-demo",
            testimonial: {
                name: "Sarah Johnson",
                position: "CEO, TechStart Inc.",
                content: "BooleanForce transformed our e-commerce platform completely. The results have exceeded our expectations with a 300% increase in conversions.",
                rating: 5,
                image: "https://picsum.photos/seed/sarahjohnson/100/100.jpg"
            },
            stats: {
                increase: "300%",
                metric: "Conversion Rate"
            }
        },
        {
            id: 2,
            title: "ERP Dashboard",
            category: "web",
            image: "https://images.unsplash.com/photo-1555051229-e1a8a6d3d5d8b5c6a3d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            description: "Comprehensive ERP dashboard for managing business operations, financial reporting, and resource planning with real-time data visualization.",
            technologies: ["React", "D3.js", "Node.js", "Express", "MongoDB", "Chart.js"],
            featured: false,
            link: "/portfolio/erp-dashboard",
            demoUrl: "https://demo.booleanforce.com/erp-demo",
            testimonial: {
                name: "Michael Chen",
                position: "CTO, Global Tech Corp",
                content: "The ERP dashboard has streamlined our operations significantly. We've seen a 40% reduction in processing time.",
                rating: 5,
                image: "https://picsum.photos/seed/michaelchen/100/100.jpg"
            },
            stats: {
                increase: "40%",
                metric: "Processing Time"
            }
        },
        {
            id: 3,
            title: "Mobile Banking App",
            category: "mobile",
            image: "https://images.unsplash.com/photo-151292777355-a7d6d3d5d8b5c6a3d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            description: "Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management features.",
            technologies: ["React Native", "TypeScript", "Node.js", "Firebase", "Biometric Authentication"],
            featured: false,
            link: "/portfolio/mobile-banking",
            demoUrl: "https://demo.booleanforce.com/mobile-banking-demo",
            testimonial: {
                name: "Emily Rodriguez",
                position: "Product Manager, FinTech Solutions",
                content: "The mobile app has revolutionized how our customers interact with their finances. User engagement has increased by 65%.",
                rating: 5,
                image: "https://picsum.photos/seed/emilyrodriguez/100/100.jpg"
            },
            stats: {
                increase: "65%",
                metric: "User Engagement"
            }
        },
        {
            id: 4,
            title: "Cloud Migration Tool",
            category: "cloud",
            image: "https://images.unsplash.com/photo-1558627780-2e6c6d5d8b5c6a3d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            description: "Automated cloud migration tool that simplifies the process of moving data between different cloud providers with zero downtime.",
            technologies: ["Python", "AWS", "Google Cloud", "Azure", "Terraform"],
            featured: false,
            link: "/portfolio/cloud-migration",
            demoUrl: "https://demo.booleanforce.com/cloud-migration-demo",
            testimonial: {
                name: "David Kim",
                position: "CTO, DataFlow Systems",
                content: "The migration tool saved us 200+ hours of manual work and eliminated data loss.",
                rating: 5,
                image: "https://picsum.photos/seed/davidkim/100/100.jpg"
            },
            stats: {
                increase: "200+",
                metric: "Time Saved"
            }
        },
        {
            id: 5,
            title: "Brand Identity System",
            category: "brand",
            image: "https://images.unsplash.com/photo-1542744240-7c279d5d8b5c6a3d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            description: "Complete brand identity system including logo design, color palette, typography, and comprehensive brand guidelines.",
            technologies: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "After Effects"],
            featured: false,
            link: "/portfolio/brand-identity",
            testimonial: {
                name: "Lisa Wang",
                position: "Creative Director",
                content: "The brand identity they created perfectly captures our company's essence and values.",
                rating: 5,
                image: "https://picsum.photos/seed/lisawang/100/100.jpg"
            }
        },
        {
            id: 6,
            title: "Real Estate Platform",
            category: "web",
            image: "https://images.unsplash.com/photo-1560412284-2e9c9f5d8b5c6a3d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            description: "Real estate platform with property listings, advanced search filters, virtual tours, and integrated mortgage calculator.",
            technologies: ["Next.js", "React", "Three.js", "Tailwind CSS"],
            featured: false,
            link: "/portfolio/real-estate",
            testimonial: {
                name: "John Smith",
                position: "CEO, PropertyHub",
                content: "The real estate platform they built has increased our lead quality by 45%.",
                rating: 5,
                image: "https://picsum.photos/seed/johnsmith/100/100.jpg"
            }
        },
        {
            id: 7,
            title: "Healthcare Management System",
            category: "web",
            image: "https://images.unsplash.com/photo-1576091167-2b7ac6d5d8b5c6a3d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            description: "Comprehensive healthcare management system for hospitals and clinics with patient records, appointments, and billing.",
            technologies: ["React", "Node.js", "Express", "PostgreSQL", "Socket.io"],
            featured: false,
            link: "/portfolio/healthcare-system",
            testimonial: {
                name: "Dr. Sarah Lee",
                position: "Medical Director",
                content: "The healthcare system has improved patient satisfaction by 30% and reduced administrative tasks by 60%.",
                rating: 5,
                image: "https://picsum.photos/seed/sarahlee/100/100.jpg"
            }
        },
        {
            id: 8,
            title: "Social Media Dashboard",
            category: "web",
            image: "https://images.unsplash.com/photo-161122498477-8f9d5d8b5c6a3d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            description: "Social media management dashboard with analytics, scheduling, and content management features.",
            technologies: ["React", "Chart.js", "Node.js", "MongoDB", "Social APIs"],
            featured: false,
            link: "/portfolio/social-media-dashboard",
            testimonial: {
                name: "Alex Thompson",
                position: "Marketing Director",
                content: "The social media dashboard they created increased our engagement by 120% across all platforms.",
                rating: 5,
                image: "https://picsum.photos/seed/alexthompson/100/100.jpg"
            }
        }
    ];

    const categories = [
        { id: 'all', name: 'All Projects' },
        { id: 'web', name: 'Web Development' },
        { id: 'mobile', name: 'Mobile Apps' },
        { id: 'brand', name: 'Brand Identity' },
        { id: 'cloud', name: 'Cloud Solutions' }
    ];

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(project => project.category === filter);

    const openModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    // Fix: Properly destructure scrollY from useScroll
    const { scrollYProgress, scrollY } = useScroll();

    // Fix: Provide proper input and output ranges for useTransform
    const textY = useTransform(scrollY, [0, 300], [0, -50]);
    const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <>
            <Head>
                <title>Portfolio | BooleanForce - Our Work</title>
                <meta name="description" content="Explore our portfolio of innovative digital solutions including web development, mobile apps, and cloud solutions." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                    <div className="absolute bottom-1/2 right-1/4 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                </div>

                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 px-6">
                    <div className="relative z-10 container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                            style={{ y: textY, opacity: textOpacity }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                                    Portfolio
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                                Explore our latest projects and see how we're transforming businesses through innovative digital solutions.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Filter Tabs */}
                <section className="py-8 px-6">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setFilter(category.id)}
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${filter === category.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="py-12 px-6">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                                    onMouseEnter={() => setHoveredProject(project.id)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                    onClick={() => openModal(project)}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                        {hoveredProject === project.id && (
                                            <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                                                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                                                {project.category}
                                            </span>
                                            {project.featured && (
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-purple-500 rounded-full ml-2">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-gray-300 text-sm line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {project.technologies.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-sm font-medium text-blue-400 bg-blue-500/20 rounded"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <a
                                                href={project.link}
                                                className="text-blue-400 hover:text-white transition-colors duration-300 flex items-center"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="w-5 h-5 mr-2" />
                                                <span className="text-sm">Live Preview</span>
                                            </a>
                                            <a
                                                href="#contact"
                                                className="text-blue-400 hover:text-white transition-colors duration-300 flex items-center"
                                            >
                                                <Mail className="w-5 h-5 mr-2" />
                                                <span className="text-sm">Discuss Project</span>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-3">
                                    <Database className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">500+</div>
                                <p className="text-gray-300">Projects</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-3">
                                    <Code className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">50+</div>
                                <p className="text-gray-300">Happy Clients</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-3">
                                    <Users className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">8+</div>
                                <p className="text-gray-300">Years of Excellence</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-3">
                                    <TrendingUp className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">95%</div>
                                <p className="text-gray-300">Client Satisfaction</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-3">
                                    <Award className="w-8 h-8 text-yellow-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">15+</div>
                                <p className="text-gray-300">Awards Won</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Have a Project in Mind?
                            </h2>
                            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                                Let's work together to bring your vision to life with our cutting-edge technology solutions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/contact"
                                    className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                                >
                                    Get In Touch
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </a>
                                <a
                                    href="#portfolio"
                                    className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border-2 border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                                >
                                    View All Projects
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {isModalOpen && selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="relative">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                                                {selectedProject.category}
                                            </span>
                                            {selectedProject.featured && (
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-purple-500 rounded-full ml-2">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <Image
                                            src={selectedProject.image}
                                            alt={selectedProject.title}
                                            width={800}
                                            height={450}
                                            className="w-full rounded-lg object-cover"
                                        />
                                    </div>

                                    <p className="text-gray-300 mb-6">
                                        {selectedProject.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selectedProject.technologies.map((tech, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 text-sm font-medium text-blue-400 bg-blue-500/20 rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                        <a
                                            href={selectedProject.link}
                                            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="w-5 h-5 mr-2" />
                                            <span className="text-sm">Live Preview</span>
                                        </a>
                                        <a
                                            href="#contact"
                                            className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-600 transition-colors duration-300 flex items-center justify-center"
                                        >
                                            <Mail className="w-5 h-5 mr-2" />
                                            <span className="text-sm">Discuss Project</span>
                                        </a>
                                    </div>

                                    {/* Testimonial */}
                                    {selectedProject.testimonial && (
                                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-6">
                                            <div className="flex items-start space-x-3 mb-4">
                                                <img
                                                    src={selectedProject.testimonial.image}
                                                    alt={selectedProject.testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white">{selectedProject.testimonial.name}</h4>
                                                    <p className="text-sm text-gray-300">{selectedProject.testimonial.position}</p>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-300 italic">
                                                "{selectedProject.testimonial.content}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Project Stats */}
                                    {selectedProject.stats && (
                                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-6">
                                            <h4 className="text-lg font-semibold text-white mb-4">Project Results</h4>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">{selectedProject.stats.increase}</div>
                                                <p className="text-sm text-gray-400">{selectedProject.stats.metric}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Live Demo Button */}
                                    {selectedProject.demoUrl && (
                                        <div className="mt-6">
                                            <a
                                                href={selectedProject.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center"
                                            >
                                                <ExternalLink className="w-5 h-5 mr-2" />
                                                <span className="text-sm">Live Demo</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Portfolio;