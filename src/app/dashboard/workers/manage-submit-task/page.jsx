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
    ChevronUp,
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
    Share2,
    Timer,
    Check,
    MoreHorizontal,
    User,
    Archive,
    Flag,
    Tag,
    MessageSquare,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Play } from 'lucide-react';

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
    const [currentUserId, setCurrentUserId] = useState(null);

    // Real data states
    const [userTasks, setUserTasks] = useState([]);
    const [taskStats, setTaskStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0
    });
    const [priorityStats, setPriorityStats] = useState({
        high: 0,
        medium: 0,
        low: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'priority', 'title', 'createdAt'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [showFilters, setShowFilters] = useState(false);

    // Auto-progress tracking
    const [timeTracking, setTimeTracking] = useState({
        startTime: null,
        elapsedTime: 0,
        isTracking: false
    });

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

        // Fetch data from API
        const fetchData = async () => {
            try {
                // First, get the user's database ID from their email
                const userResponse = await fetch('/api/users/by-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: session.user.email })
                });

                if (!userResponse.ok) {
                    const errorText = await userResponse.text();
                    console.error('User API Error:', errorText);
                    throw new Error('Failed to fetch user');
                }

                const userData = await userResponse.json();

                if (!userData.success) {
                    throw new Error(userData.error || 'Failed to get user data');
                }

                const user = userData.data;
                setCurrentUserId(user._id);

                // Set users array with just the current user for now
                setUsers([user]);

                // Check if current user is admin or manager
                setIsAdmin(user.role === 'admin');
                setIsManager(user.role === 'admin' || user.role === 'manager');

                // Set permissions based on role
                setTaskData(prev => ({
                    ...prev,
                    permissions: {
                        canEdit: true, // Employees can edit their own tasks
                        canDelete: user.role === 'admin',
                        canShare: true,
                        canDownload: true
                    }
                }));

                // Fetch user tasks using the database ID
                const tasksResponse = await fetch(`/api/work`);

                if (!tasksResponse.ok) {
                    const errorText = await tasksResponse.text();
                    console.error('Tasks API Error:', errorText);
                    throw new Error('Failed to fetch tasks');
                }

                const allTasks = await tasksResponse.json();
                const tasksData = allTasks.filter(task => task.assignedTo === user._id);

                console.log(tasksData);

                setUserTasks(tasksData);

                // Calculate task statistics
                const total = tasksData.length;
                const completed = tasksData.filter(task => task.status === 'completed').length;
                const inProgress = tasksData.filter(task => task.status === 'in-progress').length;
                const pending = tasksData.filter(task => task.status === 'pending').length;
                const overdue = tasksData.filter(task => {
                    if (!task.dueDate) return false;
                    const dueDate = new Date(task.dueDate);
                    const today = new Date();
                    return dueDate < today && task.status !== 'completed';
                }).length;

                setTaskStats({ total, completed, inProgress, pending, overdue });

                // Calculate priority statistics
                const high = tasksData.filter(task => task.priority === 'high').length;
                const medium = tasksData.filter(task => task.priority === 'medium').length;
                const low = tasksData.filter(task => task.priority === 'low').length;

                setPriorityStats({ high, medium, low });

                // Extract unique categories from tasks
                const uniqueCategories = [...new Set(tasksData.map(task => task.category).filter(Boolean))];
                setCategories(uniqueCategories);

                // Create mock activity for now
                const mockActivity = tasksData.slice(0, 5).map(task => ({
                    type: task.status === 'completed' ? 'completed' :
                        task.status === 'in-progress' ? 'updated' : 'submitted',
                    description: `Task "${task.title}" ${task.status === 'completed' ? 'completed' :
                        task.status === 'in-progress' ? 'updated' : 'submitted'}`,
                    timestamp: task.updatedAt || task.createdAt
                }));
                setRecentActivity(mockActivity);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session, status, router]);

    // Auto-update progress based on time tracking
    useEffect(() => {
        let interval;

        if (timeTracking.isTracking && selectedTask) {
            interval = setInterval(() => {
                setTimeTracking(prev => ({
                    ...prev,
                    elapsedTime: prev.elapsedTime + 1
                }));

                // Update task progress based on time spent
                if (selectedTask.estimatedHours) {
                    const estimatedMinutes = parseFloat(selectedTask.estimatedHours) * 60;
                    const progressPercentage = Math.min(100, Math.round((timeTracking.elapsedTime / estimatedMinutes) * 100));

                    // Update progress in the database
                    updateTaskProgress(selectedTask._id, progressPercentage);
                }
            }, 60000); // Update every minute
        }

        return () => clearInterval(interval);
    }, [timeTracking.isTracking, timeTracking.elapsedTime, selectedTask]);

    // Update task progress in the database
    const updateTaskProgress = async (taskId, progress) => {
        try {
            const response = await fetch(`/api/work/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress })
            });

            if (!response.ok) throw new Error('Failed to update progress');

            // Update local state
            setUserTasks(prev => prev.map(task =>
                task._id === taskId ? { ...task, progress } : task
            ));

            // Update selected task if it's the current one
            if (selectedTask && selectedTask._id === taskId) {
                setSelectedTask(prev => ({ ...prev, progress }));
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

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

    // Upload files
    const uploadFiles = async () => {
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload files');

            const result = await response.json();

            const newUploadedFiles = result.files.map(file => ({
                id: file.id,
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
                type: file.type,
                uploadDate: new Date().toISOString(),
                uploadedBy: session.user.name,
                url: file.url
            }));

            setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
            setFiles([]);
            toast.success('Files uploaded successfully');
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('Failed to upload files');
        }
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
            let response;

            if (isEditingTask && selectedTask) {
                // Update existing task
                response = await fetch(`/api/work/${selectedTask._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...taskData,
                        files: uploadedFiles,
                        updatedAt: new Date().toISOString()
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update task');
                }

                const result = await response.json();

                // Update task in the user's tasks
                setUserTasks(prev => prev.map(task =>
                    task._id === selectedTask._id ? { ...task, ...result.data } : task
                ));

                toast.success('Task updated successfully');
            } else {
                // Create new task
                response = await fetch('/api/work', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...taskData,
                        files: uploadedFiles,
                        submittedAt: new Date().toISOString(),
                        status: 'pending', // Initial status for new tasks
                        assignedTo: currentUserId // Assign to current user
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit task');
                }

                const result = await response.json();

                // Add new task to the user's tasks
                setUserTasks(prev => [...prev, result.data]);

                // Update statistics
                setTaskStats(prev => ({
                    ...prev,
                    total: prev.total + 1,
                    pending: prev.pending + 1
                }));

                toast.success('Task submitted successfully');
            }

            setIsSubmitting(false);
            setShowSuccessModal(true);

            // Reset form after successful submission
            if (!isEditingTask) {
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
            }

            // Reset editing state
            setIsEditingTask(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Error submitting task:', error);
            toast.error(isEditingTask ? 'Failed to update task' : 'Failed to submit task');
            setIsSubmitting(false);
        }
    };

    // Download file
    const downloadFile = async (file) => {
        try {
            const response = await fetch(`/api/files/${file.id}/download`);
            if (!response.ok) throw new Error('Failed to download file');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success(`Downloading ${file.name}`);
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file');
        }
    };

    // View file
    const viewFile = (file) => {
        window.open(file.url, '_blank');
        toast.success(`Viewing ${file.name}`);
    };

    // Copy to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard');
    };

    // Share Google Drive link
    const shareGoogleDriveLink = () => {
        toast.success('Google Drive link shared successfully');
    };

    // Start time tracking
    const startTimeTracking = (task) => {
        setSelectedTask(task);
        setTimeTracking({
            startTime: new Date(),
            elapsedTime: 0,
            isTracking: true
        });
        toast.success('Time tracking started');
    };

    // Stop time tracking
    const stopTimeTracking = () => {
        if (!selectedTask) return;

        // Calculate progress based on time spent
        if (selectedTask.estimatedHours) {
            const estimatedMinutes = parseFloat(selectedTask.estimatedHours) * 60;
            const progressPercentage = Math.min(100, Math.round((timeTracking.elapsedTime / estimatedMinutes) * 100));

            // Update progress in the database
            updateTaskProgress(selectedTask._id, progressPercentage);
        }

        setTimeTracking({
            startTime: null,
            elapsedTime: 0,
            isTracking: false
        });
        setSelectedTask(null);
        toast.success('Time tracking stopped');
    };

    // Format time for display
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Edit task - populate form with task data
    const editTask = (task) => {
        setSelectedTask(task);
        setIsEditingTask(true);

        // Populate form with task data
        setTaskData({
            title: task.title || '',
            description: task.description || '',
            category: task.category || '',
            priority: task.priority || 'medium',
            dueDate: task.dueDate || '',
            estimatedHours: task.estimatedHours || '',
            tags: task.tags || [],
            progress: task.progress || 0,
            googleDriveLink: task.googleDriveLink || '',
            submittedBy: session.user.name,
            submittedByEmail: session.user.email,
            permissions: {
                canEdit: true,
                canDelete: isAdmin,
                canShare: true,
                canDownload: true
            }
        });

        // Set uploaded files if any
        if (task.files && task.files.length > 0) {
            setUploadedFiles(task.files);
        } else {
            setUploadedFiles([]);
        }

        // Switch to details tab
        setActiveTab('details');

        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancel editing
    const cancelEdit = () => {
        setIsEditingTask(false);
        setSelectedTask(null);

        // Reset form
        setTaskData({
            title: '',
            description: '',
            category: '',
            priority: 'medium',
            dueDate: '',
            estimatedHours: '',
            tags: [],
            progress: 0,
            googleDriveLink: '',
            submittedBy: session.user.name,
            submittedByEmail: session.user.email,
            permissions: {
                canEdit: true,
                canDelete: isAdmin,
                canShare: true,
                canDownload: true
            }
        });
        setUploadedFiles([]);
    };

    // Delete task
    const deleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await fetch(`/api/work/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            // Remove task from local state
            setUserTasks(prev => prev.filter(task => task._id !== taskId));

            // Update statistics
            const deletedTask = userTasks.find(task => task._id === taskId);
            if (deletedTask) {
                setTaskStats(prev => ({
                    ...prev,
                    total: prev.total - 1,
                    [deletedTask.status]: prev[deletedTask.status] - 1
                }));
            }

            toast.success('Task deleted successfully');

            // If we were editing this task, cancel editing
            if (selectedTask && selectedTask._id === taskId) {
                cancelEdit();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    // Filter and sort tasks
    const filteredAndSortedTasks = userTasks
        .filter(task => {
            // Filter by status
            if (filterStatus !== 'all' && task.status !== filterStatus) return false;

            // Filter by priority
            if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

            // Filter by category
            if (filterCategory !== 'all' && task.category !== filterCategory) return false;

            // Filter by search query
            if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            return true;
        })
        .sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'dueDate':
                    comparison = new Date(a.dueDate) - new Date(b.dueDate);
                    break;
                case 'priority':
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'createdAt':
                    comparison = new Date(a.createdAt) - new Date(b.createdAt);
                    break;
                default:
                    comparison = 0;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

    // Get status badge component
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</span>;
            case 'in-progress':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">In Progress</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">{status}</span>;
        }
    };

    // Get priority badge component
    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">High</span>;
            case 'medium':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Medium</span>;
            case 'low':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Low</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">{priority}</span>;
        }
    };

    // Get days until due
    const getDaysUntilDue = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    // Get due date badge
    const getDueDateBadge = (dueDate) => {
        const daysUntilDue = getDaysUntilDue(dueDate);

        if (daysUntilDue < 0) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">{Math.abs(daysUntilDue)} days overdue</span>;
        } else if (daysUntilDue === 0) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Due today</span>;
        } else if (daysUntilDue <= 3) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">{daysUntilDue} days left</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{daysUntilDue} days left</span>;
        }
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
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Task Management</h1>
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Task List */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            {/* Task List Header */}
                            <div className="bg-slate-50 dark:bg-slate-900/20 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Tasks</h2>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                            title={viewMode === 'grid' ? 'List View' : 'Grid View'}
                                        >
                                            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                            title="Filters"
                                        >
                                            <Filter className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveTab('details');
                                                cancelEdit();
                                            }}
                                            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                            title="New Task"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            {showFilters && (
                                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Search
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    placeholder="Search tasks..."
                                                />
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Search className="w-5 h-5 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            >
                                                <option value="all">All Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Priority
                                            </label>
                                            <select
                                                value={filterPriority}
                                                onChange={(e) => setFilterPriority(e.target.value)}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            >
                                                <option value="all">All Priorities</option>
                                                <option value="high">High</option>
                                                <option value="medium">Medium</option>
                                                <option value="low">Low</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Sort By
                                            </label>
                                            <div className="flex">
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                >
                                                    <option value="dueDate">Due Date</option>
                                                    <option value="priority">Priority</option>
                                                    <option value="title">Title</option>
                                                    <option value="createdAt">Created Date</option>
                                                </select>
                                                <button
                                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                                    className="px-4 py-2 border border-l-0 border-slate-300 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                                                >
                                                    {sortOrder === 'asc' ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                        {isEditingTask ? 'Edit Task' : 'New Task'}
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

                            {activeTab === 'details' ? (
                                <div className="p-6">
                                    {/* Edit indicator */}
                                    {isEditingTask && (
                                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Edit className="w-5 h-5 text-blue-600 mr-2" />
                                                <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Editing task: {selectedTask?.title}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Task Form */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-between">
                                            {isEditingTask && (
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <div className={isEditingTask ? '' : 'ml-auto'}>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                            {isEditingTask ? 'Updating...' : 'Submitting...'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4 mr-2" />
                                                            {isEditingTask ? 'Update Task' : 'Submit Task'}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : activeTab === 'files' ? (
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
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => downloadFile(file)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
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
                                        >
                                            <Paperclip className="w-4 h-4 mr-2" />
                                            Copy Link
                                        </button>
                                        <button
                                            type="button"
                                            onClick={shareGoogleDriveLink}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
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

                        {/* Task List */}
                        {filteredAndSortedTasks.length > 0 ? (
                            <div className="p-6">
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredAndSortedTasks.map((task) => (
                                            <div key={task._id} className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-medium text-slate-900 dark:text-white truncate">{task.title}</h3>
                                                        <div className="flex space-x-1">
                                                            <button
                                                                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                                onClick={() => editTask(task)}
                                                                title="Edit Task"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            {(isAdmin || task.assignedTo === currentUserId) && (
                                                                <button
                                                                    className="p-1 rounded-full text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                                                    onClick={() => deleteTask(task._id)}
                                                                    title="Delete Task"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{task.description}</p>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {getStatusBadge(task.status)}
                                                        {getPriorityBadge(task.priority)}
                                                        {getDueDateBadge(task.dueDate)}
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                            <span>Progress</span>
                                                            <span>{task.progress || 0}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${task.progress || 0}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 text-slate-400 mr-1" />
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {new Date(task.dueDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex space-x-1">
                                                            {selectedTask && selectedTask._id === task._id && timeTracking.isTracking ? (
                                                                <button
                                                                    onClick={stopTimeTracking}
                                                                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                                                    title="Stop Time Tracking"
                                                                >
                                                                    <Timer className="w-4 h-4" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => startTimeTracking(task)}
                                                                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                                                                    title="Start Time Tracking"
                                                                >
                                                                    <Play className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredAndSortedTasks.map((task) => (
                                            <div key={task._id} className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">{task.title}</h3>
                                                        <div className="flex items-center space-x-2">
                                                            {selectedTask && selectedTask._id === task._id && timeTracking.isTracking ? (
                                                                <button
                                                                    onClick={stopTimeTracking}
                                                                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                                                    title="Stop Time Tracking"
                                                                >
                                                                    <Timer className="w-4 h-4" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => startTimeTracking(task)}
                                                                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                                                                    title="Start Time Tracking"
                                                                >
                                                                    <Play className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                                onClick={() => editTask(task)}
                                                                title="Edit Task"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            {(isAdmin || task.assignedTo === currentUserId) && (
                                                                <button
                                                                    className="p-1 rounded-full text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                                                    onClick={() => deleteTask(task._id)}
                                                                    title="Delete Task"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{task.description}</p>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {getStatusBadge(task.status)}
                                                        {getPriorityBadge(task.priority)}
                                                        {getDueDateBadge(task.dueDate)}
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                            <span>Progress</span>
                                                            <span>{task.progress || 0}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${task.progress || 0}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 text-slate-400 mr-1" />
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {new Date(task.dueDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No tasks found</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all'
                                        ? 'Try adjusting your filters or search query'
                                        : 'Create your first task to get started'}
                                </p>
                                {(!searchQuery && filterStatus === 'all' && filterPriority === 'all' && filterCategory === 'all') && (
                                    <button
                                        onClick={() => {
                                            setActiveTab('details');
                                            cancelEdit();
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Create New Task
                                    </button>
                                )}
                            </div>
                        )}
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
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{taskStats.total}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{taskStats.completed}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">In Progress</span>
                                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{taskStats.inProgress}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{taskStats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Overdue</span>
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">{taskStats.overdue}</span>
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
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{priorityStats.high}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Medium Priority</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{priorityStats.medium}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Low Priority</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{priorityStats.low}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {recentActivity.length > 0 ? (
                                    recentActivity.slice(0, 5).map((activity, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 mr-3 ${activity.type === 'completed' ? 'bg-green-500' :
                                                activity.type === 'updated' ? 'bg-amber-500' :
                                                    activity.type === 'submitted' ? 'bg-blue-500' :
                                                        'bg-slate-500'
                                                }`}></div>
                                            <div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-500">{new Date(activity.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
                                )}
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
                                        <button classname=" cursor-pointertext-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                            View all members
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Time Tracking Display */}
                        {timeTracking.isTracking && selectedTask && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                    <Timer className="w-5 h-5 mr-2" />
                                    Time Tracking
                                </h2>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Current Task:</p>
                                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{selectedTask.title}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Time Elapsed:</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatTime(timeTracking.elapsedTime)}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Progress:</p>
                                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${selectedTask.progress || 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedTask.progress || 0}%</p>
                                </div>
                                <button
                                    onClick={stopTimeTracking}
                                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                                >
                                    <Timer className="w-4 h-4 mr-2" />
                                    Stop Tracking
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-center">
                                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
                                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white" id="modal-title">
                                            {isEditingTask ? 'Task Updated Successfully' : 'Task Submitted Successfully'}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {isEditingTask
                                                    ? 'Your task has been updated and all changes have been saved.'
                                                    : 'Your task has been submitted and is now being processed. You will be notified when it\'s reviewed.'
                                                }
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