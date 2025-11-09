"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaUser, FaTag, FaSearch, FaArrowRight, FaClock, FaComments, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import { blogCategories, blogPosts, featuredPost } from "./blogData";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import required modules
import { Autoplay, Pagination, Navigation, EffectFade, Parallax } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';
import ScrollStack from "../portfolio/ScrollStack";
// import BinaryBackground from "@/components/BinaryBackground";
// import Header from "@/components/Header";

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [mounted, setMounted] = useState(false);

    // Fix for hydration issues with Swiper
    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" ||
            post.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    // Hero carousel slides with working images
    const heroSlides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
            title: "Our Blog",
            subtitle: "Insights, tutorials, and industry trends from our expert developers"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            title: "Tech Innovations",
            subtitle: "Exploring the latest advancements in technology and development"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
            title: "Developer Resources",
            subtitle: "Tools, tips, and tricks to enhance your development workflow"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            title: "Industry Insights",
            subtitle: "Stay ahead with expert analysis of tech trends and market shifts"
        }
    ];

    // Custom navigation components
    const CustomPrevButton = () => (
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white bg-opacity-20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
            <FaChevronLeft className="text-xl" />
        </div>
    );

    const CustomNextButton = () => (
        <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white bg-opacity-20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
            <FaChevronRight className="text-xl" />
        </div>
    );

    return (
        <div className="min-h-screen text-white">
            {/* <BinaryBackground />
            <Header /> */}

            {/* Hero Section with Enhanced Carousel */}
            <section className="relative h-[600px] overflow-hidden">
                {mounted && (
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation, EffectFade, Parallax]}
                        spaceBetween={0}
                        slidesPerView={1}
                        effect="fade"
                        parallax={true}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                            renderBullet: (index, className) => {
                                return `<span class="${className} custom-pagination-bullet"></span>`;
                            },
                        }}
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        className="h-full w-full"
                        loop={true}
                    >
                        {heroSlides.map((slide) => (
                            <SwiperSlide key={slide.id} className="relative">
                                {/* Fixed overlay with proper opacity */}
                                <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

                                {/* Fixed image container with proper parallax */}
                                <div className="absolute inset-0 z-0" data-swiper-parallax="-23%">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        unoptimized={true}
                                        onError={(e) => {
                                            // Fallback to a placeholder image if the original fails to load
                                            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80";
                                        }}
                                    />
                                </div>

                                <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
                                    <div className="max-w-3xl mx-auto text-center">
                                        <div className="overflow-hidden mb-4">
                                            <h1
                                                className="text-4xl md:text-5xl font-bold text-white swiper-parallax"
                                                data-swiper-parallax="-300"
                                                data-swiper-parallax-duration="1000"
                                            >
                                                {slide.title}
                                            </h1>
                                        </div>
                                        <div className="overflow-hidden mb-8">
                                            <p
                                                className="text-xl text-gray-300 swiper-parallax"
                                                data-swiper-parallax="-200"
                                                data-swiper-parallax-duration="1200"
                                            >
                                                {slide.subtitle}
                                            </p>
                                        </div>

                                        {/* Search Bar with animation */}
                                        <div
                                            className="relative max-w-xl mx-auto swiper-parallax"
                                            data-swiper-parallax="-100"
                                            data-swiper-parallax-duration="1400"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Search articles..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full py-3 px-5 pr-12 rounded-full text-gray-800 bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                                            />
                                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                                <FaSearch />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                {/* Custom Navigation Buttons */}
                <CustomPrevButton />
                <CustomNextButton />
            </section>

            {/* Categories */}
            <section className="py-8 bg-gray-800 bg-opacity-80 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-3">
                        {blogCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${selectedCategory === category
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Article</h2>
                    <div className="bg-gray-800 bg-opacity-90 rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto transform hover:shadow-2xl transition-shadow duration-500">
                        <div className="md:flex">
                            <div className="md:w-1/2">
                                <div className="h-64 md:h-full relative">
                                    <Image
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover"
                                        unoptimized={true}
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2 p-8">
                                <div className="flex items-center text-sm text-gray-400 mb-2">
                                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold mr-2">Featured</span>
                                    <FaCalendarAlt className="mr-1" />
                                    <span className="mr-4">{featuredPost.date}</span>
                                    <FaClock className="mr-1" />
                                    <span>{featuredPost.readTime}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 hover:text-blue-400 transition-colors cursor-pointer">
                                    {featuredPost.title}
                                </h3>
                                <p className="text-gray-300 mb-4">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 relative">
                                            <Image
                                                src={featuredPost.author.avatar}
                                                alt={featuredPost.author.name}
                                                fill
                                                className="rounded-full object-cover"
                                                unoptimized={true}
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{featuredPost.author.name}</p>
                                            <p className="text-xs text-gray-400">{featuredPost.author.role}</p>
                                        </div>
                                    </div>
                                    <Link href={`/blog/${featuredPost.slug}`} className="text-blue-400 hover:text-blue-300 font-medium flex items-center group">
                                        Read More
                                        <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Latest Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className="bg-gray-800 bg-opacity-90 rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                                <div className="h-48 relative">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        unoptimized={true}
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
                                        }}
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center text-sm text-gray-400 mb-2">
                                        <FaCalendarAlt className="mr-1" />
                                        <span className="mr-4">{post.date}</span>
                                        <FaClock className="mr-1" />
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors cursor-pointer">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-600 mr-2 relative">
                                                <Image
                                                    src={post.author.avatar}
                                                    alt={post.author.name}
                                                    fill
                                                    className="rounded-full object-cover"
                                                    unoptimized={true}
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-300">{post.author.name}</span>
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <FaComments className="mr-1" />
                                            <span className="text-sm">{post.comments}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <span key={tag} className="text-xs bg-blue-600 bg-opacity-50 text-blue-200 px-2 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  

                    {/* Load More Button */}
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors transform hover:scale-105 transition-transform">
                            Load More Articles
                        </button>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gray-800 bg-opacity-90">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
                        <p className="text-gray-300 mb-8">
                            Get the latest articles, tutorials, and industry insights delivered straight to your inbox
                        </p>
                        <div className="flex flex-col sm:flex-row max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 py-3 px-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
                            />
                            <button className="bg-yellow-400 text-gray-800 py-3 px-6 rounded-r-full hover:bg-yellow-300 transition-colors font-medium sm:mt-0 mt-2">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom styles for the carousel */}
            <style jsx>{`
                .custom-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background-color: rgba(255, 255, 255, 0.5);
                    opacity: 1;
                    transition: all 0.3s ease;
                }
                
                .custom-pagination-bullet-active {
                    background-color: white;
                    transform: scale(1.2);
                }
                
                :global(.swiper-pagination-bullet) {
                    margin: 0 6px;
                }
                
                :global(.swiper-pagination-fraction) {
                    color: white;
                }
                
                :global(.swiper-button-prev-custom),
                :global(.swiper-button-next-custom) {
                    position: absolute;
                    top: 50%;
                    width: 48px;
                    height: 48px;
                    margin-top: -24px;
                    z-index: 10;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(4px);
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                :global(.swiper-button-prev-custom:hover),
                :global(.swiper-button-next-custom:hover) {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}