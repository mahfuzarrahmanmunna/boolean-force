// app/dashboard/manage-all-projects/page.jsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaProjectDiagram, FaTasks, FaCalendarAlt,
    FaSearch, FaFilter, FaEye, FaEyeSlash, FaUser, FaClock, FaFlag, FaTag, FaDollarSign,
    FaChartLine, FaBriefcase, FaExclamationTriangle, FaSpinner, FaCheckCircle, FaHourglassHalf,
    FaPlayCircle, FaPauseCircle, FaStopCircle, FaArrowUp, FaArrowDown, FaArrowRight
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
    { value: 'pending', label: 'Pending', color: 'bg-gray-500', icon: FaHourglassHalf },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500', icon: FaPlayCircle },
    { value: 'completed', label: 'Completed', color: 'bg-green-500', icon: FaCheckCircle },
    { value: 'archived', label: 'Archived', color: 'bg-gray-700', icon: FaStopCircle }
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
const projectFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.string().default('medium'),
    category: z.string().default('other'),
    dueDate: z.string().optional(),
    estimatedHours: z.string().optional(),
    tags: z.string().optional(),
});

// Helper Components
const StatusBadge = ({ status }) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    const Icon = statusOption?.icon || FaExclamationTriangle;

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
                                <FaExclamationTriangle className="h-3 w-3" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
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
export default function ManageAllProjects() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [viewingProject, setViewingProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Forms
    const projectForm = useForm({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            category: 'other',
            dueDate: '',
            estimatedHours: '',
            tags: '',
        },
    });

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, usersResponse] = await Promise.all([
                    fetch('/api/work'),
                    fetch('/api/users')
                ]);

                if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
                if (!usersResponse.ok) throw new Error('Failed to fetch users');

                const projectsData = await projectsResponse.json();
                const usersData = await usersResponse.json();

                setProjects(projectsData);
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle project creation
    const handleProjectSubmit = async (data) => {
        setIsLoading(true);
        try {
            const projectData = {
                ...data,
                estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : 0,
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
                status: 'pending',
                progress: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const response = await fetch('/api/work', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create project');
            }

            setProjects(prev => [result.data, ...prev]);
            setIsAddingProject(false);
            projectForm.reset();
            showNotification('Project created successfully!', 'success');
        } catch (error) {
            console.error("Error creating project:", error);
            showNotification(error.message || 'Failed to create project.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Get user name by ID
    const getUserName = (userId) => {
        if (!userId) return 'Unassigned';
        const user = users.find(u => u._id === userId);
        return user ? user.name : 'Unknown User';
    };

    // Filter projects based on search and filters
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getUserName(project.assignedTo).toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
            const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
        });
    }, [projects, searchTerm, statusFilter, priorityFilter, categoryFilter, users]);

    // Update form when editingProject changes
    useEffect(() => {
        if (editingProject) {
            projectForm.setValue('title', editingProject.title || '');
            projectForm.setValue('description', editingProject.description || '');
            projectForm.setValue('priority', editingProject.priority || 'medium');
            projectForm.setValue('category', editingProject.category || 'other');
            projectForm.setValue('dueDate', editingProject.dueDate || '');
            projectForm.setValue('estimatedHours', editingProject.estimatedHours || '');
            projectForm.setValue('tags', editingProject.tags ? editingProject.tags.join(', ') : '');
        }
    }, [editingProject, projectForm]);

    if (isInitialLoading) return <LoadingSpinner message="Loading projects..." />;

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
                                        <FaProjectDiagram className="text-primary animate-pulse" />
                                        Manage All Projects
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        View and manage all projects in the system
                                    </CardDescription>
                                </div>
                                <AnimatedButton
                                    onClick={() => setIsAddingProject(true)}
                                    className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                >
                                    <FaPlus className="mr-2 h-4 w-4" />
                                    New Project
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
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
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
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Category</SelectItem>
                                            {CATEGORY_OPTIONS.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </AnimatedCard>

                    {/* Projects Table */}
                    <AnimatedCard className="shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProjects.map((project) => (
                                        <TableRow key={project._id} className="hover:bg-muted/50 transition-all duration-200">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{project.title}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                                        {project.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="h-4 w-4 text-muted-foreground" />
                                                    {getUserName(project.assignedTo)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={project.status} />
                                            </TableCell>
                                            <TableCell>
                                                <PriorityBadge priority={project.priority} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={project.progress || 0} className="w-16" />
                                                    <span className="text-sm">{project.progress || 0}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not set'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setViewingProject(project)}
                                                            >
                                                                <FaEye className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View Details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setEditingProject(project)}
                                                            >
                                                                <FaEdit className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit Project</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filteredProjects.length === 0 && (
                                <EmptyState
                                    message="No projects found"
                                    icon={<FaProjectDiagram className="mx-auto h-12 w-12 text-muted-foreground" />}
                                />
                            )}
                        </CardContent>
                    </AnimatedCard>

                    {/* Add Project Dialog */}
                    <Dialog open={isAddingProject} onOpenChange={() => {
                        setIsAddingProject(false);
                        projectForm.reset();
                    }}>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaProjectDiagram className="text-primary animate-pulse" />
                                    Create New Project
                                </DialogTitle>
                                <DialogDescription>
                                    Add a new project to the system
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4">
                                <FormField
                                    label="Project Title"
                                    error={projectForm.formState.errors.title}
                                    required
                                >
                                    <Input
                                        placeholder="Enter project title"
                                        {...projectForm.register('title')}
                                    />
                                </FormField>

                                <FormField
                                    label="Description"
                                    error={projectForm.formState.errors.description}
                                    required
                                >
                                    <Textarea
                                        placeholder="Enter project description"
                                        {...projectForm.register('description')}
                                        rows={3}
                                    />
                                </FormField>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        label="Category"
                                        error={projectForm.formState.errors.category}
                                    >
                                        <Select
                                            value={projectForm.watch('category')}
                                            onValueChange={(value) => projectForm.setValue('category', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
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
                                    </FormField>
                                    <FormField
                                        label="Priority"
                                        error={projectForm.formState.errors.priority}
                                    >
                                        <Select
                                            value={projectForm.watch('priority')}
                                            onValueChange={(value) => projectForm.setValue('priority', value)}
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
                                        label="Due Date"
                                        error={projectForm.formState.errors.dueDate}
                                    >
                                        <Input
                                            type="date"
                                            {...projectForm.register('dueDate')}
                                        />
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="Estimated Hours"
                                        error={projectForm.formState.errors.estimatedHours}
                                    >
                                        <Input
                                            type="number"
                                            placeholder="0.0"
                                            {...projectForm.register('estimatedHours')}
                                        />
                                    </FormField>
                                    <FormField
                                        label="Tags"
                                        error={projectForm.formState.errors.tags}
                                    >
                                        <Input
                                            placeholder="e.g., frontend, urgent, redesign"
                                            {...projectForm.register('tags')}
                                        />
                                    </FormField>
                                </div>

                                <DialogFooter>
                                    <AnimatedButton type="button" variant="outline" onClick={() => {
                                        setIsAddingProject(false);
                                        projectForm.reset();
                                    }}>
                                        Cancel
                                    </AnimatedButton>
                                    <AnimatedButton type="submit" disabled={isLoading}>
                                        {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaPlus className="mr-2 h-4 w-4" />}
                                        Create Project
                                    </AnimatedButton>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* View Project Dialog */}
                    <Dialog open={!!viewingProject} onOpenChange={() => setViewingProject(null)}>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaProjectDiagram className="text-primary" />
                                    {viewingProject?.title}
                                </DialogTitle>
                                <DialogDescription>
                                    Project details and information
                                </DialogDescription>
                            </DialogHeader>
                            {viewingProject && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                            <div className="mt-1">
                                                <StatusBadge status={viewingProject.status} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Priority</h4>
                                            <div className="mt-1">
                                                <PriorityBadge priority={viewingProject.priority} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Assigned To</h4>
                                            <p className="mt-1">{getUserName(viewingProject.assignedTo)}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Due Date</h4>
                                            <p className="mt-1">{viewingProject.dueDate ? new Date(viewingProject.dueDate).toLocaleDateString() : 'Not set'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Estimated Hours</h4>
                                            <p className="mt-1">{viewingProject.estimatedHours || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                                            <p className="mt-1">{new Date(viewingProject.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                        <p className="mt-1">{viewingProject.description}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Progress</h4>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Progress value={viewingProject.progress || 0} className="flex-1" />
                                            <span className="text-sm">{viewingProject.progress || 0}%</span>
                                        </div>
                                    </div>

                                    {viewingProject.tags && viewingProject.tags.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {viewingProject.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {viewingProject.notes && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                                            <p className="mt-1">{viewingProject.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <DialogFooter>
                                <AnimatedButton onClick={() => setViewingProject(null)}>
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