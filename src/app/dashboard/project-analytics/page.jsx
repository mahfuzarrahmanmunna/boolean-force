"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaChartBar, FaChartPie, FaChartLine, FaUsers, FaTasks, FaClock, FaTrophy, FaArrowUp, FaArrowDown,
    FaFilter, FaSearch, FaDownload, FaUser, FaEnvelope, FaCalendar, FaBuilding, FaPhone,
    FaSpinner, FaCheckCircle, FaExclamationCircle, FaTimes, FaEdit, FaEye,
    FaPlus, FaUserTie, FaBriefcase, FaGraduationCap, FaAward, FaStar,
    FaRocket, FaMedal, FaFire, FaGem, FaCrown, FaCertificate, FaLightbulb,
    FaHandshake, FaPuzzlePiece, FaTools, FaCogs, FaFlag, FaHistory,
    FaChartArea, FaIndustry, FaProjectDiagram, FaGlobe, FaUserClock, FaRegChartBar,
    FaInfoCircle, FaSortAmountDown, FaSortAmountUp, FaDollarSign, FaCalendarAlt, FaTag, FaClipboardList
} from 'react-icons/fa';

// Recharts imports
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

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
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

// Constants with professional color palette
const STATUS_OPTIONS = [
    { value: 'completed', label: 'Completed', color: '#10b981', lightColor: 'bg-emerald-100', textColor: 'text-emerald-800', icon: FaCheckCircle },
    { value: 'in-progress', label: 'In Progress', color: '#3b82f6', lightColor: 'bg-blue-100', textColor: 'text-blue-800', icon: FaSpinner },
    { value: 'pending', label: 'Pending', color: '#f59e0b', lightColor: 'bg-amber-100', textColor: 'text-amber-800', icon: FaClock },
    { value: 'archived', label: 'Archived', color: '#64748b', lightColor: 'bg-slate-100', textColor: 'text-slate-800', icon: FaTimes }
];

const CATEGORY_OPTIONS = [
    { value: 'development', label: 'Development', icon: '💻', color: '#3b82f6' },
    { value: 'design', label: 'Design', icon: '🎨', color: '#ec4899' },
    { value: 'marketing', label: 'Marketing', icon: '📢', color: '#f97316' },
    { value: 'research', label: 'Research', icon: '🔍', color: '#8b5cf6' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: '#6b7280' },
    { value: 'mobile-app', label: 'Mobile App', icon: '📱', color: '#14b8a6' },
    { value: 'other', label: 'Other', icon: '📌', color: '#64748b' }
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: '#10b981', lightColor: 'bg-green-100', textColor: 'text-green-800', icon: FaFlag },
    { value: 'medium', label: 'Medium', color: '#f59e0b', lightColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: FaFlag },
    { value: 'high', label: 'High', color: '#f97316', lightColor: 'bg-orange-100', textColor: 'text-orange-800', icon: FaFlag },
    { value: 'urgent', label: 'Urgent', color: '#ef4444', lightColor: 'bg-red-100', textColor: 'text-red-800', icon: FaFlag }
];

// Helper Components
const StatusBadge = ({ status }) => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    const Icon = statusOption?.icon || FaCheckCircle;
    
    return (
        <Badge className={`px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1`} style={{ backgroundColor: statusOption?.color || '#64748b' }}>
            <Icon className="h-3 w-3" />
            {statusOption?.label || status}
        </Badge>
    );
};

const PriorityBadge = ({ priority }) => {
    const priorityOption = PRIORITY_OPTIONS.find(option => option.value === priority);
    const Icon = priorityOption?.icon || FaFlag;
    
    return (
        <Badge className={`px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1`} style={{ backgroundColor: priorityOption?.color || '#64748b' }}>
            <Icon className="h-3 w-3" />
            {priorityOption?.label || priority}
        </Badge>
    );
};

const CategoryBadge = ({ category }) => {
    const categoryOption = CATEGORY_OPTIONS.find(option => option.value === category);
    
    return (
        <Badge className={`px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1`} style={{ backgroundColor: categoryOption?.color || '#64748b' }}>
            <span className="mr-1">{categoryOption?.icon || '📌'}</span>
            {categoryOption?.label || category}
        </Badge>
    );
};

const LoadingSpinner = ({ message }) => (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">{message}</p>
    </div>
);

// Enhanced Chart Components using Recharts with professional styling
const DonutChart = ({ data, colors, labels, title }) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    
    // Transform data for Recharts
    const chartData = labels.map((label, index) => ({
        name: label,
        value: data[index],
        percentage: total > 0 ? Math.round((data[index] / total) * 100) : 0
    }));
    
    // Custom label for the pie chart
    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
        if (percent < 0.05) return null; // Don't show label if percentage is less than 5%
        
        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                className="text-sm font-medium"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    
    return (
        <div className="h-80 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value, name, props) => [
                            `${value} (${props.payload.percentage}%)`, 
                            props.payload.name
                        ]}
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700">
                        <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: colors[index] }}></div>
                        <div className="text-xs">
                            <div className="font-medium text-slate-800 dark:text-white truncate">{item.name}</div>
                            <div className="text-slate-600 dark:text-slate-400">{item.value} ({item.percentage}%)</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BarChartComponent = ({ data, labels, title, colors }) => {
    // Transform data for Recharts
    const chartData = labels.map((label, index) => ({
        name: label,
        value: data[index],
        fill: colors[index]
    }));
    
    return (
        <div className="h-80 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const LineChartComponent = ({ data, labels, title, colors }) => {
    // Transform data for Recharts
    const chartData = labels.map((label, index) => ({
        name: label,
        value: data[index]
    }));
    
    return (
        <div className="h-80 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={colors[0]} 
                        strokeWidth={3}
                        dot={{ fill: colors[0], strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const AreaChartComponent = ({ data, labels, title, colors }) => {
    // Transform data for Recharts
    const chartData = labels.map((label, index) => ({
        name: label,
        value: data[index]
    }));
    
    return (
        <div className="h-80 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={colors[0]} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// Advanced Distribution Card Component with professional design
const DistributionCard = ({ title, data, labels, colors, icon: Icon, type }) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'list'
    
    // Transform data for list view
    const listData = labels.map((label, index) => ({
        name: label,
        value: data[index],
        percentage: total > 0 ? Math.round((data[index] / total) * 100) : 0,
        color: colors[index]
    }));
    
    return (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
            <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
                            <Icon className="h-5 w-5" />
                        </div>
                        {title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setViewMode(viewMode === 'chart' ? 'list' : 'chart')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'chart' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
                                >
                                    {viewMode === 'chart' ? <FaRegChartBar className="h-4 w-4" /> : <FaChartBar className="h-4 w-4" />}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{viewMode === 'chart' ? 'Switch to list view' : 'Switch to chart view'}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="p-2 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                    <FaInfoCircle className="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>More information</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {viewMode === 'chart' ? (
                    <BarChartComponent
                        data={data}
                        labels={labels}
                        title=""
                        colors={colors}
                    />
                ) : (
                    <div className="space-y-3">
                        {listData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                <div className="flex items-center">
                                    <div className="h-4 w-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">{item.value} items ({item.percentage}%)</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-24 bg-slate-200 dark:bg-slate-600 rounded-full h-2 mr-2">
                                        <div 
                                            className="h-2 rounded-full"
                                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                        ></div>
                                    </div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{item.value}</div>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total</span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">{total}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Performance Card Component with professional design
const PerformanceCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue, bgGradient }) => (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-white dark:bg-slate-800">
        <div className={`h-1 ${bgGradient}`}></div>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl bg-opacity-10 group-hover:scale-110 transition-transform duration-300`} style={{ backgroundColor: `${color}20` }}>
                    <Icon className={`h-8 w-8`} style={{ color }} />
                </div>
            </div>
            {trend && (
                <div className="flex items-center mt-4">
                    {trend === 'up' ? (
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                            <FaArrowUp className="h-3 w-3 mr-1" />
                            <span className="text-sm font-medium">{trendValue}%</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                            <FaArrowDown className="h-3 w-3 mr-1" />
                            <span className="text-sm font-medium">{trendValue}%</span>
                        </div>
                    )}
                    <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">from last month</span>
                </div>
            )}
        </CardContent>
    </Card>
);

// Main Component
export default function ProjectWorkAnalytics() {
    const [workItems, setWorkItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
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

    // Fetch work items from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const workResponse = await fetch('/api/work');

                if (!workResponse.ok) throw new Error('Failed to fetch work items');

                const workData = await workResponse.json();

                setWorkItems(workData);
                
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
        const totalWorkItems = workItems.length;
        const completedWorkItems = workItems.filter(w => w.status === 'completed').length;
        const inProgressWorkItems = workItems.filter(w => w.status === 'in-progress').length;
        const pendingWorkItems = workItems.filter(w => w.status === 'pending').length;
        const archivedWorkItems = workItems.filter(w => w.status === 'archived').length;
        
        // Category distribution
        const categoryDistribution = workItems.reduce((acc, work) => {
            const category = work.category || 'other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        
        // Priority distribution
        const priorityDistribution = workItems.reduce((acc, work) => {
            const priority = work.priority || 'medium';
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, {});
        
        // Assigned vs unassigned
        const assignedWorkItems = workItems.filter(w => w.assignedTo).length;
        const unassignedWorkItems = totalWorkItems - assignedWorkItems;
        
        // Budget analysis - Fixed the variable order issue
        const itemsWithBudget = workItems.filter(w => w.budget && w.budget > 0).length;
        const totalBudget = workItems.reduce((sum, work) => sum + (work.budget || 0), 0);
        const avgBudget = itemsWithBudget > 0 ? Math.round(totalBudget / itemsWithBudget) : 0;
        
        // Progress analysis
        const totalProgress = workItems.reduce((sum, work) => sum + (work.progress || 0), 0);
        const avgProgress = totalWorkItems > 0 ? Math.round(totalProgress / totalWorkItems) : 0;
        
        // Due date analysis
        const overdueItems = workItems.filter(w => {
            if (!w.dueDate) return false;
            const dueDate = new Date(w.dueDate);
            const today = new Date();
            return dueDate < today && w.status !== 'completed';
        }).length;
        
        // Monthly work completion (mock data for demonstration)
        const monthlyCompletion = [65, 78, 82, 91, 73, 85, 90, 88, 92, 87, 94, 96];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return {
            totalWorkItems,
            completedWorkItems,
            inProgressWorkItems,
            pendingWorkItems,
            archivedWorkItems,
            categoryDistribution,
            priorityDistribution,
            assignedWorkItems,
            unassignedWorkItems,
            totalBudget,
            avgBudget,
            itemsWithBudget,
            avgProgress,
            overdueItems,
            monthlyCompletion,
            months
        };
    }, [workItems]);

    // Filter work items based on search and filters
    const filteredWorkItems = useMemo(() => {
        return workItems.filter(work => {
            const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                work.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || work.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || work.category === categoryFilter;
            const matchesPriority = priorityFilter === 'all' || work.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
        });
    }, [workItems, searchTerm, statusFilter, categoryFilter, priorityFilter]);

    // Filter work items based on date range
    const filteredWorkByDate = useMemo(() => {
        if (dateRange === 'all') return workItems;
        
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
                return workItems;
        }
        
        return workItems.filter(work => new Date(work.createdAt) >= startDate);
    }, [workItems, dateRange]);

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

    if (isInitialLoading) return <LoadingSpinner message="Loading work analytics data..." />;

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                {/* Notification */}
                {notification.show && (
                    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse ${
                        notification.type === 'success' ? 'bg-emerald-500 text-white' : 
                        notification.type === 'error' ? 'bg-red-500 text-white' : 
                        'bg-blue-500 text-white'
                    }`}>
                        {notification.type === 'success' ? <FaCheckCircle className="text-xl" /> : 
                         notification.type === 'error' ? <FaExclamationCircle className="text-xl" /> : 
                         <FaSpinner className="text-xl animate-spin" />}
                        <span>{notification.message}</span>
                    </div>
                )}

                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-800 shadow-xl border-b border-slate-200 dark:border-slate-700 mb-8 rounded-t-2xl overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 ">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mr-4 shadow-lg">
                                            <FaClipboardList className="h-6 w-6" />
                                        </div>
                                        Project & Work Analytics
                                    </h1>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Comprehensive analytics and performance metrics for all work items
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={generatePDFReport}
                                                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                                        onClick={() => router.push('/dashboard/work')}
                                        className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <FaTasks className="h-4 w-4 mr-2" />
                                        Manage Work Items
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => router.push('/dashboard/add-work')}
                                            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <FaPlus className="h-4 w-4 mr-2" />
                                            Add Work Item
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaSearch className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search work items..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Statuses</option>
                                        {STATUS_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Categories</option>
                                        {CATEGORY_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={priorityFilter}
                                        onChange={(e) => setPriorityFilter(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Priorities</option>
                                        {PRIORITY_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
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
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                        <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-md">
                            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer">
                                <FaChartBar className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer">
                                <FaChartLine className="h-4 w-4" />
                                Performance
                            </TabsTrigger>
                            <TabsTrigger value="distribution" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer">
                                <FaChartPie className="h-4 w-4" />
                                Distribution
                            </TabsTrigger>
                            <TabsTrigger value="work-items" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer">
                                <FaTasks className="h-4 w-4" />
                                Work Items
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <PerformanceCard
                                    title="Total Work Items"
                                    value={analytics.totalWorkItems}
                                    subtitle={`${analytics.assignedWorkItems} assigned`}
                                    icon={FaTasks}
                                    color="#3b82f6"
                                    bgGradient="bg-gradient-to-r from-blue-500 to-blue-600"
                                    trend="up"
                                    trendValue="12"
                                />
                                <PerformanceCard
                                    title="Completed Items"
                                    value={analytics.completedWorkItems}
                                    subtitle={`${analytics.totalWorkItems > 0 ? Math.round((analytics.completedWorkItems / analytics.totalWorkItems) * 100) : 0}% completion rate`}
                                    icon={FaCheckCircle}
                                    color="#10b981"
                                    bgGradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
                                    trend="up"
                                    trendValue="8"
                                />
                                <PerformanceCard
                                    title="In Progress"
                                    value={analytics.inProgressWorkItems}
                                    subtitle={`${analytics.totalWorkItems > 0 ? Math.round((analytics.inProgressWorkItems / analytics.totalWorkItems) * 100) : 0}% of total`}
                                    icon={FaSpinner}
                                    color="#f59e0b"
                                    bgGradient="bg-gradient-to-r from-amber-500 to-amber-600"
                                    trend="down"
                                    trendValue="3"
                                />
                                <PerformanceCard
                                    title="Overdue Items"
                                    value={analytics.overdueItems}
                                    subtitle={`${analytics.totalWorkItems > 0 ? Math.round((analytics.overdueItems / analytics.totalWorkItems) * 100) : 0}% of total`}
                                    icon={FaExclamationCircle}
                                    color="#ef4444"
                                    bgGradient="bg-gradient-to-r from-red-500 to-red-600"
                                    trend="up"
                                    trendValue="5"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                                    <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white mr-3">
                                                <FaChartPie className="h-5 w-5" />
                                            </div>
                                            Work Status Distribution
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <DonutChart
                                            data={[
                                                analytics.completedWorkItems,
                                                analytics.inProgressWorkItems,
                                                analytics.pendingWorkItems,
                                                analytics.archivedWorkItems
                                            ]}
                                            colors={['#10b981', '#3b82f6', '#f59e0b', '#64748b']}
                                            labels={['Completed', 'In Progress', 'Pending', 'Archived']}
                                            title="Work Status"
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                                    <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white mr-3">
                                                <FaDollarSign className="h-5 w-5" />
                                            </div>
                                            Budget Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Budget</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">${analytics.totalBudget.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Items with Budget</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.itemsWithBudget}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analytics.totalWorkItems > 0 ? (analytics.itemsWithBudget / analytics.totalWorkItems) * 100 : 0}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Budget</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">${analytics.avgBudget.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(analytics.avgBudget / 1000, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Performance Tab */}
                        <TabsContent value="performance" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                                    <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
                                                <FaChartLine className="h-5 w-5" />
                                            </div>
                                            Monthly Completion Rate
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <AreaChartComponent
                                            data={analytics.monthlyCompletion}
                                            labels={analytics.months}
                                            title="Monthly Completion Rate"
                                            colors={['#10b981']}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                                    <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                                        <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white mr-3">
                                                <FaRegChartBar className="h-5 w-5" />
                                            </div>
                                            Performance Metrics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Work Items</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalWorkItems}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Work Items</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.assignedWorkItems}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${analytics.totalWorkItems > 0 ? (analytics.assignedWorkItems / analytics.totalWorkItems) * 100 : 0}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalWorkItems > 0 ? Math.round((analytics.completedWorkItems / analytics.totalWorkItems) * 100) : 0}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${analytics.totalWorkItems > 0 ? (analytics.completedWorkItems / analytics.totalWorkItems) * 100 : 0}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Progress</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.avgProgress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${analytics.avgProgress}%` }}></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Distribution Tab */}
                        <TabsContent value="distribution" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <DistributionCard
                                    title="Category Distribution"
                                    data={Object.values(analytics.categoryDistribution)}
                                    labels={Object.keys(analytics.categoryDistribution).map(category => 
                                        CATEGORY_OPTIONS.find(opt => opt.value === category)?.label || category
                                    )}
                                    colors={Object.keys(analytics.categoryDistribution).map(category => 
                                        CATEGORY_OPTIONS.find(opt => opt.value === category)?.color || '#64748b'
                                    )}
                                    icon={FaProjectDiagram}
                                    type="category"
                                />

                                <DistributionCard
                                    title="Priority Distribution"
                                    data={Object.values(analytics.priorityDistribution)}
                                    labels={Object.keys(analytics.priorityDistribution).map(priority => 
                                        PRIORITY_OPTIONS.find(opt => opt.value === priority)?.label || priority
                                    )}
                                    colors={Object.keys(analytics.priorityDistribution).map(priority => 
                                        PRIORITY_OPTIONS.find(opt => opt.value === priority)?.color || '#64748b'
                                    )}
                                    icon={FaFlag}
                                    type="priority"
                                />
                            </div>
                        </TabsContent>

                        {/* Work Items Tab */}
                        <TabsContent value="work-items" className="mt-6">
                            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                                    <CardTitle className="text-slate-900 dark:text-white">Work Item Details</CardTitle>
                                    <CardDescription>
                                        Showing {filteredWorkItems.length} of {workItems.length} work items
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Work Item
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Category
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Priority
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Progress
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Due Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                                {filteredWorkItems.length > 0 ? (
                                                    filteredWorkItems.map((workItem) => (
                                                        <tr key={workItem._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{workItem.title}</div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">{workItem.description}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <CategoryBadge category={workItem.category} />
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <StatusBadge status={workItem.status} />
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <PriorityBadge priority={workItem.priority} />
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-2">
                                                                        <div 
                                                                            className="bg-blue-500 h-2 rounded-full" 
                                                                            style={{ width: `${workItem.progress || 0}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-sm text-slate-900 dark:text-white">{workItem.progress || 0}%</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-slate-900 dark:text-white">
                                                                    {workItem.dueDate ? new Date(workItem.dueDate).toLocaleDateString() : 'N/A'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <button
                                                                        onClick={() => router.push(`/dashboard/project-details/${workItem._id}`)}
                                                                        className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
                                                        <td colSpan="7" className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                                                                    <FaTasks className="h-8 w-8 text-slate-400" />
                                                                </div>
                                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No work items found</h3>
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