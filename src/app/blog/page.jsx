"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaUser, FaTag, FaSearch, FaArrowRight, FaClock, FaComments } from "react-icons/fa";
import { useState } from "react";
import { blogCategories, blogPosts, featuredPost } from "./blogData";
// import BinaryBackground from "@/components/BinaryBackground";
// import Header from "@/components/Header";

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" ||
            post.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen text-white">
            {/* <BinaryBackground />
            <Header /> */}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Our Blog</h1>
                        <p className="text-xl mb-8 text-gray-300">
                            Insights, tutorials, and industry trends from our expert developers
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 px-5 pr-12 rounded-full text-gray-800 bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </div>
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
        </div>
    );
}