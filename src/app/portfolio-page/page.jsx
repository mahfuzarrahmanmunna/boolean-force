"use client";

import { useState, useEffect, useRef } from 'react';
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
    Lightbulb,
    Filter,
    X,
    ChevronLeft,
    ChevronRight as ChevronRightIcon
} from 'lucide-react';

const PortfolioSection = () => {
    const [filter, setFilter] = useState('all');
    const [activeProject, setActiveProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [hoveredProject, setHoveredProject] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

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
            },
            details: {
                client: "TechStart Inc.",
                duration: "4 months",
                team: "5 members",
                challenge: "Create a scalable e-commerce platform that could handle high traffic volumes while providing a seamless user experience.",
                solution: "Developed a custom solution with microservices architecture, implemented advanced caching strategies, and created an intuitive admin dashboard."
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
            },
            details: {
                client: "Global Tech Corp",
                duration: "6 months",
                team: "8 members",
                challenge: "Create a comprehensive ERP system that could integrate with existing legacy systems while providing real-time insights.",
                solution: "Developed a modular architecture with API-first approach, implemented custom data visualization components, and created seamless integration layers."
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
            },
            details: {
                client: "FinTech Solutions",
                duration: "5 months",
                team: "6 members",
                challenge: "Develop a secure mobile banking app with advanced features while maintaining regulatory compliance.",
                solution: "Implemented end-to-end encryption, created a seamless user experience with biometric authentication, and developed robust security protocols."
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
            },
            details: {
                client: "DataFlow Systems",
                duration: "3 months",
                team: "4 members",
                challenge: "Create a tool that could automate cloud migration between different providers while ensuring data integrity.",
                solution: "Developed a multi-cloud architecture with intelligent data mapping, implemented automated testing, and created a user-friendly interface."
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
            },
            details: {
                client: "Creative Studio",
                duration: "2 months",
                team: "3 members",
                challenge: "Create a comprehensive brand identity that would resonate with a diverse target audience.",
                solution: "Conducted extensive market research, developed multiple design concepts, and created a flexible brand system with comprehensive guidelines."
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
            },
            details: {
                client: "PropertyHub",
                duration: "4 months",
                team: "5 members",
                challenge: "Create a real estate platform with advanced features like virtual tours and mortgage calculator.",
                solution: "Implemented 3D virtual tours, developed an advanced search algorithm, and integrated with financial APIs for mortgage calculations."
            }
        }
    ];

    const categories = [
        { id: 'all', name: 'All Projects', icon: <Layers className="w-4 h-4" /> },
        { id: 'web', name: 'Web Development', icon: <Code className="w-4 h-4" /> },
        { id: 'mobile', name: 'Mobile Apps', icon: <Smartphone className="w-4 h-4" /> },
        { id: 'brand', name: 'Brand Identity', icon: <Palette className="w-4 h-4" /> },
        { id: 'cloud', name: 'Cloud Solutions', icon: <Cloud className="w-4 h-4" /> }
    ];

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(project => project.category === filter);

    const openModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
        setTimeout(() => setSelectedProject(null), 300);
    };

    const navigateProject = (direction) => {
        const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % filteredProjects.length;
        } else {
            newIndex = currentIndex === 0 ? filteredProjects.length - 1 : currentIndex - 1;
        }

        setSelectedProject(filteredProjects[newIndex]);
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1.0]
            }
        }
    };

    return (
        <section ref={containerRef} className="relative py-20 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
                <div className="absolute bottom-1/2 right-1/4 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
            </div>

            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Star className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" />
                        <span className="text-white text-sm font-medium">Our Portfolio</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Recent Work</span>
                    </h2>

                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                        Discover how we've helped businesses transform their digital presence with innovative solutions tailored to their unique needs.
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <motion.button
                            key={category.id}
                            onClick={() => setFilter(category.id)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${filter === category.id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category.icon}
                            {category.name}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                >
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                            onMouseEnter={() => setHoveredProject(project.id)}
                            onMouseLeave={() => setHoveredProject(null)}
                            onClick={() => openModal(project)}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                {/* Overlay with project details on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500/80 backdrop-blur-sm rounded-full">
                                            {project.category}
                                        </span>
                                        {project.featured && (
                                            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-purple-500/80 backdrop-blur-sm rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                                        {project.description}
                                    </p>
                                    <button className=" cursor-pointerflex items-center text-white font-medium text-sm hover:text-blue-400 transition-colors">
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </motion.div>

                                {/* Quick view button */}
                                <motion.div
                                    className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <ExternalLink className="w-5 h-5 text-white" />
                                </motion.div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                                    {project.stats && (
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-400">{project.stats.increase}</div>
                                            <div className="text-xs text-gray-400">{project.stats.metric}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.slice(0, 3).map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 rounded"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="px-2 py-1 text-xs font-medium text-gray-400 bg-gray-500/10 rounded">
                                            +{project.technologies.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button className=" cursor-pointertext-blue-400 hover:text-white transition-colors duration-300 flex items-center text-sm font-medium">
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        Live Preview
                                    </button>
                                    <button className=" cursor-pointertext-purple-400 hover:text-white transition-colors duration-300 flex items-center text-sm font-medium">
                                        <Mail className="w-4 h-4 mr-1" />
                                        Discuss
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {[
                        { icon: <Database className="w-6 h-6" />, value: "500+", label: "Projects Completed" },
                        { icon: <Users className="w-6 h-6" />, value: "50+", label: "Happy Clients" },
                        { icon: <Award className="w-6 h-6" />, value: "8+", label: "Years of Excellence" },
                        { icon: <TrendingUp className="w-6 h-6" />, value: "95%", label: "Client Satisfaction" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300"
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 text-white">
                                {stat.icon}
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Have a Project in Mind?
                        </h2>
                        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                            Let's work together to bring your vision to life with our cutting-edge technology solutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.a
                                href="/contact"
                                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300 hover:shadow-xl flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get In Touch
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </motion.a>
                            <motion.a
                                href="#portfolio"
                                className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border-2 border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 hover:shadow-xl flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View All Projects
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {isModalOpen && selectedProject && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                {/* Close Button */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Navigation Buttons */}
                                <button
                                    onClick={() => navigateProject('prev')}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => navigateProject('next')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronRightIcon className="w-6 h-6" />
                                </button>

                                {/* Project Image */}
                                <div className="relative h-64 md:h-80">
                                    <Image
                                        src={selectedProject.image}
                                        alt={selectedProject.title}
                                        fill
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                                    {/* Project Title and Category */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500/80 backdrop-blur-sm rounded-full">
                                                {selectedProject.category}
                                            </span>
                                            {selectedProject.featured && (
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-purple-500/80 backdrop-blur-sm rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedProject.title}</h3>
                                    </div>
                                </div>

                                {/* Project Content */}
                                <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-20rem)]">
                                    {/* Project Description */}
                                    <div className="mb-8">
                                        <h4 className="text-xl font-semibold text-white mb-3">Project Overview</h4>
                                        <p className="text-gray-300">
                                            {selectedProject.description}
                                        </p>
                                    </div>

                                    {/* Project Details */}
                                    {selectedProject.details && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <h4 className="text-xl font-semibold text-white mb-3">Project Details</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Client:</span>
                                                        <span className="text-white">{selectedProject.details.client}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Duration:</span>
                                                        <span className="text-white">{selectedProject.details.duration}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Team Size:</span>
                                                        <span className="text-white">{selectedProject.details.team}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold text-white mb-3">Technologies Used</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.technologies.map((tech, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 text-sm font-medium text-blue-400 bg-blue-500/10 rounded"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Challenge & Solution */}
                                    {selectedProject.details && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                                                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                    <Target className="w-5 h-5 mr-2 text-blue-400" />
                                                    Challenge
                                                </h4>
                                                <p className="text-gray-300 text-sm">
                                                    {selectedProject.details.challenge}
                                                </p>
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                                                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                    <Lightbulb className="w-5 h-5 mr-2 text-purple-400" />
                                                    Solution
                                                </h4>
                                                <p className="text-gray-300 text-sm">
                                                    {selectedProject.details.solution}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Project Stats */}
                                    {selectedProject.stats && (
                                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg p-6 mb-8 border border-blue-500/30">
                                            <h4 className="text-lg font-semibold text-white mb-3">Project Results</h4>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white mb-1">{selectedProject.stats.increase}</div>
                                                <p className="text-sm text-gray-400">{selectedProject.stats.metric}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Testimonial */}
                                    {selectedProject.testimonial && (
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8">
                                            <h4 className="text-lg font-semibold text-white mb-4">Client Testimonial</h4>
                                            <div className="flex items-start space-x-4">
                                                <img
                                                    src={selectedProject.testimonial.image}
                                                    alt={selectedProject.testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <h5 className="text-lg font-semibold text-white mr-2">{selectedProject.testimonial.name}</h5>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mb-2">{selectedProject.testimonial.position}</p>
                                                    <p className="text-gray-300 italic">
                                                        "{selectedProject.testimonial.content}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a
                                            href={selectedProject.link}
                                            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="w-5 h-5 mr-2" />
                                            Live Preview
                                        </a>
                                        {selectedProject.demoUrl && (
                                            <a
                                                href={selectedProject.demoUrl}
                                                className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-600 transition-colors duration-300 flex items-center justify-center"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Play className="w-5 h-5 mr-2" />
                                                Live Demo
                                            </a>
                                        )}
                                        <a
                                            href="/contact"
                                            className="px-6 py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border-2 border-white hover:bg-white hover:text-slate-900 transition-colors duration-300 flex items-center justify-center"
                                        >
                                            <Mail className="w-5 h-5 mr-2" />
                                            Discuss Project
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default PortfolioSection;