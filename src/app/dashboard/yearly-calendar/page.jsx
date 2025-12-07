// src/app/dashboard/yearly-calendar/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Users,
    CheckCircle,
    X,
    Search,
    Filter,
    Briefcase,
    User,
    Clock,
    AlertCircle,
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    FileText,
    Target,
    CalendarDays,
    UserCheck,
    ListTodo,
    ArrowUp,
    ArrowDown,
    MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from 'recharts';

export default function YearlyCalendarPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [users, setUsers] = useState([]);
    const [works, setWorks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showWorkDetails, setShowWorkDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock work data based on IDs in assignedWork arrays
    const mockWorks = [
        { _id: "692dc1053e016ac2b9a909ac", title: "Website Development", type: "development", priority: "high", deadline: "2025-02-15", progress: 75 },
        { _id: "692ef71f80bae9cf7ac283e6", title: "Mobile App Design", type: "design", priority: "medium", deadline: "2025-03-20", progress: 60 },
        { _id: "692f091480bae9cf7ac283ea", title: "Database Optimization", type: "development", priority: "high", deadline: "2025-04-10", progress: 40 },
        { _id: "692f111e80bae9cf7ac283ed", title: "UI/UX Research", type: "research", priority: "low", deadline: "2025-05-25", progress: 30 },
        { _id: "692f0a0880bae9cf7ac283eb", title: "API Integration", type: "development", priority: "high", deadline: "2025-06-30", progress: 50 },
        { _id: "692f151280bae9cf7ac283ee", title: "Security Audit", type: "security", priority: "high", deadline: "2025-07-15", progress: 20 },
        { _id: "692f159680bae9cf7ac283f0", title: "Content Creation", type: "content", priority: "medium", deadline: "2025-08-20", progress: 80 },
        { _id: "692f154680bae9cf7ac283ef", title: "Testing & QA", type: "testing", priority: "medium", deadline: "2025-09-10", progress: 10 }
    ];

    // Fetch users data
    useEffect(() => {
        const fetchUsersData = async () => {
            if (status === 'loading') return;

            if (!session) {
                router.push('/login');
                return;
            }

            setIsLoading(true);

            try {
                // Fetch users from API
                const response = await fetch('/api/users');

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const usersData = await response.json();
                setUsers(usersData);
                setWorks(mockWorks);

                // If current user is a worker, set them as selected user by default
                const currentUser = usersData.find(user => user.email === session.user.email);
                if (currentUser && currentUser.role === 'worker') {
                    setSelectedUser(currentUser);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching users data:', error);
                toast.error('Failed to load users data');
                setIsLoading(false);
            }
        };

        fetchUsersData();
    }, [session, status, router]);

    // Get work details by ID
    const getWorkById = (workId) => {
        return works.find(work => work._id === workId);
    };

    // Get work for a specific month
    const getWorkForMonth = (user, month) => {
        if (!user || !user.assignedWork) return [];

        return user.assignedWork
            .map(workId => getWorkById(workId))
            .filter(work => {
                if (!work) return false;
                const deadline = new Date(work.deadline);
                return deadline.getMonth() === month && deadline.getFullYear() === currentYear;
            });
    };

    // Calculate overview statistics
    const getOverviewStats = () => {
        const activeUsers = users.filter(user => user.status === 'active').length;
        const pendingUsers = users.filter(user => user.status === 'pending').length;
        const totalUsers = users.length;
        const totalWorks = works.length;
        const highPriorityWorks = works.filter(work => work.priority === 'high').length;
        const completedWorks = works.filter(work => work.progress === 100).length;

        // Calculate average progress
        const totalProgress = works.reduce((sum, work) => sum + work.progress, 0);
        const avgProgress = works.length > 0 ? Math.round(totalProgress / works.length) : 0;

        return {
            activeUsers,
            pendingUsers,
            totalUsers,
            totalWorks,
            highPriorityWorks,
            completedWorks,
            avgProgress
        };
    };

    // Get work distribution by type
    const getWorkDistribution = () => {
        const distribution = {};

        works.forEach(work => {
            if (!distribution[work.type]) {
                distribution[work.type] = 0;
            }
            distribution[work.type]++;
        });

        return Object.keys(distribution).map(type => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            value: distribution[type]
        }));
    };

    // Get monthly workload data
    const getMonthlyWorkload = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = months.map((month, index) => {
            let count = 0;
            users.forEach(user => {
                count += getWorkForMonth(user, index).length;
            });
            return { month, count };
        });

        return data;
    };

    // Get user workload data
    const getUserWorkload = () => {
        return users.map(user => {
            const workCount = user.assignedWork ? user.assignedWork.length : 0;
            return { name: user.name.split(' ')[0], workload: workCount };
        }).sort((a, b) => b.workload - a.workload).slice(0, 10);
    };

    // Get priority distribution
    const getPriorityDistribution = () => {
        const distribution = { high: 0, medium: 0, low: 0 };

        works.forEach(work => {
            distribution[work.priority]++;
        });

        return [
            { name: 'High', value: distribution.high, color: '#ef4444' },
            { name: 'Medium', value: distribution.medium, color: '#f59e0b' },
            { name: 'Low', value: distribution.low, color: '#3b82f6' }
        ];
    };

    // Filter users based on search and filters
    const getFilteredUsers = () => {
        let filtered = users;

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    // Navigate to previous year
    const handlePreviousYear = () => {
        setCurrentYear(prev => prev - 1);
    };

    // Navigate to next year
    const handleNextYear = () => {
        setCurrentYear(prev => prev + 1);
    };

    // Render month view for yearly calendar
    const renderMonthView = (monthIndex, user) => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const monthName = monthNames[monthIndex];
        const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
        const firstDayOfWeek = new Date(currentYear, monthIndex, 1).getDay();
        const monthWorks = getWorkForMonth(user, monthIndex);

        // Create a simple calendar grid
        const days = [];

        // Add empty cells for days before 1st
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 h-64">
                <h3 className="text-center font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                    {monthName}
                </h3>
                <div className="grid grid-cols-7 gap-1 text-xs">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <div key={index} className="text-center font-medium text-slate-500 dark:text-slate-400">
                            {day}
                        </div>
                    ))}
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`text-center p-1 h-6 ${day ? 'border border-slate-200 dark:border-slate-600' : ''}`}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="mt-2 space-y-1">
                    {monthWorks.map((work, index) => (
                        <div
                            key={index}
                            className={`text-xs p-1 rounded truncate cursor-pointer ${work.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                work.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}
                            onClick={() => setShowWorkDetails(work)}
                        >
                            {work.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render year view for a specific user
    const renderYearView = (user) => {
        return (
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        {user.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                            user.role === 'user' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                            {user.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                            {user.status}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }, (_, i) => renderMonthView(i, user))}
                </div>
            </div>
        );
    };

    // Render overview section
    const renderOverview = () => {
        const stats = getOverviewStats();
        const workDistribution = getWorkDistribution();
        const monthlyWorkload = getMonthlyWorkload();
        const userWorkload = getUserWorkload();
        const priorityDistribution = getPriorityDistribution();

        return (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                        {stats.activeUsers} active
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Works</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalWorks}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                        {stats.highPriorityWorks} high priority
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                                <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.completedWorks}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        {stats.totalWorks > 0 ? Math.round((stats.completedWorks / stats.totalWorks) * 100) : 0}% completion rate
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Progress</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.avgProgress}%</p>
                                <div className="flex items-center mt-2">
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.avgProgress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Work Distribution Chart */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Work Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RePieChart>
                                <Pie
                                    data={workDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {workDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Priority Distribution Chart */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Priority Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={priorityDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8">
                                    {priorityDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Workload Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Workload</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyWorkload}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* User Workload Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top User Workload</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userWorkload} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="workload" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    // Render work details modal
    const renderWorkDetailsModal = () => {
        if (!showWorkDetails) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div> */}

                    <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Work Details</h3>
                                <button
                                    onClick={() => setShowWorkDetails(null)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="px-4 pb-4 sm:p-6 sm:pb-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">
                                        {showWorkDetails.title}
                                    </h4>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${showWorkDetails.type === 'development' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                            showWorkDetails.type === 'design' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                                                showWorkDetails.type === 'research' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                                    showWorkDetails.type === 'security' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                                        showWorkDetails.type === 'content' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                            }`}>
                                            {showWorkDetails.type}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${showWorkDetails.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                            showWorkDetails.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                            }`}>
                                            {showWorkDetails.priority} priority
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-slate-500" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        Deadline: {new Date(showWorkDetails.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{showWorkDetails.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${showWorkDetails.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end px-4 pb-4 sm:px-6 sm:pb-4">
                            <button
                                type="button"
                                onClick={() => setShowWorkDetails(null)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const filteredUsers = getFilteredUsers();
    const usersToDisplay = selectedUser ? [selectedUser] : filteredUsers;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                        <CalendarDays className="w-8 h-8 mr-3" />
                        Yearly Calendar Dashboard
                    </h1>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePreviousYear}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white px-4">
                            {currentYear}
                        </h2>
                        <button
                            onClick={handleNextYear}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="worker">Worker</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                                setSearchQuery('');
                                setRoleFilter('all');
                                setStatusFilter('all');
                            }}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4 inline mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Calendar
                        </button>
                    </div>
                </div>

                {/* User selection tabs for calendar view */}
                {activeTab === 'calendar' && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${!selectedUser ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                All Users
                            </button>
                            {filteredUsers.map(user => (
                                <button
                                    key={user._id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedUser?._id === user._id ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    {user.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' ? (
                renderOverview()
            ) : (
                <div>
                    {usersToDisplay.length > 0 ? (
                        <div>
                            {usersToDisplay.map(user => renderYearView(user))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
                            <Users className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                No users found
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Try adjusting your filters or search criteria.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Work Details Modal */}
            {renderWorkDetailsModal()}
        </div>
    );
}