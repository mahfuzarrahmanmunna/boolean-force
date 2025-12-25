"use client";

// app/dashboard/manage-all-projects/page.jsx
import { useState, useEffect, useMemo } from 'react';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaProjectDiagram, FaTasks, FaClipboardList,
    FaHourglassHalf, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaUserPlus,
    FaBriefcase, FaCalendarAlt, FaSearch, FaFilter, FaEye, FaEyeSlash, FaUserClock,
    FaUserCheck, FaUserTimes, FaExclamationCircle, FaFlag, FaTag, FaInfoCircle,
    FaPaperclip, FaStar, FaClock, FaChartLine, FaQuestionCircle, FaLightbulb, FaDollarSign,
    FaPlayCircle, FaPauseCircle, FaStopCircle, FaArrowUp, FaArrowDown, FaArrowRight,
    FaUser, FaUsers
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
import CreateWorkTaskModal from '@/app/components/CreateWorkTaskModal/page';

// Constants
const STATUS_OPTIONS = [
    { value: 'planning', label: 'Planning', description: 'Project is in planning phase', color: 'bg-gray-500', icon: FaHourglassHalf },
    { value: 'in-progress', label: 'In Progress', description: 'Project is currently being worked on', color: 'bg-blue-500', icon: FaPlayCircle },
    { value: 'on-hold', label: 'On Hold', description: 'Project is temporarily paused', color: 'bg-yellow-500', icon: FaPauseCircle },
    { value: 'completed', label: 'Completed', description: 'Project has been completed', color: 'bg-green-500', icon: FaCheckCircle },
    { value: 'cancelled', label: 'Cancelled', description: 'Project has been cancelled', color: 'bg-red-500', icon: FaStopCircle }
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'bg-green-500', description: 'Low priority project, can be completed when time permits' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Standard priority project' },
    { value: 'high', label: 'High', color: 'bg-orange-500', description: 'High priority project, should be completed soon' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500', description: 'Urgent project, requires immediate attention' }
];

const CATEGORY_OPTIONS = [
    { value: 'web-development', label: 'Web Development', icon: '💻', description: 'Web development projects' },
    { value: 'mobile-app', label: 'Mobile App', icon: '📱', description: 'Mobile application projects' },
    { value: 'design', label: 'Design', icon: '🎨', description: 'UI/UX design projects' },
    { value: 'marketing', label: 'Marketing', icon: '📢', description: 'Marketing and promotional projects' },
    { value: 'consulting', label: 'Consulting', icon: '💼', description: 'Consulting projects' },
    { value: 'other', label: 'Other', icon: '📌', description: 'Other types of projects' }
];

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
    const [clients, setClients] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [viewingProject, setViewingProject] = useState(null);
    const [assigningProjectTo, setAssigningProjectTo] = useState(null);
    const [selectedTeamsToAssign, setSelectedTeamsToAssign] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    // State for CreateWorkTaskModal
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    
    // Current date for creation timestamp
    const currentDate = new Date().toISOString().split('T')[0];
    // State for team search in project assignment dialog
    const [teamSearchTerm, setTeamSearchTerm] = useState('');

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Fetch projects, clients, workers, and teams from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, usersResponse, teamsResponse] = await Promise.all([
                    fetch('/api/work'),
                    fetch('/api/users'),
                    fetch('/api/teams')
                ]);

                if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
                if (!usersResponse.ok) throw new Error('Failed to fetch users');
                if (!teamsResponse.ok) throw new Error('Failed to fetch teams');

                const projectsResult = await projectsResponse.json();
                const usersData = await usersResponse.json();
                const teamsData = await teamsResponse.json();

                // Extract clients from users data
                const clientsData = usersData.filter(user => user.role === 'client');

                // Handle different response structures
                const projectsData = projectsResult.data || projectsResult;
                const teamsList = teamsData.data || teamsData;
                
                setProjects(projectsData);
                setClients(clientsData);
                setWorkers(usersData);
                setTeams(teamsList);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle project deletion
    const handleDeleteProject = async (projectId) => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/work/${projectId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Failed to delete project');

                setProjects(projects.filter(p => p._id !== projectId));
                showNotification('Project deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting project:", error);
                showNotification(error.message || 'Failed to delete project.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle assigning teams to a project
    const handleAssignTeams = async () => {
        if (selectedTeamsToAssign.length === 0) {
            showNotification('Please select at least one team to assign.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Assigning teams:', selectedTeamsToAssign);
            console.log('Project ID:', assigningProjectTo._id);

            // For each selected team, assign the project to that team
            const assignmentPromises = selectedTeamsToAssign.map(teamId => 
                fetch(`/api/teams/${teamId}/assign`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectIds: [assigningProjectTo._id] }),
                })
            );

            // Wait for all assignments to complete
            const results = await Promise.allSettled(assignmentPromises);
            
            // Check if any assignments failed
            const failedAssignments = [];
            const successfulTeamIds = [];
            
            results.forEach((result, index) => {
                const teamId = selectedTeamsToAssign[index];
                const team = teams.find(t => t._id === teamId);
                const teamName = team ? team.name : `Team ID ${teamId}`;
                
                if (result.status === 'rejected' || !result.value.ok) {
                    failedAssignments.push(teamName);
                } else {
                    successfulTeamIds.push(teamId);
                }
            });

            if (failedAssignments.length > 0) {
                throw new Error(`Failed to assign project to teams: ${failedAssignments.join(', ')}`);
            }

            // Update the project's assignedTo field with the team IDs
            const updatedProject = {
                ...assigningProjectTo,
                assignedTo: [...(assigningProjectTo.assignedTo || []), ...successfulTeamIds],
                updatedAt: new Date().toISOString()
            };

            // Update the projects state
            setProjects(projects.map(p => 
                p._id === assigningProjectTo._id ? updatedProject : p
            ));

            // Update the teams state to reflect the new assignments
            const updatedTeams = teams.map(team => {
                if (successfulTeamIds.includes(team._id)) {
                    return {
                        ...team,
                        assignedProjects: [...(team.assignedProjects || []), assigningProjectTo._id],
                        updatedAt: new Date().toISOString()
                    };
                }
                return team;
            });
            setTeams(updatedTeams);

            setAssigningProjectTo(null);
            setSelectedTeamsToAssign([]);
            showNotification('Teams assigned successfully!', 'success');
        } catch (error) {
            console.error("Error assigning teams:", error);
            showNotification(error.message || 'Failed to assign teams.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Get client name by ID
    const getClientName = (clientId) => {
        if (!clientId) return 'Unassigned';
        const client = clients.find(c => c && c._id === clientId);
        return client ? client.name : 'Unknown Client';
    };

    // Get team name by ID
    const getTeamName = (teamId) => {
        if (!teamId) return 'Unassigned';
        const team = teams.find(t => t && t._id === teamId);
        return team ? team.name : 'Unknown Team';
    };

    // Get team leader name by ID
    const getTeamLeaderName = (teamId) => {
        if (!teamId) return 'Unknown';
        const team = teams.find(t => t && t._id === teamId);
        if (!team || !team.teamLeader) return 'Unknown';
        const leader = workers.find(w => w && w._id === team.teamLeader);
        return leader ? leader.name : 'Unknown Leader';
    };

    // Filter projects based on search and filters
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            // Add null check for project
            if (!project) return false;
            
            const title = project.title || '';
            const description = project.description || '';
            const clientId = project.clientId || '';
            
            const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getClientName(clientId).toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
            const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
        });
    }, [projects, searchTerm, statusFilter, priorityFilter, categoryFilter, clients]);

    // Filter teams for project assignment based on search term
    const filteredTeamsForProject = useMemo(() => {
        return teams.filter(team => {
            const name = team.name || '';
            const matchesSearch = name.toLowerCase().includes(teamSearchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [teams, teamSearchTerm]);

    if (isInitialLoading) return <LoadingSpinner message="Loading project data..." />;

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
                                    onClick={() => setIsCreateTaskModalOpen(true)}
                                    className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                >
                                    <FaTasks className="mr-2 h-4 w-4" />
                                    Create Task
                                </AnimatedButton>
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
                                        <TableHead>Client</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Budget</TableHead>
                                        <TableHead>Assigned Teams</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProjects.map((project) => (
                                        <TableRow key={project._id} className="hover:bg-muted/50 transition-all duration-200">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{project.title || 'Untitled'}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                                        {project.description || 'No description'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="h-4 w-4 text-muted-foreground" />
                                                    {getClientName(project.clientId)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={project.status || 'unknown'} />
                                            </TableCell>
                                            <TableCell>
                                                <PriorityBadge priority={project.priority || 'medium'} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={project.progress || 0} className="w-16" />
                                                    <span className="text-sm">{project.progress || 0}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                                                    {project.budget ? project.budget.toLocaleString() : 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.assignedTo && project.assignedTo.length > 0 ? (
                                                        project.assignedTo.map((teamId, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {getTeamName(teamId)}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">Not assigned</span>
                                                    )}
                                                </div>
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
                                                                onClick={() => {
                                                                    setAssigningProjectTo(project);
                                                                    setSelectedTeamsToAssign([]);
                                                                }}
                                                            >
                                                                <FaUsers className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Assign Teams</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AnimatedButton
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteProject(project._id)}
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <FaTrash className="h-4 w-4" />
                                                            </AnimatedButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Project</p>
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

                    {/* Assign Teams Dialog */}
                    <Dialog open={!!assigningProjectTo} onOpenChange={() => {
                        setAssigningProjectTo(null);
                        setSelectedTeamsToAssign([]);
                    }}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Assign Teams</DialogTitle>
                                <DialogDescription>
                                    Select teams to assign to {assigningProjectTo?.title || 'Selected Project'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                {/* Team Search Input */}
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search teams by name..."
                                        value={teamSearchTerm}
                                        onChange={(e) => setTeamSearchTerm(e.target.value)}
                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                {/* Team Selection Stats */}
                                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                                    <span className="text-sm font-medium">
                                        {selectedTeamsToAssign.length} team{selectedTeamsToAssign.length !== 1 ? 's' : ''} selected
                                    </span>
                                    {selectedTeamsToAssign.length > 0 && (
                                        <AnimatedButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedTeamsToAssign([])}
                                        >
                                            Clear All
                                        </AnimatedButton>
                                    )}
                                </div>

                                {/* Team List */}
                                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                                    {filteredTeamsForProject.length > 0 ? (
                                        <div className="space-y-2">
                                            {filteredTeamsForProject.map((team) => (
                                                <div key={team._id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md transition-all duration-200">
                                                    <Checkbox
                                                        id={`team-${team._id}`}
                                                        checked={selectedTeamsToAssign.includes(team._id)}
                                                        onCheckedChange={() => {
                                                            if (selectedTeamsToAssign.includes(team._id)) {
                                                                setSelectedTeamsToAssign(selectedTeamsToAssign.filter(id => id !== team._id));
                                                            } else {
                                                                setSelectedTeamsToAssign([...selectedTeamsToAssign, team._id]);
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`team-${team._id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 flex-1"
                                                    >
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground transition-all duration-200 hover:scale-110">
                                                            <FaUsers className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span>{team.name || 'Unnamed Team'}</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {team.teamMembers ? team.teamMembers.length : 0} members
                                                                </Badge>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                Leader: {getTeamLeaderName(team._id)}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {team.assignedProjects ? team.assignedProjects.length : 0} projects
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-4">
                                            {teamSearchTerm ? 'No teams match your search.' : 'No teams available.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <AnimatedButton type="button" variant="outline" onClick={() => {
                                    setAssigningProjectTo(null);
                                    setSelectedTeamsToAssign([]);
                                }}>
                                    Cancel
                                </AnimatedButton>
                                <AnimatedButton
                                    onClick={handleAssignTeams}
                                    disabled={isLoading || selectedTeamsToAssign.length === 0}
                                >
                                    {isLoading ? <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> : <FaUsers className="mr-2 h-4 w-4" />}
                                    Assign Selected
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* View Project Dialog */}
                    <Dialog open={!!viewingProject} onOpenChange={() => setViewingProject(null)}>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <FaProjectDiagram className="text-primary" />
                                    {viewingProject?.title || 'Project Details'}
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
                                                <StatusBadge status={viewingProject.status || 'unknown'} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Priority</h4>
                                            <div className="mt-1">
                                                <PriorityBadge priority={viewingProject.priority || 'medium'} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Client</h4>
                                            <p className="mt-1">{getClientName(viewingProject.clientId)}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Budget</h4>
                                            <p className="mt-1">${viewingProject.budget?.toLocaleString() || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                                            <p className="mt-1">{viewingProject.startDate ? new Date(viewingProject.startDate).toLocaleDateString() : 'Not set'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
                                            <p className="mt-1">{viewingProject.endDate ? new Date(viewingProject.endDate).toLocaleDateString() : 'Not set'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                        <p className="mt-1">{viewingProject.description || 'No description available'}</p>
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

                                    {viewingProject.assignedTo && viewingProject.assignedTo.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Assigned Teams</h4>
                                            <div className="mt-1 space-y-2">
                                                {viewingProject.assignedTo.map((teamId, index) => {
                                                    const team = teams.find(t => t._id === teamId);
                                                    return (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                                                            <div className="flex items-center gap-2">
                                                                <FaUsers className="h-4 w-4 text-muted-foreground" />
                                                                <span>{getTeamName(teamId)}</span>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                Leader: {getTeamLeaderName(teamId)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                                            <p className="mt-1">{new Date(viewingProject.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Updated</h4>
                                            <p className="mt-1">{new Date(viewingProject.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <AnimatedButton onClick={() => setViewingProject(null)}>
                                    Close
                                </AnimatedButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Create Work Task Modal */}
                    <CreateWorkTaskModal
                        isOpen={isCreateTaskModalOpen}
                        onClose={() => setIsCreateTaskModalOpen(false)}
                        teams={teams}
                        workers={workers}
                        availableWork={projects}
                        setAvailableWork={setProjects}
                        setTeams={setTeams}
                        showNotification={showNotification}
                    />
                </div>
            </div>
        </TooltipProvider>
    );
}