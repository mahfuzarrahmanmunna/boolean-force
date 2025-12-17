// src/app/dashboard/client/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Briefcase,
    Users,
    DollarSign,
    TrendingUp,
    Calendar,
    MessageSquare,
    Settings,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Clock,
    CheckCircle,
    AlertCircle,
    FileText,
    Star,
    BarChart3,
    PieChart,
    Target,
    Activity,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Search,
    Filter,
    Plus,
    Edit,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronRight,
    Home,
    Building,
    UserCheck,
    Zap,
    Award,
    TrendingUp as TrendingUpIcon,
    Bell,
    LogOut,
    HelpCircle,
    Sparkles,
    Layers,
    Grid3x3,
    List,
    Calendar as CalendarIcon
} from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectDetails, setShowProjectDetails] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [viewMode, setViewMode] = useState('grid'); // grid or list view

    // Mock data for demonstration
    const [projects] = useState([
        {
            id: 1,
            title: 'E-commerce Website Development',
            description: 'Full-stack e-commerce platform with payment integration',
            status: 'in-progress',
            progress: 65,
            deadline: '2024-02-15',
            budget: 15000,
            spent: 9750,
            priority: 'high',
            team: [
                { id: 1, name: 'John Doe', role: 'Frontend Developer', avatar: null, status: 'active' },
                { id: 2, name: 'Jane Smith', role: 'Backend Developer', avatar: null, status: 'active' },
                { id: 3, name: 'Mike Johnson', role: 'UI/UX Designer', avatar: null, status: 'active' }
            ],
            milestones: [
                { id: 1, title: 'Design Phase', status: 'completed', date: '2024-01-10' },
                { id: 2, title: 'Frontend Development', status: 'completed', date: '2024-01-25' },
                { id: 3, title: 'Backend Development', status: 'in-progress', date: '2024-02-01' },
                { id: 4, title: 'Testing & Deployment', status: 'pending', date: '2024-02-10' }
            ],
            createdAt: '2024-01-01',
            tags: ['Web Development', 'E-commerce', 'React']
        },
        {
            id: 2,
            title: 'Mobile App Development',
            description: 'Cross-platform mobile application for iOS and Android',
            status: 'planning',
            progress: 15,
            deadline: '2024-03-20',
            budget: 25000,
            spent: 3750,
            priority: 'medium',
            team: [
                { id: 4, name: 'Sarah Wilson', role: 'Mobile Developer', avatar: null, status: 'active' },
                { id: 5, name: 'Tom Brown', role: 'Project Manager', avatar: null, status: 'active' }
            ],
            milestones: [
                { id: 1, title: 'Requirements Gathering', status: 'completed', date: '2024-01-15' },
                { id: 2, title: 'UI/UX Design', status: 'in-progress', date: '2024-01-20' },
                { id: 3, title: 'Development', status: 'pending', date: '2024-02-01' }
            ],
            createdAt: '2024-01-15',
            tags: ['Mobile', 'React Native', 'Flutter']
        },
        {
            id: 3,
            title: 'CRM System Implementation',
            description: 'Custom CRM solution for sales team management',
            status: 'completed',
            progress: 100,
            deadline: '2024-01-10',
            budget: 20000,
            spent: 19500,
            priority: 'low',
            team: [
                { id: 6, name: 'David Lee', role: 'Full Stack Developer', avatar: null, status: 'completed' },
                { id: 7, name: 'Emily Chen', role: 'Database Expert', avatar: null, status: 'completed' }
            ],
            milestones: [
                { id: 1, title: 'System Analysis', status: 'completed', date: '2023-12-01' },
                { id: 2, title: 'Development', status: 'completed', date: '2023-12-20' },
                { id: 3, title: 'Testing', status: 'completed', date: '2024-01-05' },
                { id: 4, title: 'Deployment', status: 'completed', date: '2024-01-08' }
            ],
            createdAt: '2023-11-15',
            tags: ['CRM', 'Sales', 'Database']
        }
    ]);

    const [invoices] = useState([
        {
            id: 1,
            invoiceNumber: 'INV-2024-001',
            project: 'E-commerce Website Development',
            amount: 5000,
            status: 'paid',
            dueDate: '2024-01-15',
            paidDate: '2024-01-12'
        },
        {
            id: 2,
            invoiceNumber: 'INV-2024-002',
            project: 'Mobile App Development',
            amount: 7500,
            status: 'pending',
            dueDate: '2024-02-01',
            paidDate: null
        },
        {
            id: 3,
            invoiceNumber: 'INV-2024-003',
            project: 'CRM System Implementation',
            amount: 10000,
            status: 'overdue',
            dueDate: '2024-01-10',
            paidDate: null
        }
    ]);

    const [teamMembers] = useState([
        { id: 1, name: 'John Doe', role: 'Frontend Developer', avatar: null, status: 'active', email: 'john@example.com', phone: '+1 234 567 8901' },
        { id: 2, name: 'Jane Smith', role: 'Backend Developer', avatar: null, status: 'active', email: 'jane@example.com', phone: '+1 234 567 8902' },
        { id: 3, name: 'Mike Johnson', role: 'UI/UX Designer', avatar: null, status: 'active', email: 'mike@example.com', phone: '+1 234 567 8903' },
        { id: 4, name: 'Sarah Wilson', role: 'Mobile Developer', avatar: null, status: 'active', email: 'sarah@example.com', phone: '+1 234 567 8904' },
        { id: 5, name: 'Tom Brown', role: 'Project Manager', avatar: null, status: 'active', email: 'tom@example.com', phone: '+1 234 567 8905' },
        { id: 6, name: 'David Lee', role: 'Full Stack Developer', avatar: null, status: 'completed', email: 'david@example.com', phone: '+1 234 567 8906' },
        { id: 7, name: 'Emily Chen', role: 'Database Expert', avatar: null, status: 'completed', email: 'emily@example.com', phone: '+1 234 567 8907' }
    ]);

    useEffect(() => {
        // Calculate unread notifications
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
    }, [notifications]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="relative inline-flex">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 animate-ping"></div>
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative flex items-center justify-center">
                            <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading your workspace...</p>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
            case 'in-progress':
                return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'planning':
                return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
            case 'pending':
                return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800';
            default:
                return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'medium':
                return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
            case 'low':
                return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
            default:
                return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <main className="flex-1">
                <div className="flex-1 p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Welcome Section */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                                <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
                                <p className="text-indigo-100 mb-6">Here's what's happening with your projects today.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-indigo-100">Active Projects</p>
                                            <TrendingUp className="w-5 h-5 text-indigo-200" />
                                        </div>
                                        <p className="text-3xl font-bold">{projects.filter(p => p.status === 'in-progress').length}</p>
                                    </div>

                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-indigo-100">Team Members</p>
                                            <Users className="w-5 h-5 text-indigo-200" />
                                        </div>
                                        <p className="text-3xl font-bold">{teamMembers.length}</p>
                                    </div>

                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-indigo-100">Total Budget</p>
                                            <DollarSign className="w-5 h-5 text-indigo-200" />
                                        </div>
                                        <p className="text-3xl font-bold">{formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                                                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Total Projects</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                                                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{projects.filter(p => p.status === 'in-progress').length}</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Active Projects</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                                                <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Total Budget</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {projects.reduce((sum, p) => sum + p.team.length, 0)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Team Members</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Projects */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Projects</h3>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                            >
                                                <Grid3x3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                            >
                                                <List className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={viewMode === 'grid' ? "p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "p-6 space-y-4"}>
                                    {projects.slice(0, 3).map(project => (
                                        <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{project.title}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                        {project.status.replace('-', ' ')}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                                                        {project.priority}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <span>Deadline: {formatDate(project.deadline)}</span>
                                                <span>Budget: {formatCurrency(project.budget)}</span>
                                            </div>

                                            <div className="mb-3">
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                    <span className="font-medium">{project.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {project.team.slice(0, 3).map(member => (
                                                        <div key={member.id} className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">
                                                            {getInitials(member.name)}
                                                        </div>
                                                    ))}
                                                    {project.team.length > 3 && (
                                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs font-bold">
                                                            +{project.team.length - 3}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button classname=" cursor-pointerp-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button classname=" cursor-pointerp-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button classname=" cursor-pointerp-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                        <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Projects</h3>
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Search projects..."
                                                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            />
                                        </div>
                                        <button classname=" cursor-pointerp-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <button classname=" cursor-pointerpx-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700">
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Project
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Project</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Progress</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Budget</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Deadline</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map(project => (
                                            <tr key={project.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {project.tags.map(tag => (
                                                                <span key={tag} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                        {project.status.replace('-', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center">
                                                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                                            <div
                                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                                                                style={{ width: `${project.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm">{project.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-900 dark:text-white">
                                                    {formatCurrency(project.budget)}
                                                </td>
                                                <td className="py-4 px-4 text-gray-900 dark:text-white">
                                                    {formatDate(project.deadline)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button classname=" cursor-pointerp-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        </button>
                                                        <button classname=" cursor-pointerp-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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

                    {/* Team Tab */}
                    {activeTab === 'team' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h3>
                                        <button classname=" cursor-pointerpx-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Invite Member
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {teamMembers.map(member => (
                                            <div key={member.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {getInitials(member.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'}`}>
                                                        {member.status}
                                                    </span>
                                                    <div className="flex space-x-2">
                                                        <button classname=" cursor-pointerp-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                            <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        </button>
                                                        <button classname=" cursor-pointerp-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                            <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center">
                                                        <Phone className="w-4 h-4 mr-2" />
                                                        {member.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Invoices Tab */}
                    {activeTab === 'invoices' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Invoices</h3>
                                    <button classname=" cursor-pointerpx-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Generate Invoice
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {invoices.map(invoice => (
                                        <div key={invoice.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.project}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(invoice.amount)}</p>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                                        invoice.status === 'overdue' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                                            'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                                        }`}>
                                                        {invoice.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                <span>Due: {formatDate(invoice.dueDate)}</span>
                                                {invoice.paidDate && <span>Paid: {formatDate(invoice.paidDate)}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Status Distribution</h3>
                                    <div className="space-y-3">
                                        {['completed', 'in-progress', 'planning', 'pending'].map(status => {
                                            const count = projects.filter(p => p.status === status).length;
                                            const percentage = (count / projects.length) * 100;
                                            return (
                                                <div key={status} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status.replace('-', ' ')}</span>
                                                    <div className="flex items-center">
                                                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                                            <div
                                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium">{count}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Budget Overview</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Budget</span>
                                            <span className="font-medium">{formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Spent</span>
                                            <span className="font-medium">{formatCurrency(projects.reduce((sum, p) => sum + p.spent, 0))}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
                                            <span className="font-medium text-green-600">
                                                {formatCurrency(projects.reduce((sum, p) => sum + (p.budget - p.spent), 0))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={session?.user?.name || ''}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    defaultValue={session?.user?.email || ''}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    placeholder="+1 (555) 123-4567"
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input type="checkbox" defaultChecked className="mr-3" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for project updates</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" defaultChecked className="mr-3" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for invoice reminders</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" defaultChecked className="mr-3" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">SMS notifications for urgent updates</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <button classname=" cursor-pointerpx-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}