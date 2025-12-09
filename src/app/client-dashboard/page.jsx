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

    // Sample data for charts
    const revenueData = [
        { name: 'Jan', revenue: 4000, projects: 4 },
        { name: 'Feb', revenue: 3000, projects: 3 },
        { name: 'Mar', revenue: 5000, projects: 5 },
        { name: 'Apr', revenue: 2780, projects: 3 },
        { name: 'May', revenue: 6890, projects: 7 },
        { name: 'Jun', revenue: 7390, projects: 8 },
    ];

    const projectDistribution = [
        { name: 'Completed', value: 12, color: '#10b981' },
        { name: 'In Progress', value: 8, color: '#3b82f6' },
        { name: 'Planning', value: 5, color: '#8b5cf6' },
        { name: 'Review', value: 3, color: '#f59e0b' },
    ];

    const teamPerformance = [
        { name: 'John Doe', tasks: 24, completed: 18 },
        { name: 'Jane Smith', tasks: 18, completed: 15 },
        { name: 'Mike Johnson', tasks: 22, completed: 20 },
        { name: 'Sarah Williams', tasks: 16, completed: 14 },
    ];

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Sample data
    const stats = [
        {
            title: 'Active Projects',
            value: '12',
            change: '+2 from last month',
            changeType: 'increase',
            icon: <Briefcase className="w-5 h-5" />,
            color: 'blue'
        },
        {
            title: 'Completed Tasks',
            value: '47',
            change: '+12% from last month',
            changeType: 'increase',
            icon: <CheckCircle className="w-5 h-5" />,
            color: 'green'
        },
        {
            title: 'Team Members',
            value: '8',
            change: 'No change',
            changeType: 'neutral',
            icon: <Users className="w-5 h-5" />,
            color: 'purple'
        },
        {
            title: 'Total Revenue',
            value: '$24,500',
            change: '+8% from last month',
            changeType: 'increase',
            icon: <DollarSign className="w-5 h-5" />,
            color: 'amber'
        }
    ];

    const recentProjects = [
        {
            id: 1,
            name: 'Website Redesign',
            client: 'Tech Corp',
            status: 'in-progress',
            progress: 75,
            deadline: '2023-12-15',
            team: ['John Doe', 'Jane Smith'],
            budget: '$5,000',
            startDate: '2023-10-01'
        },
        {
            id: 2,
            name: 'Mobile App Development',
            client: 'StartupXYZ',
            status: 'planning',
            progress: 25,
            deadline: '2024-01-20',
            team: ['Mike Johnson', 'Sarah Williams'],
            budget: '$12,000',
            startDate: '2023-11-01'
        },
        {
            id: 3,
            name: 'Brand Identity',
            client: 'Fashion Brand',
            status: 'review',
            progress: 90,
            deadline: '2023-11-30',
            team: ['Emily Brown', 'Chris Taylor'],
            budget: '$3,500',
            startDate: '2023-09-15'
        },
        {
            id: 4,
            name: 'E-commerce Platform',
            client: 'Retail Store',
            status: 'completed',
            progress: 100,
            deadline: '2023-11-10',
            team: ['David Wilson', 'Lisa Anderson'],
            budget: '$15,000',
            startDate: '2023-08-01'
        }
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: 'Project Review Meeting',
            date: '2023-11-25',
            time: '10:00 AM',
            type: 'meeting'
        },
        {
            id: 2,
            title: 'Client Presentation',
            date: '2023-11-28',
            time: '2:00 PM',
            type: 'presentation'
        },
        {
            id: 3,
            title: 'Sprint Planning',
            date: '2023-12-01',
            time: '11:00 AM',
            type: 'planning'
        }
    ];

    const notifications = [
        {
            id: 1,
            title: 'New comment on Website Redesign',
            message: 'John Doe commented on your design mockups',
            time: '5 minutes ago',
            read: false
        },
        {
            id: 2,
            title: 'Project deadline approaching',
            message: 'Brand Identity project deadline is in 5 days',
            time: '1 hour ago',
            read: false
        },
        {
            id: 3,
            title: 'Invoice payment received',
            message: 'Payment of $5,000 received from Tech Corp',
            time: '3 hours ago',
            read: true
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'meeting': return <Users className="w-4 h-4" />;
            case 'presentation': return <FileText className="w-4 h-4" />;
            case 'planning': return <Calendar className="w-4 h-4" />;
            default: return <Calendar className="w-4 h-4" />;
        }
    };

    const getEventColor = (type) => {
        switch (type) {
            case 'meeting': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'presentation': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
            case 'planning': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
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

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Welcome back, Client!</h1>
                        <p className="text-blue-100">Here's what's happening with your projects today.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </button>
                        <button className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center font-medium">
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
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Overview</h2>
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
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Projects</h2>
                                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center">
                                        View All
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
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
                                                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors flex items-center">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'projects' && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 sm:mb-0">All Projects</h2>
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
                                            <option value="planning">Planning</option>
                                            <option value="review">Review</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700">
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Project</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Client</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Progress</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Deadline</th>
                                            <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentProjects.map((project) => (
                                            <tr key={project.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-slate-900 dark:text-white">{project.name}</div>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{project.client}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                        {project.status.replace('-', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${project.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{project.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{project.deadline}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Revenue Trend</h2>
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
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Team Members</h2>
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center font-medium">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Invite Member
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'John Doe', role: 'Project Manager', avatar: 'JD', status: 'online', projects: 5 },
                                    { name: 'Jane Smith', role: 'UI/UX Designer', avatar: 'JS', status: 'online', projects: 3 },
                                    { name: 'Mike Johnson', role: 'Frontend Developer', avatar: 'MJ', status: 'offline', projects: 4 },
                                    { name: 'Sarah Williams', role: 'Backend Developer', avatar: 'SW', status: 'online', projects: 6 }
                                ].map((member, index) => (
                                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                                                <span className="text-blue-600 dark:text-blue-400 font-medium">{member.avatar}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-slate-900 dark:text-white">{member.name}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{member.role}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">{member.projects} projects</span>
                                            <div className="flex items-center space-x-2">
                                                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                    <Phone className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Events */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upcoming Events</h2>
                        <div className="space-y-3">
                            {upcomingEvents.map((event) => (
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
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                                Mark all read
                            </button>
                        </div>
                        <div className="space-y-3">
                            {notifications.map((notification) => (
                                <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-slate-50 dark:bg-slate-700/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">{notification.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{notification.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center">
                                <Plus className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                                <span className="text-slate-900 dark:text-white">Create New Project</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center">
                                <Users className="w-4 h-4 mr-3 text-green-600 dark:text-green-400" />
                                <span className="text-slate-900 dark:text-white">Invite Team Member</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center">
                                <FileText className="w-4 h-4 mr-3 text-purple-600 dark:text-purple-400" />
                                <span className="text-slate-900 dark:text-white">Generate Report</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center">
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