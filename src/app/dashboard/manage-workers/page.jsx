"use client";

// app/dashboard/manage-workers/page.jsx
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaUser, FaTasks, FaClipboardList,
    FaHourglassHalf, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaUserPlus,
    FaBriefcase, FaCalendarAlt, FaSearch, FaFilter, FaEye, FaEyeSlash, FaUserClock,
    FaUserCheck, FaUserTimes, FaExclamationCircle, FaFlag, FaTag, FaInfoCircle,
    FaPaperclip, FaStar, FaClock, FaChartLine, FaQuestionCircle, FaLightbulb
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Constants
const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', description: 'Worker has registered but not yet approved' },
    { value: 'approved', label: 'Approved', description: 'Worker has been approved but not yet active' },
    { value: 'active', label: 'Active', description: 'Worker is currently active and can be assigned tasks' },
    { value: 'inactive', label: 'Inactive', description: 'Worker is not currently available for tasks' }
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
const statusFormSchema = z.object({
    status: z.string().min(1, "Status is required"),
});

const workFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string().optional(),
    priority: z.string().default('medium'),
    category: z.string().default('other'),
    estimatedHours: z.string().optional(),
    tags: z.string().optional(),
});

// Helper Components
const StatusBadge = ({ status }) => {
    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'approved':
                return 'default';
            case 'active':
                return 'default';
            case 'inactive':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaHourglassHalf className="mr-1 h-3 w-3" />;
            case 'approved':
                return <FaCheckCircle className="mr-1 h-3 w-3" />;
            case 'active':
                return <FaUserCheck className="mr-1 h-3 w-3" />;
            case 'inactive':
                return <FaUserTimes className="mr-1 h-3 w-3" />;
            default:
                return <FaExclamationTriangle className="mr-1 h-3 w-3" />;
        }
    };

    return (
        <Badge variant={getStatusVariant(status)} className="flex items-center gap-1 transition-all duration-200 hover:scale-105">
            {getStatusIcon(status)}
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
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

// Form Field Component (without shadcn form)
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
            {description && <FaInfoCircle className="h-3 w-3 text-muted-foreground" title={description} />}
        </div>
        {children}
        {error && (
            <p className="text-sm font-medium text-destructive animate-pulse">
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
export default function ManageWorkers() {
    const [workers, setWorkers] = useState([]);
    const [availableWork, setAvailableWork] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [editingWorker, setEditingWorker] = useState(null);
    const [isAddingWork, setIsAddingWork] = useState(false);
    const [assigningWorkTo, setAssigningWorkTo] = useState(null);
    const [selectedTasksToAssign, setSelectedTasksToAssign] = useState([]);
    const [selectedWorkersForNewTask, setSelectedWorkersForNewTask] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    // Add the missing state variable for worker search in the task creation dialog
    const [workerSearchTerm, setWorkerSearchTerm] = useState('');
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

    // Forms
    const statusForm = useForm({
        resolver: zodResolver(statusFormSchema),
        defaultValues: {
            status: '',
        },
    });

    const workForm = useForm({
        resolver: zodResolver(workFormSchema),
        defaultValues: {
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
            category: 'other',
            estimatedHours: '',
            tags: '',
        },
    });

    // Fetch workers and available work from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workersResponse, workResponse] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/work')
                ]);

                if (!workersResponse.ok) throw new Error('Failed to fetch workers');
                if (!workResponse.ok) throw new Error('Failed to fetch work tasks');

                const workersData = await workersResponse.json();
                const workData = await workResponse.json();

                setWorkers(workersData);
                setAvailableWork(workData);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle worker status update
    const handleEditSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/workers/${editingWorker._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: data.status }),
            });

            if (!response.ok) {
                // Try to get the error message from the server
                let errorMessage = 'Failed to update worker status';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // If we can't parse the JSON, use the status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const updatedWorker = await response.json();
            setWorkers(workers.map(w => w._id === editingWorker._id ? updatedWorker.data : w));
            setEditingWorker(null);
            showNotification('Worker status updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating worker:", error);
            showNotification(error.message || 'Failed to update worker.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle adding new work task and assigning it to workers
    const handleWorkSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Add creation date to the data
            const taskData = {
                ...data,
                createdAt: currentDate,
                // Convert tags string to array if provided
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
            };

            // Create the work task
            const response = await fetch('/api/work', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create work task');
            }

            const newWork = await response.json();

            // If workers are selected, assign the task to them
            if (selectedWorkersForNewTask.length > 0) {
                // Create an array of promises for each assignment
                const assignmentPromises = selectedWorkersForNewTask.map(workerId =>
                    fetch(`/api/workers/${workerId}/assign`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ taskIds: [newWork.data._id] }),
                    })
                );

                // Wait for all promises to settle (either fulfilled or rejected)
                const assignmentResults = await Promise.allSettled(assignmentPromises);

                const failedAssignments = [];
                const successfulWorkerIds = [];

                // Process each result
                for (let i = 0; i < assignmentResults.length; i++) {
                    const result = assignmentResults[i];
                    const workerId = selectedWorkersForNewTask[i];
                    const worker = workers.find(w => w._id === workerId);
                    const workerName = worker ? worker.name : `Worker ID ${workerId}`;

                    if (result.status === 'fulfilled' && result.value.ok) {
                        successfulWorkerIds.push(workerId);
                    } else {
                        let errorMessage = 'Unknown error';
                        if (result.status === 'rejected') {
                            errorMessage = result.reason.message || 'Network or server error';
                        } else { // The fetch was successful but the server responded with an error status
                            try {
                                const errorData = await result.value.json();
                                errorMessage = errorData.error || `Server error (status: ${result.value.status})`;
                            } catch (e) {
                                errorMessage = `Server responded with status ${result.value.status}`;
                            }
                        }
                        failedAssignments.push({ workerName, errorMessage });
                    }
                }

                // If there were any failures, throw a detailed error
                if (failedAssignments.length > 0) {
                    const failureMessages = failedAssignments.map(
                        ({ workerName, errorMessage }) => `• ${workerName}: ${errorMessage}`
                    ).join('<br>'); // Use <br> for HTML rendering in the notification

                    throw new Error(`Task created, but failed to assign to some workers:<br>${failureMessages}`);
                }

                // If all assignments were successful, fetch updated worker data to keep UI in sync
                const updatedWorkersPromises = successfulWorkerIds.map(async (workerId) => {
                    const res = await fetch(`/api/workers/${workerId}`);
                    if (res.ok) return res.json();
                    return null;
                });

                const updatedWorkersData = await Promise.all(updatedWorkersPromises);

                setWorkers(prevWorkers =>
                    prevWorkers.map(worker => {
                        const updatedData = updatedWorkersData.find(data => data && data.data._id === worker._id);
                        return updatedData ? updatedData.data : worker;
                    })
                );

            } else {
                // If no workers are selected, add the task to the available work list
                setAvailableWork(prev => [...prev, newWork.data]);
            }

            // Reset form and show success
            setIsAddingWork(false);
            workForm.reset();
            setSelectedWorkersForNewTask([]);
            setWorkerSearchTerm('');
            showNotification('New work task created and assigned successfully!', 'success');

        } catch (error) {
            console.error("Error in handleWorkSubmit:", error);
            // The notification will now display the detailed, multi-line error message
            showNotification(error.message || 'Failed to create work task.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle assigning work to a worker
    // Handle assigning work to a worker
    const handleAssignWork = async () => {
        if (selectedTasksToAssign.length === 0) {
            showNotification('Please select at least one task to assign.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Assigning tasks:', selectedTasksToAssign);
            console.log('Worker ID:', assigningWorkTo._id);

            const response = await fetch(`/api/workers/${assigningWorkTo._id}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskIds: selectedTasksToAssign }),
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            // Parse the JSON response first
            const result = await response.json();
            console.log('Response data:', result);

            // Then check if the response was successful
            if (!response.ok) {
                // Extract the error message from the backend response
                const errorMessage = result.error || result.details || 'Failed to assign work';
                console.error('Error from backend:', errorMessage);
                throw new Error(errorMessage);
            }

            // Update worker's assigned work
            setWorkers(workers.map(w =>
                w._id === assigningWorkTo._id
                    ? { ...w, assignedWork: [...(w.assignedWork || []), ...result.data.assignedTasks] }
                    : w
            ));

            // Remove assigned tasks from available work list
            setAvailableWork(availableWork.filter(w => !selectedTasksToAssign.includes(w._id)));

            setAssigningWorkTo(null);
            setSelectedTasksToAssign([]);
            showNotification('Work assigned successfully!', 'success');
        } catch (error) {
            console.error("Error assigning work:", error);
            showNotification(error.message || 'Failed to assign work.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle worker deletion
    const handleDeleteWorker = async (workerId) => {
        if (confirm('Are you sure you want to delete this worker? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/workers/${workerId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Failed to delete worker');

                setWorkers(workers.filter(w => w._id !== workerId));
                showNotification('Worker deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting worker:", error);
                showNotification(error.message || 'Failed to delete worker.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Filter workers based on search and status
    const filteredWorkers = useMemo(() => {
        return workers.filter(worker => {
            const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [workers, searchTerm, statusFilter]);

    // Filter workers for task assignment based on search term
    const filteredWorkersForTask = useMemo(() => {
        return workers.filter(worker => {
            const matchesStatus = worker.status === 'active' || worker.status === 'approved';
            const matchesSearch = worker.name.toLowerCase().includes(workerSearchTerm.toLowerCase()) ||
                worker.email.toLowerCase().includes(workerSearchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [workers, workerSearchTerm]);

    // Update form when editingWorker changes
    useEffect(() => {
        if (editingWorker) {
            statusForm.setValue('status', editingWorker.status || '');
        }
    }, [editingWorker, statusForm]);

    if (isInitialLoading) return <LoadingSpinner message="Loading worker data..." />;

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
                                        <FaUserClock className="text-primary animate-pulse" />
                                        Manage Workers
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Approve workers and assign tasks
                                    </CardDescription>
                                </div>
                                <AnimatedButton
                                    onClick={() => setIsAddingWork(true)}
                                    className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                >
                                    <FaBriefcase className="mr-2 h-4 w-4" />
                                    Create New Task
                                </AnimatedButton>
                            </div>
                        </CardHeader>
                    </AnimatedCard>

                    {/* Filters */}
                    <AnimatedCard className="shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search by name or email..."
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
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-2 w-full">
                                                                {option.label}
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
                                </div>
                            </div>
                        </CardContent>
                    </AnimatedCard>

                    {/* Worker Table */}
                    <AnimatedCard className="shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Worker</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Assigned Tasks</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredWorkers.map((worker) => (
                                        <TableRow key={worker._id} className="hover:bg-muted/50 transition-all duration-200">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground transition-all duration-200 hover:scale-110">
                                                        <FaUser className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{worker.name}</div>
                                                        <div className="text-sm text-muted-foreground">{worker.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <StatusBadge status={worker.status} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{STATUS_OPTIONS.find(s => s.value === worker.status)?.description || 'No description available'}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span>{worker.assignedWork ? worker.assignedWork.length : 0}</span>
                                                    <AnimatedButton
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => {
                                                            setAssigningWorkTo(worker);
                                                            setSelectedTasksToAssign([]);
                                                        }}
                                                        title="Assign Work"
                                                    >
                                                        <FaPlus className="h-3 w-3" />
                                                    </AnimatedButton>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(worker.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setEditingWorker(worker)}
                                                                className="cursor-pointer"
                                                            >
                                                                <FaEdit className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit Worker Status</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setAssigningWorkTo(worker);
                                                                    setSelectedTasksToAssign([]);
                                                                }}
                                                            >
                                                                <FaTasks className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Assign Work</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteWorker(worker._id)}
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <FaTrash className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Worker</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filteredWorkers.length === 0 && (
                                <EmptyState
                                    message="No workers found"
                                    icon={<FaUserTimes className="mx-auto h-12 w-12 text-muted-foreground" />}
                                />
                            )}
                        </CardContent>
                    </AnimatedCard>

                    {/* Edit Worker Status Dialog */}
                    <Dialog open={!!editingWorker} onOpenChange={() => setEditingWorker(null)}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Update Status</DialogTitle>
                                <DialogDescription>
                                    Change the status for {editingWorker?.name}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={statusForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                                <FormField
                                    label="Status"
                                    error={statusForm.formState.errors.status}
                                    required
                                    tooltip="Select the appropriate status for this worker"
                                >
                                    <Select
                                        value={statusForm.watch('status')}
                                        onValueChange={(value) => statusForm.setValue('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        {option.label}
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <FaQuestionCircle className="h-3 w-3 text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{option.description}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <DialogFooter>
                                    <AnimatedButton type="button" variant="outline" onClick={() => setEditingWorker(null)}>
                                        Cancel
                                    </AnimatedButton>
                                    <AnimatedButton type="submit" disabled={isLoading}>
                                        {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                        Save
                                    </AnimatedButton>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Assign Work Dialog */}
                    <Dialog open={!!assigningWorkTo} onOpenChange={() => {
                        setAssigningWorkTo(null);
                        setSelectedTasksToAssign([]);
                    }}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Assign Work</DialogTitle>
                                <DialogDescription>
                                    Select tasks to assign to {assigningWorkTo?.name}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                                {availableWork.length > 0 ? (
                                    <div className="space-y-2">
                                        {availableWork.map((task) => (
                                            <div key={task._id} className="flex items-start space-x-2 p-2 hover:bg-muted rounded-md transition-all duration-200">
                                                <Checkbox
                                                    id={`task-${task._id}`}
                                                    checked={selectedTasksToAssign.includes(task._id)}
                                                    onCheckedChange={() => {
                                                        if (selectedTasksToAssign.includes(task._id)) {
                                                            setSelectedTasksToAssign(selectedTasksToAssign.filter(id => id !== task._id));
                                                        } else {
                                                            setSelectedTasksToAssign([...selectedTasksToAssign, task._id]);
                                                        }
                                                    }}
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor={`task-${task._id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {task.title}
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {task.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">No available work tasks to assign.</p>
                                )}
                            </div>
                            <DialogFooter>
                                <AnimatedButton type="button" variant="outline" onClick={() => {
                                    setAssigningWorkTo(null);
                                    setSelectedTasksToAssign([]);
                                }}>
                                    Cancel
                                </AnimatedButton>
                                <AnimatedButton
                                    onClick={handleAssignWork}
                                    disabled={isLoading || selectedTasksToAssign.length === 0}
                                >
                                    {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaTasks className="mr-2 h-4 w-4" />}
                                    Assign Selected
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Add Work Dialog - Enhanced Version */}
                    <Dialog open={isAddingWork} onOpenChange={() => {
                        setIsAddingWork(false);
                        setSelectedWorkersForNewTask([]);
                        setWorkerSearchTerm('');
                    }}>
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaBriefcase className="text-primary animate-pulse" />
                                    Create New Work Task
                                </DialogTitle>
                                <DialogDescription>
                                    Add a new task and assign it to workers
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
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
                                    <TabsTrigger
                                        value="preview"
                                        className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        Preview
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4 mt-4">
                                    <form onSubmit={workForm.handleSubmit(handleWorkSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                label="Task Title"
                                                error={workForm.formState.errors.title}
                                                required
                                                tooltip="Give your task a clear and descriptive title"
                                            >
                                                <Input
                                                    placeholder="Enter task title"
                                                    {...workForm.register('title')}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            </FormField>
                                            <FormField
                                                label="Category"
                                                error={workForm.formState.errors.category}
                                                tooltip="Select the category that best describes this task"
                                            >
                                                <Select
                                                    value={workForm.watch('category')}
                                                    onValueChange={(value) => workForm.setValue('category', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CATEGORY_OPTIONS.map(option => (
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
                                            error={workForm.formState.errors.description}
                                            required
                                            tooltip="Provide a detailed description of the task including requirements and expectations"
                                        >
                                            <Textarea
                                                placeholder="Enter task description"
                                                {...workForm.register('description')}
                                                rows={3}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormField>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField
                                                label="Priority"
                                                error={workForm.formState.errors.priority}
                                                tooltip="Set the priority level to help workers understand urgency"
                                            >
                                                <Select
                                                    value={workForm.watch('priority')}
                                                    onValueChange={(value) => workForm.setValue('priority', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select priority" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {PRIORITY_OPTIONS.map(option => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
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
                                                label="Due Date"
                                                error={workForm.formState.errors.dueDate}
                                                tooltip="Set a deadline for task completion"
                                            >
                                                <Input
                                                    type="date"
                                                    {...workForm.register('dueDate')}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            </FormField>

                                            <FormField
                                                label="Estimated Hours"
                                                error={workForm.formState.errors.estimatedHours}
                                                tooltip="Provide an estimate of how long this task will take"
                                            >
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 8"
                                                    {...workForm.register('estimatedHours')}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            </FormField>
                                        </div>

                                        <FormField
                                            label="Tags"
                                            error={workForm.formState.errors.tags}
                                            tooltip="Add tags to help categorize and find this task later"
                                        >
                                            <Input
                                                placeholder="e.g., frontend, urgent, bug-fix"
                                                {...workForm.register('tags')}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormField>

                                        <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                                            <FaCalendarAlt className="text-primary" />
                                            <span className="text-sm font-medium">Creation Date: {new Date(currentDate).toLocaleDateString()}</span>
                                        </div>
                                    </form>
                                </TabsContent>

                                <TabsContent value="assignment" className="space-y-4 mt-4">
                                    <FormField
                                        label="Assign to Workers (Optional)"
                                        tooltip="Select workers to assign this task to. Leave empty to make it available for anyone."
                                    >
                                        <div className="space-y-3">
                                            {/* Worker Search Input */}
                                            <div className="relative">
                                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    placeholder="Search workers by name or email..."
                                                    value={workerSearchTerm}
                                                    onChange={(e) => setWorkerSearchTerm(e.target.value)}
                                                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>

                                            {/* Worker Selection Stats */}
                                            <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                                                <span className="text-sm font-medium">
                                                    {selectedWorkersForNewTask.length} worker{selectedWorkersForNewTask.length !== 1 ? 's' : ''} selected
                                                </span>
                                                {selectedWorkersForNewTask.length > 0 && (
                                                    <AnimatedButton
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedWorkersForNewTask([])}
                                                    >
                                                        Clear All
                                                    </AnimatedButton>
                                                )}
                                            </div>

                                            {/* Worker List */}
                                            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                                                {filteredWorkersForTask.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {filteredWorkersForTask.map((worker) => (
                                                            <div key={worker._id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md transition-all duration-200">
                                                                <Checkbox
                                                                    id={`worker-${worker._id}`}
                                                                    checked={selectedWorkersForNewTask.includes(worker._id)}
                                                                    onCheckedChange={() => {
                                                                        if (selectedWorkersForNewTask.includes(worker._id)) {
                                                                            setSelectedWorkersForNewTask(selectedWorkersForNewTask.filter(id => id !== worker._id));
                                                                        } else {
                                                                            setSelectedWorkersForNewTask([...selectedWorkersForNewTask, worker._id]);
                                                                        }
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`worker-${worker._id}`}
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 flex-1"
                                                                >
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground transition-all duration-200 hover:scale-110">
                                                                        <FaUser className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span>{worker.name}</span>
                                                                            <StatusBadge status={worker.status} />
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground">{worker.email}</div>
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {worker.assignedWork ? worker.assignedWork.length : 0} tasks
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-center text-muted-foreground py-4">
                                                        {workerSearchTerm ? 'No workers match your search.' : 'No active workers available.'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </FormField>
                                </TabsContent>

                                <TabsContent value="preview" className="space-y-4 mt-4">
                                    <AnimatedCard className="transition-all duration-300 hover:shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <span>{workForm.watch('title') || 'Task Title'}</span>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge variant="outline" className="flex items-center gap-1 transition-all duration-200 hover:scale-105">
                                                                {CATEGORY_OPTIONS.find(c => c.value === workForm.watch('category'))?.icon}
                                                                {CATEGORY_OPTIONS.find(c => c.value === workForm.watch('category'))?.label || 'No Category'}
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{CATEGORY_OPTIONS.find(c => c.value === workForm.watch('category'))?.description || 'No description available'}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge variant="outline" className={`flex items-center gap-1 transition-all duration-200 hover:scale-105 ${PRIORITY_OPTIONS.find(p => p.value === workForm.watch('priority'))?.color
                                                                } text-white`}>
                                                                <FaFlag className="h-3 w-3" />
                                                                {PRIORITY_OPTIONS.find(p => p.value === workForm.watch('priority'))?.label || 'No Priority'}
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{PRIORITY_OPTIONS.find(p => p.value === workForm.watch('priority'))?.description || 'No description available'}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-4 text-xs">
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt />
                                                    Created: {new Date(currentDate).toLocaleDateString()}
                                                </span>
                                                {workForm.watch('dueDate') && (
                                                    <span className="flex items-center gap-1">
                                                        <FaClock />
                                                        Due: {new Date(workForm.watch('dueDate')).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {workForm.watch('estimatedHours') && (
                                                    <span className="flex items-center gap-1">
                                                        <FaChartLine />
                                                        Est. {workForm.watch('estimatedHours')} hours
                                                    </span>
                                                )}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mb-4">{workForm.watch('description') || 'Task description will appear here...'}</p>

                                            {workForm.watch('tags') && (
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {workForm.watch('tags').split(',').map((tag, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs transition-all duration-200 hover:scale-105">
                                                            {tag.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {selectedWorkersForNewTask.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium mb-2">Assigned to:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedWorkersForNewTask.map(workerId => {
                                                            const worker = workers.find(w => w._id === workerId);
                                                            return worker ? (
                                                                <Tooltip key={workerId}>
                                                                    <TooltipTrigger asChild>
                                                                        <Badge variant="outline" className="flex items-center gap-1 transition-all duration-200 hover:scale-105">
                                                                            <FaUser className="h-3 w-3" />
                                                                            {worker.name}
                                                                        </Badge>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{worker.email}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </AnimatedCard>
                                </TabsContent>
                            </Tabs>

                            <DialogFooter>
                                <AnimatedButton type="button" variant="outline" onClick={() => {
                                    setIsAddingWork(false);
                                    workForm.reset();
                                    setSelectedWorkersForNewTask([]);
                                    setWorkerSearchTerm('');
                                }}>
                                    Cancel
                                </AnimatedButton>
                                <AnimatedButton
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={workForm.handleSubmit(handleWorkSubmit)}
                                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                                >
                                    {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaPlus className="mr-2 h-4 w-4" />}
                                    Create Task
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </TooltipProvider>
    );
}