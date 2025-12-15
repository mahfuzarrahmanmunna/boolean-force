"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSave,
    FaTimes,
    FaEye,
    FaSearch,
    FaFilter,
    FaCheck,
    FaExclamationTriangle,
    FaSpinner,
    FaSync,
    FaSortAmountUp,
    FaSortAmountDown,
    FaCalendarAlt,
    FaUser,
    FaTag,
    FaImage,
    FaHeading,
    FaParagraph,
    FaFileAlt,
    FaClock,
    FaUpload,
    FaCloudUploadAlt,
    FaCopy,
    FaExternalLinkAlt,
    FaRegFileAlt,
    FaRegListAlt,
    FaRegCalendarCheck,
    FaChevronLeft,
    FaChevronRight,
    FaTh,
    FaList,
    FaRegClone,
    FaRegTrashAlt,
    FaRegEye,
    FaRegEdit,
    FaEllipsisV,
    FaRegCopy,
    FaRegStar,
    FaStar,
    FaRegClock,
    FaRegChartBar,
    FaHeart,
    FaRegHeart,
    FaReply,
    FaShare,
    FaBookmark,
    FaRegBookmark,
    FaComments,
    FaUserCircle
} from 'react-icons/fa';

// Import shadcn/ui components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Services data
const services = [
    {
        name: "Brand Visual Identity",
        href: "/brand-visual-identity",
        description: "Creating memorable brand experiences",
        icon: "🎨"
    },
    {
        name: "Website Development",
        href: "/website-development",
        description: "Building responsive, high-performance websites",
        icon: "🌐"
    },
    {
        name: "ERP Software Solutions",
        href: "/erp-software-solutions",
        description: "Streamlining business operations",
        icon: "💻"
    },
    {
        name: "POS Systems",
        href: "/pos-systems",
        description: "Modern point-of-sale solutions",
        icon: "💳"
    }
];

// Blog categories
const blogCategories = [
    "All",
    "Technology",
    "Design",
    "Development",
    "Business",
    "Marketing",
    "Tutorial",
    "Industry News"
];

// Status options
const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
    { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'archived', label: 'Archived', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' }
];

// Image Upload Component
const ImageUpload = ({ onImageUpload, initialImage, label = "Image", aspectRatio = "16/9" }) => {
    const [imageUrl, setImageUrl] = useState(initialImage || "");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file (JPEG, PNG, etc.)', 'error');
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size should be less than 5MB', 'error');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Create a FormData object to send file
            const formData = new FormData();
            formData.append('image', file);

            // Upload to your server
            const uploadedUrl = await uploadImage(formData, (progress) => {
                setUploadProgress(progress);
            });

            setImageUrl(uploadedUrl);
            onImageUpload(uploadedUrl);
            showNotification('Image uploaded successfully!', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showNotification('Failed to upload image. Please try again.', 'error');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Image upload function
    const uploadImage = async (formData, onProgress) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Progress tracking
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onProgress(progress);
                }
            });

            // Handle response
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response.url);
                    } catch (error) {
                        reject(new Error('Invalid response from server'));
                    }
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', '/api/upload');
            xhr.send(formData);
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileInputRef.current.files = e.dataTransfer.files;
            handleFileSelect({ target: fileInputRef.current });
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        onImageUpload(url);
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        onImageUpload("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(imageUrl);
        showNotification('Image URL copied to clipboard!', 'success');
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="image" className="text-gray-700 dark:text-gray-300">{label}</Label>

            {imageUrl ? (
                <div className="relative">
                    <div className={`aspect-${aspectRatio} w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700`}>
                        <img
                            src={imageUrl}
                            alt="Uploaded image"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
                            }}
                        />
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                                        onClick={handleCopyUrl}
                                    >
                                        <FaCopy className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copy URL</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                                        onClick={handleRemoveImage}
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Remove Image</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            PNG, JPG, GIF up to 5MB
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FaUpload className="mr-2 h-4 w-4" />
                                Select Image
                            </>
                        )}
                    </Button>
                </div>
            )}

            {isUploading && (
                <div className="mt-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {uploadProgress}% uploaded
                    </p>
                </div>
            )}

            <div className="mt-2">
                <Label htmlFor="image-url" className="text-xs text-gray-500 dark:text-gray-400">
                    Or provide image URL:
                </Label>
                <div className="flex mt-1">
                    <Input
                        id="image-url"
                        type="text"
                        value={imageUrl}
                        onChange={handleUrlChange}
                        placeholder="https://example.com/image.jpg"
                        className="rounded-r-none"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-l-none"
                        onClick={handleCopyUrl}
                        disabled={!imageUrl}
                    >
                        <FaCopy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Notification function
let notificationTimeout;
const showNotification = (message, type = 'success') => {
    // Clear any existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    // Create or update notification element
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 translate-x-full`;
        document.body.appendChild(notification);
    }

    // Update content and styling
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 ${type === 'success'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
        }`;

    notification.innerHTML = `
        ${type === 'success'
            ? '<svg class="text-xl" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
            : '<svg class="text-xl" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>'
        }
        <span>${message}</span>
    `;

    // Show notification
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Hide notification after 3 seconds
    notificationTimeout = setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
};

// API functions
const api = {
    // Get all blog posts
    getPosts: async (page = 1, limit = 10, search = '', status = '', category = '', sortBy = 'date', sortOrder = 'desc') => {
        try {
            const params = new URLSearchParams({
                page,
                limit,
                ...(search && { search }),
                ...(status && { status }),
                ...(category && { category }),
                sortBy,
                sortOrder
            });

            const response = await fetch(`/api/blog?${params}`);
            if (!response.ok) throw new Error('Failed to fetch blog posts');

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            throw error;
        }
    },

    // Get a single blog post
    getPost: async (id) => {
        try {
            const response = await fetch(`/api/blog/${id}`);
            if (!response.ok) throw new Error('Failed to fetch blog post');

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching blog post:', error);
            throw error;
        }
    },

    // Create a new blog post
    createPost: async (postData) => {
        try {
            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create blog post');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating blog post:', error);
            throw error;
        }
    },

    // Update a blog post
    updatePost: async (id, postData) => {
        try {
            const response = await fetch(`/api/blog/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update blog post');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating blog post:', error);
            throw error;
        }
    },

    // Delete a blog post
    deletePost: async (id) => {
        try {
            const response = await fetch(`/api/blog/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete blog post');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting blog post:', error);
            throw error;
        }
    },

    // Update status of a blog post
    updateStatus: async (id, status) => {
        try {
            const response = await fetch(`/api/blog/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update status');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    },

    // Duplicate a blog post
    duplicatePost: async (id) => {
        try {
            const response = await fetch(`/api/blog/${id}/duplicate`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to duplicate blog post');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error duplicating blog post:', error);
            throw error;
        }
    },

    // Get comments for a blog post
    getComments: async (postId) => {
        try {
            const response = await fetch(`/api/blog/${postId}/comments`);
            if (!response.ok) throw new Error('Failed to fetch comments');

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    // Add a comment to a blog post
    addComment: async (postId, commentData) => {
        try {
            const response = await fetch(`/api/blog/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add comment');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    // Delete a comment
    deleteComment: async (postId, commentId) => {
        try {
            const response = await fetch(`/api/blog/${postId}/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete comment');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },

    // Like/unlike a blog post
    toggleLike: async (postId) => {
        try {
            const response = await fetch(`/api/blog/${postId}/like`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to toggle like');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    }
};

export default function ManageAndPostBlogs() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [viewingPost, setViewingPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [savingPostId, setSavingPostId] = useState(null);
    const [deletingPostId, setDeletingPostId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('manage');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [seoMode, setSeoMode] = useState(false);
    const [advancedMode, setAdvancedMode] = useState(false);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [likes, setLikes] = useState({});

    // Form for creating/editing blog posts
    const {
        register: registerBlog,
        handleSubmit: handleBlogSubmit,
        reset: resetBlog,
        setValue: setBlogValue,
        watch: watchBlog,
        formState: { errors: blogErrors, isSubmitting: isBlogSubmitting }
    } = useForm();

    // Form for comments
    const {
        register: registerComment,
        handleSubmit: handleCommentSubmit,
        reset: resetComment,
        formState: { errors: commentErrors }
    } = useForm();

    // Fetch blog posts from API
    const fetchBlogPosts = useCallback(async () => {
        setIsInitialLoading(true);
        try {
            const data = await api.getPosts(
                currentPage,
                10,
                searchTerm,
                statusFilter,
                selectedCategory,
                sortBy,
                sortOrder
            );

            setBlogPosts(data.posts || []);
            setFilteredPosts(data.posts || []);
            setTotalPages(data.totalPages || 1);
            setTotalPosts(data.totalPosts || 0);

            // Initialize likes count for each post
            const likesData = {};
            (data.posts || []).forEach(post => {
                likesData[post._id] = post.likes || 0;
            });
            setLikes(likesData);
        } catch (error) {
            showNotification('Failed to load blog posts. Please try again.', 'error');
        } finally {
            setIsInitialLoading(false);
        }
    }, [currentPage, searchTerm, statusFilter, selectedCategory, sortBy, sortOrder]);

    // Initial fetch and when filters change
    useEffect(() => {
        fetchBlogPosts();
    }, [fetchBlogPosts]);

    // Fetch comments for a specific post
    const fetchComments = async (postId) => {
        try {
            const data = await api.getComments(postId);
            setComments(prev => ({
                ...prev,
                [postId]: data.comments || []
            }));
        } catch (error) {
            showNotification('Failed to load comments. Please try again.', 'error');
        }
    };

    // Handle opening edit modal and populate form
    const handleEditModalOpen = async (postId) => {
        try {
            const post = await api.getPost(postId);
            if (post) {
                // Populate form with existing data
                setBlogValue("title", post.title || "");
                setBlogValue("slug", post.slug || "");
                setBlogValue("excerpt", post.excerpt || "");
                setBlogValue("content", post.content || "");
                setBlogValue("image", post.image || "");
                setBlogValue("authorName", post.author.name || "");
                setBlogValue("authorAvatar", post.author.avatar || "");
                setBlogValue("authorRole", post.author.role || "");
                setBlogValue("date", post.date || "");
                setBlogValue("readTime", post.readTime || "");
                setBlogValue("status", post.status || "draft");
                setBlogValue("featured", post.featured || false);
                setBlogValue("relatedService", post.relatedService || "");

                // SEO fields
                setBlogValue("metaTitle", post.metaTitle || "");
                setBlogValue("metaDescription", post.metaDescription || "");
                setBlogValue("metaKeywords", post.metaKeywords || "");

                // For tags, set the array of selected tags
                if (post.tags && post.tags.length > 0) {
                    setBlogValue("tags", post.tags);
                } else {
                    setBlogValue("tags", []);
                }

                setEditingPost(postId);
                setActiveTab('create');
            }
        } catch (error) {
            showNotification('Failed to load blog post details.', 'error');
        }
    };

    // Handle form submission for creating/editing blog posts
    const onBlogSubmit = async (data) => {
        setIsLoading(true);
        const postId = editingPost || Date.now().toString();
        setSavingPostId(postId);

        try {
            // Process tags data to ensure it's an array
            const tags = Array.isArray(data.tags)
                ? data.tags
                : Object.keys(data.tags || {}).filter(key => data.tags[key]);

            const processedData = {
                ...data,
                tags,
                id: postId,
                author: {
                    name: data.authorName,
                    avatar: data.authorAvatar,
                    role: data.authorRole
                },
                likes: likes[postId] || 0,
                comments: comments[postId] || []
            };

            if (editingPost) {
                // Update existing post
                await api.updatePost(editingPost, processedData);
                showNotification('Blog post updated successfully!', 'success');
            } else {
                // Create new post
                await api.createPost(processedData);
                showNotification('Blog post created successfully!', 'success');
            }

            setEditingPost(null);
            resetBlog();
            setActiveTab('manage');
            fetchBlogPosts();
        } catch (error) {
            showNotification(error.message || 'Failed to save blog post. Please try again.', 'error');
        } finally {
            setIsLoading(false);
            setSavingPostId(null);
        }
    };

    // Handle blog post delete
    const handleDeletePost = async (postId) => {
        if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            setDeletingPostId(postId);

            try {
                await api.deletePost(postId);
                showNotification('Blog post deleted successfully!', 'success');
                fetchBlogPosts();
            } catch (error) {
                showNotification(error.message || 'Failed to delete blog post. Please try again.', 'error');
            } finally {
                setDeletingPostId(null);
            }
        }
    };

    // Handle status update
    const handleStatusUpdate = async (postId, newStatus) => {
        try {
            await api.updateStatus(postId, newStatus);
            showNotification('Status updated successfully!', 'success');
            fetchBlogPosts();
        } catch (error) {
            showNotification(error.message || 'Failed to update status. Please try again.', 'error');
        }
    };

    // Handle duplicate post
    const handleDuplicatePost = async (postId) => {
        try {
            await api.duplicatePost(postId);
            showNotification('Blog post duplicated successfully!', 'success');
            fetchBlogPosts();
        } catch (error) {
            showNotification(error.message || 'Failed to duplicate blog post. Please try again.', 'error');
        }
    };

    // Handle like/unlike a post
    const handleToggleLike = async (postId) => {
        try {
            const response = await api.toggleLike(postId);
            setLikes(prev => ({
                ...prev,
                [postId]: response.likes || 0
            }));
            showNotification(response.message || 'Like status updated!', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to update like status. Please try again.', 'error');
        }
    };

    // Handle comment submission
    const onCommentSubmit = async (data) => {
        try {
            const commentData = {
                ...data,
                postId: viewingPost,
                timestamp: new Date().toISOString()
            };

            await api.addComment(viewingPost, commentData);
            resetComment();
            fetchComments(viewingPost);
            showNotification('Comment added successfully!', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to add comment. Please try again.', 'error');
        }
    };

    // Handle reply to a comment
    const handleReplySubmit = async (commentId) => {
        try {
            const replyData = {
                content: replyText,
                author: "Current User", // This should come from authentication
                timestamp: new Date().toISOString(),
                isReply: true,
                parentCommentId: commentId
            };

            await api.addComment(viewingPost, replyData);
            setReplyText('');
            setReplyingTo(null);
            fetchComments(viewingPost);
            showNotification('Reply added successfully!', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to add reply. Please try again.', 'error');
        }
    };

    // Handle delete comment
    const handleDeleteComment = async (commentId) => {
        if (confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
            try {
                await api.deleteComment(viewingPost, commentId);
                fetchComments(viewingPost);
                showNotification('Comment deleted successfully!', 'success');
            } catch (error) {
                showNotification(error.message || 'Failed to delete comment. Please try again.', 'error');
            }
        }
    };

    // Refresh data
    const refreshData = async () => {
        setRefreshing(true);
        try {
            await fetchBlogPosts();
            showNotification('Data refreshed successfully!', 'success');
        } catch (error) {
            showNotification('Failed to refresh data. Please try again.', 'error');
        } finally {
            setRefreshing(false);
        }
    };

    // Handle sort
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(filteredPosts.map(post => post._id));
        }
        setSelectAll(!selectAll);
    };

    // Handle individual selection
    const handleSelectPost = (postId) => {
        if (selectedPosts.includes(postId)) {
            setSelectedPosts(selectedPosts.filter(id => id !== postId));
        } else {
            setSelectedPosts([...selectedPosts, postId]);
        }
    };

    // Handle bulk actions
    const handleBulkAction = async (action) => {
        if (selectedPosts.length === 0) {
            showNotification('Please select at least one post', 'error');
            return;
        }

        try {
            const promises = selectedPosts.map(postId => {
                switch (action) {
                    case 'delete':
                        return api.deletePost(postId);
                    case 'publish':
                        return api.updateStatus(postId, 'published');
                    case 'draft':
                        return api.updateStatus(postId, 'draft');
                    case 'archive':
                        return api.updateStatus(postId, 'archived');
                    default:
                        return Promise.resolve();
                }
            });

            await Promise.all(promises);
            showNotification(`${action} completed successfully!`, 'success');
            setSelectedPosts([]);
            setSelectAll(false);
            fetchBlogPosts();
        } catch (error) {
            showNotification(`Failed to ${action} posts. Please try again.`, 'error');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption ? statusOption.color : statusOptions[0].color;
    };

    if (isInitialLoading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">Loading blog posts...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                                        <FaFileAlt className="mr-3 text-blue-500" />
                                        Blog Management
                                    </h1>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">Create and manage your professional blog posts</p>
                                </div>
                                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={() => {
                                            setEditingPost(null);
                                            resetBlog();
                                            setSavingPostId(null);
                                            setActiveTab('create');
                                        }}
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <FaPlus className="mr-2 h-4 w-4" />
                                        New Post
                                    </Button>
                                    <Button
                                        onClick={refreshData}
                                        disabled={refreshing}
                                        variant="outline"
                                    >
                                        {refreshing ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSync className="mr-2 h-4 w-4" />}
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                        <TabsTrigger value="manage" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 text-gray-800 dark:text-gray-200">Manage Posts</TabsTrigger>
                        <TabsTrigger value="create" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 text-gray-800 dark:text-gray-200">Create Post</TabsTrigger>
                    </TabsList>

                    {/* Manage Posts Tab */}
                    <TabsContent value="manage" className="space-y-6">
                        {/* Filters and Search */}
                        <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="text-gray-400" />
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="Search posts..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                {statusOptions.map(status => (
                                                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600">
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                                                {blogCategories.map(category => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select value={sortBy} onValueChange={(value) => handleSort(value)}>
                                            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                                                <SelectItem value="date">Sort by Date</SelectItem>
                                                <SelectItem value="title">Sort by Title</SelectItem>
                                                <SelectItem value="status">Sort by Status</SelectItem>
                                                <SelectItem value="likes">Sort by Likes</SelectItem>
                                                <SelectItem value="comments">Sort by Comments</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={viewMode === 'table' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setViewMode('table')}
                                                    >
                                                        <FaList className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Table View</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setViewMode('grid')}
                                                    >
                                                        <FaTh className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Grid View</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={advancedMode ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setAdvancedMode(!advancedMode)}
                                                    >
                                                        <FaFilter className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Advanced Filters</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                {advancedMode && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <Label htmlFor="dateFrom" className="text-gray-700 dark:text-gray-300">Date From</Label>
                                                <Input
                                                    id="dateFrom"
                                                    type="date"
                                                    className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="dateTo" className="text-gray-700 dark:text-gray-300">Date To</Label>
                                                <Input
                                                    id="dateTo"
                                                    type="date"
                                                    className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="author" className="text-gray-700 dark:text-gray-300">Author</Label>
                                                <Input
                                                    id="author"
                                                    type="text"
                                                    placeholder="Filter by author"
                                                    className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="featured" className="text-gray-700 dark:text-gray-300">Featured</Label>
                                                <Select>
                                                    <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600">
                                                        <SelectValue placeholder="All" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                                                        <SelectItem value="all">All</SelectItem>
                                                        <SelectItem value="featured">Featured Only</SelectItem>
                                                        <SelectItem value="not-featured">Not Featured</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bulk Actions */}
                        {selectedPosts.length > 0 && (
                            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                onClick={() => handleBulkAction('publish')}
                                                variant="outline"
                                                size="sm"
                                                className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                                            >
                                                Publish
                                            </Button>
                                            <Button
                                                onClick={() => handleBulkAction('draft')}
                                                variant="outline"
                                                size="sm"
                                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                                            >
                                                Set as Draft
                                            </Button>
                                            <Button
                                                onClick={() => handleBulkAction('archive')}
                                                variant="outline"
                                                size="sm"
                                                className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"
                                            >
                                                Archive
                                            </Button>
                                            <Button
                                                onClick={() => handleBulkAction('delete')}
                                                variant="outline"
                                                size="sm"
                                                className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                                            >
                                                <FaTrash className="mr-1 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Blog Posts Table/Grid */}
                        <Card className="shadow-lg border-0 overflow-hidden bg-white dark:bg-slate-800">
                            {viewMode === 'table' ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left">
                                                    <Checkbox
                                                        checked={selectAll}
                                                        onCheckedChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Post
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                                                    <div className="flex items-center">
                                                        Date
                                                        {sortBy === 'date' && (
                                                            sortOrder === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Engagement
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredPosts.map((post) => (
                                                <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Checkbox
                                                            checked={selectedPosts.includes(post._id)}
                                                            onCheckedChange={() => handleSelectPost(post._id)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-16 w-16">
                                                                <img
                                                                    className="h-16 w-16 rounded object-cover"
                                                                    src={post.image}
                                                                    alt={post.title}
                                                                    onError={(e) => {
                                                                        e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.title}</div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</div>
                                                                {post.featured && (
                                                                    <Badge className="mt-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                                        <FaStar className="mr-1 h-3 w-3" />
                                                                        Featured
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={post.author.avatar}
                                                                    alt={post.author.name}
                                                                    onError={(e) => {
                                                                        e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.author.name}</div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{post.author.role}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Select
                                                            value={post.status || 'draft'}
                                                            onValueChange={(value) => handleStatusUpdate(post._id, value)}
                                                        >
                                                            <SelectTrigger className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${getStatusColor(post.status || 'draft')}`}>
                                                                <SelectValue placeholder="Status" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                                                                {statusOptions.map(status => (
                                                                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(post.date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center">
                                                                <FaHeart className="mr-1 text-red-500" />
                                                                <span>{likes[post._id] || 0}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaComments className="mr-1 text-blue-500" />
                                                                <span>{comments[post._id]?.length || 0}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <FaEllipsisV className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => {
                                                                    setViewingPost(post._id);
                                                                    fetchComments(post._id);
                                                                }}>
                                                                    <FaRegEye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEditModalOpen(post._id)}>
                                                                    <FaRegEdit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDuplicatePost(post._id)}>
                                                                    <FaRegClone className="mr-2 h-4 w-4" />
                                                                    Duplicate
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                                                                    <FaExternalLinkAlt className="mr-2 h-4 w-4" />
                                                                    Preview
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`)}>
                                                                    <FaRegCopy className="mr-2 h-4 w-4" />
                                                                    Copy Link
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDeletePost(post._id)}
                                                                    className="text-red-600"
                                                                    disabled={deletingPostId === post._id}
                                                                >
                                                                    {deletingPostId === post._id ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaRegTrashAlt className="mr-2 h-4 w-4" />}
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                    {filteredPosts.map((post) => (
                                        <Card key={post._id} className="overflow-hidden hover:shadow-xl transition-shadow">
                                            <div className="aspect-video relative">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
                                                    }}
                                                />
                                                {post.featured && (
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                            <FaStar className="mr-1 h-3 w-3" />
                                                            Featured
                                                        </Badge>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <Checkbox
                                                        checked={selectedPosts.includes(post._id)}
                                                        onCheckedChange={() => handleSelectPost(post._id)}
                                                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                                                    />
                                                </div>
                                            </div>
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center justify-between">
                                                    <Badge className={`${getStatusColor(post.status || 'draft')}`}>
                                                        {statusOptions.find(option => option.value === (post.status || 'draft'))?.label || 'Draft'}
                                                    </Badge>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <FaEllipsisV className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => {
                                                                setViewingPost(post._id);
                                                                fetchComments(post._id);
                                                            }}>
                                                                <FaRegEye className="mr-2 h-4 w-4" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditModalOpen(post._id)}>
                                                                <FaRegEdit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDuplicatePost(post._id)}>
                                                                <FaRegClone className="mr-2 h-4 w-4" />
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                                                                <FaExternalLinkAlt className="mr-2 h-4 w-4" />
                                                                Preview
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`)}>
                                                                <FaRegCopy className="mr-2 h-4 w-4" />
                                                                Copy Link
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeletePost(post._id)}
                                                                className="text-red-600"
                                                                disabled={deletingPostId === post._id}
                                                            >
                                                                {deletingPostId === post._id ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaRegTrashAlt className="mr-2 h-4 w-4" />}
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                    <div className="flex items-center mr-4">
                                                        <div className="w-6 h-6 rounded-full mr-2 relative">
                                                            <img
                                                                src={post.author.avatar}
                                                                alt={post.author.name}
                                                                className="rounded-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                                                                }}
                                                            />
                                                        </div>
                                                        <span>{post.author.name}</span>
                                                    </div>
                                                    <div className="flex items-center mr-4">
                                                        <FaCalendarAlt className="mr-1" />
                                                        <span>{formatDate(post.date)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaClock className="mr-1" />
                                                        <span>{post.readTime}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <FaHeart className="mr-1 text-red-500" />
                                                            <span>{likes[post._id] || 0}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FaComments className="mr-1 text-blue-500" />
                                                            <span>{comments[post._id]?.length || 0}</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleLike(post._id)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <FaHeart className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {post.tags && post.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {post.tags && post.tags.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{post.tags.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {filteredPosts.length} of {totalPosts} posts
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <FaChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <FaChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Create Post Tab */}
                    <TabsContent value="create" className="space-y-6">
                        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-gray-800 dark:text-gray-200">{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">
                                            {editingPost ? 'Update details of your blog post' : 'Fill in details to create a new blog post'}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={seoMode ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setSeoMode(!seoMode)}
                                                    >
                                                        <FaRegChartBar className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>SEO Settings</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleBlogSubmit(onBlogSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Title</Label>
                                            <Input
                                                type="text"
                                                {...registerBlog("title", { required: "Title is required" })}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                            />
                                            {blogErrors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.title.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300">Slug</Label>
                                            <Input
                                                type="text"
                                                {...registerBlog("slug", { required: "Slug is required" })}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                placeholder="url-friendly-post-title"
                                            />
                                            {blogErrors.slug && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.slug.message}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="excerpt" className="text-gray-700 dark:text-gray-300">Excerpt</Label>
                                            <Textarea
                                                {...registerBlog("excerpt", { required: "Excerpt is required" })}
                                                rows={3}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                placeholder="Brief description of post"
                                            />
                                            {blogErrors.excerpt && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.excerpt.message}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <ImageUpload
                                                onImageUpload={(url) => setBlogValue("image", url)}
                                                initialImage={watchBlog("image")}
                                                label="Featured Image"
                                            />
                                            {blogErrors.image && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.image.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="authorName" className="text-gray-700 dark:text-gray-300">Author Name</Label>
                                            <Input
                                                type="text"
                                                {...registerBlog("authorName", { required: "Author name is required" })}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                            />
                                            {blogErrors.authorName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.authorName.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="authorRole" className="text-gray-700 dark:text-gray-300">Author Role</Label>
                                            <Input
                                                type="text"
                                                {...registerBlog("authorRole", { required: "Author role is required" })}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                            />
                                            {blogErrors.authorRole && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.authorRole.message}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <ImageUpload
                                                onImageUpload={(url) => setBlogValue("authorAvatar", url)}
                                                initialImage={watchBlog("authorAvatar")}
                                                label="Author Avatar"
                                                aspectRatio="1/1"
                                            />
                                            {blogErrors.authorAvatar && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.authorAvatar.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Publication Date</Label>
                                            <Input
                                                type="date"
                                                {...registerBlog("date", { required: "Publication date is required" })}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                            />
                                            {blogErrors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.date.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="readTime" className="text-gray-700 dark:text-gray-300">Read Time</Label>
                                            <Input
                                                type="text"
                                                {...registerBlog("readTime", { required: "Read time is required" })}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                placeholder="5 min read"
                                            />
                                            {blogErrors.readTime && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.readTime.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
                                            <Select
                                                {...registerBlog("status")}
                                                onValueChange={(value) => setBlogValue("status", value)}
                                                defaultValue="draft"
                                            >
                                                <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                                                    {statusOptions.map(status => (
                                                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="relatedService" className="text-gray-700 dark:text-gray-300">Related Service</Label>
                                            <Select
                                                {...registerBlog("relatedService")}
                                                onValueChange={(value) => setBlogValue("relatedService", value)}
                                            >
                                                <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600">
                                                    <SelectValue placeholder="Select related service" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                                                    {services.map(service => (
                                                        <SelectItem key={service.name} value={service.name}>{service.icon} {service.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">Content</Label>
                                        <Textarea
                                            {...registerBlog("content", { required: "Content is required" })}
                                            rows={10}
                                            className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                            placeholder="Full blog post content"
                                        />
                                        {blogErrors.content && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{blogErrors.content.message}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="tags" className="text-gray-700 dark:text-gray-300">Tags</Label>
                                        <div className="mt-2 space-y-2">
                                            {blogCategories.slice(1).map(category => (
                                                <div key={category} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`tag-${category}`}
                                                        value={category}
                                                        {...registerBlog("tags")}
                                                        className="text-gray-700 dark:text-gray-300"
                                                    />
                                                    <Label htmlFor={`tag-${category}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {category}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="featured"
                                            {...registerBlog("featured")}
                                            className="text-gray-700 dark:text-gray-300"
                                        />
                                        <Label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Mark as featured post
                                        </Label>
                                    </div>

                                    {/* SEO Settings */}
                                    {seoMode && (
                                        <>
                                            <Separator />
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">SEO Settings</h3>
                                                <div>
                                                    <Label htmlFor="metaTitle" className="text-gray-700 dark:text-gray-300">Meta Title</Label>
                                                    <Input
                                                        type="text"
                                                        {...registerBlog("metaTitle")}
                                                        className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                        placeholder="SEO title (max 60 characters)"
                                                        maxLength={60}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="metaDescription" className="text-gray-700 dark:text-gray-300">Meta Description</Label>
                                                    <Textarea
                                                        {...registerBlog("metaDescription")}
                                                        rows={3}
                                                        className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                        placeholder="SEO description (max 160 characters)"
                                                        maxLength={160}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="metaKeywords" className="text-gray-700 dark:text-gray-300">Meta Keywords</Label>
                                                    <Input
                                                        type="text"
                                                        {...registerBlog("metaKeywords")}
                                                        className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                        placeholder="Comma-separated keywords"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setEditingPost(null);
                                                resetBlog();
                                                setSavingPostId(null);
                                                setActiveTab('manage');
                                            }}
                                            variant="outline"
                                            className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isBlogSubmitting || (savingPostId !== null && savingPostId === editingPost)}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {isBlogSubmitting || (savingPostId !== null && savingPostId === editingPost) ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                            {editingPost ? 'Update Post' : 'Create Post'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* View Post Modal */}
            <Dialog open={!!viewingPost} onOpenChange={(open) => !open && setViewingPost(null)}>
                <DialogContent className="sm:max-w-[425px] md:max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-gray-800 dark:text-gray-200">Blog Post Details</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Preview of blog post
                        </DialogDescription>
                    </DialogHeader>
                    {blogPosts.find(p => p._id === viewingPost) && (
                        <div className="space-y-6">
                            <div className="aspect-video relative overflow-hidden rounded-lg">
                                <img
                                    src={blogPosts.find(p => p._id === viewingPost).image}
                                    alt={blogPosts.find(p => p._id === viewingPost).title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
                                    }}
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                    {blogPosts.find(p => p._id === viewingPost).title}
                                </h2>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center mr-4">
                                        <div className="w-8 h-8 rounded-full mr-2 relative">
                                            <img
                                                src={blogPosts.find(p => p._id === viewingPost).author.avatar}
                                                alt={blogPosts.find(p => p._id === viewingPost).author.name}
                                                className="rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                                                }}
                                            />
                                        </div>
                                        <span>{blogPosts.find(p => p._id === viewingPost).author.name}</span>
                                    </div>
                                    <div className="flex items-center mr-4">
                                        <FaCalendarAlt className="mr-1" />
                                        <span>{formatDate(blogPosts.find(p => p._id === viewingPost).date)}</span>
                                    </div>
                                    <div className="flex items-center mr-4">
                                        <FaClock className="mr-1" />
                                        <span>{blogPosts.find(p => p._id === viewingPost).readTime}</span>
                                    </div>
                                    <Badge className={`${getStatusColor(blogPosts.find(p => p._id === viewingPost).status)}`}>
                                        {statusOptions.find(option => option.value === (blogPosts.find(p => p._id === viewingPost).status || 'draft'))?.label || 'Draft'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <FaHeart className="mr-1 text-red-500" />
                                            <span>{likes[viewingPost] || 0} likes</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaComments className="mr-1 text-blue-500" />
                                            <span>{comments[viewingPost]?.length || 0} comments</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleToggleLike(viewingPost)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <FaHeart className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    {blogPosts.find(p => p._id === viewingPost).excerpt}
                                </p>
                                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                    <div dangerouslySetInnerHTML={{ __html: blogPosts.find(p => p._id === viewingPost).content.replace(/\n/g, '<br />') }} />
                                </div>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {blogPosts.find(p => p._id === viewingPost).tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Comments</h3>

                                {/* Add Comment Form */}
                                <div className="mb-6">
                                    <form onSubmit={handleCommentSubmit(onCommentSubmit)} className="space-y-4">
                                        <div>
                                            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
                                            <Input
                                                type="text"
                                                {...registerComment("name", { required: "Name is required" })}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                            />
                                            {commentErrors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{commentErrors.name.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                                            <Input
                                                type="email"
                                                {...registerComment("email", { required: "Email is required" })}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                            />
                                            {commentErrors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{commentErrors.email.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="comment" className="text-gray-700 dark:text-gray-300">Comment</Label>
                                            <Textarea
                                                {...registerComment("content", { required: "Comment is required" })}
                                                rows={3}
                                                className="mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                placeholder="Write your comment here..."
                                            />
                                            {commentErrors.content && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{commentErrors.content.message}</p>}
                                        </div>
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                            Post Comment
                                        </Button>
                                    </form>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-4">
                                    {comments[viewingPost]?.map((comment) => (
                                        <div key={comment._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            <div className="flex items-start space-x-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={comment.avatar} alt={comment.name} />
                                                    <AvatarFallback>{comment.name?.charAt(0) || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{comment.name}</h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.timestamp)}</p>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <FaEllipsisV className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => setReplyingTo(comment._id)}>
                                                                    <FaReply className="mr-2 h-4 w-4" />
                                                                    Reply
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDeleteComment(comment._id)}
                                                                    className="text-red-600"
                                                                >
                                                                    <FaTrash className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>

                                                    {/* Reply Form */}
                                                    {replyingTo === comment._id && (
                                                        <div className="mt-3 space-y-2">
                                                            <Textarea
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                rows={2}
                                                                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                                                                placeholder="Write your reply..."
                                                            />
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleReplySubmit(comment._id)}
                                                                    disabled={!replyText.trim()}
                                                                >
                                                                    Post Reply
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setReplyingTo(null);
                                                                        setReplyText('');
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply._id} className="flex items-start space-x-2">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage src={reply.avatar} alt={reply.name} />
                                                                        <AvatarFallback>{reply.name?.charAt(0) || 'U'}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{reply.name}</h5>
                                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(reply.timestamp)}</p>
                                                                            </div>
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" className="h-6 w-6 p-0">
                                                                                        <span className="sr-only">Open menu</span>
                                                                                        <FaEllipsisV className="h-3 w-3" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem
                                                                                        onClick={() => handleDeleteComment(reply._id)}
                                                                                        className="text-red-600"
                                                                                    >
                                                                                        <FaTrash className="mr-2 h-3 w-3" />
                                                                                        Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {comments[viewingPost]?.length === 0 && (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            onClick={() => setViewingPost(null)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}