'use client';
import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Activity,
    Calendar,
    FileText,
    Settings,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    BarChart3,
    PieChart,
    Download,
    RefreshCw,
    Filter,
    Search,
    Bell,
    UserPlus,
    Eye,
    Edit,
    Trash2,
    Zap,
    Server,
    Cpu,
    HardDrive,
    Globe,
    Package,
    MessageSquare,
    Target,
    Award,
    Briefcase,
    CreditCard,
    Headphones,
    Star,
    TrendingDown,
    User,
    Mail,
    MapPin,
    Phone,
    ChevronRight,
    Grid3x3,
    List,
    ArrowRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AdminPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [isLoading, setIsLoading] = useState(false);
    const [dataRefreshKey, setDataRefreshKey] = useState(0);
    const [activeView, setActiveView] = useState('grid');
    const [selectedMetric, setSelectedMetric] = useState('revenue');
    const [notifications, setNotifications] = useState(3);

    // Enhanced sample data for charts
    const salesData = [
        { day: 'Mon', sales: 4200, orders: 120, visitors: 2400, revenue: 5400 },
        { day: 'Tue', sales: 5300, orders: 150, visitors: 2800, revenue: 6200 },
        { day: 'Wed', sales: 6100, orders: 180, visitors: 3200, revenue: 7100 },
        { day: 'Thu', sales: 5900, orders: 170, visitors: 3100, revenue: 6800 },
        { day: 'Fri', sales: 7300, orders: 210, visitors: 3800, revenue: 8500 },
        { day: 'Sat', sales: 8900, orders: 260, visitors: 4500, revenue: 10200 },
        { day: 'Sun', sales: 8200, orders: 240, visitors: 4200, revenue: 9400 }
    ];

    const trafficData = [
        { name: 'Direct', value: 35, color: '#3B82F6' },
        { name: 'Social', value: 25, color: '#8B5CF6' },
        { name: 'Referral', value: 20, color: '#10B981' },
        { name: 'Organic', value: 20, color: '#F59E0B' }
    ];

    const performanceData = [
        { subject: 'Speed', A: 120, B: 110, fullMark: 150 },
        { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
        { subject: 'Security', A: 86, B: 130, fullMark: 150 },
        { subject: 'Usability', A: 99, B: 100, fullMark: 150 },
        { subject: 'Functionality', A: 85, B: 90, fullMark: 150 },
        { subject: 'Compatibility', A: 65, B: 85, fullMark: 150 }
    ];

    const recentActivity = [
        { id: 1, user: 'John Doe', action: 'Created new project', time: '2 minutes ago', status: 'success', avatar: 'JD' },
        { id: 2, user: 'Jane Smith', action: 'Updated profile settings', time: '15 minutes ago', status: 'info', avatar: 'JS' },
        { id: 3, user: 'Robert Johnson', action: 'Deleted 5 old posts', time: '1 hour ago', status: 'warning', avatar: 'RJ' },
        { id: 4, user: 'Emily Davis', action: 'Published new article', time: '3 hours ago', status: 'success', avatar: 'ED' },
        { id: 5, user: 'Michael Wilson', action: 'Changed password', time: '5 hours ago', status: 'info', avatar: 'MW' }
    ];

    const topPages = [
        { page: '/dashboard', views: 5421, change: 12, bounce: 32.5, avgTime: '3:42' },
        { page: '/products', views: 4321, change: -5, bounce: 41.2, avgTime: '2:18' },
        { page: '/about', views: 3214, change: 8, bounce: 28.7, avgTime: '4:05' },
        { page: '/contact', views: 2145, change: 15, bounce: 35.9, avgTime: '1:55' },
        { page: '/blog', views: 1823, change: -2, bounce: 45.3, avgTime: '5:12' }
    ];

    const recentTransactions = [
        { id: 'TRX001', customer: 'John Doe', amount: 125.50, status: 'completed', date: '2023-10-15', paymentMethod: 'credit-card' },
        { id: 'TRX002', customer: 'Jane Smith', amount: 89.99, status: 'completed', date: '2023-10-15', paymentMethod: 'paypal' },
        { id: 'TRX003', customer: 'Robert Johnson', amount: 210.00, status: 'pending', date: '2023-10-14', paymentMethod: 'bank-transfer' },
        { id: 'TRX004', customer: 'Emily Davis', amount: 45.75, status: 'completed', date: '2023-10-14', paymentMethod: 'credit-card' },
        { id: 'TRX005', customer: 'Michael Wilson', amount: 156.30, status: 'failed', date: '2023-10-13', paymentMethod: 'crypto' }
    ];

    const teamMembers = [
        { id: 1, name: 'Alex Johnson', role: 'Frontend Developer', avatar: 'AJ', status: 'online', projects: 5 },
        { id: 2, name: 'Sarah Williams', role: 'UI/UX Designer', avatar: 'SW', status: 'online', projects: 3 },
        { id: 3, name: 'Mike Chen', role: 'Backend Developer', avatar: 'MC', status: 'offline', projects: 7 },
        { id: 4, name: 'Lisa Anderson', role: 'Project Manager', avatar: 'LA', status: 'online', projects: 4 },
        { id: 5, name: 'David Brown', role: 'DevOps Engineer', avatar: 'DB', status: 'away', projects: 6 }
    ];

    const projectProgress = [
        { id: 1, name: 'Website Redesign', progress: 75, status: 'on-track', deadline: '2023-11-15', team: 4 },
        { id: 2, name: 'Mobile App Development', progress: 45, status: 'at-risk', deadline: '2023-12-01', team: 6 },
        { id: 3, name: 'Marketing Campaign', progress: 90, status: 'on-track', deadline: '2023-10-30', team: 3 },
        { id: 4, name: 'Database Migration', progress: 30, status: 'delayed', deadline: '2023-11-30', team: 5 },
        { id: 5, name: 'API Integration', progress: 60, status: 'on-track', deadline: '2023-11-10', team: 2 }
    ];

    const systemHealth = [
        { name: 'CPU', value: 45, status: 'normal', icon: Cpu },
        { name: 'Memory', value: 62, status: 'normal', icon: Server },
        { name: 'Disk', value: 78, status: 'warning', icon: HardDrive },
        { name: 'Network', value: 32, status: 'normal', icon: Globe }
    ];

    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setDataRefreshKey(prev => prev + 1);
        }, 1500);
    };

    useEffect(() => {
        // Simulate initial data loading
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <div className={`min-h-screen dark:dark bg-gray-900 bg-gray-50 transition-colors duration-300`}>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 animate-fadeIn">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your business today.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <div className="relative">
                            <button
                                onClick={refreshData}
                                className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all duration-300 ${isLoading ? 'animate-spin' : ''}`}
                                disabled={isLoading}
                            >
                                <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                        <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all duration-300">
                            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all duration-300">
                            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="relative">
                            <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all duration-300">
                                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                    {notifications}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">$45,231</p>
                                <div className="flex items-center mt-2">
                                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-sm text-green-500 font-medium">12.5%</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 -mr-4 -mb-4 opacity-10">
                            <DollarSign className="w-24 h-24 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">New Users</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">1,423</p>
                                <div className="flex items-center mt-2">
                                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-sm text-green-500 font-medium">8.2%</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 -mr-4 -mb-4 opacity-10">
                            <Users className="w-24 h-24 text-purple-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">3,642</p>
                                <div className="flex items-center mt-2">
                                    <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                                    <span className="text-sm text-red-500 font-medium">3.1%</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 -mr-4 -mb-4 opacity-10">
                            <ShoppingCart className="w-24 h-24 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Conversion Rate</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">24.57%</p>
                                <div className="flex items-center mt-2">
                                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-sm text-green-500 font-medium">5.4%</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 -mr-4 -mb-4 opacity-10">
                            <TrendingUp className="w-24 h-24 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Sales Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Overview</h2>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setSelectedPeriod('day')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${selectedPeriod === 'day' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    Day
                                </button>
                                <button
                                    onClick={() => setSelectedPeriod('week')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${selectedPeriod === 'week' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setSelectedPeriod('month')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${selectedPeriod === 'month' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    Month
                                </button>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="day" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
                                        <Area type="monotone" dataKey="sales" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                        <Area type="monotone" dataKey="orders" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Traffic Sources */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Traffic Sources</h2>
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={trafficData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {trafficData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Performance Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-slideUp" style={{ animationDelay: '0.6s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Performance Metrics</h2>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setSelectedMetric('revenue')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${selectedMetric === 'revenue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    Revenue
                                </button>
                                <button
                                    onClick={() => setSelectedMetric('users')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${selectedMetric === 'users' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    Users
                                </button>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={performanceData}>
                                        <PolarGrid stroke="#e0e0e0" />
                                        <PolarAngleAxis dataKey="subject" stroke="#888" />
                                        <PolarRadiusAxis angle={90} domain={[0, 150]} stroke="#888" />
                                        <Radar name="Current" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                        <Radar name="Previous" dataKey="B" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* System Health */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-slideUp" style={{ animationDelay: '0.7s' }}>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">System Health</h2>
                        <div className="space-y-4">
                            {systemHealth.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className={`p-2 rounded-lg mr-3 ${item.status === 'normal' ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                                        <item.icon className={`w-5 h-5 ${item.status === 'normal' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-800 dark:text-white">{item.name}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.value}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${item.status === 'normal' ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                style={{ width: `${item.value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 animate-slideUp" style={{ animationDelay: '0.8s' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h2>
                        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center">
                            View all
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <th className="pb-3">Transaction ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Payment Method</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recentTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                        <td className="py-3 text-sm font-medium text-gray-800 dark:text-white">{transaction.id}</td>
                                        <td className="py-3 text-sm text-gray-800 dark:text-white">{transaction.customer}</td>
                                        <td className="py-3 text-sm text-gray-800 dark:text-white">${transaction.amount.toFixed(2)}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{transaction.date}</td>
                                        <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{transaction.paymentMethod}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Team Members and Project Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Team Members */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-slideUp" style={{ animationDelay: '0.9s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Team Members</h2>
                            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center">
                                View all
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-150">
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                                {member.avatar}
                                            </div>
                                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${member.status === 'online' ? 'bg-green-500' :
                                                member.status === 'away' ? 'bg-yellow-500' :
                                                    'bg-gray-400'
                                                }`}></span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">{member.name}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{member.projects} projects</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project Progress */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-slideUp" style={{ animationDelay: '1.0s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Project Progress</h2>
                            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center">
                                View all
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {projectProgress.map((project) => (
                                <div key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-150">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">{project.name}</p>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'on-track' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            project.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Progress: {project.progress}%</span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Deadline: {project.deadline}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${project.status === 'on-track' ? 'bg-green-500' :
                                                project.status === 'at-risk' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-slideUp" style={{ animationDelay: '1.1s' }}>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                            <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">Add User</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
                            <Package className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">New Product</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200">
                            <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">Generate Report</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors duration-200">
                            <MessageSquare className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mb-2" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">Send Message</span>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                
                .animate-slideUp {
                    animation: slideUp 0.5s ease-out;
                    animation-fill-mode: both;
                }
            `}</style>
        </div>
    );
};

export default AdminPage;