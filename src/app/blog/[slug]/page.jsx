"use client";

import Image from "next/image";
import { FaCalendarAlt, FaUser, FaClock, FaComments, FaArrowLeft, FaShare, FaBookmark, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
// import { blogPostDetail, relatedPosts, blogComments } from "./../blogPostDetail";
import { useState } from "react";
import { blogPostDetail } from "../blogPostDetail";
import { blogComments, relatedPosts } from "../blogData";

export default function BlogPost({ params }) {
    const [newComment, setNewComment] = useState({
        name: "",
        email: "",
        content: ""
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would submit this to your backend
        console.log("New comment:", newComment);
        // Reset form
        setNewComment({ name: "", email: "", content: "" });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Image */}
            <div className="relative h-96">
                <Image
                    src={blogPostDetail.image}
                    alt={blogPostDetail.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-3xl px-6">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{blogPostDetail.title}</h1>
                        <div className="flex items-center justify-center text-sm">
                            <div className="flex items-center mr-6">
                                <FaCalendarAlt className="mr-2" />
                                <span>{blogPostDetail.date}</span>
                            </div>
                            <div className="flex items-center mr-6">
                                <FaClock className="mr-2" />
                                <span>{blogPostDetail.readTime}</span>
                            </div>
                            <div className="flex items-center">
                                <FaComments className="mr-2" />
                                <span>{blogPostDetail.comments} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2">
                        <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                            {/* Author Info */}
                            <div className="flex items-center mb-8 pb-8 border-b">
                                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4 relative">
                                    <Image
                                        src={blogPostDetail.author.avatar}
                                        alt={blogPostDetail.author.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">{blogPostDetail.author.name}</h3>
                                    <p className="text-gray-600">{blogPostDetail.author.role}</p>
                                </div>
                                <div className="ml-auto flex space-x-3">
                                    <button classname=" cursor-pointerp-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                        <FaShare />
                                    </button>
                                    <button classname=" cursor-pointerp-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                        <FaBookmark />
                                    </button>
                                </div>
                            </div>

                            {/* Article Body */}
                            <div
                                className="prose prose-lg max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: blogPostDetail.content }}
                            />

                            {/* Tags */}
                            <div className="mt-8 pt-8 border-t">
                                <div className="flex flex-wrap gap-2">
                                    {blogPostDetail.tags.map((tag) => (
                                        <span key={tag} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-12 pt-8 border-t">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Comments ({blogPostDetail.comments})</h3>

                                {/* Comment Form */}
                                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Leave a Comment</h4>
                                    <form onSubmit={handleCommentSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={newComment.name}
                                                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                                                className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            <input
                                                type="email"
                                                placeholder="Your Email"
                                                value={newComment.email}
                                                onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                                                className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Your Comment"
                                            rows="4"
                                            value={newComment.content}
                                            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                            required
                                        ></textarea>
                                        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                            Post Comment
                                        </button>
                                    </form>
                                </div>

                                {/* Comments */}
                                <div className="space-y-6">
                                    {blogComments.map((comment) => (
                                        <div key={comment.id} className="flex">
                                            <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 relative">
                                                <Image
                                                    src={comment.avatar}
                                                    alt={comment.author}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <h4 className="font-medium text-gray-800 mr-2">{comment.author}</h4>
                                                        <span className="text-sm text-gray-500">{comment.date}</span>
                                                    </div>
                                                    <p className="text-gray-700">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                                <button classname=" cursor-pointertext-sm text-blue-600 hover:text-blue-800 mt-2">Reply</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>

                        {/* Back to Blog */}
                        <div className="mt-8 text-center">
                            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                <FaArrowLeft className="mr-2" />
                                Back to Blog
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="lg:col-span-1">
                        {/* Sticky Related Articles */}
                        <div className="sticky top-8">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b">Related Articles</h3>
                                <div className="space-y-6">
                                    {relatedPosts.map((post) => (
                                        <div key={post.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                                            <div className="h-40 relative mb-4 rounded-lg overflow-hidden">
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h4 className="font-medium text-gray-800 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                                                {post.title}
                                            </h4>
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <FaCalendarAlt className="mr-1" />
                                                <span>{post.date}</span>
                                            </div>
                                            <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                                Read More
                                                <FaArrowRight className="ml-2" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}