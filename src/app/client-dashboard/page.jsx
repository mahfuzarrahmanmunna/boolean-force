"use client";

import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    Calendar,
    DollarSign,
    Users,
    TrendingUp,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    BarChart3,
    PieChart,
    Activity,
    Star,
    Download,
    Filter,
    Search,
    Bell,
    User,
    Settings,
    HelpCircle,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Plus,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClientPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedTimeRange, setSelectedTimeRange] = useState('month');
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentClient, setCurrentClient] = useState(null);
    const [error, setError] = useState(null);

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current user from session/auth
                const sessionResponse = await fetch('/api/auth/session');
                const sessionData = await sessionResponse.json();

                if (!sessionData || !sessionData.user) {
                    throw new Error('Not authenticated');
                }

                const currentUserId = sessionData.user.id;

                // Fetch all tasks
                const tasksResponse = await fetch('/api/work');
                if (!tasksResponse.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const allTasks = await tasksResponse.json();

                // Fetch all users
                const usersResponse = await fetch('/api/users');
                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch users');
                }
                const allUsers = await usersResponse.json();

                // Find current client info
                const clientInfo = allUsers.find(user => user._id === currentUserId && user.role === 'client');
                if (!clientInfo) {
                    throw new Error('Client not found or unauthorized');
                }

                // Filter tasks to only show those belonging to this client
                const clientTasks = allTasks.filter(task => task.clientId === currentUserId);

                // Get unique user IDs from client's projects
                const assignedUserIds = [...new Set(clientTasks
                    .filter(task => task.assignedTo)
                    .map(task => task.assignedTo)
                )];

                // Filter users to only show those working on client's projects
                const relevantUsers = allUsers.filter(user =>
                    assignedUserIds.includes(user._id) || user._id === currentUserId
                );

                setTasks(clientTasks);
                setUsers(relevantUsers);
                setCurrentClient(clientInfo);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Process data for charts and statistics
    const calculateStats = () => {
        if (tasks.length === 0) {
            return [
                {
                    title: 'Active Projects',
                    value: '0',
                    change: 'No projects',
                    changeType: 'neutral',
                    icon: <Briefcase className="w-5 h-5" />,
                    color: 'blue'
                },
                {
                    title: 'Completed Tasks',
                    value: '0',
                    change: 'No data',
                    changeType: 'neutral',
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: 'green'
                },
                {
                    title: 'Team Members',
                    value: '0',
                    change: 'No data',
                    changeType: 'neutral',
                    icon: <Users className="w-5 h-5" />,
                    color: 'purple'
                },
                {
                    title: 'Total Budget',
                    value: '$0',
                    change: 'No data',
                    changeType: 'neutral',
                    icon: <DollarSign className="w-5 h-5" />,
                    color: 'amber'
                }
            ];
        }

        const activeProjects = tasks.filter(task => task.status === 'in-progress' || task.status === 'pending').length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const teamMembers = users.filter(user => user.status === 'active' && user._id !== currentClient?._id).length;
        const totalBudget = tasks.reduce((sum, task) => sum + (task.budget || 0), 0);

        return [
            {
                title: 'Active Projects',
                value: activeProjects.toString(),
                change: `${Math.round(activeProjects / tasks.length * 100)}% of total`,
                changeType: 'increase',
                icon: <Briefcase className="w-5 h-5" />,
                color: 'blue'
            },
            {
                title: 'Completed Tasks',
                value: completedTasks.toString(),
                change: `${Math.round(completedTasks / tasks.length * 100)}% completion rate`,
                changeType: 'increase',
                icon: <CheckCircle className="w-5 h-5" />,
                color: 'green'
            },
            {
                title: 'Team Members',
                value: teamMembers.toString(),
                change: 'Working on your projects',
                changeType: 'neutral',
                icon: <Users className="w-5 h-5" />,
                color: 'purple'
            },
            {
                title: 'Total Budget',
                value: `$${totalBudget.toLocaleString()}`,
                change: 'Across all projects',
                changeType: 'increase',
                icon: <DollarSign className="w-5 h-5" />,
                color: 'amber'
            }
        ];
    };

    const stats = calculateStats();

    // Process data for revenue chart
    const getRevenueData = () => {
        // Group tasks by month and calculate budget
        const monthlyData = {};

        tasks.forEach(task => {
            if (task.budget && task.createdAt) {
                const date = new Date(task.createdAt);
                const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = { revenue: 0, projects: 0 };
                }

                monthlyData[monthYear].revenue += task.budget;
                monthlyData[monthYear].projects += 1;
            }
        });

        // Convert to array format for chart
        return Object.entries(monthlyData).map(([name, data]) => ({
            name,
            revenue: data.revenue,
            projects: data.projects
        }));
    };

    const revenueData = getRevenueData();

    // Process data for project distribution chart
    const getProjectDistribution = () => {
        const statusCount = {};

        tasks.forEach(task => {
            const status = task.status || 'unknown';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        const colors = {
            'completed': '#10b981',
            'in-progress': '#3b82f6',
            'pending': '#8b5cf6',
            'archived': '#6b7280',
            'planning': '#f59e0b',
            'unknown': '#ef4444'
        };

        return Object.entries(statusCount).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
            value,
            color: colors[name] || '#6b7280'
        }));
    };

    const projectDistribution = getProjectDistribution();

    // Process data for team performance chart
    const getTeamPerformance = () => {
        const userPerformance = {};

        tasks.forEach(task => {
            if (task.assignedTo) {
                if (!userPerformance[task.assignedTo]) {
                    userPerformance[task.assignedTo] = { tasks: 0, completed: 0 };
                }

                userPerformance[task.assignedTo].tasks += 1;
                if (task.status === 'completed') {
                    userPerformance[task.assignedTo].completed += 1;
                }
            }
        });

        // Convert to array format and add user names
        return Object.entries(userPerformance).map(([userId, data]) => {
            const user = users.find(u => u._id === userId);
            return {
                name: user ? user.name : 'Unknown User',
                tasks: data.tasks,
                completed: data.completed
            };
        }).slice(0, 5); // Limit to top 5
    };

    const teamPerformance = getTeamPerformance();

    // Process recent projects
    const getRecentProjects = () => {
        // Sort tasks by creation date (newest first) and take the first 4
        return [...tasks]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4)
            .map(task => {
                const assignedUser = users.find(user => user._id === task.assignedTo);
                return {
                    id: task._id,
                    name: task.title,
                    client: currentClient ? currentClient.name : 'Unknown Client',
                    status: task.status || 'unknown',
                    progress: task.progress || 0,
                    deadline: task.dueDate || 'No deadline',
                    team: assignedUser ? [assignedUser.name] : [],
                    budget: task.budget ? `$${task.budget.toLocaleString()}` : 'No budget',
                    startDate: task.startDate || 'Not specified'
                };
            });
    };

    const recentProjects = getRecentProjects();

    // Generate upcoming events based on client's project deadlines
    const getUpcomingEvents = () => {
        const events = [];

        tasks
            .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3)
            .forEach(task => {
                const dueDate = new Date(task.dueDate);
                events.push({
                    id: task._id,
                    title: `Project Deadline: ${task.title}`,
                    date: task.dueDate,
                    time: dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    type: 'deadline'
                });
            });

        return events;
    };

    const upcomingEvents = getUpcomingEvents();

    // Generate notifications based on client's projects
    const getNotifications = () => {
        const notifications = [];

        // Add notifications for projects approaching deadline
        tasks
            .filter(task => {
                if (!task.dueDate) return false;
                const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                return daysUntilDue <= 5 && daysUntilDue > 0 && task.status !== 'completed';
            })
            .forEach(task => {
                notifications.push({
                    id: `deadline-${task._id}`,
                    title: 'Project deadline approaching',
                    message: `${task.title} is due in ${Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days`,
                    time: 'Today',
                    read: false
                });
            });

        // Add notifications for newly assigned tasks
        tasks
            .filter(task => {
                if (!task.assignedAt) return false;
                const daysSinceAssigned = Math.ceil((new Date() - new Date(task.assignedAt)) / (1000 * 60 * 60 * 24));
                return daysSinceAssigned <= 3;
            })
            .forEach(task => {
                const assignedUser = users.find(user => user._id === task.assignedTo);
                notifications.push({
                    id: `assigned-${task._id}`,
                    title: 'Task assigned',
                    message: `${task.title} has been assigned to ${assignedUser ? assignedUser.name : 'a team member'}`,
                    time: 'Recently',
                    read: false
                });
            });

        return notifications.slice(0, 5);
    };

    const notifications = getNotifications();

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'pending': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            case 'planning': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'meeting': return <Users className="w-4 h-4" />;
            case 'presentation': return <FileText className="w-4 h-4" />;
            case 'planning': return <Calendar className="w-4 h-4" />;
            case 'deadline': return <Clock className="w-4 h-4" />;
            default: return <Calendar className="w-4 h-4" />;
        }
    };

    const getEventColor = (type) => {
        switch (type) {
            case 'meeting': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'presentation': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
            case 'planning': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
            case 'deadline': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="relative inline-flex">
                        <div className="w-16 h-16 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
                        <div className="w-16 h-16 bg-blue-600 rounded-full relative flex items-center justify-center">
                            <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Error Loading Data</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentClient ? currentClient.name : 'Client'}!</h1>
                        <p className="text-blue-100">Here's what's happening with your projects today.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <button classname=" cursor-pointerpx-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </button>
                        <button classname=" cursor-pointerpx-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center font-medium">
                            <Plus className="w-4 h-4 mr-2" />
                            New Project
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                                stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                                    stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                                        'bg-amber-100 dark:bg-amber-900/20'}`}>
                                <div className={`${stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                    stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                                        stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                            'text-amber-600 dark:text-amber-400'}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className={`flex items-center text-sm ${stat.changeType === 'increase' ? 'text-green-600' :
                                stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'}`}>
                                {stat.changeType === 'increase' && <ArrowUp className="w-3 h-3 mr-1" />}
                                {stat.changeType === 'decrease' && <ArrowDown className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-1">
                <div className="flex flex-col sm:flex-row">
                    {['overview', 'projects', 'analytics', 'team'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'overview' && (
                        <>
                            {/* Chart Section */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Budget Overview</h2>
                                    <div className="flex items-center space-x-2">
                                        {['week', 'month', 'year'].map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => setSelectedTimeRange(range)}
                                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedTimeRange === range
                                                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                {range.charAt(0).toUpperCase() + range.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1e293b',
                                                    border: '1px solid #334155',
                                                    borderRadius: '8px'
                                                }}
                                                labelStyle={{ color: '#f1f5f9' }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                            <Area type="monotone" dataKey="projects" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recent Projects */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Projects</h2>
                                    <button classname=" cursor-pointertext-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center">
                                        View All
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recentProjects.length > 0 ? recentProjects.map((project) => (
                                        <div key={project.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-medium text-slate-900 dark:text-white">{project.name}</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{project.client}</p>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status.replace('-', ' ')}
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                                                    <span className="font-medium text-slate-900 dark:text-white">{project.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center text-slate-600 dark:text-slate-400">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {project.deadline}
                                                </div>
                                                <div className="flex -space-x-2">
                                                    {project.team.map((member, index) => (
                                                        <div key={index} className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                                {member.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button classname=" cursor-pointerpx-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors flex items-center">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8">
                                            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No projects yet</h3>
                                            <p className="text-slate-600 dark:text-slate-400">Get started by creating your first project.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'projects' && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 sm:mb-0">Your Projects</h2>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search projects..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <Filter className="w-4 h-4 text-slate-400 mr-2" />
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="completed">Completed</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="pending">Pending</option>
                                            <option value="archived">Archived</option>
                                            <option value="planning">Planning</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700">
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Project</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Assigned To</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Progress</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Deadline</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.length > 0 ? tasks
                                            .filter(task => {
                                                const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
                                                const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
                                                return matchesSearch && matchesStatus;
                                            })
                                            .map((task) => {
                                                const assignedUser = users.find(user => user._id === task.assignedTo);
                                                return (
                                                    <tr key={task._id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                        <td className="py-3 px-4">
                                                            <div className="font-medium text-slate-900 dark:text-white">{task.title}</div>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                                            {assignedUser ? assignedUser.name : 'Unassigned'}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status || 'unknown')}`}>
                                                                {(task.status || 'unknown').replace('-', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center">
                                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-2">
                                                                    <div
                                                                        className="bg-blue-600 h-2 rounded-full"
                                                                        style={{ width: `${task.progress || 0}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{task.progress || 0}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{task.dueDate || 'No deadline'}</td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center space-x-2">
                                                                <button classname=" cursor-pointerp-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button classname=" cursor-pointerp-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button classname=" cursor-pointerp-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }) : (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center">
                                                    <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No projects found</h3>
                                                    <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Project Distribution</h2>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RePieChart>
                                                <Pie
                                                    data={projectDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {projectDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </RePieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Team Performance</h2>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={teamPerformance}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="name" stroke="#94a3b8" />
                                                <YAxis stroke="#94a3b8" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1e293b',
                                                        border: '1px solid #334155',
                                                        borderRadius: '8px'
                                                    }}
                                                    labelStyle={{ color: '#f1f5f9' }}
                                                />
                                                <Bar dataKey="tasks" fill="#3b82f6" />
                                                <Bar dataKey="completed" fill="#10b981" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Budget Trend</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1e293b',
                                                    border: '1px solid #334155',
                                                    borderRadius: '8px'
                                                }}
                                                labelStyle={{ color: '#f1f5f9' }}
                                            />
                                            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Team Members</h2>
                                <button classname=" cursor-pointerpx-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center font-medium">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Request Team Member
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {users.length > 0 ? users
                                    .filter(user => user._id !== currentClient?._id) // Exclude client from team list
                                    .map((member, index) => {
                                        // Get tasks assigned to this team member
                                        const memberTasks = tasks.filter(task => task.assignedTo === member._id);
                                        return (
                                            <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <div className="flex items-center mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                            {member.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-slate-900 dark:text-white">{member.name}</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{member.role}</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Working on {memberTasks.length} project{memberTasks.length !== 1 ? 's' : ''}:</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {memberTasks.slice(0, 3).map(task => (
                                                            <span key={task._id} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded text-slate-700 dark:text-slate-300">
                                                                {task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title}
                                                            </span>
                                                        ))}
                                                        {memberTasks.length > 3 && (
                                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded text-slate-700 dark:text-slate-300">
                                                                +{memberTasks.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        {memberTasks.filter(task => task.status === 'completed').length} of {memberTasks.length} completed
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <button classname=" cursor-pointerp-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                            <Mail className="w-4 h-4" />
                                                        </button>
                                                        <button classname=" cursor-pointerp-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                            <Phone className="w-4 h-4" />
                                                        </button>
                                                        <button classname=" cursor-pointerp-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                    <div className="col-span-2 text-center py-8">
                                        <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No team members assigned</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Team members will appear here when assigned to your projects.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Events */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upcoming Deadlines</h2>
                        <div className="space-y-3">
                            {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-start">
                                    <div className={`p-2 rounded-lg mr-3 ${getEventColor(event.type)}`}>
                                        {getEventIcon(event.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-900 dark:text-white">{event.title}</h3>
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {event.date} at {event.time}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-4">
                                    <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">No upcoming deadlines</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
                            <button classname=" cursor-pointertext-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                                Mark all read
                            </button>
                        </div>
                        <div className="space-y-3">
                            {notifications.length > 0 ? notifications.map((notification) => (
                                <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-slate-50 dark:bg-slate-700/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">{notification.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{notification.time}</p>
                                </div>
                            )) : (
                                <div className="text-center py-4">
                                    <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">No new notifications</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button classname=" cursor-pointerw-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center">
                                <Plus className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                                <span className="text-slate-900 dark:text-white">Create New Project</span>
                            </button>
                            <button classname=" cursor-pointerw-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center">
                                <Users className="w-4 h-4 mr-3 text-green-600 dark:text-green-400" />
                                <span className="text-slate-900 dark:text-white">Request Team Member</span>
                            </button>
                            <button classname=" cursor-pointerw-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center">
                                <FileText className="w-4 h-4 mr-3 text-purple-600 dark:text-purple-400" />
                                <span className="text-slate-900 dark:text-white">Generate Report</span>
                            </button>
                            <button classname=" cursor-pointerw-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center">
                                <Settings className="w-4 h-4 mr-3 text-amber-600 dark:text-amber-400" />
                                <span className="text-slate-900 dark:text-white">Account Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientPage;