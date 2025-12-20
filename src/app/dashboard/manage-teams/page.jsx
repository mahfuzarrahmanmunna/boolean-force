// app/dashboard/tasks/page.jsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaTasks, FaClipboardList,
    FaSpinner, FaBriefcase, FaCalendarAlt, FaSearch, FaFilter, FaEye,
    FaUser, FaFlag, FaTag, FaClock, FaChartLine, FaQuestionCircle,
    FaExclamationTriangle, FaCheckCircle, FaHourglassHalf, FaInfoCircle
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Constants
const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-500' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
    { value: 'completed', label: 'Completed', color: 'bg-green-500' },
    { value: 'archived', label: 'Archived', color: 'bg-gray-400' }
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

// Form schema
const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string().optional(),
    priority: z.string().default('medium'),
    category: z.string().default('other'),
    estimatedHours: z.string().optional(),
    tags: z.string().optional(),
    assignedTo: z.string().optional(),
    status: z.string().default('pending'),
});

// Helper Components
const StatusBadge = ({ status }) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return (
        <Badge className={`${statusOption?.color || 'bg-gray-500'} text-white`}>
            {statusOption?.label || status}
        </Badge>
    );
};

const PriorityBadge = ({ priority }) => {
    const priorityOption = PRIORITY_OPTIONS.find(p => p.value === priority);
    return (
        <Badge className={`${priorityOption?.color || 'bg-gray-500'} text-white`}>
            <FaFlag className="mr-1 h-3 w-3" />
            {priorityOption?.label || priority}
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
export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [assigningTask, setAssigningTask] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    // Current date for creation timestamp
    const currentDate = new Date().toISOString().split('T')[0];
    // State for tab animation
    const [activeTab, setActiveTab] = useState('details');

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
            dueDate: '',
            priority: 'medium',
            category: 'other',
            estimatedHours: '',
            tags: '',
            assignedTo: '',
            status: 'pending',
        },
    });

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksResponse, workersResponse, teamsResponse] = await Promise.all([
                    fetch('/api/work'),
                    fetch('/api/workers'),
                    fetch('/api/teams')
                ]);

                if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');
                if (!workersResponse.ok) throw new Error('Failed to fetch workers');
                if (!teamsResponse.ok) throw new Error('Failed to fetch teams');

                const tasksData = await tasksResponse.json();
                const workersData = await workersResponse.json();
                const teamsData = await teamsResponse.json();

                setTasks(tasksData);
                setWorkers(workersData);
                setTeams(teamsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle task creation/update
    const handleTaskSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Add creation/update date to data
            const taskData = {
                ...data,
                createdAt: editingTask ? editingTask.createdAt : currentDate,
                updatedAt: currentDate,
                // Convert tags string to array if provided
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
            };

            const url = editingTask ? `/api/work/${editingTask._id}` : '/api/work';
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
                showNotification('Task created successfully!', 'success');
            }

            setIsAddingTask(false);
            setEditingTask(null);
            taskForm.reset();
        } catch (error) {
            console.error("Error saving task:", error);
            showNotification(error.message || 'Failed to save task.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/work/${taskId}`, {
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
        }
    };

    // Handle task assignment
    const handleAssignTask = async () => {
        if (!selectedWorker) {
            showNotification('Please select a worker to assign this task to.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/workers/${selectedWorker}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskIds: [assigningTask._id] }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to assign task');
            }

            const result = await response.json();
            
            // Update task in local state
            setTasks(tasks.map(t => 
                t._id === assigningTask._id 
                    ? { ...t, assignedTo: selectedWorker, status: 'in-progress', assignedAt: new Date() }
                    : t
            ));

            // Update worker in local state
            const updatedWorker = workers.find(w => w._id === selectedWorker);
            if (updatedWorker) {
                setWorkers(workers.map(w => 
                    w._id === selectedWorker 
                        ? { ...w, assignedWork: [...(w.assignedWork || []), assigningTask._id] }
                        : w
                ));
            }

            setAssigningTask(null);
            setSelectedWorker('');
            showNotification('Task assigned successfully!', 'success');
        } catch (error) {
            console.error("Error assigning task:", error);
            showNotification(error.message || 'Failed to assign task.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Get worker name by ID
    const getWorkerName = (workerId) => {
        const worker = workers.find(w => w._id === workerId);
        return worker ? worker.name : 'Unassigned';
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

    // Filter eligible workers for task assignment
    const eligibleWorkers = workers.filter(w => 
        w.status === 'active' || w.status === 'approved'
    );

    // Update form when editingTask changes
    useEffect(() => {
        if (editingTask) {
            taskForm.setValue('title', editingTask.title || '');
            taskForm.setValue('description', editingTask.description || '');
            taskForm.setValue('dueDate', editingTask.dueDate || '');
            taskForm.setValue('priority', editingTask.priority || 'medium');
            taskForm.setValue('category', editingTask.category || 'other');
            taskForm.setValue('estimatedHours', editingTask.estimatedHours || '');
            taskForm.setValue('tags', editingTask.tags ? editingTask.tags.join(', ') : '');
            taskForm.setValue('assignedTo', editingTask.assignedTo || '');
            taskForm.setValue('status', editingTask.status || 'pending');
        }
    }, [editingTask, taskForm]);

    if (isInitialLoading) return <LoadingSpinner message="Loading task data..." />;

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
                                        Task Management
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Create, assign, and track tasks
                                    </CardDescription>
                                </div>
                                <AnimatedButton
                                    onClick={() => setIsAddingTask(true)}
                                    className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                >
                                    <FaPlus className="mr-2 h-4 w-4" />
                                    Create New Task
                                </AnimatedButton>
                            </div>
                        </CardHeader>
                    </AnimatedCard>

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
                                <div className="flex gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {STATUS_OPTIONS.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            {PRIORITY_OPTIONS.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Category" />
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
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
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
                                                    <div className="text-sm text-muted-foreground">{task.description}</div>
                                                    {task.tags && task.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {task.tags.slice(0, 3).map((tag, index) => (
                                                                <Badge key={index} variant="secondary" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                            {task.tags.length > 3 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    +{task.tags.length - 3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="h-4 w-4 text-muted-foreground" />
                                                    <span>{getWorkerName(task.assignedTo)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={task.status} />
                                            </TableCell>
                                            <TableCell>
                                                <PriorityBadge priority={task.priority} />
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
                                                                onClick={() => setEditingTask(task)}
                                                                className="cursor-pointer"
                                                            >
                                                                <FaEdit className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit Task</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    {!task.assignedTo && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AnimatedButton
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setAssigningTask(task)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <FaUser className="h-4 w-4" />
                                                                </AnimatedButton>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Assign Task</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteTask(task._id)}
                                                                className="text-destructive hover:text-destructive"
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
                    }}>
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaBriefcase className="text-primary animate-pulse" />
                                    {editingTask ? 'Edit Task' : 'Create New Task'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingTask ? 'Update task details' : 'Add a new task to the system'}
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="details"
                                        className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        Task Details
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
                                        <div>
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Task Title <span className="text-destructive">*</span>
                                            </label>
                                            <Input
                                                placeholder="Enter task title"
                                                {...taskForm.register('title')}
                                                className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                            {taskForm.formState.errors.title && (
                                                <p className="text-sm font-medium text-destructive mt-1">
                                                    {taskForm.formState.errors.title.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Category
                                            </label>
                                            <Select
                                                value={taskForm.watch('category')}
                                                onValueChange={(value) => taskForm.setValue('category', value)}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
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

                                    <div>
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Description <span className="text-destructive">*</span>
                                        </label>
                                        <Textarea
                                            placeholder="Enter task description"
                                            {...taskForm.register('description')}
                                            rows={3}
                                            className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                        {taskForm.formState.errors.description && (
                                            <p className="text-sm font-medium text-destructive mt-1">
                                                {taskForm.formState.errors.description.message}
                                            </p>
                                            )}
                                        </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Priority
                                            </label>
                                            <Select
                                                value={taskForm.watch('priority')}
                                                onValueChange={(value) => taskForm.setValue('priority', value)}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                                <SelectContent>
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

                                        <div>
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Due Date
                                            </label>
                                            <Input
                                                type="date"
                                                {...taskForm.register('dueDate')}
                                                className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Estimated Hours
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="e.g., 8"
                                                {...taskForm.register('estimatedHours')}
                                                className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Tags
                                        </label>
                                        <Input
                                            placeholder="e.g., frontend, urgent, bug-fix"
                                            {...taskForm.register('tags')}
                                            className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                                        <FaCalendarAlt className="text-primary" />
                                        <span className="text-sm font-medium">
                                            Created: {editingTask ? new Date(editingTask.createdAt).toLocaleDateString() : new Date(currentDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </TabsContent>

                                <TabsContent value="assignment" className="space-y-4 mt-4">
                                    <div>
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Status
                                        </label>
                                        <Select
                                            value={taskForm.watch('status')}
                                            onValueChange={(value) => taskForm.setValue('status', value)}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map(option => (
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

                                    <div>
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Assign To (Optional)
                                        </label>
                                        <Select
                                            value={taskForm.watch('assignedTo')}
                                            onValueChange={(value) => taskForm.setValue('assignedTo', value)}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select a worker" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Unassigned</SelectItem>
                                                {eligibleWorkers.length > 0 ? (
                                                    eligibleWorkers.map(worker => (
                                                        // Only render SelectItem if worker has a valid ID
                                                        worker._id && (
                                                            <SelectItem key={worker._id} value={worker._id}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                                                        <FaUser className="h-3 w-3" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium">{worker.name}</div>
                                                                        <div className="text-xs text-muted-foreground">{worker.email}</div>
                                                                    </div>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {worker.assignedWork ? worker.assignedWork.length : 0} tasks
                                                                    </Badge>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-muted-foreground">
                                                        No eligible workers available
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <DialogFooter>
                                <AnimatedButton type="button" variant="outline" onClick={() => {
                                    setIsAddingTask(false);
                                    setEditingTask(null);
                                    taskForm.reset();
                                }}>
                                    Cancel
                                </AnimatedButton>
                                <AnimatedButton
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={taskForm.handleSubmit(handleTaskSubmit)}
                                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                                >
                                    {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                    {editingTask ? 'Update' : 'Create'} Task
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Assign Task Dialog */}
                    <Dialog open={!!assigningTask} onOpenChange={() => {
                        setAssigningTask(null);
                        setSelectedWorker('');
                    }}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Assign Task</DialogTitle>
                                <DialogDescription>
                                    Assign "{assigningTask?.title}" to a worker
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Select Worker <span className="text-destructive">*</span>
                                    </label>
                                    <Select
                                        value={selectedWorker}
                                        onValueChange={setSelectedWorker}
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select a worker" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {eligibleWorkers.length > 0 ? (
                                                eligibleWorkers.map(worker => (
                                                    // Only render SelectItem if worker has a valid ID
                                                    worker._id && (
                                                        <SelectItem key={worker._id} value={worker._id}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                                                    <FaUser className="h-3 w-3" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-medium">{worker.name}</div>
                                                                    <div className="text-xs text-muted-foreground">{worker.email}</div>
                                                                </div>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {worker.assignedWork ? worker.assignedWork.length : 0} tasks
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-muted-foreground">
                                                    No eligible workers available
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <AnimatedButton type="button" variant="outline" onClick={() => {
                                    setAssigningTask(null);
                                    setSelectedWorker('');
                                }}>
                                    Cancel
                                </AnimatedButton>
                                <AnimatedButton
                                    onClick={handleAssignTask}
                                    disabled={isLoading || !selectedWorker}
                                >
                                    {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaUser className="mr-2 h-4 w-4" />}
                                    Assign Task
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </TooltipProvider>
    );
}