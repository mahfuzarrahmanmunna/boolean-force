"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaChartBar, FaChartPie, FaChartLine, FaUsers, FaTasks, FaClock, FaTrophy, FaArrowUp, FaArrowDown,
    FaFilter, FaSearch, FaDownload, FaUser, FaEnvelope, FaCalendar, FaBuilding, FaPhone,
    FaSpinner, FaCheckCircle, FaExclamationCircle, FaTimes, FaEdit, FaEye,
    FaPlus, FaUserTie, FaBriefcase, FaGraduationCap, FaAward, FaStar
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

// Constants
const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'bg-green-500', lightColor: 'bg-green-100', textColor: 'text-green-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-500', lightColor: 'bg-gray-100', textColor: 'text-gray-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500', lightColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { value: 'suspended', label: 'Suspended', color: 'bg-red-500', lightColor: 'bg-red-100', textColor: 'text-red-800' }
];

const JOB_TITLE_OPTIONS = [
    { value: 'full-stack-developer', label: 'Full Stack Developer', icon: '💻', color: 'bg-blue-500' },
    { value: 'devops-engineer', label: 'DevOps Engineer', icon: '🔧', color: 'bg-purple-500' },
    { value: 'graphics-designer', label: 'Graphics Designer', icon: '🎨', color: 'bg-pink-500' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer', icon: '🎨', color: 'bg-indigo-500' },
    { value: 'backend-developer', label: 'Backend Developer', icon: '💻', color: 'bg-cyan-500' },
    { value: 'frontend-developer', label: 'Frontend Developer', icon: '💻', color: 'bg-emerald-500' },
    { value: 'mobile-developer', label: 'Mobile Developer', icon: '📱', color: 'bg-orange-500' },
    { value: 'qa-engineer', label: 'QA Engineer', icon: '🔍', color: 'bg-teal-500' },
    { value: 'data-scientist', label: 'Data Scientist', icon: '📊', color: 'bg-violet-500' },
    { value: 'product-manager', label: 'Product Manager', icon: '📋', color: 'bg-amber-500' },
    { value: 'other', label: 'Other', icon: '👤', color: 'bg-slate-500' }
];

const CATEGORY_OPTIONS = [
    { value: 'development', label: 'Development', icon: '💻', color: 'bg-blue-500' },
    { value: 'design', label: 'Design', icon: '🎨', color: 'bg-pink-500' },
    { value: 'marketing', label: 'Marketing', icon: '📢', color: 'bg-orange-500' },
    { value: 'research', label: 'Research', icon: '🔍', color: 'bg-purple-500' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-gray-500' },
    { value: 'testing', label: 'Testing', icon: '🧪', color: 'bg-teal-500' },
    { value: 'documentation', label: 'Documentation', icon: '📝', color: 'bg-indigo-500' },
    { value: 'other', label: 'Other', icon: '📌', color: 'bg-slate-500' }
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
];

// Helper Components
const StatusBadge = ({ status }) => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    return (
        <Badge className={`px-2 py-1 text-xs font-medium text-white ${statusOption?.color || 'bg-gray-500'}`}>
            {statusOption?.label || status}
        </Badge>
    );
};

const LoadingSpinner = ({ message }) => (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="w-96 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-6 text-lg font-medium text-center">{message}</p>
        </div>
    </div>
);

// Donut Chart Component
const DonutChart = ({ data, colors, labels, title }) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    const [hoveredSegment, setHoveredSegment] = useState(null);
    
    return (
        <div className="h-64 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{title}</h3>
            <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                    {data.map((value, index) => {
                        const percentage = total > 0 ? (value / total) * 100 : 0;
                        const strokeWidth = hoveredSegment === index ? 40 : 30;
                        const radius = 100 - strokeWidth / 2;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                        const previousPercentages = data.slice(0, index).reduce((sum, val) => sum + (total > 0 ? (val / total) * 100 : 0), 0);
                        const strokeDashoffset = circumference * (previousPercentages / 100);
                        
                        return (
                            <circle
                                key={index}
                                cx="100"
                                cy="100"
                                r={radius}
                                stroke={colors[index]}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setHoveredSegment(index)}
                                onMouseLeave={() => setHoveredSegment(null)}
                            />
                        );
                    })}
                    <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="white"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center transform rotate-90">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{total}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total</div>
                    </div>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                {labels.map((label, index) => (
                    <div key={index} className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-2 ${colors[index]}`}></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{label}: {data[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Bar Chart Component
const BarChart = ({ data, labels, title, colors }) => {
    const maxValue = Math.max(...data, 1);
    const [hoveredBar, setHoveredBar] = useState(null);
    
    return (
        <div className="h-64 flex flex-col">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{title}</h3>
            <div className="flex-1 flex items-end justify-between px-2">
                {data.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div className="w-full flex flex-col items-center">
                            <span className={`text-sm font-medium mb-1 transition-opacity duration-200 ${hoveredBar === index ? 'opacity-100' : 'opacity-0'}`}>
                                {value}
                            </span>
                            <div
                                className={`w-full rounded-t-md transition-all duration-300 cursor-pointer ${colors[index]}`}
                                style={{ 
                                    height: `${(value / maxValue) * 100}%`,
                                    opacity: hoveredBar === null || hoveredBar === index ? 1 : 0.5
                                }}
                                onMouseEnter={() => setHoveredBar(index)}
                                onMouseLeave={() => setHoveredBar(null)}
                            ></div>
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center truncate w-full">
                            {labels[index].length > 10 ? `${labels[index].substring(0, 10)}...` : labels[index]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Line Chart Component
const LineChart = ({ data, labels, title }) => {
    const maxValue = Math.max(...data, 1);
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (value / maxValue) * 100;
        return `${x},${y}`;
    }).join(' ');
    
    return (
        <div className="h-64 flex flex-col">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{title}</h3>
            <div className="flex-1 relative">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[...Array(5)].map((_, i) => (
                        <line
                            key={`h-${i}`}
                            x1="0"
                            y1={i * 25}
                            x2="100"
                            y2={i * 25}
                            stroke="#e2e8f0"
                            strokeWidth="0.5"
                        />
                    ))}
                    {[...Array(5)].map((_, i) => (
                        <line
                            key={`v-${i}`}
                            x1={i * 25}
                            y1="0"
                            x2={i * 25}
                            y2="100"
                            stroke="#e2e8f0"
                            strokeWidth="0.5"
                        />
                    ))}
                    {/* Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                    />
                    {/* Area under the line */}
                    <polygon
                        points={`${points}, 100,0 100,100 0,100`}
                        fill="url(#gradient)"
                        opacity="0.3"
                    />
                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Data points */}
                    {data.map((value, index) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = 100 - (value / maxValue) * 100;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="2"
                                fill="#3b82f6"
                            />
                        );
                    })}
                </svg>
                {/* X-axis labels */}
                <div className="flex justify-between mt-2">
                    {labels.map((label, index) => (
                        <span key={index} className="text-xs text-slate-600 dark:text-slate-400">
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main Component
export default function WorkerAnalytics() {
    const [workers, setWorkers] = useState([]);
    const [availableWork, setAvailableWork] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobTitleFilter, setJobTitleFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const reportRef = useRef(null);
    const router = useRouter();

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Fetch workers and work from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workersResponse, workResponse] = await Promise.all([
                    fetch('/api/workers'),
                    fetch('/api/work')
                ]);

                if (!workersResponse.ok) throw new Error('Failed to fetch workers');
                if (!workResponse.ok) throw new Error('Failed to fetch work tasks');

                const workersData = await workersResponse.json();
                const workData = await workResponse.json();

                setWorkers(workersData);
                setAvailableWork(workData);
                
                // Check if current user is admin
                const userRole = localStorage.getItem('userRole') || 'user';
                setIsAdmin(userRole === 'admin');
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate analytics
    const analytics = useMemo(() => {
        const totalWorkers = workers.length;
        const activeWorkers = workers.filter(w => w.status === 'active').length;
        const inactiveWorkers = workers.filter(w => w.status === 'inactive').length;
        const pendingWorkers = workers.filter(w => w.status === 'pending').length;
        const suspendedWorkers = workers.filter(w => w.status === 'suspended').length;
        
        // Job title distribution
        const jobTitleDistribution = workers.reduce((acc, worker) => {
            const title = worker.jobTitle || 'other';
            acc[title] = (acc[title] || 0) + 1;
            return acc;
        }, {});
        
        // Work assignments
        const totalWorkItems = availableWork.length;
        const assignedWorkItems = availableWork.filter(w => w.assignedTo).length;
        const unassignedWorkItems = totalWorkItems - assignedWorkItems;
        
        // Performance metrics
        const workersWithWork = workers.filter(w => w.assignedWork && w.assignedWork.length > 0);
        const avgWorkPerWorker = workersWithWork.length > 0 ? 
            Math.round(workersWithWork.reduce((sum, w) => sum + w.assignedWork.length, 0) / workersWithWork.length) : 0;
        
        // Top performers
        const topPerformers = workers
            .filter(w => w.assignedWork && w.assignedWork.length > 0)
            .sort((a, b) => b.assignedWork.length - a.assignedWork.length)
            .slice(0, 5);
        
        // Work by category
        const workByCategory = availableWork.reduce((acc, work) => {
            const category = work.category || 'other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        
        // Work by priority
        const workByPriority = availableWork.reduce((acc, work) => {
            const priority = work.priority || 'medium';
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, {});

        // Work completion rate
        const completedWork = availableWork.filter(w => w.status === 'completed').length;
        const inProgressWork = availableWork.filter(w => w.status === 'in-progress').length;
        const completionRate = totalWorkItems > 0 ? Math.round((completedWork / totalWorkItems) * 100) : 0;
        
        // Monthly work completion (mock data for demonstration)
        const monthlyCompletion = [65, 78, 82, 91, 73, 85, 90, 88, 92, 87, 94, 96];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return {
            totalWorkers,
            activeWorkers,
            inactiveWorkers,
            pendingWorkers,
            suspendedWorkers,
            jobTitleDistribution,
            totalWorkItems,
            assignedWorkItems,
            unassignedWorkItems,
            avgWorkPerWorker,
            topPerformers,
            workByCategory,
            workByPriority,
            completionRate,
            monthlyCompletion,
            months
        };
    }, [workers, availableWork]);

    // Filter workers based on search and filters
    const filteredWorkers = useMemo(() => {
        return workers.filter(worker => {
            const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;
            const matchesJobTitle = jobTitleFilter === 'all' || worker.jobTitle === jobTitleFilter;
            return matchesSearch && matchesStatus && matchesJobTitle;
        });
    }, [workers, searchTerm, statusFilter, jobTitleFilter]);

    // Filter work based on date range
    const filteredWork = useMemo(() => {
        if (dateRange === 'all') return availableWork;
        
        const now = new Date();
        let startDate;
        
        switch (dateRange) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return availableWork;
        }
        
        return availableWork.filter(work => new Date(work.createdAt) >= startDate);
    }, [availableWork, dateRange]);

    // Generate and download PDF report
    const generatePDFReport = async () => {
        if (!reportRef.current) return;
        
        try {
            showNotification('Generating PDF report...', 'info');
            
            // In a real implementation, you would use a library like html2canvas and jsPDF
            // For this example, we'll just show a notification
            setTimeout(() => {
                showNotification('PDF report generated successfully!', 'success');
            }, 2000);
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('Failed to generate PDF report. Please try again.', 'error');
        }
    };

    if (isInitialLoading) return <LoadingSpinner message="Loading analytics data..." />;

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                {/* Notification */}
                {notification.show && (
                    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse ${notification.type === 'success' ? 'bg-green-500 text-white' : notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                        {notification.type === 'success' ? <FaCheckCircle className="text-xl" /> : notification.type === 'error' ? <FaExclamationCircle className="text-xl" /> : <FaSpinner className="text-xl animate-spin" />}
                        <span>{notification.message}</span>
                    </div>
                )}

                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 mb-6 rounded-t-xl">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mr-3 shadow-lg">
                                            <FaChartBar className="h-6 w-6" />
                                        </div>
                                        Worker Analytics
                                    </h1>
                                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                                        Comprehensive analytics and performance metrics for all workers
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={generatePDFReport}
                                                className="inline-flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                <FaDownload className="h-4 w-4 mr-2" />
                                                Download Report
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Generate PDF report</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <button
                                        onClick={() => router.push('/dashboard/all-emplyee')}
                                        className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <FaUsers className="h-4 w-4 mr-2" />
                                        Manage Workers
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => router.push('/dashboard/add-worker')}
                                            className="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <FaPlus className="h-4 w-4 mr-2" />
                                            Add Worker
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-6">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaSearch className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search workers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-0 border-b-2 border-slate-300 dark:border-slate-600 rounded-t-xl focus:ring-0 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-3 border-0 border-b-2 border-slate-300 dark:border-slate-600 rounded-t-xl focus:ring-0 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Statuses</option>
                                        {STATUS_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={jobTitleFilter}
                                        onChange={(e) => setJobTitleFilter(e.target.value)}
                                        className="w-full px-4 py-3 border-0 border-b-2 border-slate-300 dark:border-slate-600 rounded-t-xl focus:ring-0 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Job Titles</option>
                                        {JOB_TITLE_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        className="w-full px-4 py-3 border-0 border-b-2 border-slate-300 dark:border-slate-600 rounded-t-xl focus:ring-0 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="week">Last Week</option>
                                        <option value="month">Last Month</option>
                                        <option value="quarter">Last Quarter</option>
                                        <option value="year">Last Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-md">
                            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                <FaChartBar className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                <FaChartLine className="h-4 w-4" />
                                Performance
                            </TabsTrigger>
                            <TabsTrigger value="distribution" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                <FaChartPie className="h-4 w-4" />
                                Distribution
                            </TabsTrigger>
                            <TabsTrigger value="workers" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                <FaUsers className="h-4 w-4" />
                                Workers
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-slate-900 dark:text-white">Total Workers</CardTitle>
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <FaUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.totalWorkers}</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            <span className="text-green-600">+{analytics.activeWorkers}</span> active
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-slate-900 dark:text-white">Active Workers</CardTitle>
                                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                                                {analytics.activeWorkers}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.activeWorkers}</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {analytics.totalWorkers > 0 ? Math.round((analytics.activeWorkers / analytics.totalWorkers) * 100) : 0}% of total
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-slate-900 dark:text-white">Pending Workers</CardTitle>
                                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                            <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                                                {analytics.pendingWorkers}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.pendingWorkers}</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {analytics.totalWorkers > 0 ? Math.round((analytics.pendingWorkers / analytics.totalWorkers) * 100) : 0}% of total
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-slate-900 dark:text-white">Work Items</CardTitle>
                                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <FaTasks className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.totalWorkItems}</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            <span className="text-blue-600">{analytics.assignedWorkItems}</span> assigned
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <Card className="hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-gray-300">Worker Status Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <DonutChart
                                            data={[
                                                analytics.activeWorkers,
                                                analytics.inactiveWorkers,
                                                analytics.pendingWorkers,
                                                analytics.suspendedWorkers
                                            ]}
                                            colors={['#10b981', '#6b7280', '#f59e0b', '#ef4444']}
                                            labels={['Active', 'Inactive', 'Pending', 'Suspended']}
                                            title="Worker Status"
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-white">Top Performers</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {analytics.topPerformers.map((worker, index) => (
                                                <div key={worker._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                            {worker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{worker.name}</div>
                                                            <div className="text-xs text-slate-600 dark:text-slate-400">{worker.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Badge className="bg-blue-100 text-blue-800">
                                                            <FaTasks className="h-3 w-3 mr-1" />
                                                            {worker.assignedWork ? worker.assignedWork.length : 0} tasks
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {index === 0 && <FaTrophy className="h-5 w-5 text-yellow-500 mr-2" />}
                                                        {index === 1 && <FaAward className="h-5 w-5 text-gray-400 mr-2" />}
                                                        {index === 2 && <FaAward className="h-5 w-5 text-orange-600 mr-2" />}
                                                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                            #{index + 1}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Performance Tab */}
                        <TabsContent value="performance" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <Card className="hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-white">Monthly Completion Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <LineChart
                                            data={analytics.monthlyCompletion}
                                            labels={analytics.months}
                                            title="Work Completion Trend (%)"
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-white">Performance Metrics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Work Items</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalWorkItems}</span>
                                            </div>
                                            <Progress value={100} className="h-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Work Items</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.assignedWorkItems}</span>
                                            </div>
                                            <Progress value={analytics.totalWorkItems > 0 ? (analytics.assignedWorkItems / analytics.totalWorkItems) * 100 : 0} className="h-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.completionRate}%</span>
                                            </div>
                                            <Progress value={analytics.completionRate} className="h-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Work per Worker</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.avgWorkPerWorker}</span>
                                            </div>
                                            <Progress value={Math.min(analytics.avgWorkPerWorker * 10, 100)} className="h-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Distribution Tab */}
                        <TabsContent value="distribution" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <Card className="hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-white">Job Title Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BarChart
                                            data={Object.values(analytics.jobTitleDistribution)}
                                            labels={Object.keys(analytics.jobTitleDistribution).map(title => 
                                                JOB_TITLE_OPTIONS.find(opt => opt.value === title)?.label || title
                                            )}
                                            title="Workers by Job Title"
                                            colors={Object.keys(analytics.jobTitleDistribution).map(title => 
                                                JOB_TITLE_OPTIONS.find(opt => opt.value === title)?.color || 'bg-slate-500'
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-white">Work Category Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BarChart
                                            data={Object.values(analytics.workByCategory)}
                                            labels={Object.keys(analytics.workByCategory).map(category => 
                                                CATEGORY_OPTIONS.find(opt => opt.value === category)?.label || category
                                            )}
                                            title="Work by Category"
                                            colors={Object.keys(analytics.workByCategory).map(category => 
                                                CATEGORY_OPTIONS.find(opt => opt.value === category)?.color || 'bg-slate-500'
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Workers Tab */}
                        <TabsContent value="workers" className="mt-6">
                            <Card className="hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <CardTitle className="text-slate-900 dark:text-white">Worker Details</CardTitle>
                                    <CardDescription>
                                        Showing {filteredWorkers.length} of {workers.length} workers
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Worker
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Job Title
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Assigned Work
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                                {filteredWorkers.length > 0 ? (
                                                    filteredWorkers.map((worker) => (
                                                        <tr key={worker._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="h-12 w-12 flex-shrink-0">
                                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                                            {worker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{worker.name}</div>
                                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{worker.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <span className="text-lg mr-2">{JOB_TITLE_OPTIONS.find(opt => opt.value === worker.jobTitle)?.icon || '👤'}</span>
                                                                    <span className="text-sm text-slate-900 dark:text-white">
                                                                        {JOB_TITLE_OPTIONS.find(opt => opt.value === worker.jobTitle)?.label || 'Other'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <StatusBadge status={worker.status} />
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <span className="text-sm text-slate-900 dark:text-white mr-2">
                                                                        {worker.assignedWork ? worker.assignedWork.length : 0}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <button
                                                                        onClick={() => router.push(`/dashboard/worker-details/${worker._id}`)}
                                                                        className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                                                                    >
                                                                        <FaEye className="h-4 w-4 mr-1" />
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                                                                    <FaUsers className="h-8 w-8 text-slate-400" />
                                                                </div>
                                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No workers found</h3>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                    Try adjusting your search or filter criteria
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </TooltipProvider>
    );
}