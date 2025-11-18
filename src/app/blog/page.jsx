"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaUser, FaTag, FaSearch, FaArrowRight, FaClock, FaComments, FaChevronLeft, FaChevronRight, FaSpinner, FaShare, FaBookmark, FaRegBookmark, FaHeart, FaRegHeart, FaEye } from "react-icons/fa";
import { useState, useEffect } from "react";
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

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [mounted, setMounted] = useState(false);
    const [blogPosts, setBlogPosts] = useState([]);
    const [featuredPost, setFeaturedPost] = useState(null);
    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    // Fix for hydration issues with Swiper
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch blog data from API
    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/blog?page=${page}&limit=9`);

                if (!response.ok) {
                    throw new Error('Failed to fetch blog data');
                }

                const data = await response.json();

                // Set data from API response
                setBlogPosts(data.posts || []);
                setFeaturedPost(data.featuredPost || null);
                setBlogCategories(data.categories || ["All"]);
                setTotalPages(data.totalPages || 1);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [page]);

    // Load bookmarked and liked posts from localStorage
    useEffect(() => {
        const savedBookmarks = localStorage.getItem('bookmarkedPosts');
        const savedLikes = localStorage.getItem('likedPosts');

        if (savedBookmarks) {
            setBookmarkedPosts(JSON.parse(savedBookmarks));
        }

        if (savedLikes) {
            setLikedPosts(JSON.parse(savedLikes));
        }
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
            subtitle: "Exploring latest advancements in technology and development"
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

    // Toggle bookmark status
    const toggleBookmark = (postId) => {
        let updatedBookmarks;

        if (bookmarkedPosts.includes(postId)) {
            updatedBookmarks = bookmarkedPosts.filter(id => id !== postId);
        } else {
            updatedBookmarks = [...bookmarkedPosts, postId];
        }

        setBookmarkedPosts(updatedBookmarks);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
    };

    // Toggle like status
    const toggleLike = (postId) => {
        let updatedLikes;

        if (likedPosts.includes(postId)) {
            updatedLikes = likedPosts.filter(id => id !== postId);
        } else {
            updatedLikes = [...likedPosts, postId];
        }

        setLikedPosts(updatedLikes);
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
    };

    // Load more posts
    const loadMorePosts = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    // Show loading state while fetching data
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-700"></div>
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 animate-spin"></div>
                    </div>
                    <p className="text-white text-xl font-medium">Loading blog posts...</p>
                </div>
            </div>
        );
    }

    // Show error state if API call fails
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center max-w-md mx-auto p-8 bg-gray-800 bg-opacity-50 rounded-xl backdrop-blur-sm">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-white text-2xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
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
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>

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
                                            // Fallback to a placeholder image if original fails to load
                                            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80";
                                        }}
                                    />
                                </div>

                                <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
                                    <div className="max-w-3xl mx-auto">
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
                                            className="relative max-w-xl swiper-parallax"
                                            data-swiper-parallax="-100"
                                            data-swiper-parallax-duration="1400"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Search articles..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full py-4 px-6 pr-14 rounded-full text-gray-800 bg-white bg-opacity-90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 shadow-lg"
                                            />
                                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-md">
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
            <section className="py-8 bg-gray-800 bg-opacity-50 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-3">
                        {blogCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 font-medium ${selectedCategory === category
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
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
            {featuredPost && (
                <section className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Featured Article</h2>
                            <div className="ml-4 px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-bold rounded-full">Featured</div>
                        </div>
                        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto transform hover:shadow-3xl transition-all duration-500">
                            <div className="md:flex">
                                <div className="md:w-1/2">
                                    <div className="h-64 md:h-full relative min-h-[400px]">
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
                                <div className="md:w-1/2 p-8 md:p-12">
                                    <div className="flex items-center text-sm text-gray-400 mb-4">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold mr-3">Featured</span>
                                        <FaCalendarAlt className="mr-2" />
                                        <span className="mr-4">{featuredPost.date}</span>
                                        <FaClock className="mr-2" />
                                        <span>{featuredPost.readTime}</span>
                                        <div className="ml-auto flex items-center space-x-3">
                                            <button
                                                onClick={() => toggleBookmark(featuredPost.id)}
                                                className="text-gray-400 hover:text-yellow-400 transition-colors"
                                            >
                                                {bookmarkedPosts.includes(featuredPost.id) ? <FaBookmark /> : <FaRegBookmark />}
                                            </button>
                                            <button
                                                onClick={() => toggleLike(featuredPost.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                {likedPosts.includes(featuredPost.id) ? <FaHeart /> : <FaRegHeart />}
                                            </button>
                                        </div>
                                    </div>
                                    <Link href={`/blog/${featuredPost.slug}`} className="block">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 hover:text-blue-400 transition-colors cursor-pointer">
                                            {featuredPost.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-600 mr-4 relative overflow-hidden">
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
                                        <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group">
                                            Read More
                                            <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section className="py-16 px-6">
                <div className="container mx-auto">
                    <div className="flex items-center justify-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Latest Articles</h2>
                    </div>
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <div key={post.id} className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-500 group">
                                    <div className="relative h-56 overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            unoptimized={true}
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => toggleBookmark(post.id)}
                                                className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                                            >
                                                {bookmarkedPosts.includes(post.id) ? <FaBookmark /> : <FaRegBookmark />}
                                            </button>
                                            <button
                                                onClick={() => toggleLike(post.id)}
                                                className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                                            >
                                                {likedPosts.includes(post.id) ? <FaHeart /> : <FaRegHeart />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center text-sm text-gray-400 mb-3">
                                            <FaCalendarAlt className="mr-2" />
                                            <span className="mr-4">{post.date}</span>
                                            <FaClock className="mr-2" />
                                            <span>{post.readTime}</span>
                                        </div>
                                        <Link href={`/blog/${post.slug}`} className="block">
                                            <h3 className="text-xl font-bold text-white mb-3 hover:text-blue-400 transition-colors cursor-pointer line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-300 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 relative overflow-hidden">
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
                                            <div className="flex items-center text-gray-400 space-x-3">
                                                <div className="flex items-center">
                                                    <FaEye className="mr-1" />
                                                    <span className="text-sm">{post.views || 0}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaComments className="mr-1" />
                                                    <span className="text-sm">{post.comments || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="text-xs bg-blue-600 bg-opacity-30 text-blue-300 px-3 py-1 rounded-full hover:bg-opacity-50 transition-colors cursor-pointer">
                                                    {tag}
                                                </span>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="text-xs bg-gray-700 text-gray-400 px-3 py-1 rounded-full">
                                                    +{post.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
                                            Read More
                                            <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <div className="text-gray-500 text-6xl mb-4">📝</div>
                                <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
                                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory("All");
                                    }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Load More Button */}
                    {page < totalPages && (
                        <div className="text-center mt-12">
                            <button
                                onClick={loadMorePosts}
                                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors transform hover:scale-105 transition-transform font-medium shadow-lg shadow-blue-600/30"
                            >
                                Load More Articles
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 px-6 bg-gradient-to-r from-blue-900 to-purple-900">
                <div className="container mx-auto">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
                        <p className="text-gray-300 mb-8 text-lg">
                            Get latest articles, tutorials, and industry insights delivered straight to your inbox
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

            {/* Custom styles for carousel */}
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
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}