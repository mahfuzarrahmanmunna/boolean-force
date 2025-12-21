"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaSearch, FaFilter, FaEye,
    FaCalendarAlt, FaClock, FaUser, FaFlag, FaTasks, FaExclamationTriangle,
    FaSpinner, FaChevronDown, FaChevronUp, FaSort, FaSortAmountDown,
    FaSortAmountUp, FaClipboardCheck, FaHourglassHalf, FaCheckCircle,
    FaBan, FaPlay, FaPause, FaRedo, FaArchive, FaStar, FaLink,
    FaPaperclip, FaComment, FaEllipsisV
} from 'react-icons/fa';

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Constants
const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'gray' },
    { value: 'medium', label: 'Medium', color: 'blue' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' }
];

const STATUS_OPTIONS = [
    { value: 'todo', label: 'To Do', icon: <FaClipboardCheck className="h-3 w-3" />, color: 'gray' },
    { value: 'in-progress', label: 'In Progress', icon: <FaPlay className="h-3 w-3" />, color: 'blue' },
    { value: 'review', label: 'Review', icon: <FaEye className="h-3 w-3" />, color: 'yellow' },
    { value: 'completed', label: 'Completed', icon: <FaCheckCircle className="h-3 w-3" />, color: 'green' },
    { value: 'cancelled', label: 'Cancelled', icon: <FaBan className="h-3 w-3" />, color: 'red' }
];

const SORT_OPTIONS = [
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' },
    { value: 'due-asc', label: 'Due Date (Earliest)' },
    { value: 'due-desc', label: 'Due Date (Latest)' },
    { value: 'priority-desc', label: 'Priority (High to Low)' },
    { value: 'priority-asc', label: 'Priority (Low to High)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
];

// Form schemas
const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.string().min(1, "Priority is required"),
    status: z.string().min(1, "Status is required"),
    assignee: z.string().min(1, "Assignee is required"),
    dueDate: z.string().min(1, "Due date is required"),
    estimatedHours: z.string().optional(),
    tags: z.string().optional(),
});

// Helper Components
const PriorityBadge = ({ priority }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700';
            case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-700';
            case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'urgent': return <FaExclamationTriangle className="h-3 w-3" />;
            case 'high': return <FaFlag className="h-3 w-3" />;
            case 'medium': return <FaFlag className="h-3 w-3" />;
            case 'low': return <FaFlag className="h-3 w-3" />;
            default: return <FaFlag className="h-3 w-3" />;
        }
    };

    return (
        <Badge variant="outline" className={`flex items-center gap-1 ${getPriorityColor(priority)}`}>
            {getPriorityIcon(priority)}
            {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'N/A'}
        </Badge>
    );
};

const StatusBadge = ({ status }) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    if (!statusOption) return null;

    return (
        <Badge variant="outline" className={`flex items-center gap-1 ${
            status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700' :
            status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700' :
            status === 'review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700' :
            status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700'
        }`}>
            {statusOption.icon}
            {statusOption.label}
        </Badge>
    );
};

const LoadingSpinner = ({ message }) => (
    <div className="flex justify-center items-center h-64">
        <Card className="w-96">
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
                <p className="mt-4 text-sm text-muted-foreground">{message}</p>
            </CardContent>
        </Card>
    </div>
);

const EmptyState = ({ message, icon }) => (
    <div className="flex flex-col items-center justify-center py-12">
        {icon}
        <h3 className="mt-2 text-sm font-medium text-muted-foreground">{message}</h3>
    </div>
);

// Form Field Component
const FormField = ({ label, error, children, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label} {required && <span className="text-destructive">*</span>}
        </label>
        {children}
        {error && (
            <p className="text-sm font-medium text-destructive">
                {error.message}
            </p>
        )}
    </div>
);

// Main Component
export default function ManageTasks() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [viewingTask, setViewingTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created-desc');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    // const { toast } = useToast();

    // Forms
    const taskForm = useForm({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            status: 'todo',
            assignee: '',
            dueDate: '',
            estimatedHours: '',
            tags: '',
        },
    });

    // Show notification function
    const showNotification = (message, type = 'success') => {
        // toast({
        //     title: type === 'success' ? "Success" : "Error",
        //     description: message,
        //     variant: type === 'success' ? "default" : "destructive",
        // });
        console.log(`${type}: ${message}`);
    };

    // Fetch tasks from API on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Change from '/api/work' to '/api/work'
                const response = await fetch('/api/work');
                if (!response.ok) throw new Error('Failed to fetch tasks');
                const tasksData = await response.json();
                setTasks(tasksData);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                showNotification('Failed to load tasks. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Handle task creation/update
    const handleTaskSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Fixed the typo: changed from '/api/works' to '/api/work'
            const url = editingTask ? `/api/work/${editingTask._id}` : '/api/work';
            const method = editingTask ? 'PUT' : 'POST';
            
            console.log(`Submitting ${method} request to ${url}`, data);
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                // Try to get the error message from the server
                let errorMessage = `Failed to ${editingTask ? 'update' : 'create'} task`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                    console.error('Server error response:', errorData);
                } catch (e) {
                    // If we can't parse the JSON, use the status text
                    errorMessage = response.statusText || errorMessage;
                    console.error('Response status:', response.status, response.statusText);
                }
                throw new Error(errorMessage);
            }
    
            const result = await response.json();
            console.log('Server response:', result);
            
            if (editingTask) {
                // Update the task in the local state
                setTasks(tasks.map(t => t._id === editingTask._id ? result.data : t));
                showNotification('Task updated successfully!', 'success');
            } else {
                // Add the new task to the local state
                setTasks([...tasks, result.data]);
                showNotification('Task created successfully!', 'success');
            }
    
            setIsAddingTask(false);
            setEditingTask(null);
            taskForm.reset();
        } catch (error) {
            console.error("Error saving task:", error);
            showNotification(error.message || `Failed to ${editingTask ? 'update' : 'create'} task.`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                console.log(`Deleting task with ID: ${taskId}`);
                // Fixed the typo: changed from '/api/tasks' to '/api/work'
                const response = await fetch(`/api/work/${taskId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    // Try to get the error message from the server
                    let errorMessage = 'Failed to delete task';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorMessage;
                        console.error('Server error response:', errorData);
                    } catch (e) {
                        // If we can't parse the JSON, use the status text
                        errorMessage = response.statusText || errorMessage;
                        console.error('Response status:', response.status, response.statusText);
                    }
                    throw new Error(errorMessage);
                }

                setTasks(tasks.filter(t => t._id !== taskId));
                showNotification('Task deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting task:", error);
                showNotification(error.message || 'Failed to delete task.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle bulk actions
    const handleBulkAction = async (action) => {
        if (selectedTasks.length === 0) {
            showNotification('Please select at least one task.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            console.log(`Performing ${action} on tasks:`, selectedTasks);
            // Fixed the typo: changed from '/api/tasks/bulk' to '/api/work/bulk'
            const response = await fetch('/api/work/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskIds: selectedTasks, action }),
            });

            if (!response.ok) {
                // Try to get the error message from the server
                let errorMessage = `Failed to ${action} tasks`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                    console.error('Server error response:', errorData);
                } catch (e) {
                    // If we can't parse the JSON, use the status text
                    errorMessage = response.statusText || errorMessage;
                    console.error('Response status:', response.status, response.statusText);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success && result.data) {
                setTasks(result.data);
                setSelectedTasks([]);
                showNotification(`Tasks ${action}d successfully!`, 'success');
            } else {
                throw new Error(result.error || `Failed to ${action} tasks`);
            }
        } catch (error) {
            console.error("Error performing bulk action:", error);
            showNotification(error.message || `Failed to ${action} tasks.`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter and sort tasks
    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks;

        // Apply tab filter
        if (activeTab !== 'all') {
            filtered = filtered.filter(task => task.status === activeTab);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.assignee?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        // Apply priority filter
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'created-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'created-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'due-asc':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'due-desc':
                    return new Date(b.dueDate) - new Date(a.dueDate);
                case 'priority-desc':
                    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'priority-asc':
                    const priorityOrderAsc = { urgent: 4, high: 3, medium: 2, low: 1 };
                    return priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority];
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        return sorted;
    }, [tasks, activeTab, searchTerm, statusFilter, priorityFilter, sortBy]);

    // Update form when editingTask changes
    useEffect(() => {
        if (editingTask) {
            taskForm.reset({
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
                status: editingTask.status,
                assignee: editingTask.assignee,
                dueDate: editingTask.dueDate,
                estimatedHours: editingTask.estimatedHours || '',
                tags: editingTask.tags?.join(', ') || '',
            });
        }
    }, [editingTask, taskForm]);

    // Calculate task statistics
    const taskStats = useMemo(() => {
        const stats = {
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            review: tasks.filter(t => t.status === 'review').length,
            completed: tasks.filter(t => t.status === 'completed').length,
            cancelled: tasks.filter(t => t.status === 'cancelled').length,
            overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.status !== 'cancelled').length,
        };
        return stats;
    }, [tasks]);

    if (isInitialLoading) return <LoadingSpinner message="Loading tasks..." />;

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{taskStats.total}</div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">All tasks in system</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">{taskStats.completed}</div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">Tasks finished</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{taskStats.inProgress}</div>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Currently working</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Overdue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100">{taskStats.overdue}</div>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">Need attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Header with Actions */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                <FaTasks className="text-primary" />
                                Task Management
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Manage and track all your tasks efficiently
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setIsAddingTask(true)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            >
                                <FaPlus className="mr-2 h-4 w-4" />
                                New Task
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Filters and Search */}
            <Card>
                <CardContent className="py-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    {STATUS_OPTIONS.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priority</SelectItem>
                                    {PRIORITY_OPTIONS.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Task Table */}
            <Card>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="all">All ({taskStats.total})</TabsTrigger>
                            <TabsTrigger value="todo">To Do ({taskStats.todo})</TabsTrigger>
                            <TabsTrigger value="in-progress">In Progress ({taskStats.inProgress})</TabsTrigger>
                            <TabsTrigger value="review">Review ({taskStats.review})</TabsTrigger>
                            <TabsTrigger value="completed">Completed ({taskStats.completed})</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled ({taskStats.cancelled})</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="m-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedTasks.length === filteredAndSortedTasks.length}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedTasks(filteredAndSortedTasks.map(t => t._id));
                                                    } else {
                                                        setSelectedTasks([]);
                                                    }
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead>Task</TableHead>
                                        <TableHead>Assignee</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedTasks.map((task) => (
                                        <TableRow key={task._id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedTasks.includes(task._id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedTasks([...selectedTasks, task._id]);
                                                        } else {
                                                            setSelectedTasks(selectedTasks.filter(id => id !== task._id));
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{task.title}</div>
                                                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                        {task.description}
                                                    </div>
                                                    {task.tags && task.tags.length > 0 && (
                                                        <div className="flex gap-1 mt-1">
                                                            {task.tags.slice(0, 2).map((tag, index) => (
                                                                <Badge key={index} variant="secondary" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                            {task.tags.length > 2 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    +{task.tags.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {task.assignee?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <span className="text-sm">{task.assignee}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <PriorityBadge priority={task.priority} />
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={task.status} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
                                                    {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-24">
                                                    <Progress value={task.progress || 0} className="h-2" />
                                                    <span className="text-xs text-muted-foreground">{task.progress || 0}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <FaEllipsisV className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setViewingTask(task)}>
                                                            <FaEye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEditingTask(task)}>
                                                            <FaEdit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDeleteTask(task._id)} className="text-red-600">
                                                            <FaTrash className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filteredAndSortedTasks.length === 0 && (
                                <EmptyState
                                    message="No tasks found"
                                    icon={<FaTasks className="mx-auto h-12 w-12 text-muted-foreground" />}
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedTasks.length > 0 && (
                <Card className="fixed bottom-4 right-4 z-40 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                                {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('complete')}
                                >
                                    <FaCheck className="mr-2 h-4 w-4" />
                                    Complete
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('archive')}
                                >
                                    <FaArchive className="mr-2 h-4 w-4" />
                                    Archive
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('delete')}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <FaTrash className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Add/Edit Task Dialog */}
            <Dialog open={isAddingTask || !!editingTask} onOpenChange={() => {
                setIsAddingTask(false);
                setEditingTask(null);
                taskForm.reset();
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                        <DialogDescription>
                            {editingTask ? 'Update the task details below.' : 'Fill in the details to create a new task.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={taskForm.handleSubmit(handleTaskSubmit)} className="space-y-4">
                        <FormField
                            label="Task Title"
                            error={taskForm.formState.errors.title}
                            required
                        >
                            <Input
                                placeholder="Enter task title"
                                {...taskForm.register('title')}
                            />
                        </FormField>
                        <FormField
                            label="Description"
                            error={taskForm.formState.errors.description}
                            required
                        >
                            <Textarea
                                placeholder="Enter task description"
                                {...taskForm.register('description')}
                                rows={3}
                            />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Priority"
                                error={taskForm.formState.errors.priority}
                                required
                            >
                                <Select
                                    value={taskForm.watch('priority')}
                                    onValueChange={(value) => taskForm.setValue('priority', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRIORITY_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField
                                label="Status"
                                error={taskForm.formState.errors.status}
                                required
                            >
                                <Select
                                    value={taskForm.watch('status')}
                                    onValueChange={(value) => taskForm.setValue('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Assignee"
                                error={taskForm.formState.errors.assignee}
                                required
                            >
                                <Input
                                    placeholder="Enter assignee name"
                                    {...taskForm.register('assignee')}
                                />
                            </FormField>
                            <FormField
                                label="Due Date"
                                error={taskForm.formState.errors.dueDate}
                                required
                            >
                                <Input
                                    type="date"
                                    {...taskForm.register('dueDate')}
                                />
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Estimated Hours"
                                error={taskForm.formState.errors.estimatedHours}
                            >
                                <Input
                                    type="number"
                                    placeholder="e.g., 8"
                                    {...taskForm.register('estimatedHours')}
                                />
                            </FormField>
                            <FormField
                                label="Tags"
                                error={taskForm.formState.errors.tags}
                            >
                                <Input
                                    placeholder="e.g., urgent, frontend (comma separated)"
                                    {...taskForm.register('tags')}
                                />
                            </FormField>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => {
                                setIsAddingTask(false);
                                setEditingTask(null);
                                taskForm.reset();
                            }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                {editingTask ? 'Update' : 'Create'} Task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Task Dialog */}
            <Dialog open={!!viewingTask} onOpenChange={() => setViewingTask(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Task Details</DialogTitle>
                    </DialogHeader>
                    {viewingTask && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">{viewingTask.title}</h3>
                                <p className="text-muted-foreground mt-2">{viewingTask.description}</p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Priority</label>
                                    <div className="mt-1">
                                        <PriorityBadge priority={viewingTask.priority} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <div className="mt-1">
                                        <StatusBadge status={viewingTask.status} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Assignee</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {viewingTask.assignee?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <span>{viewingTask.assignee}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Due Date</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                                        <span>{new Date(viewingTask.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Created</label>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        {new Date(viewingTask.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Progress</label>
                                    <div className="mt-1">
                                        <Progress value={viewingTask.progress || 0} className="h-2" />
                                        <span className="text-xs text-muted-foreground">{viewingTask.progress || 0}%</span>
                                    </div>
                                </div>
                            </div>
                            {viewingTask.tags && viewingTask.tags.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium">Tags</label>
                                    <div className="mt-1 flex gap-1 flex-wrap">
                                        {viewingTask.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setViewingTask(null)}>
                                    Close
                                </Button>
                                <Button onClick={() => {
                                    setEditingTask(viewingTask);
                                    setViewingTask(null);
                                }}>
                                    <FaEdit className="mr-2 h-4 w-4" />
                                    Edit Task
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}