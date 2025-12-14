"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaTasks, FaEdit, FaSave, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSpinner,
    FaCalendarAlt, FaSearch, FaFilter, FaClock, FaChartLine, FaFlag, FaTag,
    FaEye, FaTrash, FaChevronLeft, FaChevronRight, FaUser, FaPlay, FaPause,
    FaCheck, FaArchive, FaUndo, FaHourglassHalf, FaExclamationCircle
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
import { Separator } from '@/components/ui/separator';

// Constants
const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', icon: <FaHourglassHalf />, color: 'bg-yellow-500' },
    { value: 'in-progress', label: 'In Progress', icon: <FaPlay />, color: 'bg-blue-500' },
    { value: 'completed', label: 'Completed', icon: <FaCheckCircle />, color: 'bg-green-500' },
    { value: 'archived', label: 'Archived', icon: <FaArchive />, color: 'bg-gray-500' }
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
];

const CATEGORY_OPTIONS = [
    { value: 'development', label: 'Development', icon: '💻' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'research', label: 'Research', icon: '🔍' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'testing', label: 'Testing', icon: '🧪' },
    { value: 'documentation', label: 'Documentation', icon: '📝' },
    { value: 'other', label: 'Other', icon: '📌' }
];

// Form schemas
const taskUpdateSchema = z.object({
    status: z.string().min(1, "Status is required"),
    progress: z.number().min(0).max(100),
    notes: z.string().optional(),
});

// Helper Components
const StatusBadge = ({ status }) => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);

    return (
        <Badge variant="outline" className={`flex items-center gap-1 ${statusOption?.color} text-white`}>
            {statusOption?.icon}
            <span>{statusOption?.label || status}</span>
        </Badge>
    );
};

const PriorityBadge = ({ priority }) => {
    const priorityOption = PRIORITY_OPTIONS.find(option => option.value === priority);

    return (
        <Badge variant="outline" className={`flex items-center gap-1 ${priorityOption?.color} text-white`}>
            <FaFlag className="h-3 w-3" />
            <span>{priorityOption?.label || priority}</span>
        </Badge>
    );
};

const CategoryBadge = ({ category }) => {
    const categoryOption = CATEGORY_OPTIONS.find(option => option.value === category);

    return (
        <Badge variant="outline" className="flex items-center gap-1">
            <span>{categoryOption?.icon}</span>
            <span>{categoryOption?.label || category}</span>
        </Badge>
    );
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

// Form Field Component
const FormField = ({ label, error, children, required = false, tooltip }) => (
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
                                <FaExclamationCircle className="h-3 w-3" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
        {children}
        {error && (
            <p className="text-sm font-medium text-destructive">
                {error.message}
            </p>
        )}
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

// Main Component
export default function WorkerTasks() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isViewingTask, setIsViewingTask] = useState(false);
    const [isUpdatingTask, setIsUpdatingTask] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Current user ID (in a real app, this would come from authentication)
    const currentUserId = "69394eb72f9e07a87e764d1d"; // Example worker ID

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Form for updating task
    const taskUpdateForm = useForm({
        resolver: zodResolver(taskUpdateSchema),
        defaultValues: {
            status: '',
            progress: 0,
            notes: '',
        },
    });

    // Fetch tasks from API on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('/api/work');

                if (!response.ok) throw new Error('Failed to fetch tasks');

                const tasksData = await response.json();

                // Filter tasks assigned to the current user
                const userTasks = tasksData.filter(task => task.assignedTo === currentUserId);

                setTasks(userTasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                showNotification('Failed to load tasks. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Handle task update
    const handleTaskUpdate = async (data) => {
        if (!selectedTask) {
            console.error("handleTaskUpdate called without a selectedTask.");
            return;
        }

        // --- DEBUGGING & VALIDATION ---

        // 1. Log the raw selected task object
        console.log('Attempting to update task. Selected Task Object:', selectedTask);

        // 2. Log the ID and its type directly from the object
        console.log('Task ID from selectedTask:', selectedTask._id);
        console.log('Task ID Type:', typeof selectedTask._id);

        // 3. Force the ID to be a string, just in case it's an object
        const taskId = String(selectedTask._id);
        console.log('Forced String Task ID:', taskId);
        console.log('Forced String Task ID Type:', typeof taskId);

        // 4. Client-side validation: Check if it matches the 24-char hex format for a MongoDB ObjectId.
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(taskId);
        if (!isValidObjectId) {
            console.error('CLIENT VALIDATION FAILED: The ID is not a valid ObjectId format.', taskId);
            showNotification('Invalid task ID format. Cannot update task. Please refresh the page.', 'error');
            return; // Stop the function here
        }

        console.log('ID is valid. Proceeding with API call to:', `/api/work/${taskId}`);
        // --- END DEBUGGING ---

        setIsLoading(true);
        try {
            const response = await fetch(`/api/work/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // This will now show the server's error message, which should be the same
                throw new Error(errorData.error || 'Failed to update task');
            }

            const updatedTask = await response.json();

            // Update the task in the state
            setTasks(tasks.map(task =>
                task._id === selectedTask._id ? updatedTask.data : task
            ));

            setIsUpdatingTask(false);
            setSelectedTask(null);
            showNotification('Task updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating task:", error);
            showNotification(error.message || 'Failed to update task.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate days until due date
    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null;

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

        if (daysUntilDue === null) return null;

        if (daysUntilDue < 0) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <FaExclamationTriangle className="h-3 w-3" />
                    {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue
                </Badge>
            );
        } else if (daysUntilDue === 0) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <FaExclamationTriangle className="h-3 w-3" />
                    Due today
                </Badge>
            );
        } else if (daysUntilDue <= 3) {
            return (
                <Badge variant="secondary" className="flex items-center gap-1">
                    <FaClock className="h-3 w-3" />
                    {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} left
                </Badge>
            );
        } else {
            return (
                <Badge variant="outline" className="flex items-center gap-1">
                    <FaCalendarAlt className="h-3 w-3" />
                    {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} left
                </Badge>
            );
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

    // Pagination
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    // Update form when selectedTask changes
    useEffect(() => {
        if (selectedTask) {
            taskUpdateForm.setValue('status', selectedTask.status || '');
            taskUpdateForm.setValue('progress', selectedTask.progress || 0);
            taskUpdateForm.setValue('notes', selectedTask.notes || '');
        }
    }, [selectedTask, taskUpdateForm]);

    // Get task statistics
    const taskStats = useMemo(() => {
        const total = tasks.length;
        const pending = tasks.filter(task => task.status === 'pending').length;
        const inProgress = tasks.filter(task => task.status === 'in-progress').length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const overdue = tasks.filter(task => {
            const daysUntilDue = getDaysUntilDue(task.dueDate);
            return daysUntilDue !== null && daysUntilDue < 0 && task.status !== 'completed';
        }).length;

        return { total, pending, inProgress, completed, overdue };
    }, [tasks]);

    if (isInitialLoading) return <LoadingSpinner message="Loading your tasks..." />;

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
                {/* Notification */}
                {notification.show && (
                    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                        {notification.type === 'success' ? <FaCheckCircle className="text-xl" /> : <FaExclamationTriangle className="text-xl" />}
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
                                        <FaTasks className="text-primary animate-pulse" />
                                        My Tasks
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Manage and track your assigned tasks
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </AnimatedCard>

                    {/* Task Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <AnimatedCard className="shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl font-bold">{taskStats.total}</div>
                                <div className="text-sm text-muted-foreground">Total Tasks</div>
                            </CardContent>
                        </AnimatedCard>
                        <AnimatedCard className="shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl font-bold text-yellow-500">{taskStats.pending}</div>
                                <div className="text-sm text-muted-foreground">Pending</div>
                            </CardContent>
                        </AnimatedCard>
                        <AnimatedCard className="shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl font-bold text-blue-500">{taskStats.inProgress}</div>
                                <div className="text-sm text-muted-foreground">In Progress</div>
                            </CardContent>
                        </AnimatedCard>
                        <AnimatedCard className="shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl font-bold text-green-500">{taskStats.completed}</div>
                                <div className="text-sm text-muted-foreground">Completed</div>
                            </CardContent>
                        </AnimatedCard>
                        <AnimatedCard className="shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl font-bold text-red-500">{taskStats.overdue}</div>
                                <div className="text-sm text-muted-foreground">Overdue</div>
                            </CardContent>
                        </AnimatedCard>
                    </div>

                    {/* Filters */}
                    <AnimatedCard className="shadow-md">
                        <CardContent className="pt-6">
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
                                    <FaFilter className="text-muted-foreground h-4 w-4" />
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

                    {/* Task Table */}
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
                                    {currentTasks.map((task) => (
                                        <TableRow key={task._id} className="hover:bg-muted/50 transition-all duration-200">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{task.title}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                                                    {task.category && <CategoryBadge category={task.category} className="mt-1" />}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={task.status} />
                                            </TableCell>
                                            <TableCell>
                                                {task.priority && <PriorityBadge priority={task.priority} />}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={task.progress || 0} className="w-16" />
                                                    <span className="text-sm">{task.progress || 0}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {task.dueDate ? (
                                                        <>
                                                            <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
                                                            {getDueDateBadge(task.dueDate)}
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">No due date</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedTask(task);
                                                                    setIsViewingTask(true);
                                                                }}
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
                                                                onClick={() => {
                                                                    setSelectedTask(task);
                                                                    setIsUpdatingTask(true);
                                                                }}
                                                            >
                                                                <FaEdit className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Update Task</p>
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <AnimatedButton
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft className="h-4 w-4" />
                            </AnimatedButton>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <AnimatedButton
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight className="h-4 w-4" />
                            </AnimatedButton>
                        </div>
                    )}

                    {/* View Task Dialog */}
                    <Dialog open={isViewingTask} onOpenChange={() => setIsViewingTask(false)}>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaTasks className="text-primary" />
                                    Task Details
                                </DialogTitle>
                                <DialogDescription>
                                    View details of the assigned task
                                </DialogDescription>
                            </DialogHeader>
                            {selectedTask && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
                                            <p className="font-medium">{selectedTask.title}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                            <StatusBadge status={selectedTask.status} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                                            {selectedTask.priority && <PriorityBadge priority={selectedTask.priority} />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                                            {selectedTask.category && <CategoryBadge category={selectedTask.category} />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
                                            <div className="flex flex-col gap-1">
                                                {selectedTask.dueDate ? (
                                                    <>
                                                        <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                                                        {getDueDateBadge(selectedTask.dueDate)}
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No due date</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Progress</h3>
                                            <div className="flex items-center gap-2">
                                                <Progress value={selectedTask.progress || 0} className="w-24" />
                                                <span className="text-sm">{selectedTask.progress || 0}%</span>
                                            </div>
                                        </div>
                                        {selectedTask.estimatedHours && (
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Hours</h3>
                                                <p>{selectedTask.estimatedHours} hours</p>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Assigned Date</h3>
                                            <p>{new Date(selectedTask.assignedAt || selectedTask.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                                        <p>{selectedTask.description}</p>
                                    </div>
                                    {selectedTask.tags && selectedTask.tags.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedTask.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedTask.notes && (
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                                            <p>{selectedTask.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <DialogFooter>
                                <AnimatedButton
                                    variant="outline"
                                    onClick={() => setIsViewingTask(false)}
                                >
                                    Close
                                </AnimatedButton>
                                <AnimatedButton
                                    onClick={() => {
                                        setIsViewingTask(false);
                                        setIsUpdatingTask(true);
                                    }}
                                >
                                    <FaEdit className="mr-2 h-4 w-4" />
                                    Update Task
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Update Task Dialog */}
                    <Dialog open={isUpdatingTask} onOpenChange={() => setIsUpdatingTask(false)}>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaEdit className="text-primary" />
                                    Update Task
                                </DialogTitle>
                                <DialogDescription>
                                    Update the status and progress of your task
                                </DialogDescription>
                            </DialogHeader>
                            {selectedTask && (
                                <form onSubmit={taskUpdateForm.handleSubmit(handleTaskUpdate)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            label="Status"
                                            error={taskUpdateForm.formState.errors.status}
                                            required
                                            tooltip="Update the current status of this task"
                                        >
                                            <Select
                                                value={taskUpdateForm.watch('status')}
                                                onValueChange={(value) => taskUpdateForm.setValue('status', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
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
                                        </FormField>
                                        <FormField
                                            label="Progress"
                                            error={taskUpdateForm.formState.errors.progress}
                                            required
                                            tooltip="Update the progress of this task (0-100%)"
                                        >
                                            <div className="space-y-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    {...taskUpdateForm.register('progress', { valueAsNumber: true })}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                                <Progress value={taskUpdateForm.watch('progress') || 0} />
                                            </div>
                                        </FormField>
                                    </div>
                                    <FormField
                                        label="Notes"
                                        error={taskUpdateForm.formState.errors.notes}
                                        tooltip="Add any notes or comments about this task"
                                    >
                                        <Textarea
                                            placeholder="Add notes or comments..."
                                            {...taskUpdateForm.register('notes')}
                                            rows={3}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </FormField>
                                    <div className="bg-muted/30 p-3 rounded-md">
                                        <h3 className="text-sm font-medium mb-2">Task Details</h3>
                                        <div className="text-sm space-y-1">
                                            <p><span className="font-medium">Title:</span> {selectedTask.title}</p>
                                            <p><span className="font-medium">Description:</span> {selectedTask.description}</p>
                                            {selectedTask.dueDate && (
                                                <p><span className="font-medium">Due Date:</span> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <AnimatedButton
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsUpdatingTask(false)}
                                        >
                                            Cancel
                                        </AnimatedButton>
                                        <AnimatedButton
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                            Save Changes
                                        </AnimatedButton>
                                    </DialogFooter>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </TooltipProvider>
    );
}