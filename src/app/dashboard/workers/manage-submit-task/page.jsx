// app/dashboard/submit-task/page.jsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaTasks, FaPlus, FaSave, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSpinner,
    FaCalendarAlt, FaSearch, FaClock, FaFlag, FaTag, FaTrash, FaEdit, FaEye,
    FaUserShield, FaProjectDiagram, FaBriefcase, FaLightbulb, FaPaperclip,
    FaFile, FaUsers, FaChartLine, FaDollarSign, FaHourglassHalf,
    FaPlay,
    FaPause,
    FaStopCircle,
    FaQuestionCircle,
    FaInfoCircle,
    FaSync, // Changed from FaRefresh to FaSync
    FaSignOutAlt,
    FaUser
} from 'react-icons/fa';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

// Constants
const STATUS_OPTIONS = [
    { value: 'planning', label: 'Planning', description: 'Task is in planning phase', color: 'bg-gray-500', icon: <FaHourglassHalf /> },
    { value: 'in-progress', label: 'In Progress', description: 'Task is currently being worked on', color: 'bg-blue-500', icon: <FaPlay /> },
    { value: 'on-hold', label: 'On Hold', description: 'Task is temporarily paused', color: 'bg-yellow-500', icon: <FaPause /> },
    { value: 'completed', label: 'Completed', description: 'Task has been completed', color: 'bg-green-500', icon: <FaCheckCircle /> },
    { value: 'cancelled', label: 'Cancelled', description: 'Task has been cancelled', color: 'bg-red-500', icon: <FaStopCircle /> }
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'bg-green-500', description: 'Low priority task, can be completed when time permits' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Standard priority task' },
    { value: 'high', label: 'High', color: 'bg-orange-500', description: 'High priority task, should be completed soon' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500', description: 'Urgent task, requires immediate attention' }
];

const CATEGORY_OPTIONS = [
    { value: 'development', label: 'Development', icon: '💻', description: 'Software development tasks' },
    { value: 'design', label: 'Design', icon: '🎨', description: 'UI/UX design tasks' },
    { value: 'marketing', label: 'Marketing', icon: '📢', description: 'Marketing and promotional tasks' },
    { value: 'research', label: 'Research', icon: '🔍', description: 'Research and analysis tasks' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', description: 'System maintenance tasks' },
    { value: 'testing', label: 'Testing', icon: '🧪', description: 'Quality assurance and testing tasks' },
    { value: 'documentation', label: 'Documentation', icon: '📝', description: 'Documentation tasks' },
    { value: 'other', label: 'Other', icon: '📌', description: 'Other types of tasks' }
];

// Form schemas
const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.string().default("planning"),
    priority: z.string().default("medium"),
    category: z.string().default("other"),
    budget: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    dueDate: z.string().optional(),
    estimatedHours: z.string().optional(),
    tags: z.string().optional(),
    directions: z.string().optional(),
    progress: z.number().default(0),
    assignedTo: z.string().optional(),
});

// Helper Components
const StatusBadge = ({ status }) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    const Icon = statusOption?.icon || <FaExclamationTriangle />;

    return (
        <Badge variant="outline" className={`flex items-center gap-1 ${statusOption?.color} text-white`}>
            <Icon className="h-3 w-3" />
            {statusOption?.label || status}
        </Badge>
    );
};

const PriorityBadge = ({ priority }) => {
    const priorityOption = PRIORITY_OPTIONS.find(p => p.value === priority);

    return (
        <Badge variant="outline" className={`${priorityOption?.color} text-white`}>
            {priorityOption?.label || priority}
        </Badge>
    );
};

// Helper function to get due date badge
const getDueDateBadge = (dueDate) => {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return <Badge variant="destructive" className="text-xs">Overdue</Badge>;
    } else if (diffDays === 0) {
        return <Badge variant="destructive" className="text-xs">Due Today</Badge>;
    } else if (diffDays <= 3) {
        return <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">Due Soon</Badge>;
    } else {
        return <Badge variant="outline" className="text-xs">On Track</Badge>;
    }
};

const LoadingSpinner = ({ message }) => (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-96">
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                <p className="mt-6 text-lg font-medium text-muted-foreground">{message}</p>
            </CardContent>
        </Card>
    </div>
);

const EmptyState = ({ message, icon }) => (
    <div className="flex flex-col items-center justify-center py-12">
        {icon}
        <h3 className="mt-2 text-sm font-medium text-foreground">{message}</h3>
    </div>
);

// Animated Card Component
const AnimatedCard = ({ children, className, ...props }) => (
    <Card
        className={`transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${className}`}
        {...props}
    >
        {children}
    </Card>
);

// Animated Button Component
const AnimatedButton = ({ children, className, ...props }) => (
    <Button
        className={`transition-all duration-200 transform hover:scale-105 active:scale-95 ${className}`}
        {...props}
    >
        {children}
    </Button>
);

// Form Field Component
const FormField = ({ label, error, children, required = false, description, tooltip }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            {tooltip && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                <FaQuestionCircle className="h-3 w-3" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            {description && (
                <FaInfoCircle
                    className="h-3 w-3 text-muted-foreground"
                    title={description}
                />
            )}
        </div>
        {children}
        {error && (
            <p className="text-sm font-medium text-destructive animate-pulse">
                {error.message}
            </p>
        )}
    </div>
);

// FileUpload Component
const FileUpload = ({ files, setFiles, onRemoveFile }) => {
    const handleFileChange = async (e) => {
        const newFiles = Array.from(e.target.files);

        // For now, just add files without uploading
        // In a real app, you would upload each file and get the URL
        const uploadedFiles = newFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: null, // Would be the URL after upload
        }));

        setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Task Files
                </label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <FaQuestionCircle className="h-3 w-3" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                            <p>Upload files related to this task (images, documents, etc.)</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <FaPaperclip className="h-8 w-8 text-muted-foreground/50" />
                    <div className="text-sm text-muted-foreground">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="font-medium text-primary">Click to upload</span>{" "}
                            or drag and drop
                        </label>
                        <Input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        PNG, JPG, PDF, DOC up to 10MB each
                    </p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-2 mt-2">
                    <p className="text-sm font-medium">Attached Files:</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                            >
                                <div className="flex items-center gap-2">
                                    <FaFile className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm truncate max-w-[200px]">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        ({(file.size / 1024).toFixed(2)} KB)
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveFile(index)}
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                >
                                    <FaTrash className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Component
export default function ManageSubmitMyTask() {
    const [tasks, setTasks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [viewingTask, setViewingTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [activeTab, setActiveTab] = useState('details');
    const [files, setFiles] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [isCheckingRole, setIsCheckingRole] = useState(true);
    const [userRole, setUserRole] = useState('worker'); // Default to worker

    // Current date for creation timestamp
    const currentDate = new Date().toISOString().split('T')[0];

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Form for task creation/editing
    const taskForm = useForm({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'planning',
            priority: 'medium',
            category: 'other',
            budget: '',
            startDate: '',
            endDate: '',
            dueDate: '',
            estimatedHours: '',
            tags: '',
            directions: '',
            progress: 0,
            assignedTo: '',
        },
    });

    // Fetch user data and role on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsCheckingRole(true);
                
                // Get current user from localStorage
                const userId = localStorage.getItem('userId');
                const userRole = localStorage.getItem('userRole');
                
                if (!userId) {
                    showNotification('User not found. Please log in again.', 'error');
                    setIsInitialLoading(false);
                    setIsCheckingRole(false);
                    return;
                }

                setUserRole(userRole || 'worker');

                // Check if this is a guest user
                if (userId.startsWith('guest-user-')) {
                    console.log("Guest user detected, using default values");
                    setCurrentUser({
                        _id: userId,
                        name: "Guest User",
                        email: "guest@example.com",
                        role: "guest",
                        isTeamLeader: false,
                        status: "active"
                    });
                    setIsTeamLeader(false);
                    showNotification('You are logged in as a guest. Please sign in to access all features.', 'warning');
                    setIsInitialLoading(false);
                    setIsCheckingRole(false);
                    return;
                }

                // Fetch current user details
                console.log("Fetching user data for ID:", userId);
                const userResponse = await fetch(`/api/users/${userId}`);
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    console.log("User data fetched:", userData);
                    setCurrentUser(userData);
                    
                    // Check if user is a team leader
                    const isLeader = userData.isTeamLeader === true;
                    console.log("Is team leader:", isLeader);
                    setIsTeamLeader(isLeader);
                    
                    // If user is not a team leader, show error
                    if (!isLeader) {
                        showNotification('You do not have permission to access this page. Only team leaders can submit tasks.', 'error');
                        setIsInitialLoading(false);
                        setIsCheckingRole(false);
                        return;
                    }
                } else {
                    console.error("Failed to fetch user data, status:", userResponse.status);
                    showNotification('Failed to fetch user data. Please try again.', 'error');
                    setIsInitialLoading(false);
                    setIsCheckingRole(false);
                    return;
                }

                // Fetch tasks, teams, and workers
                const [tasksResponse, teamsResponse, workersResponse] = await Promise.all([
                    fetch('/api/work'),
                    fetch('/api/teams'),
                    fetch('/api/workers')
                ]);

                if (!tasksResponse.ok || !teamsResponse.ok || !workersResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const tasksData = await tasksResponse.json();
                const teamsData = await teamsResponse.json();
                const workersData = await workersResponse.json();

                // Filter tasks submitted by the current user
                const userTasks = tasksData.filter(task => task.createdBy === userId);

                setTasks(userTasks);
                setTeams(teamsData);
                setWorkers(workersData);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
                setIsCheckingRole(false);
            }
        };

        fetchUserData();
    }, []);

    // Handle task creation/update
    const handleTaskSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Check if user is a guest
            if (currentUser && currentUser._id.startsWith('guest-user-')) {
                showNotification('Guest users cannot submit tasks. Please sign in to continue.', 'error');
                setIsLoading(false);
                return;
            }
            
            // Add creation/update date to data
            const taskData = {
                ...data,
                createdBy: currentUser._id,
                createdAt: editingTask ? editingTask.createdAt : currentDate,
                updatedAt: currentDate,
                // Convert tags string to array if provided
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
            };

            const url = editingTask ? `/api/projects/${editingTask._id}` : '/api/work';
            const method = editingTask ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save task');
            }

            const result = await response.json();

            if (editingTask) {
                setTasks(tasks.map(t => t._id === editingTask._id ? result.data : t));
                showNotification('Task updated successfully!', 'success');
            } else {
                setTasks([...tasks, result.data]);
                showNotification('Task submitted successfully!', 'success');
            }

            setIsAddingTask(false);
            setEditingTask(null);
            taskForm.reset();
            setFiles([]);
        } catch (error) {
            console.error("Error saving task:", error);
            showNotification(error.message || 'Failed to save task.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        // Check if user is a guest
        if (currentUser && currentUser._id.startsWith('guest-user-')) {
            showNotification('Guest users cannot delete tasks. Please sign in to continue.', 'error');
            return;
        }
        
        if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete task');

            setTasks(tasks.filter(t => t._id !== taskId));
            showNotification('Task deleted successfully!', 'success');
        } catch (error) {
            console.error("Error deleting task:", error);
            showNotification(error.message || 'Failed to delete task.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle removing a file from the list
    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // Refresh user data
    const refreshUserData = async () => {
        try {
            setIsCheckingRole(true);
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                showNotification('User not found. Please log in again.', 'error');
                setIsCheckingRole(false);
                return;
            }

            // Check if this is a guest user
            if (userId.startsWith('guest-user-')) {
                console.log("Guest user detected, cannot refresh");
                showNotification('Guest user data cannot be refreshed. Please sign in.', 'warning');
                setIsCheckingRole(false);
                return;
            }

            const userResponse = await fetch(`/api/users/${userId}`);
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                setCurrentUser(userData);
                setIsTeamLeader(userData.isTeamLeader === true);
                showNotification('User data refreshed successfully!', 'success');
            } else {
                console.error("Failed to refresh user data, status:", userResponse.status);
                showNotification('Failed to refresh user data. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Error refreshing user data:", error);
            showNotification('Failed to refresh user data. Please try again.', 'error');
        } finally {
            setIsCheckingRole(false);
        }
    };

    // Filter tasks based on search and filters
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
        });
    }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter]);

    // Update form when editingTask changes
    useEffect(() => {
        if (editingTask) {
            taskForm.setValue('title', editingTask.title || '');
            taskForm.setValue('description', editingTask.description || '');
            taskForm.setValue('status', editingTask.status || 'planning');
            taskForm.setValue('priority', editingTask.priority || 'medium');
            taskForm.setValue('category', editingTask.category || 'other');
            taskForm.setValue('budget', editingTask.budget || '');
            taskForm.setValue('startDate', editingTask.startDate || '');
            taskForm.setValue('endDate', editingTask.endDate || '');
            taskForm.setValue('dueDate', editingTask.dueDate || '');
            taskForm.setValue('estimatedHours', editingTask.estimatedHours || '');
            taskForm.setValue('tags', editingTask.tags ? editingTask.tags.join(', ') : '');
            taskForm.setValue('directions', editingTask.directions || '');
            taskForm.setValue('progress', editingTask.progress || 0);
            taskForm.setValue('assignedTo', editingTask.assignedTo || '');
        }
    }, [editingTask, taskForm]);

    if (isInitialLoading) {
        return <LoadingSpinner message="Loading your tasks..." />;
    }

    // If checking role, show loading spinner
    if (isCheckingRole) {
        return <LoadingSpinner message="Checking your permissions..." />;
    }

    // If user is not a team leader, show access denied message with refresh option
    if (!isTeamLeader) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <Card className="w-96 max-w-md">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <FaUserShield className="h-16 w-16 text-red-500 mb-4" />
                        <h2 className="text-xl font-bold text-center mb-2">Access Denied</h2>
                        <p className="text-center text-muted-foreground mb-4">
                            You do not have permission to access this page. Only team leaders can submit tasks.
                        </p>
                        <div className="text-sm text-muted-foreground mb-4">
                            Your current role: <span className="font-medium">{userRole}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button
                                onClick={refreshUserData}
                                variant="outline"
                                className="w-full"
                                disabled={currentUser && currentUser._id.startsWith('guest-user-')}
                            >
                                <FaSync className="mr-2 h-4 w-4" /> {/* Changed from FaRefresh to FaSync */}
                                Refresh User Data
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/dashboard'}
                                className="w-full"
                            >
                                <FaSignOutAlt className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
                {/* Notification */}
                {notification.show && (
                    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse ${notification.type === 'success' ? 'bg-green-500 text-white' : notification.type === 'warning' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                        {notification.type === 'success' ? <FaCheckCircle className="text-xl" /> : 
                         notification.type === 'warning' ? <FaExclamationTriangle className="text-xl" /> : 
                         <FaExclamationTriangle className="text-xl" />}
                        <span>{notification.message}</span>
                    </div>
                )}

                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <AnimatedCard className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-3xl font-bold flex items-center gap-3">
                                        <FaUserShield className="text-primary animate-pulse" />
                                        Submit Tasks
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Create and manage tasks as a team leader
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={
                                        userRole === 'admin' ? 'bg-purple-100 text-purple-800' :
                                        userRole === 'project-manager' ? 'bg-blue-100 text-blue-800' :
                                        userRole === 'guest' ? 'bg-gray-100 text-gray-800' :
                                        'bg-gray-100 text-gray-800'
                                    }>
                                        {userRole === 'admin' ? 'Admin' :
                                         userRole === 'project-manager' ? 'Project Manager' :
                                         userRole === 'guest' ? 'Guest' :
                                         'Worker'}
                                    </Badge>
                                    <Badge 
                                        variant={isTeamLeader ? "default" : "secondary"}
                                        className={isTeamLeader ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                    >
                                        {isTeamLeader ? 'Team Leader' : 'Not a Team Leader'}
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    <AnimatedButton
                                        onClick={() => setIsAddingTask(true)}
                                        className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                        disabled={currentUser && currentUser._id.startsWith('guest-user-')}
                                    >
                                        <FaPlus className="mr-2 h-4 w-4" />
                                        Submit New Task
                                    </AnimatedButton>
                                    <Button
                                        onClick={refreshUserData}
                                        variant="outline"
                                        size="sm"
                                        disabled={currentUser && currentUser._id.startsWith('guest-user-')}
                                    >
                                        <FaSync className="h-4 w-4" /> {/* Changed from FaRefresh to FaSync */}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </AnimatedCard>

                    {/* Filters */}
                    <AnimatedCard className="shadow-md">
                        <CardContent className="py-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="relative flex-1">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search by title or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {STATUS_OPTIONS.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        {option.icon}
                                                        <span>{option.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                        <SelectTrigger className="w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Filter by priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            {PRIORITY_OPTIONS.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                                                        <span>{option.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Filter by category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {CATEGORY_OPTIONS.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{option.icon}</span>
                                                        <span>{option.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </AnimatedCard>

                    {/* Tasks Table */}
                    <AnimatedCard className="shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Task</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTasks.map((task) => (
                                        <TableRow key={task._id} className="hover:bg-muted/50 transition-all duration-200">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{task.title}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {task.category}
                                                        </Badge>
                                                        {task.tags && task.tags.slice(0, 2).map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs ml-1">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {task.tags && task.tags.length > 2 && (
                                                            <Badge variant="secondary" className="text-xs ml-1">
                                                                +{task.tags.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={task.status} />
                                            </TableCell>
                                            <TableCell>
                                                <PriorityBadge priority={task.priority} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={task.progress || 0} className="w-16" />
                                                    <span className="text-sm">{task.progress || 0}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {task.dueDate ? (
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">No due date</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setViewingTask(task)}
                                                            >
                                                                <FaEye className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View Task Details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setEditingTask(task)}
                                                                disabled={currentUser && currentUser._id.startsWith('guest-user-')}
                                                            >
                                                                <FaEdit className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit Task</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteTask(task._id)}
                                                                className="text-destructive hover:text-destructive"
                                                                disabled={currentUser && currentUser._id.startsWith('guest-user-')}
                                                            >
                                                                <FaTrash className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Task</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filteredTasks.length === 0 && (
                                <EmptyState
                                    message="No tasks found"
                                    icon={<FaTasks className="mx-auto h-12 w-12 text-muted-foreground" />}
                                />
                            )}
                        </CardContent>
                    </AnimatedCard>

                    {/* Create/Edit Task Dialog */}
                    <Dialog open={isAddingTask || !!editingTask} onOpenChange={() => {
                        setIsAddingTask(false);
                        setEditingTask(null);
                        taskForm.reset();
                        setFiles([]);
                    }}>
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaBriefcase className="text-primary animate-pulse" />
                                    {editingTask ? 'Edit Task' : 'Submit New Task'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingTask ? 'Update task details' : 'Create a new task and assign it to team members'}
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger
                                        value="details"
                                        className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        Task Details
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="timeline"
                                        className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        Timeline & Budget
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="directions"
                                        className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        Directions
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="files"
                                        className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        Files
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="assignment"
                                        className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        Assignment
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            label="Task Title"
                                            error={taskForm.formState.errors.title}
                                            required
                                            tooltip="Give your task a clear and descriptive title"
                                        >
                                            <Input
                                                placeholder="Enter task title"
                                                {...taskForm.register("title")}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Category"
                                            error={taskForm.formState.errors.category}
                                            tooltip="Select the category that best describes this task"
                                        >
                                            <Select
                                                value={taskForm.watch("category")}
                                                onValueChange={(value) =>
                                                    taskForm.setValue("category", value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CATEGORY_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex items-center gap-2">
                                                                        <span>{option.icon}</span>
                                                                        <span>{option.label}</span>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{option.description}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>

                                    <FormField
                                        label="Description"
                                        error={taskForm.formState.errors.description}
                                        required
                                        tooltip="Provide a detailed description of the task including requirements and expectations"
                                    >
                                        <Textarea
                                            placeholder="Enter task description"
                                            {...taskForm.register("description")}
                                            rows={3}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </FormField>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            label="Status"
                                            error={taskForm.formState.errors.status}
                                            tooltip="Current status of the task"
                                        >
                                            <Select
                                                value={taskForm.watch("status")}
                                                onValueChange={(value) =>
                                                    taskForm.setValue("status", value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div className="flex items-center gap-2">
                                                                {option.icon}
                                                                <span>{option.label}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField
                                            label="Priority"
                                            error={taskForm.formState.errors.priority}
                                            tooltip="Set the priority level to help team members understand urgency"
                                        >
                                            <Select
                                                value={taskForm.watch("priority")}
                                                onValueChange={(value) =>
                                                    taskForm.setValue("priority", value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PRIORITY_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className={`w-3 h-3 rounded-full ${option.color}`}
                                                                        ></div>
                                                                        <span>{option.label}</span>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{option.description}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField
                                            label="Progress"
                                            error={taskForm.formState.errors.progress}
                                            tooltip="Current progress of the task"
                                        >
                                            <div className="space-y-2">
                                                <Input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    {...taskForm.register("progress", { valueAsNumber: true })}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>0%</span>
                                                    <span>{taskForm.watch("progress") || 0}%</span>
                                                    <span>100%</span>
                                                </div>
                                            </div>
                                        </FormField>
                                    </div>

                                    <FormField
                                        label="Tags"
                                        error={taskForm.formState.errors.tags}
                                        tooltip="Add tags to help categorize and find this task later"
                                    >
                                        <Input
                                            placeholder="e.g., frontend, urgent, bug-fix"
                                            {...taskForm.register("tags")}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </FormField>

                                    <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                                        <FaCalendarAlt className="text-primary" />
                                        <span className="text-sm font-medium">
                                            Created: {editingTask ? new Date(editingTask.createdAt).toLocaleDateString() : new Date(currentDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </TabsContent>

                                <TabsContent value="timeline" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            label="Start Date"
                                            error={taskForm.formState.errors.startDate}
                                            tooltip="When the task is scheduled to start"
                                        >
                                            <Input
                                                type="date"
                                                {...taskForm.register("startDate")}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormField>
                                        <FormField
                                            label="End Date"
                                            error={taskForm.formState.errors.endDate}
                                            tooltip="When the task is scheduled to be completed"
                                        >
                                            <Input
                                                type="date"
                                                {...taskForm.register("endDate")}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            label="Due Date"
                                            error={taskForm.formState.errors.dueDate}
                                            tooltip="Set a deadline for task completion"
                                        >
                                            <Input
                                                type="date"
                                                {...taskForm.register("dueDate")}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Budget"
                                            error={taskForm.formState.errors.budget}
                                            tooltip="Estimated budget for the task"
                                        >
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                {...taskForm.register("budget")}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormField>
                                    </div>

                                    <FormField
                                        label="Story Point"
                                        error={taskForm.formState.errors.estimatedHours}
                                        tooltip="Provide an estimate of how long this task will take"
                                    >
                                        <Input
                                            type="number"
                                            placeholder="e.g., 8"
                                            {...taskForm.register("estimatedHours")}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </FormField>
                                </TabsContent>

                                <TabsContent value="directions" className="space-y-4 mt-4">
                                    <FormField
                                        label="Work Directions"
                                        error={taskForm.formState.errors.directions}
                                        tooltip="Provide detailed step-by-step instructions on how to complete this task"
                                        description="This is where you can explain the process, requirements, and expectations for completing this task"
                                    >
                                        <Textarea
                                            placeholder="Enter detailed directions for this task..."
                                            {...taskForm.register("directions")}
                                            rows={8}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </FormField>

                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md">
                                        <div className="flex items-start gap-2">
                                            <FaLightbulb className="text-blue-500 mt-1" />
                                            <div>
                                                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                                                    Tips for effective directions:
                                                </h4>
                                                <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                                                    <li>• Be specific about requirements and expectations</li>
                                                    <li>• Break down complex tasks into smaller steps</li>
                                                    <li>• Include examples or references when helpful</li>
                                                    <li>• Specify any tools or resources needed</li>
                                                    <li>• Define what "done" looks like for this task</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="files" className="space-y-4 mt-4">
                                    <FileUpload
                                        files={files}
                                        setFiles={setFiles}
                                        onRemoveFile={handleRemoveFile}
                                    />
                                </TabsContent>

                                <TabsContent value="assignment" className="space-y-4 mt-4">
                                    <FormField
                                        label="Assign To (Optional)"
                                        tooltip="Select a team member to assign this task to. Leave empty to make it available for any team member."
                                    >
                                        <Select
                                            value={taskForm.watch("assignedTo")}
                                            onValueChange={(value) => taskForm.setValue("assignedTo", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a team member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Unassigned</SelectItem>
                                                {workers.map(worker => (
                                                    <SelectItem key={worker._id} value={worker._id}>
                                                        <div className="flex items-center gap-2">
                                                            <FaUser className="h-4 w-4 text-muted-foreground" />
                                                            <div className="flex-1">
                                                                <div className="font-medium">{worker.name}</div>
                                                                <div className="text-xs text-muted-foreground">{worker.email}</div>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                {worker.status}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </TabsContent>
                            </Tabs>

                            <DialogFooter>
                                <AnimatedButton type="button" variant="outline" onClick={() => {
                                    setIsAddingTask(false);
                                    setEditingTask(null);
                                    taskForm.reset();
                                    setFiles([]);
                                }}>
                                    Cancel
                                </AnimatedButton>
                                <AnimatedButton
                                    type="submit"
                                    disabled={isLoading || (currentUser && currentUser._id.startsWith('guest-user-'))}
                                    onClick={taskForm.handleSubmit(handleTaskSubmit)}
                                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                                >
                                    {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                    {editingTask ? 'Update' : 'Submit'} Task
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* View Task Dialog */}
                    <Dialog open={!!viewingTask} onOpenChange={() => setViewingTask(null)}>
                        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaTasks className="text-primary" />
                                    Task Details
                                </DialogTitle>
                                <DialogDescription>
                                    View details of the task
                                </DialogDescription>
                            </DialogHeader>
                            {viewingTask && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
                                            <p className="font-medium">{viewingTask.title}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                            <StatusBadge status={viewingTask.status} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                                            <PriorityBadge priority={viewingTask.priority} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {viewingTask.category}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
                                            <div className="flex flex-col gap-1">
                                                {viewingTask.dueDate ? (
                                                    <>
                                                        <span>{new Date(viewingTask.dueDate).toLocaleDateString()}</span>
                                                        {getDueDateBadge(viewingTask.dueDate)}
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No due date</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Progress</h3>
                                            <div className="flex items-center gap-2">
                                                <Progress value={viewingTask.progress || 0} className="w-24" />
                                                <span className="text-sm">{viewingTask.progress || 0}%</span>
                                            </div>
                                        </div>
                                        {viewingTask.estimatedHours && (
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Story Point</h3>
                                                <p>{viewingTask.estimatedHours} hours</p>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Created Date</h3>
                                            <p>{new Date(viewingTask.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                                        <p>{viewingTask.description}</p>
                                    </div>
                                    {viewingTask.directions && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Directions</h3>
                                            <p>{viewingTask.directions}</p>
                                        </div>
                                    )}
                                    {viewingTask.tags && viewingTask.tags.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {viewingTask.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {viewingTask.assignedTo && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h3>
                                            <div className="flex items-center gap-2">
                                                <FaUser className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {(() => {
                                                        const worker = workers.find(w => w._id === viewingTask.assignedTo);
                                                        return worker ? worker.name : 'Unknown';
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <DialogFooter>
                                <AnimatedButton onClick={() => setViewingTask(null)}>
                                    Close
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </TooltipProvider>
    );
}