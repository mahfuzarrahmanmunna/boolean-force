// app/dashboard/manage-workers/manage-active-workers/page.jsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaSearch, FaFilter, FaEye,
    FaCalendarAlt, FaClock, FaUser, FaUserCheck, FaUserTimes, FaExclamationTriangle,
    FaSpinner, FaChevronDown, FaChevronUp, FaSort, FaSortAmountDown,
    FaSortAmountUp, FaClipboardCheck, FaHourglassHalf, FaCheckCircle,
    FaBan, FaPlay, FaPause, FaRedo, FaArchive, FaStar, FaLink,
    FaPaperclip, FaComment, FaEllipsisV, FaBriefcase, FaTasks,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserCog, FaUserShield,
    FaCrown, FaGem, FaAward, FaChartLine, FaHistory, FaBell,
    FaToggleOn, FaToggleOff, FaUserPlus, FaUserMinus
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

// Constants
const ROLE_OPTIONS = [
    { value: 'user', label: 'User', color: 'blue' },
    { value: 'admin', label: 'Admin', color: 'purple' },
    { value: 'moderator', label: 'Moderator', color: 'green' },
    { value: 'manager', label: 'Manager', color: 'orange' }
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', icon: <FaUserCheck className="h-3 w-3" />, color: 'green' },
    { value: 'inactive', label: 'Inactive', icon: <FaUserTimes className="h-3 w-3" />, color: 'gray' },
    { value: 'pending', label: 'Pending', icon: <FaHourglassHalf className="h-3 w-3" />, color: 'yellow' },
    { value: 'suspended', label: 'Suspended', icon: <FaBan className="h-3 w-3" />, color: 'red' }
];

const SORT_OPTIONS = [
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'email-asc', label: 'Email (A-Z)' },
    { value: 'email-desc', label: 'Email (Z-A)' }
];

// Form schemas
const workerFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
    status: z.string().min(1, "Status is required"),
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
});

// Helper Components
const RoleBadge = ({ role }) => {
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700';
            case 'manager': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-700';
            case 'moderator': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700';
            case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <FaCrown className="h-3 w-3" />;
            case 'manager': return <FaAward className="h-3 w-3" />;
            case 'moderator': return <FaUserShield className="h-3 w-3" />;
            case 'user': return <FaUser className="h-3 w-3" />;
            default: return <FaUser className="h-3 w-3" />;
        }
    };

    return (
        <Badge variant="outline" className={`flex items-center gap-1 ${getRoleColor(role)}`}>
            {getRoleIcon(role)}
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'N/A'}
        </Badge>
    );
};

const StatusBadge = ({ status }) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    if (!statusOption) return null;

    return (
        <Badge variant="outline" className={`flex items-center gap-1 ${
            status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700' :
            status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700' :
            status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700'
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
export default function ManageActiveWorkers() {
    const [workers, setWorkers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [editingWorker, setEditingWorker] = useState(null);
    const [viewingWorker, setViewingWorker] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created-desc');
    const [selectedWorkers, setSelectedWorkers] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    // const { toast } = useToast();

    // Forms
    const workerForm = useForm({
        resolver: zodResolver(workerFormSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'user',
            status: 'active',
            phone: '',
            location: '',
            bio: '',
        },
    });

    // Show notification function
    const showNotification = (message, type = 'success') => {
        // toast({
        //     title: type === 'success' ? "Success" : "Error",
        //     description: message,
        //     variant: type === 'success' ? "default" : "destructive",
        // });
    };

    // Fetch active workers from API on component mount
    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await fetch('/api/users?status=active');
                if (!response.ok) throw new Error('Failed to fetch active workers');
                const workersData = await response.json();
                setWorkers(workersData);
            } catch (error) {
                console.error("Error fetching workers:", error);
                showNotification('Failed to load active workers. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchWorkers();
    }, []);

    // Handle worker update
    const handleWorkerSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/${editingWorker._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update worker');

            const result = await response.json();
            setWorkers(workers.map(w => w._id === editingWorker._id ? result.data : w));
            setEditingWorker(null);
            showNotification('Worker updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating worker:", error);
            showNotification(error.message || 'Failed to update worker.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle worker status change
    const handleStatusChange = async (workerId, newStatus) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/${workerId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update worker status');

            const result = await response.json();
            setWorkers(workers.map(w => w._id === workerId ? result.data : w));
            showNotification('Worker status updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating worker status:", error);
            showNotification(error.message || 'Failed to update worker status.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle worker deletion
    const handleDeleteWorker = async (workerId) => {
        if (confirm('Are you sure you want to delete this worker? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/users/${workerId}`, {
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

    // Handle bulk actions
    const handleBulkAction = async (action) => {
        if (selectedWorkers.length === 0) {
            showNotification('Please select at least one worker.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/users/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds: selectedWorkers, action }),
            });

            if (!response.ok) throw new Error(`Failed to ${action} workers`);

            const result = await response.json();
            setWorkers(result.data);
            setSelectedWorkers([]);
            showNotification(`Workers ${action}d successfully!`, 'success');
        } catch (error) {
            console.error("Error performing bulk action:", error);
            showNotification(error.message || `Failed to ${action} workers.`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter and sort workers
    const filteredAndSortedWorkers = useMemo(() => {
        let filtered = workers;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(worker =>
                worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(worker => worker.role === roleFilter);
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'created-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'created-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'email-asc':
                    return a.email.localeCompare(b.email);
                case 'email-desc':
                    return b.email.localeCompare(a.email);
                default:
                    return 0;
            }
        });

        return sorted;
    }, [workers, searchTerm, roleFilter, sortBy]);

    // Update form when editingWorker changes
    useEffect(() => {
        if (editingWorker) {
            workerForm.reset({
                name: editingWorker.name,
                email: editingWorker.email,
                role: editingWorker.role,
                status: editingWorker.status,
                phone: editingWorker.phone || '',
                location: editingWorker.location || '',
                bio: editingWorker.bio || '',
            });
        }
    }, [editingWorker, workerForm]);

    // Calculate worker statistics
    const workerStats = useMemo(() => {
        const stats = {
            total: workers.length,
            admin: workers.filter(w => w.role === 'admin').length,
            manager: workers.filter(w => w.role === 'manager').length,
            moderator: workers.filter(w => w.role === 'moderator').length,
            user: workers.filter(w => w.role === 'user').length,
            withAssignedWork: workers.filter(w => w.assignedWork && w.assignedWork.length > 0).length,
        };
        return stats;
    }, [workers]);

    if (isInitialLoading) return <LoadingSpinner message="Loading active workers..." />;

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{workerStats.total}</div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Currently active</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Admins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{workerStats.admin}</div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">System administrators</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Managers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">{workerStats.manager}</div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">Team managers</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">With Work</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{workerStats.withAssignedWork}</div>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Assigned tasks</p>
                    </CardContent>
                </Card>
            </div>

            {/* Header with Actions */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                <FaUserCheck className="text-primary" />
                                Active Workers
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Manage and monitor all active workers in the system
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setEditingWorker({})}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            >
                                <FaUserPlus className="mr-2 h-4 w-4" />
                                Add Worker
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search workers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {ROLE_OPTIONS.map(option => (
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

            {/* Worker Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedWorkers.length === filteredAndSortedWorkers.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedWorkers(filteredAndSortedWorkers.map(w => w._id));
                                            } else {
                                                setSelectedWorkers([]);
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Worker</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Assigned Work</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedWorkers.map((worker) => (
                                <TableRow key={worker._id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedWorkers.includes(worker._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedWorkers([...selectedWorkers, worker._id]);
                                                } else {
                                                    setSelectedWorkers(selectedWorkers.filter(id => id !== worker._id));
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={worker.avatar} alt={worker.name} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                                    {worker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{worker.name}</div>
                                                <div className="text-sm text-muted-foreground">{worker.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <RoleBadge role={worker.role} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{worker.assignedWork ? worker.assignedWork.length : 0}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                title="View assigned work"
                                            >
                                                <FaTasks className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(worker.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={worker.status} />
                                            <Switch
                                                checked={worker.status === 'active'}
                                                onCheckedChange={(checked) => handleStatusChange(worker._id, checked ? 'active' : 'inactive')}
                                            />
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
                                                <DropdownMenuItem onClick={() => setViewingWorker(worker)}>
                                                    <FaEye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setEditingWorker(worker)}>
                                                    <FaEdit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleStatusChange(worker._id, 'inactive')}>
                                                    <FaToggleOff className="mr-2 h-4 w-4" />
                                                    Deactivate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteWorker(worker._id)} className="text-red-600">
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
                    {filteredAndSortedWorkers.length === 0 && (
                        <EmptyState
                            message="No active workers found"
                            icon={<FaUserCheck className="mx-auto h-12 w-12 text-muted-foreground" />}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedWorkers.length > 0 && (
                <Card className="fixed bottom-4 right-4 z-40 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                                {selectedWorkers.length} worker{selectedWorkers.length > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('deactivate')}
                                >
                                    <FaToggleOff className="mr-2 h-4 w-4" />
                                    Deactivate
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

            {/* Add/Edit Worker Dialog */}
            <Dialog open={!!editingWorker} onOpenChange={() => {
                setEditingWorker(null);
                workerForm.reset();
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        {/* <DialogTitle>{editingWorker._id ? 'Edit Worker' : 'Add New Worker'}</DialogTitle> */}
                        <DialogDescription>
                            {editingWorker?.id ? 'Update worker details below.' : 'Fill in details to add a new worker.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={workerForm.handleSubmit(handleWorkerSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Name"
                                error={workerForm.formState.errors.name}
                                required
                            >
                                <Input
                                    placeholder="Enter worker name"
                                    {...workerForm.register('name')}
                                />
                            </FormField>
                            <FormField
                                label="Email"
                                error={workerForm.formState.errors.email}
                                required
                            >
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    {...workerForm.register('email')}
                                />
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Role"
                                error={workerForm.formState.errors.role}
                                required
                            >
                                <Select
                                    value={workerForm.watch('role')}
                                    onValueChange={(value) => workerForm.setValue('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLE_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField
                                label="Status"
                                error={workerForm.formState.errors.status}
                                required
                            >
                                <Select
                                    value={workerForm.watch('status')}
                                    onValueChange={(value) => workerForm.setValue('status', value)}
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
                                label="Phone"
                                error={workerForm.formState.errors.phone}
                            >
                                <Input
                                    placeholder="Enter phone number"
                                    {...workerForm.register('phone')}
                                />
                            </FormField>
                            <FormField
                                label="Location"
                                error={workerForm.formState.errors.location}
                            >
                                <Input
                                    placeholder="Enter location"
                                    {...workerForm.register('location')}
                                />
                            </FormField>
                        </div>
                        <FormField
                            label="Bio"
                            error={workerForm.formState.errors.bio}
                        >
                            <Textarea
                                placeholder="Enter bio"
                                {...workerForm.register('bio')}
                                rows={3}
                            />
                        </FormField>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => {
                                setEditingWorker(null);
                                workerForm.reset();
                            }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                {editingWorker?._id ? 'Update' : 'Create'} Worker
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Worker Dialog */}
            <Dialog open={!!viewingWorker} onOpenChange={() => setViewingWorker(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Worker Details</DialogTitle>
                    </DialogHeader>
                    {viewingWorker && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={viewingWorker.avatar} alt={viewingWorker.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                                        {viewingWorker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{viewingWorker.name}</h3>
                                    <p className="text-muted-foreground">{viewingWorker.email}</p>
                                    <div className="flex gap-2 mt-1">
                                        <RoleBadge role={viewingWorker.role} />
                                        <StatusBadge status={viewingWorker.status} />
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Provider</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <FaGem className="h-4 w-4 text-muted-foreground" />
                                        <span>{viewingWorker.provider}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Member Since</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                                        <span>{new Date(viewingWorker.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {viewingWorker.phone && (
                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <FaPhone className="h-4 w-4 text-muted-foreground" />
                                            <span>{viewingWorker.phone}</span>
                                        </div>
                                    </div>
                                )}
                                {viewingWorker.location && (
                                    <div>
                                        <label className="text-sm font-medium">Location</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground" />
                                            <span>{viewingWorker.location}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {viewingWorker.bio && (
                                <div>
                                    <label className="text-sm font-medium">Bio</label>
                                    <p className="mt-1 text-sm">{viewingWorker.bio}</p>
                                </div>
                            )}
                            {viewingWorker.assignedWork && viewingWorker.assignedWork.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium">Assigned Work</label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <FaBriefcase className="h-4 w-4 text-muted-foreground" />
                                        <span>{viewingWorker.assignedWork.length} tasks assigned</span>
                                        <Button variant="outline" size="sm" className="ml-auto">
                                            View Tasks
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setViewingWorker(null)}>
                                    Close
                                </Button>
                                <Button onClick={() => {
                                    setEditingWorker(viewingWorker);
                                    setViewingWorker(null);
                                }}>
                                    <FaEdit className="mr-2 h-4 w-4" />
                                    Edit Worker
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}