// src/app/dashboard/workers/manage-submit-task/page.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Upload,
    FileText,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    X,
    Save,
    Plus,
    Trash2,
    Paperclip,
    Download,
    Eye,
    Target,
    Star,
    BarChart3,
    TrendingUp,
    Filter,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Shield,
    Activity,
    Zap,
    Users,
    UserCheck,
    UserX,
    UserPlus,
    Edit,
    Lock,
    Unlock,
    Bell,
    Settings,
    LogOut,
    Home,
    Mail,
    Phone,
    Globe,
    Database,
    Cloud,
    Server,
    Wifi,
    HardDrive,
    ShieldCheck,
    AlertTriangle,
    Info,
    HelpCircle,
    FolderOpen,
    Folder,
    FolderPlus,
    Copy,
    ExternalLink,
    Share,
    Link2,
    RefreshCw,
    CheckSquare,
    File,
    FolderTree,
    Grid3X3,
    List,
    BarChart,
    PieChart,
    Link,
    Share2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SubmitTaskPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Form state
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        dueDate: '',
        estimatedHours: '',
        tags: [],
        progress: 0,
        googleDriveLink: '',
        submittedBy: '', // Will be auto-filled with logged-in user's name
        submittedByEmail: '', // Will be auto-filled with logged-in user's email
        permissions: {
            canEdit: true,
            canDelete: false,
            canShare: true,
            canDownload: true
        }
    });

    // File state
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isManager, setIsManager] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Mock data for demonstration
    const [categories, setCategories] = useState([
        'Development',
        'Design',
        'Marketing',
        'Research',
        'Documentation',
        'Testing',
        'Other'
    ]);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
            return;
        }

        // Auto-fill user information
        setTaskData(prev => ({
            ...prev,
            submittedBy: session.user.name,
            submittedByEmail: session.user.email
        }));

        // Fetch users from API (for team members display)
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const usersData = await response.json();
                setUsers(usersData);

                // Check if current user is admin or manager
                const currentUser = usersData.find(user => user.email === session.user.email);
                if (currentUser) {
                    setIsAdmin(currentUser.role === 'admin');
                    setIsManager(currentUser.role === 'admin' || currentUser.role === 'manager');

                    // Set permissions based on role
                    setTaskData(prev => ({
                        ...prev,
                        permissions: {
                            canEdit: true, // Employees can edit their own tasks
                            canDelete: currentUser.role === 'admin',
                            canShare: true,
                            canDownload: true
                        }
                    }));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [session, status, router]);

    // Handle file input change
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...newFiles]);
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    // Remove file from list
    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Upload files (mock function)
    const uploadFiles = () => {
        const newUploadedFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            type: file.type,
            uploadDate: new Date().toISOString(),
            uploadedBy: session.user.name
        }));

        setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
        setFiles([]);
        toast.success('Files uploaded successfully');
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    // Handle tags input
    const handleTagsChange = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            setTaskData(prev => ({
                ...prev,
                tags: [...prev.tags, e.target.value.trim()]
            }));
            e.target.value = '';
        }
    };

    // Remove tag
    const removeTag = (index) => {
        setTaskData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!taskData.title || !taskData.description || !taskData.dueDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // In a real app, you would send this data to your API
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...taskData,
                    files: uploadedFiles,
                    submittedAt: new Date().toISOString(),
                    status: 'pending' // Initial status for new tasks
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit task');
            }

            // Mock API call for demonstration
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitting(false);
            setShowSuccessModal(true);
            toast.success('Task submitted successfully');

            // Reset form after successful submission
            setTaskData(prev => ({
                ...prev,
                title: '',
                description: '',
                category: '',
                priority: 'medium',
                dueDate: '',
                estimatedHours: '',
                tags: [],
                progress: 0,
                googleDriveLink: ''
            }));
            setUploadedFiles([]);
        } catch (error) {
            console.error('Error submitting task:', error);
            toast.error('Failed to submit task');
            setIsSubmitting(false);
        }
    };

    // Download file (mock function)
    const downloadFile = (file) => {
        // In a real app, you would download the actual file
        toast.success(`Downloading ${file.name}`);
    };

    // View file (mock function)
    const viewFile = (file) => {
        // In a real app, you would open the actual file
        toast.success(`Viewing ${file.name}`);
    };

    // Copy to clipboard (mock function)
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard');
    };

    // Share Google Drive link (mock function)
    const shareGoogleDriveLink = () => {
        toast.success('Google Drive link shared successfully');
    };

    // Check if user can edit task
    const canEditTask = () => {
        return true; // Employees can edit their own tasks
    };

    // Check if user can delete task
    const canDeleteTask = () => {
        const currentUser = users.find(user => user.email === session.user.email);
        return currentUser && currentUser.role === 'admin';
    };

    // Check if user can share task
    const canShareTask = () => {
        return true; // All users can share their tasks
    };

    // Check if user can download files
    const canDownloadFiles = () => {
        return true; // All users can download files
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
                <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-white bg-blue-600 rounded-lg shadow-md">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 0 0 16 0l-4 4-4 0 0 0 2-2a2 2 0 0 0 2 2 0 0 0 0 2 2"></path>
                        </svg>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <ChevronLeft
                                className="w-5 h-5 text-slate-500 cursor-pointer mr-2"
                                onClick={() => router.back()}
                            />
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Submit Task</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <button
                                    className={`p-2 rounded-lg ${isManager || isAdmin ? 'text-blue-600' : 'text-slate-500'} hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300`}
                                    title="Admin Panel"
                                >
                                    {isManager || isAdmin ? (
                                        <Shield className="w-5 h-5" />
                                    ) : (
                                        <Lock className="w-5 h-5" />
                                    )}
                                </button>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-2">
                                        {session?.user?.name?.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {session?.user?.name || 'User'}
                                        </span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {session?.user?.email || 'user@example.com'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                    title="Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                    title="Logout"
                                    onClick={() => {
                                        // In a real app, you would implement logout functionality
                                        router.push('/api/auth/signout');
                                    }}
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            {/* User Info Display */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                                        {session?.user?.name?.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            Submitting as: {session?.user?.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 dark:border-slate-700">
                                <button
                                    className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-colors ${activeTab === 'details'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                        }`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    <div className="flex items-center justify-center">
                                        <FileText className="w-5 h-5 mr-2" />
                                        Task Details
                                    </div>
                                </button>
                                <button
                                    className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-colors ${activeTab === 'files'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                        }`}
                                    onClick={() => setActiveTab('files')}
                                >
                                    <div className="flex items-center justify-center">
                                        <Upload className="w-5 h-5 mr-2" />
                                        Files
                                    </div>
                                </button>
                                <button
                                    className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-colors ${activeTab === 'share'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                        }`}
                                    onClick={() => setActiveTab('share')}
                                >
                                    <div className="flex items-center justify-center">
                                        <Share2 className="w-5 h-5 mr-2" />
                                        Share
                                    </div>
                                </button>
                            </div>

                            {/* Task Details Tab */}
                            {activeTab === 'details' && (
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Task Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={taskData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            placeholder="Enter task title"
                                            required
                                            disabled={!canEditTask()}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={taskData.description}
                                            onChange={handleInputChange}
                                            rows={5}
                                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            placeholder="Describe task in detail"
                                            required
                                            disabled={!canEditTask()}
                                        />
                                    </div>

                                    {/* Category and Priority */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Category
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="category"
                                                    value={taskData.category}
                                                    onChange={handleInputChange}
                                                    className="w-full appearance-none px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-10"
                                                    disabled={!canEditTask()}
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map(category => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Priority
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="low"
                                                        checked={taskData.priority === 'low'}
                                                        onChange={handleInputChange}
                                                        disabled={!canEditTask()}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">Low</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="medium"
                                                        checked={taskData.priority === 'medium'}
                                                        onChange={handleInputChange}
                                                        disabled={!canEditTask()}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">Medium</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="high"
                                                        checked={taskData.priority === 'high'}
                                                        onChange={handleInputChange}
                                                        disabled={!canEditTask()}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">High</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Due Date and Estimated Hours */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Due Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    name="dueDate"
                                                    value={taskData.dueDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    required
                                                    disabled={!canEditTask()}
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                                    <Calendar className="w-5 h-5 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Estimated Hours
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="estimatedHours"
                                                    value={taskData.estimatedHours}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    step="0.5"
                                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    placeholder="0"
                                                    disabled={!canEditTask()}
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                                    <Clock className="w-5 h-5 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {taskData.tags.map((tag, index) => (
                                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(index)}
                                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                                        disabled={!canEditTask()}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Add tags and press Enter"
                                            onKeyDown={handleTagsChange}
                                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            disabled={!canEditTask()}
                                        />
                                    </div>

                                    {/* Progress */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Initial Progress: {taskData.progress}%
                                        </label>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${taskData.progress}%` }}
                                            ></div>
                                        </div>
                                        <input
                                            type="range"
                                            name="progress"
                                            value={taskData.progress}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            className="w-full"
                                            disabled={!canEditTask()}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        {canEditTask() ? (
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Submit Task
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="flex items-center text-slate-500 dark:text-slate-400">
                                                <Lock className="w-4 h-4 mr-2" />
                                                <span className="ml-2">You don't have permission to edit this task</span>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            )}

                            {/* Files Tab */}
                            {activeTab === 'files' && (
                                <div className="p-6 space-y-6">
                                    {/* File Upload Area */}
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600'
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <Cloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Drag and drop your files here
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            or
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            disabled={!canEditTask()}
                                        >
                                            Browse Files
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* File List */}
                                    {files.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Files to Upload
                                            </h3>
                                            {files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                                    <div className="flex items-center">
                                                        <FileText className="w-5 h-5 text-slate-400 mr-3" />
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                            disabled={!canEditTask()}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    type="button"
                                                    onClick={uploadFiles}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    disabled={!canEditTask()}
                                                >
                                                    Upload Files
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Uploaded Files */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Uploaded Files
                                            </h3>
                                            {uploadedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                                    <div className="flex items-center">
                                                        <FileText className="w-5 h-5 text-green-500 mr-3" />
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{file.size}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => viewFile(file)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                            disabled={!canEditTask()}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => downloadFile(file)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                            disabled={!canEditTask()}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Share Tab */}
                            {activeTab === 'share' && (
                                <div className="p-6 space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                                        <div className="flex items-center mb-4">
                                            <Cloud className="w-8 h-8 text-blue-600 mr-3" />
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Google Drive Integration</h3>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                            Share your task files via Google Drive by providing a link to your shared folder. This allows team members to access all relevant files in one place.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Google Drive Link
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                name="googleDriveLink"
                                                value={taskData.googleDriveLink}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-10"
                                                placeholder="https://drive.google.com/drive/folders/..."
                                                disabled={!canEditTask()}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                                <Link className="w-5 h-5 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(taskData.googleDriveLink)}
                                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center"
                                            disabled={!canEditTask()}
                                        >
                                            <Paperclip className="w-4 h-4 mr-2" />
                                            Copy Link
                                        </button>
                                        <button
                                            type="button"
                                            onClick={shareGoogleDriveLink}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                                            disabled={!canEditTask()}
                                        >
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Share Link
                                        </button>
                                    </div>

                                    {taskData.googleDriveLink && (
                                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                                <span className="text-sm text-green-800 dark:text-green-400">Google Drive link added to task</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Task Statistics */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2" />
                                Your Task Statistics
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">8</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">In Progress</span>
                                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">3</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">1</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                Priority Distribution
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">High Priority</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">3</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Medium Priority</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">6</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Low Priority</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">3</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Task submitted</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3"></div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Task completed</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">5 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-1.5 mr-3"></div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Task updated</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Team Members
                            </h2>
                            <div className="space-y-4">
                                {users.slice(0, 5).map((user, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                                {users.length > 5 && (
                                    <div className="text-center">
                                        <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                            View all members
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-center">
                                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
                                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white" id="modal-title">
                                            Task Submitted Successfully
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Your task has been submitted and is now being processed. You will be notified when it's reviewed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}