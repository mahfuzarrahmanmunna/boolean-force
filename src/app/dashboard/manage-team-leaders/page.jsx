// app/dashboard/manage-team-leaders/page.jsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaUsers, FaUserShield, FaDollarSign, FaTasks, FaEdit, FaTrash, FaSave, FaTimes,
    FaCheck, FaUser, FaSpinner, FaSearch, FaFilter, FaInfoCircle, FaKey, FaLock,
    FaUnlock, FaExclamationTriangle, FaCheckCircle, FaEye, FaEyeSlash, FaProjectDiagram,
    FaChartLine, FaMoneyBillWave, FaClipboardCheck, FaUserCog, FaTools, FaClock,
    FaQuestionCircle, FaShieldAlt, FaUserTie, FaCrown, FaHandshake,
    FaCog
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

// Constants
const PERMISSION_CATEGORIES = [
    {
        id: 'project',
        name: 'Project Management',
        icon: <FaProjectDiagram className="h-4 w-4" />,
        description: 'Permissions related to project management',
        permissions: [
            { id: 'create_project', name: 'Create Projects', description: 'Can create new projects' },
            { id: 'edit_project', name: 'Edit Projects', description: 'Can edit existing projects' },
            { id: 'delete_project', name: 'Delete Projects', description: 'Can delete projects' },
            { id: 'view_all_projects', name: 'View All Projects', description: 'Can view all projects in the system' },
            { id: 'assign_project', name: 'Assign Projects', description: 'Can assign projects to team members' },
        ]
    },
    {
        id: 'task',
        name: 'Task Management',
        icon: <FaTasks className="h-4 w-4" />,
        description: 'Permissions related to task management',
        permissions: [
            { id: 'create_task', name: 'Create Tasks', description: 'Can create new tasks' },
            { id: 'edit_task', name: 'Edit Tasks', description: 'Can edit existing tasks' },
            { id: 'delete_task', name: 'Delete Tasks', description: 'Can delete tasks' },
            { id: 'submit_task', name: 'Submit Tasks', description: 'Can submit tasks for review' },
            { id: 'approve_task', name: 'Approve Tasks', description: 'Can approve completed tasks' },
            { id: 'assign_task', name: 'Assign Tasks', description: 'Can assign tasks to team members' },
        ]
    },
    {
        id: 'monetization',
        name: 'Monetization',
        icon: <FaDollarSign className="h-4 w-4" />,
        description: 'Permissions related to project monetization',
        permissions: [
            { id: 'monetize_project', name: 'Monetize Projects', description: 'Can set up monetization for projects' },
            { id: 'view_revenue', name: 'View Revenue', description: 'Can view revenue reports' },
            { id: 'manage_payments', name: 'Manage Payments', description: 'Can manage payment settings' },
            { id: 'set_pricing', name: 'Set Pricing', description: 'Can set pricing for projects' },
        ]
    },
    {
        id: 'team',
        name: 'Team Management',
        icon: <FaUsers className="h-4 w-4" />,
        description: 'Permissions related to team management',
        permissions: [
            { id: 'add_member', name: 'Add Members', description: 'Can add new members to the team' },
            { id: 'remove_member', name: 'Remove Members', description: 'Can remove members from the team' },
            { id: 'edit_member_role', name: 'Edit Member Roles', description: 'Can change roles of team members' },
            { id: 'view_team_stats', name: 'View Team Stats', description: 'Can view team performance statistics' },
        ]
    },
    {
        id: 'system',
        name: 'System Access',
        icon: <FaCog className="h-4 w-4" />,
        description: 'Permissions related to system access',
        permissions: [
            { id: 'view_analytics', name: 'View Analytics', description: 'Can view system analytics' },
            { id: 'export_data', name: 'Export Data', description: 'Can export data from the system' },
            { id: 'manage_settings', name: 'Manage Settings', description: 'Can change system settings' },
        ]
    }
];

// Default permissions for new team leaders
const DEFAULT_PERMISSIONS = {
    project: ['create_project', 'edit_project', 'view_all_projects', 'assign_project'],
    task: ['create_task', 'edit_task', 'submit_task', 'approve_task', 'assign_task'],
    monetization: [],
    team: ['add_member', 'remove_member', 'view_team_stats'],
    system: []
};

// Form schema for permissions
const permissionsFormSchema = z.object({
    leaderId: z.string().min(1, "Leader ID is required"),
    permissions: z.array(z.string()).optional(),
});

// Helper Components
const PermissionBadge = ({ category, count, total }) => {
    const getCategoryColor = (category) => {
        switch (category) {
            case 'project':
                return 'bg-blue-500';
            case 'task':
                return 'bg-green-500';
            case 'monetization':
                return 'bg-yellow-500';
            case 'team':
                return 'bg-purple-500';
            case 'system':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Badge variant="outline" className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getCategoryColor(category)}`}></div>
            {count}/{total}
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
export default function ManageTeamLeaders() {
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [teams, setTeams] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [editingLeader, setEditingLeader] = useState(null);
    const [viewingLeader, setViewingLeader] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState('all');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    // State for tab animation
    const [activeTab, setActiveTab] = useState('permissions');

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Form for permissions
    const permissionsForm = useForm({
        resolver: zodResolver(permissionsFormSchema),
        defaultValues: {
            leaderId: '',
            permissions: [],
        },
    });

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamsResponse, workersResponse] = await Promise.all([
                    fetch('/api/teams'),
                    fetch('/api/workers')
                ]);

                if (!teamsResponse.ok) throw new Error('Failed to fetch teams');
                if (!workersResponse.ok) throw new Error('Failed to fetch workers');

                const teamsData = await teamsResponse.json();
                const workersData = await workersResponse.json();

                setTeams(teamsData);
                setWorkers(workersData);

                // Extract team leaders from teams and workers
                const leaders = teamsData.map(team => {
                    const leader = workersData.find(w => w._id === team.teamLeader);
                    if (!leader) return null;
                    
                    return {
                        ...leader,
                        teamId: team._id,
                        teamName: team.name,
                        teamMembers: team.teamMembers || [],
                        // Ensure permissions is always defined with default values
                        permissions: leader.permissions || { ...DEFAULT_PERMISSIONS }
                    };
                }).filter(Boolean);

                setTeamLeaders(leaders);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle permission update
    const handlePermissionsSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Format permissions for API
            const formattedPermissions = {};
            PERMISSION_CATEGORIES.forEach(category => {
                formattedPermissions[category.id] = data.permissions.filter(p => 
                    category.permissions.some(cp => cp.id === p)
                );
            });

            const response = await fetch(`/api/workers/${data.leaderId}/permissions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permissions: formattedPermissions }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update permissions');
            }

            const result = await response.json();

            // Update local state
            setTeamLeaders(leaders =>
                leaders.map(leader =>
                    leader._id === data.leaderId
                        ? { ...leader, permissions: formattedPermissions }
                        : leader
                )
            );

            setEditingLeader(null);
            showNotification('Permissions updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating permissions:", error);
            showNotification(error.message || 'Failed to update permissions.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter team leaders based on search and team filter
    const filteredLeaders = useMemo(() => {
        return teamLeaders.filter(leader => {
            const matchesSearch = leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leader.teamName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTeam = teamFilter === 'all' || leader.teamId === teamFilter;
            return matchesSearch && matchesTeam;
        });
    }, [teamLeaders, searchTerm, teamFilter]);

    // Get team member details
    const getTeamMemberDetails = (memberIds) => {
        return memberIds.map(id => workers.find(w => w._id === id)).filter(Boolean);
    };

    // Count permissions by category - FIXED VERSION
    const countPermissionsByCategory = (permissions, categoryId) => {
        // Safety check: if permissions is undefined or null, return 0
        if (!permissions) {
            return 0;
        }
        
        // Safety check: if permissions[categoryId] is undefined or null, return 0
        if (!permissions[categoryId]) {
            return 0;
        }
        
        // Ensure permissions[categoryId] is an array
        if (!Array.isArray(permissions[categoryId])) {
            return 0;
        }
        
        return permissions[categoryId].length;
    };

    // Update form when editingLeader changes
    useEffect(() => {
        if (editingLeader) {
            permissionsForm.setValue('leaderId', editingLeader._id);
            
            // Flatten permissions for form with safety checks
            const flatPermissions = [];
            Object.keys(editingLeader.permissions || {}).forEach(categoryId => {
                const categoryPermissions = editingLeader.permissions[categoryId];
                if (Array.isArray(categoryPermissions)) {
                    flatPermissions.push(...categoryPermissions);
                }
            });
            
            permissionsForm.setValue('permissions', flatPermissions);
        }
    }, [editingLeader, permissionsForm]);

    if (isInitialLoading) return <LoadingSpinner message="Loading team leaders..." />;

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
                                        <FaUserTie className="text-primary animate-pulse" />
                                        Manage Team Leaders
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Set permissions for team leaders
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </AnimatedCard>

                    {/* Filters */}
                    <AnimatedCard className="shadow-md">
                        <CardContent className="py-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search by name, email, or team..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaFilter className="text-muted-foreground h-4 w-4" />
                                    <Select value={teamFilter} onValueChange={setTeamFilter}>
                                        <SelectTrigger className="w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Filter by team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Teams</SelectItem>
                                            {teams.map(team => (
                                                <SelectItem key={team._id} value={team._id}>
                                                    {team.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </AnimatedCard>

                    {/* Team Leaders Table */}
                    <AnimatedCard className="shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Team Leader</TableHead>
                                        <TableHead>Team</TableHead>
                                        <TableHead>Members</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLeaders.map((leader) => (
                                        <TableRow key={leader._id} className="hover:bg-muted/50 transition-all duration-200">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground transition-all duration-200 hover:scale-110">
                                                        <FaUser className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{leader.name}</div>
                                                        <div className="text-sm text-muted-foreground">{leader.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                                        <FaUsers className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{leader.teamName}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <span>{getTeamMemberDetails(leader.teamMembers).length + 1}</span>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                                <FaUsers className="h-3 w-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <div className="space-y-1 max-w-xs">
                                                                <div className="font-medium">Team Members:</div>
                                                                {getTeamMemberDetails(leader.teamMembers).slice(0, 3).map(member => (
                                                                    <div key={member._id}>{member.name}</div>
                                                                ))}
                                                                {getTeamMemberDetails(leader.teamMembers).length > 3 && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        ...and {getTeamMemberDetails(leader.teamMembers).length - 3} more
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {PERMISSION_CATEGORIES.map(category => (
                                                        <PermissionBadge
                                                            key={category.id}
                                                            category={category.id}
                                                            count={countPermissionsByCategory(leader.permissions, category.id)}
                                                            total={category.permissions.length}
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setViewingLeader(leader)}
                                                                className="cursor-pointer"
                                                            >
                                                                <FaEye className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View Permissions</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setEditingLeader(leader)}
                                                                className="cursor-pointer"
                                                            >
                                                                <FaEdit className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit Permissions</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filteredLeaders.length === 0 && (
                                <EmptyState
                                    message="No team leaders found"
                                    icon={<FaUserTie className="mx-auto h-12 w-12 text-muted-foreground" />}
                                />
                            )}
                        </CardContent>
                    </AnimatedCard>

                    {/* Edit Permissions Dialog */}
                    <Dialog open={!!editingLeader} onOpenChange={() => setEditingLeader(null)}>
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaUserShield className="text-primary" />
                                    Edit Permissions for {editingLeader?.name}
                                </DialogTitle>
                                <DialogDescription>
                                    Configure permissions for {editingLeader?.name}, leader of {editingLeader?.teamName}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={permissionsForm.handleSubmit(handlePermissionsSubmit)} className="space-y-4">
                                <input type="hidden" {...permissionsForm.register('leaderId')} />

                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-5">
                                        {PERMISSION_CATEGORIES.map(category => (
                                            <TabsTrigger
                                                key={category.id}
                                                value={category.id}
                                                className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                            >
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center gap-1">
                                                            {category.icon}
                                                            <span className="hidden sm:inline">{category.name}</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{category.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {PERMISSION_CATEGORIES.map(category => (
                                        <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                                            <div className="space-y-3">
                                                {category.permissions.map(permission => (
                                                    <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-md">
                                                        <Checkbox
                                                            id={permission.id}
                                                            checked={permissionsForm.watch('permissions')?.includes(permission.id)}
                                                            onCheckedChange={(checked) => {
                                                                const currentPermissions = permissionsForm.watch('permissions') || [];
                                                                if (checked) {
                                                                    permissionsForm.setValue('permissions', [...currentPermissions, permission.id]);
                                                                } else {
                                                                    permissionsForm.setValue('permissions', currentPermissions.filter(id => id !== permission.id));
                                                                }
                                                            }}
                                                        />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <label
                                                                htmlFor={permission.id}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {permission.name}
                                                            </label>
                                                            <p className="text-sm text-muted-foreground">
                                                                {permission.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <DialogFooter>
                                    <AnimatedButton type="button" variant="outline" onClick={() => setEditingLeader(null)}>
                                        Cancel
                                    </AnimatedButton>
                                    <AnimatedButton type="submit" disabled={isLoading}>
                                        {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
                                        Save Permissions
                                    </AnimatedButton>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* View Permissions Dialog */}
                    <Dialog open={!!viewingLeader} onOpenChange={() => setViewingLeader(null)}>
                        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaUserShield className="text-primary" />
                                    Permissions for {viewingLeader?.name}
                                </DialogTitle>
                                <DialogDescription>
                                    Current permissions for {viewingLeader?.name}, leader of {viewingLeader?.teamName}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {PERMISSION_CATEGORIES.map(category => (
                                    <div key={category.id}>
                                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                            {category.icon}
                                            {category.name}
                                            <Badge variant="outline" className="ml-2">
                                                {countPermissionsByCategory(viewingLeader?.permissions, category.id)}/{category.permissions.length}
                                            </Badge>
                                        </h3>
                                        <div className="space-y-2">
                                            {category.permissions.map(permission => (
                                                <div key={permission.id} className="flex items-center justify-between p-2 border rounded-md">
                                                    <div>
                                                        <div className="font-medium">{permission.name}</div>
                                                        <div className="text-sm text-muted-foreground">{permission.description}</div>
                                                    </div>
                                                    {viewingLeader?.permissions?.[category.id]?.includes(permission.id) ? (
                                                        <Badge variant="default" className="bg-green-500">
                                                            <FaCheck className="mr-1 h-3 w-3" />
                                                            Enabled
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            <FaTimes className="mr-1 h-3 w-3" />
                                                            Disabled
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <DialogFooter>
                                <AnimatedButton onClick={() => setViewingLeader(null)}>
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