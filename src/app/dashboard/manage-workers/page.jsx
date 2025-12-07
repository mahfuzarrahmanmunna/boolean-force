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
    FaUserCheck, FaUserTimes, FaExclamationCircle
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

// Constants
const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
];

// Form schemas
const statusFormSchema = z.object({
    status: z.string().min(1, "Status is required"),
});

const workFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string().optional(),
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
        <Badge variant={getStatusVariant(status)} className="flex items-center gap-1">
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
            // Create the work task
            const response = await fetch('/api/work', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
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
    const handleAssignWork = async () => {
        if (selectedTasksToAssign.length === 0) {
            showNotification('Please select at least one task to assign.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/workers/${assigningWorkTo._id}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskIds: selectedTasksToAssign }),
            });

            if (!response.ok) throw new Error('Failed to assign work');

            const result = await response.json();

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    } animate-pulse`}>
                    {notification.type === 'success' ? <FaCheckCircle className="text-xl" /> : <FaExclamationTriangle className="text-xl" />}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                                    <FaUserClock className="text-primary" />
                                    Manage Workers
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    Approve workers and assign tasks
                                </CardDescription>
                            </div>
                            <Button
                                onClick={() => setIsAddingWork(true)}
                                className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                            >
                                <FaBriefcase className="mr-2 h-4 w-4" />
                                Create New Task
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Filters */}
                <Card className="shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-muted-foreground h-4 w-4" />
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
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
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Worker Table */}
                <Card className="shadow-lg overflow-hidden">
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
                                    <TableRow key={worker._id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                                    <FaUser className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{worker.name}</div>
                                                    <div className="text-sm text-muted-foreground">{worker.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={worker.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span>{worker.assignedWork ? worker.assignedWork.length : 0}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => {
                                                        setAssigningWorkTo(worker);
                                                        setSelectedTasksToAssign([]);
                                                    }}
                                                >
                                                    <FaPlus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(worker.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingWorker(worker)}
                                                    title="Edit Status"
                                                    className=" cursor-pointer"
                                                >
                                                    <FaEdit className="h-4 w-4 cursor-pointer" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setAssigningWorkTo(worker);
                                                        setSelectedTasksToAssign([]);
                                                    }}
                                                    title="Assign Work"
                                                >
                                                    <FaTasks className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteWorker(worker._id)}
                                                    title="Delete Worker"
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <FaTrash className="h-4 w-4" />
                                                </Button>
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
                </Card>

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
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingWorker(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                    Save
                                </Button>
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
                                        <div key={task._id} className="flex items-start space-x-2 p-2 hover:bg-muted rounded-md">
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
                            <Button type="button" variant="outline" onClick={() => {
                                setAssigningWorkTo(null);
                                setSelectedTasksToAssign([]);
                            }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAssignWork}
                                disabled={isLoading || selectedTasksToAssign.length === 0}
                            >
                                {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaTasks className="mr-2 h-4 w-4" />}
                                Assign Selected
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Work Dialog */}
                <Dialog open={isAddingWork} onOpenChange={() => {
                    setIsAddingWork(false);
                    setSelectedWorkersForNewTask([]);
                    setWorkerSearchTerm('');
                }}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Work Task</DialogTitle>
                            <DialogDescription>
                                Add a new task and assign it to workers
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={workForm.handleSubmit(handleWorkSubmit)} className="space-y-4">
                            <FormField
                                label="Task Title"
                                error={workForm.formState.errors.title}
                                required
                            >
                                <Input
                                    placeholder="Enter task title"
                                    {...workForm.register('title')}
                                />
                            </FormField>
                            <FormField
                                label="Description"
                                error={workForm.formState.errors.description}
                                required
                            >
                                <Textarea
                                    placeholder="Enter task description"
                                    {...workForm.register('description')}
                                    rows={3}
                                />
                            </FormField>
                            <FormField
                                label="Due Date (Optional)"
                                error={workForm.formState.errors.dueDate}
                            >
                                <Input
                                    type="date"
                                    {...workForm.register('dueDate')}
                                />
                            </FormField>

                            {/* Worker Selection Section */}
                            <FormField
                                label="Assign to Workers (Optional)"
                            >
                                <div className="space-y-3">
                                    {/* Worker Search Input */}
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Search workers by name or email..."
                                            value={workerSearchTerm}
                                            onChange={(e) => setWorkerSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    {/* Worker List */}
                                    <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                                        {filteredWorkersForTask.length > 0 ? (
                                            <div className="space-y-2">
                                                {filteredWorkersForTask.map((worker) => (
                                                    <div key={worker._id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
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
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                                                        >
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                                                <FaUser className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <div>{worker.name}</div>
                                                                <div className="text-xs text-muted-foreground">{worker.email}</div>
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

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => {
                                    setIsAddingWork(false);
                                    workForm.reset();
                                    setSelectedWorkersForNewTask([]);
                                    setWorkerSearchTerm('');
                                }}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaPlus className="mr-2 h-4 w-4" />}
                                    Create Task
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}