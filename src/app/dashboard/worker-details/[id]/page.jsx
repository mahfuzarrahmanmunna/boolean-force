"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaBuilding, FaBriefcase,
    FaTasks, FaClock, FaArrowLeft, FaEdit, FaSave, FaTimes, FaSpinner,
    FaCheckCircle, FaExclamationCircle, FaUserTie, FaCode, FaServer, FaPalette,
    FaShieldAlt, FaChartLine, FaDownload, FaFilePdf, FaGraduationCap, FaAward,
    FaTrophy, FaStar, FaUserClock, FaChartPie, FaChartBar, FaProjectDiagram,
    FaFilter, FaSearch, FaPlus, FaEllipsisV, FaPaperclip, FaComments,
    FaHistory, FaMedal, FaCertificate, FaLightbulb, FaRocket, FaHandshake,
    FaUsers, FaClipboardCheck, FaStopwatch, FaCalendarAlt, FaTag,
    FaLinkedin, FaTwitter, FaGlobe, FaRegFileAlt, FaUserGraduate, FaIdCard,
    FaIndustry, FaTools, FaCogs, FaChartArea, FaUserFriends, FaMoneyBillWave
} from 'react-icons/fa';
import jsPDF from 'jspdf';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Constants
const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'bg-emerald-500', icon: <FaCheckCircle />, textColor: 'text-emerald-600', bgLight: 'bg-emerald-50' },
    { value: 'inactive', label: 'Inactive', color: 'bg-slate-500', icon: <FaTimes />, textColor: 'text-slate-600', bgLight: 'bg-slate-50' },
    { value: 'pending', label: 'Pending', color: 'bg-amber-500', icon: <FaClock />, textColor: 'text-amber-600', bgLight: 'bg-amber-50' },
    { value: 'suspended', label: 'Suspended', color: 'bg-rose-500', icon: <FaExclamationCircle />, textColor: 'text-rose-600', bgLight: 'bg-rose-50' }
];

const JOB_TITLE_OPTIONS = [
    { value: 'full-stack-developer', label: 'Full Stack Developer', icon: <FaCode />, color: 'text-blue-500', bgColor: 'bg-blue-50', bgDark: 'dark:bg-blue-900/20' },
    { value: 'devops-engineer', label: 'DevOps Engineer', icon: <FaServer />, color: 'text-purple-500', bgColor: 'bg-purple-50', bgDark: 'dark:bg-purple-900/20' },
    { value: 'graphics-designer', label: 'Graphics Designer', icon: <FaPalette />, color: 'text-pink-500', bgColor: 'bg-pink-50', bgDark: 'dark:bg-pink-900/20' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer', icon: <FaPalette />, color: 'text-indigo-500', bgColor: 'bg-indigo-50', bgDark: 'dark:bg-indigo-900/20' },
    { value: 'backend-developer', label: 'Backend Developer', icon: <FaCode />, color: 'text-green-500', bgColor: 'bg-green-50', bgDark: 'dark:bg-green-900/20' },
    { value: 'frontend-developer', label: 'Frontend Developer', icon: <FaCode />, color: 'text-cyan-500', bgColor: 'bg-cyan-50', bgDark: 'dark:bg-cyan-900/20' },
    { value: 'mobile-developer', label: 'Mobile Developer', icon: <FaCode />, color: 'text-orange-500', bgColor: 'bg-orange-50', bgDark: 'dark:bg-orange-900/20' },
    { value: 'qa-engineer', label: 'QA Engineer', icon: <FaShieldAlt />, color: 'text-red-500', bgColor: 'bg-red-50', bgDark: 'dark:bg-red-900/20' },
    { value: 'data-scientist', label: 'Data Scientist', icon: <FaChartLine />, color: 'text-violet-500', bgColor: 'bg-violet-50', bgDark: 'dark:bg-violet-900/20' },
    { value: 'product-manager', label: 'Product Manager', icon: <FaBriefcase />, color: 'text-amber-600', bgColor: 'bg-amber-50', bgDark: 'dark:bg-amber-900/20' },
    { value: 'other', label: 'Other', icon: <FaUser />, color: 'text-slate-500', bgColor: 'bg-slate-50', bgDark: 'dark:bg-slate-900/20' }
];

const SKILL_LEVEL_OPTIONS = [
    { value: 'beginner', label: 'Beginner', color: 'bg-emerald-500', progress: 25, textColor: 'text-emerald-600', bgLight: 'bg-emerald-50' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-500', progress: 50, textColor: 'text-blue-600', bgLight: 'bg-blue-50' },
    { value: 'advanced', label: 'Advanced', color: 'bg-violet-500', progress: 75, textColor: 'text-violet-600', bgLight: 'bg-violet-50' },
    { value: 'expert', label: 'Expert', color: 'bg-rose-500', progress: 100, textColor: 'text-rose-600', bgLight: 'bg-rose-50' }
];

const CATEGORY_OPTIONS = [
    { value: 'development', label: 'Development', icon: '💻', color: 'bg-blue-100 text-blue-800', darkColor: 'dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'design', label: 'Design', icon: '🎨', color: 'bg-purple-100 text-purple-800', darkColor: 'dark:bg-purple-900/30 dark:text-purple-300' },
    { value: 'marketing', label: 'Marketing', icon: '📢', color: 'bg-pink-100 text-pink-800', darkColor: 'dark:bg-pink-900/30 dark:text-pink-300' },
    { value: 'research', label: 'Research', icon: '🔍', color: 'bg-indigo-100 text-indigo-800', darkColor: 'dark:bg-indigo-900/30 dark:text-indigo-300' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-green-100 text-green-800', darkColor: 'dark:bg-green-900/30 dark:text-green-300' },
    { value: 'testing', label: 'Testing', icon: '🧪', color: 'bg-yellow-100 text-yellow-800', darkColor: 'dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'documentation', label: 'Documentation', icon: '📝', color: 'bg-cyan-100 text-cyan-800', darkColor: 'dark:bg-cyan-900/30 dark:text-cyan-300' },
    { value: 'other', label: 'Other', icon: '📌', color: 'bg-gray-100 text-gray-800', darkColor: 'dark:bg-gray-900/30 dark:text-gray-300' }
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'bg-emerald-100 text-emerald-800', darkColor: 'dark:bg-emerald-900/30 dark:text-emerald-300', icon: '🟢' },
    { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-800', darkColor: 'dark:bg-amber-900/30 dark:text-amber-300', icon: '🟡' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-900/30 dark:text-orange-300', icon: '🟠' },
    { value: 'urgent', label: 'Urgent', color: 'bg-rose-100 text-rose-800', darkColor: 'dark:bg-rose-900/30 dark:text-rose-300', icon: '🔴' }
];

// Colors for task categories
const TASK_CATEGORIES_COLORS = {
    development: 'bg-blue-500',
    design: 'bg-purple-500',
    marketing: 'bg-pink-500',
    research: 'bg-indigo-500',
    maintenance: 'bg-green-500',
    testing: 'bg-yellow-500',
    documentation: 'bg-cyan-500',
    other: 'bg-gray-500'
};

// Helper Components
const StatusBadge = ({ status, size = "default" }) => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs";
    
    return (
        <Badge className={`${sizeClasses} font-medium text-white ${statusOption?.color || 'bg-slate-500'} flex items-center gap-1 shadow-sm`}>
            {statusOption?.icon}
            {statusOption?.label || status}
        </Badge>
    );
};

const JobTitleBadge = ({ title, size = "default" }) => {
    const jobOption = JOB_TITLE_OPTIONS.find(option => option.value === title);
    const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs";
    
    return (
        <Badge variant="outline" className={`${sizeClasses} flex items-center gap-1 ${jobOption?.bgColor || 'bg-slate-50'} ${jobOption?.color || 'text-slate-500'} border-current shadow-sm`}>
            <span>{jobOption?.icon}</span>
            <span className="ml-1">{jobOption?.label || 'Other'}</span>
        </Badge>
    );
};

const SkillLevelBadge = ({ level, size = "default" }) => {
    const skillOption = SKILL_LEVEL_OPTIONS.find(option => option.value === level);
    const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs";
    
    return (
        <Badge className={`${sizeClasses} font-medium text-white ${skillOption?.color || 'bg-slate-500'} shadow-sm`}>
            {skillOption?.label || 'Unknown'}
        </Badge>
    );
};

const LoadingSpinner = ({ message }) => (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <FaUserTie className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
        </div>
        <p className="mt-6 text-lg font-medium text-center text-slate-700 dark:text-slate-300">{message}</p>
    </div>
);

const MetricCard = ({ title, value, icon, color, change, changeType, description }) => (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 h-full">
        <CardContent className="p-6 h-full flex flex-col justify-between my-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
                    {description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                    )}
                    {change && (
                        <div className={`flex items-center mt-2 text-sm font-medium ${changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            <span>{changeType === 'positive' ? '↑' : '↓'}</span>
                            <span className="ml-1">{change}% from last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${color} ml-4 shadow-md`}>
                    {icon}
                </div>
            </div>
        </CardContent>
    </Card>
);

const TaskCard = ({ task, onStatusChange, isAdmin, onCategoryClick, selectedCategory }) => {
    const categoryOption = CATEGORY_OPTIONS.find(opt => opt.value === task.category);
    const priorityOption = PRIORITY_OPTIONS.find(opt => opt.value === task.priority);
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === task.status);

    return (
        <Card className={`mb-6 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 rounded-xl ${
            selectedCategory === task.category ? 'ring-2 ring-blue-500' : ''
        }`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div 
                            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => onCategoryClick && onCategoryClick(task.category)}
                        >
                            <span className="text-2xl">{categoryOption?.icon || '📌'}</span>
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg text-slate-900 dark:text-white">{task.title || 'Untitled'}</CardTitle>
                            <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
                                {task.description || 'No description available'}
                            </CardDescription>
                            <div className="flex items-center mt-2">
                                <Badge 
                                    variant="outline" 
                                    className="text-xs mr-2 cursor-pointer"
                                    onClick={() => onCategoryClick && onCategoryClick(task.category)}
                                >
                                    {categoryOption?.label || 'Other'}
                                </Badge>
                                <Badge className={`${priorityOption?.color || 'bg-gray-100 text-gray-800'} ${priorityOption?.darkColor || 'dark:bg-gray-900/30 dark:text-gray-300'} flex items-center gap-1 shadow-sm`}>
                                    <span>{priorityOption?.icon}</span>
                                    {priorityOption?.label || 'Medium'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={task.status || 'pending'} size="sm" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                    <span className="sr-only">Open menu</span>
                                    <FaEllipsisV className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <FaRegFileAlt className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <FaComments className="mr-2 h-4 w-4" />
                                    Add Comment
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <FaPaperclip className="mr-2 h-4 w-4" />
                                    Attach File
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={() => onStatusChange(task._id, task.status === 'completed' ? 'in-progress' : 'completed')}
                                            className="cursor-pointer"
                                        >
                                            {task.status === 'completed' ? (
                                                <>
                                                    <FaClock className="mr-2 h-4 w-4" />
                                                    Mark as In Progress
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle className="mr-2 h-4 w-4" />
                                                    Mark as Completed
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <FaCalendarAlt className="h-4 w-4" />
                            <span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <FaClock className="h-4 w-4" />
                            <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                        </div>
                    </div>
                </div>
                {task.progress !== undefined && (
                    <div className="my-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Progress</span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const SkillCard = ({ skill, level }) => {
    const skillOption = SKILL_LEVEL_OPTIONS.find(option => option.value === level);
    return (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-slate-900 dark:text-white">{skill}</h4>
                <Badge className={`px-2 py-1 text-xs font-medium ${skillOption?.color || 'bg-slate-500'} shadow-sm`}>
                    {skillOption?.label || 'Unknown'}
                </Badge>
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Proficiency</span>
                    <span className={`text-xs font-medium ${skillOption?.textColor || 'text-slate-600'}`}>{skillOption?.label || 'Unknown'}</span>
                </div>
                <Progress value={skillOption?.progress || 0} className="h-2" />
            </div>
        </div>
    );
};

const InfoField = ({ label, value, icon, isEditing = false, editValue = '', onChange = () => {}, type = 'text' }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
        <div className="flex items-center">
            <div className="mr-4 text-slate-400">
                {icon}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </div>
        {isEditing ? (
            type === 'textarea' ? (
                <Textarea
                    value={editValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="ml-4 max-w-xs"
                    rows={2}
                />
            ) : (
                <Input
                    value={editValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="ml-4 max-w-xs"
                />
            )
        ) : (
            <span className="text-sm text-slate-900 dark:text-white">{value || 'Not provided'}</span>
        )}
    </div>
);

// Main Component
export default function WorkerDetails() {
    const [worker, setWorker] = useState(null);
    const [assignedWork, setAssignedWork] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [editForm, setEditForm] = useState({});
    const reportRef = useRef(null);
    const router = useRouter();
    const params = useParams();
    const workerId = params.id;

    // Add state for category filtering
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState([]);

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Handle category click
    const handleCategoryClick = (categoryValue) => {
        if (selectedCategory === categoryValue) {
            // If clicking the same category, clear the filter
            setSelectedCategory(null);
            setFilteredTasks([]);
        } else {
            // Filter tasks by the selected category
            setSelectedCategory(categoryValue);
            const tasksInCategory = assignedWork.filter(w => w.category === categoryValue);
            setFilteredTasks(tasksInCategory);
        }
    };

    // Fetch worker and assigned work from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [workerResponse, workResponse] = await Promise.all([
                    fetch(`/api/workers/${workerId}`),
                    fetch('/api/work')
                ]);

                if (!workerResponse.ok) throw new Error('Failed to fetch worker');
                if (!workResponse.ok) throw new Error('Failed to fetch work tasks');

                const workerData = await workerResponse.json();
                const workData = await workResponse.json();

                setWorker(workerData.data);
                setEditForm(workerData.data);

                // Filter work assigned to this worker
                const workerAssignedWork = workData.filter(work => work.assignedTo === workerId);
                setAssignedWork(workerAssignedWork);

                // Check if current user is admin
                const userRole = localStorage.getItem('userRole') || 'user';
                setIsAdmin(userRole === 'admin');
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (workerId) {
            fetchData();
        }
    }, [workerId]);

    // Handle form field changes
    const handleFormChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        if (!isAdmin) {
            showNotification('Only administrators can edit worker details.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/workers/${workerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update worker');
            }

            setWorker(editForm);
            setIsEditing(false);
            showNotification('Worker details updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating worker:", error);
            showNotification(error.message || 'Failed to update worker.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle status change
    const handleStatusChange = async (newStatus) => {
        if (!isAdmin) {
            showNotification('Only administrators can change worker status.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/workers/${workerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update worker status');
            }

            // Update worker in state
            setWorker(prev => ({ ...prev, status: newStatus }));
            setEditForm(prev => ({ ...prev, status: newStatus }));

            showNotification(`Worker status updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error("Error updating status:", error);
            showNotification(error.message || 'Failed to update status.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle work status change
    const handleWorkStatusChange = async (workId, newStatus) => {
        if (!isAdmin) {
            showNotification('Only administrators can change work status.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/work/${workId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update work status');
            }

            // Update work in state
            setAssignedWork(prev =>
                prev.map(work =>
                    work._id === workId ? { ...work, status: newStatus } : work
                )
            );

            // Update filtered tasks if a category is selected
            if (selectedCategory) {
                setFilteredTasks(prev =>
                    prev.map(work =>
                        work._id === workId ? { ...work, status: newStatus } : work
                    )
                );
            }

            showNotification(`Work status updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error("Error updating work status:", error);
            showNotification(error.message || 'Failed to update work status.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate and download PDF report using jsPDF directly
    const generatePDFReport = () => {
        setIsGeneratingPDF(true);

        try {
            showNotification('Generating PDF report...', 'info');

            // Create a new PDF document
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Set font sizes
            const titleFontSize = 18;
            const headerFontSize = 14;
            const normalFontSize = 12;
            const smallFontSize = 10;

            // Set colors (using RGB values instead of CSS color names)
            const primaryColor = [59, 130, 246]; // Blue
            const textColor = [31, 41, 55]; // Dark gray

            // Add title
            pdf.setFontSize(titleFontSize);
            pdf.setTextColor(...primaryColor);
            pdf.text('Worker Report', 20, 20);

            // Add worker name
            pdf.setFontSize(headerFontSize);
            pdf.setTextColor(...textColor);
            pdf.text(`Name: ${worker.name || 'Unknown Worker'}`, 20, 30);

            // Add basic information
            pdf.setFontSize(headerFontSize);
            pdf.text('Basic Information', 20, 45);

            pdf.setFontSize(normalFontSize);
            pdf.text(`Email: ${worker.email || 'Not provided'}`, 20, 55);
            pdf.text(`Phone: ${worker.phone || 'Not provided'}`, 20, 65);
            pdf.text(`Job Title: ${JOB_TITLE_OPTIONS.find(opt => opt.value === worker.jobTitle)?.label || 'Other'}`, 20, 75);
            pdf.text(`Status: ${STATUS_OPTIONS.find(opt => opt.value === worker.status)?.label || 'Unknown'}`, 20, 85);
            pdf.text(`Joined Date: ${worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'Unknown'}`, 20, 95);

            // Add professional information
            pdf.setFontSize(headerFontSize);
            pdf.text('Professional Information', 20, 110);

            pdf.setFontSize(normalFontSize);
            pdf.text(`Skill Level: ${SKILL_LEVEL_OPTIONS.find(opt => opt.value === worker.skillLevel)?.label || 'Unknown'}`, 20, 120);
            pdf.text(`Skills: ${worker.skills || 'No skills specified'}`, 20, 130);
            pdf.text(`Experience: ${worker.experience || 'No experience specified'}`, 20, 140);

            // Add performance metrics
            const completedTasks = assignedWork.filter(w => w.status === 'completed').length;
            const inProgressTasks = assignedWork.filter(w => w.status === 'in-progress').length;
            const completionRate = assignedWork.length > 0 ? Math.round((completedTasks / assignedWork.length) * 100) : 0;
            const tasksThisMonth = assignedWork.filter(w => {
                if (!w.createdAt) return false;
                const workDate = new Date(w.createdAt);
                const now = new Date();
                return workDate.getMonth() === now.getMonth() && workDate.getFullYear() === now.getFullYear();
            }).length;

            pdf.setFontSize(headerFontSize);
            pdf.text('Performance Metrics', 20, 155);

            pdf.setFontSize(normalFontSize);
            pdf.text(`Total Tasks: ${assignedWork.length}`, 20, 165);
            pdf.text(`Completed: ${completedTasks}`, 20, 175);
            pdf.text(`In Progress: ${inProgressTasks}`, 20, 185);
            pdf.text(`Completion Rate: ${completionRate}%`, 20, 195);
            pdf.text(`Tasks This Month: ${tasksThisMonth}`, 20, 205);

            // Add work assignment table
            if (assignedWork.length > 0) {
                pdf.setFontSize(headerFontSize);
                pdf.text('Work Assignment', 20, 220);

                // Table headers
                pdf.setFontSize(smallFontSize);
                pdf.text('Title', 20, 235);
                pdf.text('Category', 70, 235);
                pdf.text('Priority', 110, 235);
                pdf.text('Status', 150, 235);
                pdf.text('Date', 180, 235);

                // Table rows
                let yPosition = 245;
                const maxRowsPerPage = 10;
                let rowsOnCurrentPage = 0;

                assignedWork.forEach((work, index) => {
                    // Check if we need a new page
                    if (rowsOnCurrentPage >= maxRowsPerPage) {
                        pdf.addPage();
                        yPosition = 20;
                        rowsOnCurrentPage = 0;

                        // Add headers to new page
                        pdf.setFontSize(headerFontSize);
                        pdf.text('Work Assignment (continued)', 20, yPosition);
                        yPosition += 15;

                        pdf.setFontSize(smallFontSize);
                        pdf.text('Title', 20, yPosition);
                        pdf.text('Category', 70, yPosition);
                        pdf.text('Priority', 110, yPosition);
                        pdf.text('Status', 150, yPosition);
                        pdf.text('Date', 180, yPosition);
                        yPosition += 10;
                    }

                    // Add row data
                    pdf.text(work.title || 'Untitled', 20, yPosition);
                    pdf.text(CATEGORY_OPTIONS.find(opt => opt.value === work.category)?.label || 'Other', 70, yPosition);
                    pdf.text(PRIORITY_OPTIONS.find(opt => opt.value === work.priority)?.label || 'Medium', 110, yPosition);
                    pdf.text(STATUS_OPTIONS.find(opt => opt.value === work.status)?.label || 'Unknown', 150, yPosition);
                    pdf.text(work.createdAt ? new Date(work.createdAt).toLocaleDateString() : 'Unknown', 180, yPosition);

                    yPosition += 10;
                    rowsOnCurrentPage++;
                });
            }

            // Add footer
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(smallFontSize);
                pdf.setTextColor(150, 150, 150);
                pdf.text(`Page ${i} of ${pageCount}`, pdf.internal.pageSize.width - 30, pdf.internal.pageSize.height - 10);
                pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pdf.internal.pageSize.height - 10);
            }

            // Save the PDF
            pdf.save(`${worker.name || 'worker'}_report.pdf`);

            showNotification('PDF report generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('Failed to generate PDF report. Please try again.', 'error');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="Loading worker details..." />;
    }

    if (!worker) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="text-center max-w-md p-8">
                    <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <FaUserTie className="h-12 w-12 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Worker Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        The worker you're looking for doesn't exist or has been removed.
                    </p>
                    <Button
                        onClick={() => router.push('/dashboard/worker-analytics')}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
                    >
                        <FaArrowLeft className="h-4 w-4 mr-2" />
                        Back to Analytics
                    </Button>
                </div>
            </div>
        );
    }

    // Calculate performance metrics
    const completedTasks = assignedWork.filter(w => w.status === 'completed').length;
    const inProgressTasks = assignedWork.filter(w => w.status === 'in-progress').length;
    const completionRate = assignedWork.length > 0 ? Math.round((completedTasks / assignedWork.length) * 100) : 0;
    const tasksThisMonth = assignedWork.filter(w => {
        if (!w.createdAt) return false;
        const workDate = new Date(w.createdAt);
        const now = new Date();
        return workDate.getMonth() === now.getMonth() && workDate.getFullYear() === now.getFullYear();
    }).length;

    // Get skill list
    const skillsList = worker.skills ? worker.skills.split(',').map(skill => skill.trim()) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse ${
                    notification.type === 'success' ? 'bg-emerald-500 text-white' : 
                    notification.type === 'error' ? 'bg-rose-500 text-white' : 
                    'bg-blue-500 text-white'
                }`}>
                    {notification.type === 'success' ? <FaCheckCircle className="text-xl" /> : 
                     notification.type === 'error' ? <FaExclamationCircle className="text-xl" /> : 
                     <FaSpinner className="text-xl animate-spin" />}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10">
                {/* Header */}
                <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center">
                                <Button
                                    onClick={() => router.push('/dashboard/worker-analytics')}
                                    variant="secondary"
                                    size="sm"
                                    className="mr-6 bg-white/20 hover:bg-white/30 text-white border-white/20 px-4 py-2"
                                >
                                    <FaArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                                <div className="flex items-center">
                                    <Avatar className="h-20 w-20 mr-6 border-4 border-white/30 shadow-lg">
                                        <AvatarImage src={worker.avatar} alt={worker.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
                                            {worker && worker.name ? worker.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">
                                            {worker.name || 'Unknown Worker'}
                                        </h1>
                                        <div className="flex items-center gap-3 mt-2">
                                            <JobTitleBadge title={worker.jobTitle || 'other'} />
                                            <StatusBadge status={worker.status || 'inactive'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button
                                    onClick={generatePDFReport}
                                    disabled={isGeneratingPDF}
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/20 px-4 py-2 cursor-pointer"
                                >
                                    {isGeneratingPDF ? (
                                        <>
                                            <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FaFilePdf className="h-4 w-4 mr-2" />
                                            Download PDF
                                        </>
                                    )}
                                </Button>
                                {isAdmin && (
                                    <Button
                                        onClick={() => setIsEditing(!isEditing)}
                                        disabled={isLoading}
                                        size="sm"
                                        className="bg-white/20 hover:bg-white/30 text-white border-white/20 px-4 py-2 cursor-pointer"
                                    >
                                        {isEditing ? <FaSave className="h-4 w-4 mr-2" /> : <FaEdit className="h-4 w-4 mr-2" />}
                                        {isEditing ? 'Save Changes' : 'Edit Worker'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Profile Card */}
                        <Card className="shadow-xl overflow-hidden border-0 rounded-2xl">
                            <CardContent className="p-0">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-lg">Worker Profile</h3>
                                        <Badge className="bg-white/20 text-white hover:bg-white/30">
                                            {worker.status || 'inactive'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col items-center mb-8">
                                        <Avatar className="h-28 w-28 mb-4 border-4 border-white shadow-lg">
                                            <AvatarImage src={worker.avatar} alt={worker.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-3xl">
                                                {worker && worker.name ? worker.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{worker.name || 'Unknown Worker'}</h2>
                                        <JobTitleBadge title={worker.jobTitle || 'other'} className="mt-3" />
                                    </div>
                                    <div className="space-y-5">
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaEnvelope className="h-5 w-5 mr-4 text-blue-500" />
                                            <span className="text-sm truncate">{worker.email || 'Not provided'}</span>
                                        </div>
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaPhone className="h-5 w-5 mr-4 text-green-500" />
                                            <span className="text-sm">{worker.phone || 'Not provided'}</span>
                                        </div>
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaCalendar className="h-5 w-5 mr-4 text-purple-500" />
                                            <span className="text-sm">Joined: {worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaMapMarkerAlt className="h-5 w-5 mr-4 text-red-500" />
                                            <span className="text-sm">{worker.location || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <div className="mt-8 py-6 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Change Status</span>
                                            </div>
                                            <Select value={worker.status || 'inactive'} onValueChange={handleStatusChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div className="flex items-center gap-2">
                                                                {option.icon}
                                                                {option.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="shadow-xl border-0 rounded-2xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center">
                                    <FaChartLine className="h-5 w-5 mr-3 text-blue-500" />
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tasks</span>
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">{assignedWork.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</span>
                                    <span className="font-bold text-lg text-emerald-600">{completedTasks}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</span>
                                    <span className="font-bold text-lg text-blue-600">{inProgressTasks}</span>
                                </div>
                                <div className="pt-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completion Rate</span>
                                        <span className="font-bold text-lg text-slate-900 dark:text-white">{completionRate}%</span>
                                    </div>
                                    <Progress value={completionRate} className="h-3" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card className="shadow-xl border-0 rounded-2xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center mt-4">
                                    <FaGlobe className="h-5 w-5 mr-3 text-blue-500" />
                                    Social Profiles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                                        <FaLinkedin className="h-5 w-5 mr-3 text-blue-700" />
                                        LinkedIn
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                                        <span className="sr-only">LinkedIn</span>
                                        <FaLinkedin className="h-5 w-5 text-blue-700" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                                        <FaTwitter className="h-5 w-5 mr-3 text-sky-500" />
                                        Twitter
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                                        <span className="sr-only">Twitter</span>
                                        <FaTwitter className="h-5 w-5 text-sky-500" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                                        <FaGlobe className="h-5 w-5 mr-3 text-slate-500" />
                                        Website
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                                        <span className="sr-only">Website</span>
                                        <FaGlobe className="h-5 w-5 text-slate-500" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-md">
                                <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer rounded-lg py-3">
                                    <FaUser className="h-4 w-4" />
                                    <span className="hidden sm:inline">Overview</span>
                                </TabsTrigger>
                                <TabsTrigger value="tasks" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer rounded-lg py-3">
                                    <FaTasks className="h-4 w-4" />
                                    <span className="hidden sm:inline">Tasks</span>
                                </TabsTrigger>
                                <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer rounded-lg py-3">
                                    <FaChartLine className="h-4 w-4" />
                                    <span className="hidden sm:inline">Performance</span>
                                </TabsTrigger>
                                <TabsTrigger value="skills" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer rounded-lg py-3">
                                    <FaAward className="h-4 w-4" />
                                    <span className="hidden sm:inline">Skills</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="mt-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Basic Information */}
                                    <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                            <CardTitle className="flex items-center py-4">
                                                <FaUser className="h-5 w-5 mr-3" />
                                                Basic Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {isEditing ? (
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                                                        <Input
                                                            value={editForm.name || ''}
                                                            onChange={(e) => handleFormChange('name', e.target.value)}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                                        <Input
                                                            value={editForm.email || ''}
                                                            onChange={(e) => handleFormChange('email', e.target.value)}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                                                        <Input
                                                            value={editForm.phone || ''}
                                                            onChange={(e) => handleFormChange('phone', e.target.value)}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                                                        <Input
                                                            value={editForm.location || ''}
                                                            onChange={(e) => handleFormChange('location', e.target.value)}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3 pt-4">
                                                        <Button onClick={handleSaveChanges} disabled={isLoading} size="sm" className="px-4 py-2">
                                                            <FaSave className="h-4 w-4 mr-2" />
                                                            Save
                                                        </Button>
                                                        <Button variant="outline" onClick={() => {
                                                            setIsEditing(false);
                                                            setEditForm(worker);
                                                        }} size="sm" className="px-4 py-2">
                                                            <FaTimes className="h-4 w-4 mr-2" />
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-0">
                                                    <InfoField
                                                        label="Name"
                                                        value={worker?.name}
                                                        icon={<FaUser className="h-4 w-4" />}
                                                    />
                                                    <InfoField
                                                        label="Email"
                                                        value={worker.email}
                                                        icon={<FaEnvelope className="h-4 w-4" />}
                                                    />
                                                    <InfoField
                                                        label="Phone"
                                                        value={worker.phone}
                                                        icon={<FaPhone className="h-4 w-4" />}
                                                    />
                                                    <InfoField
                                                        label="Location"
                                                        value={worker.location}
                                                        icon={<FaMapMarkerAlt className="h-4 w-4" />}
                                                    />
                                                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                                        <div className="flex items-center">
                                                            <div className="mr-4 text-slate-400">
                                                                <FaBriefcase className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Title</span>
                                                        </div>
                                                        <JobTitleBadge title={worker.jobTitle || 'other'} />
                                                    </div>
                                                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                                        <div className="flex items-center">
                                                            <div className="mr-4 text-slate-400">
                                                                <FaCheckCircle className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                                                        </div>
                                                        <StatusBadge status={worker.status || 'inactive'} />
                                                    </div>
                                                    <InfoField
                                                        label="Joined Date"
                                                        value={worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'Unknown'}
                                                        icon={<FaCalendar className="h-4 w-4" />}
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Professional Information */}
                                    <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                                        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                            <CardTitle className="flex items-center py-4">
                                                <FaBriefcase className="h-5 w-5 mr-3" />
                                                Professional Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {isEditing ? (
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skill Level</label>
                                                        <Select value={editForm.skillLevel || 'beginner'} onValueChange={(value) => handleFormChange('skillLevel', value)}>
                                                            <SelectTrigger className="mt-2">
                                                                <SelectValue placeholder="Select skill level" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {SKILL_LEVEL_OPTIONS.map(option => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills</label>
                                                        <Textarea
                                                            value={editForm.skills || ''}
                                                            onChange={(e) => handleFormChange('skills', e.target.value)}
                                                            className="mt-2"
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Experience</label>
                                                        <Textarea
                                                            value={editForm.experience || ''}
                                                            onChange={(e) => handleFormChange('experience', e.target.value)}
                                                            className="mt-2"
                                                            rows={4}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-5">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Skill Level</h4>
                                                        <SkillLevelBadge level={worker.skillLevel || 'beginner'} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Skills</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {skillsList.length > 0 ? (
                                                                skillsList.map((skill, index) => (
                                                                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                        {skill}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-slate-500 dark:text-slate-400">No skills specified</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Experience</h4>
                                                        <p className="text-sm text-slate-900 dark:text-white">
                                                            {worker.experience || 'No experience specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Additional Information */}
                                <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                                    <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                        <CardTitle className="flex items-center py-4">
                                            <FaCalendarAlt className="h-5 w-5 mr-3" />
                                            Additional Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Department</h4>
                                                <p className="text-sm text-slate-900 dark:text-white">
                                                    {worker.department || 'Not specified'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Manager</h4>
                                                <p className="text-sm text-slate-900 dark:text-white">
                                                    {worker.manager || 'Not specified'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Start Date</h4>
                                                <p className="text-sm text-slate-900 dark:text-white">
                                                    {worker.startDate ? new Date(worker.startDate).toLocaleDateString() : 'Not specified'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Employee ID</h4>
                                                <p className="text-sm text-slate-900 dark:text-white">
                                                    {worker.employeeId || 'Not specified'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Tasks Tab */}
                            <TabsContent value="tasks" className="mt-8">
                                <Card className="shadow-xl border-0 rounded-2xl">
                                    <CardHeader className="bg-gradient-to-r rounded-tr-2xl rounded-tl-2xl from-blue-500 to-blue-600 text-white">
                                        <div className="flex items-center justify-between py-4">
                                            <CardTitle className="flex items-center">
                                                <FaTasks className="h-5 w-5 mr-3" />
                                                Work Assignment
                                                <Badge className="ml-3 bg-white/20 text-white hover:bg-white/30">
                                                    {assignedWork.length} tasks
                                                </Badge>
                                            </CardTitle>
                                            <div className="flex items-center gap-3">
                                                {selectedCategory && (
                                                    <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                                                        <span>{CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.icon}</span>
                                                        <span className="ml-1 text-sm">
                                                            {CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.label}
                                                        </span>
                                                        <button 
                                                            className="ml-2 text-white/80 hover:text-white"
                                                            onClick={() => {
                                                                setSelectedCategory(null);
                                                                setFilteredTasks([]);
                                                            }}
                                                        >
                                                            <FaTimes className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                                                    <FaFilter className="h-4 w-4 mr-2" />
                                                    Filter
                                                </Button>
                                                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                                                    <FaSearch className="h-4 w-4 mr-2" />
                                                    Search
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {assignedWork.length > 0 ? (
                                            <div className="space-y-4">
                                                {(filteredTasks.length > 0 ? filteredTasks : assignedWork).map((work) => (
                                                    <TaskCard
                                                        key={work._id}
                                                        task={work}
                                                        onStatusChange={handleWorkStatusChange}
                                                        isAdmin={isAdmin}
                                                        onCategoryClick={handleCategoryClick}
                                                        selectedCategory={selectedCategory}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16">
                                                <div className="mx-auto h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                                                    <FaTasks className="h-10 w-10 text-slate-400" />
                                                </div>
                                                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-3">No assigned work</h3>
                                                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                                    This worker has not been assigned any tasks yet.
                                                </p>
                                                {isAdmin && (
                                                    <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                                                        <FaPlus className="h-4 w-4 mr-2" />
                                                        Assign Task
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Performance Tab */}
                            <TabsContent value="performance" className="mt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <MetricCard
                                        title="Total Tasks"
                                        value={assignedWork.length}
                                        icon={<FaTasks className="h-6 w-6 text-blue-500" />}
                                        color="bg-blue-100 dark:bg-blue-900/20"
                                        change={15}
                                        changeType="positive"
                                        description="All time tasks"
                                    />
                                    <MetricCard
                                        title="Completed"
                                        value={completedTasks}
                                        icon={<FaCheckCircle className="h-6 w-6 text-emerald-500" />}
                                        color="bg-emerald-100 dark:bg-emerald-900/20"
                                        change={8}
                                        changeType="positive"
                                        description="This month"
                                    />
                                    <MetricCard
                                        title="In Progress"
                                        value={inProgressTasks}
                                        icon={<FaClock className="h-6 w-6 text-amber-500" />}
                                        color="bg-amber-100 dark:bg-amber-900/20"
                                        change={-3}
                                        changeType="negative"
                                        description="Currently active"
                                    />
                                    <MetricCard
                                        title="Completion Rate"
                                        value={`${completionRate}%`}
                                        icon={<FaChartLine className="h-6 w-6 text-purple-500" />}
                                        color="bg-purple-100 dark:bg-purple-900/20"
                                        change={5}
                                        changeType="positive"
                                        description="Last 30 days"
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Performance Chart */}
                                    <Card className="shadow-xl border-0 rounded-2xl">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center">
                                                <FaChartBar className="h-5 w-5 mr-3 text-blue-500" />
                                                Performance Overview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-72 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl">
                                                <div className="text-center">
                                                    <FaChartBar className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                                                    <p className="text-slate-500 dark:text-slate-400">Performance chart would be displayed here</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Task Status Distribution */}
                                    <Card className="shadow-xl border-0 rounded-2xl">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center">
                                                <FaChartPie className="h-5 w-5 mr-3 text-purple-500" />
                                                Task Status Distribution
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-4 w-4 bg-emerald-500 rounded-full mr-3"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">Completed</span>
                                                    </div>
                                                    <span className="font-bold">{completedTasks}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-4 w-4 bg-blue-500 rounded-full mr-3"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">In Progress</span>
                                                    </div>
                                                    <span className="font-bold">{inProgressTasks}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-4 w-4 bg-amber-500 rounded-full mr-3"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">Pending</span>
                                                    </div>
                                                    <span className="font-bold">{assignedWork.filter(w => w.status === 'pending').length}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-4 w-4 bg-rose-500 rounded-full mr-3"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">Suspended</span>
                                                    </div>
                                                    <span className="font-bold">{assignedWork.filter(w => w.status === 'suspended').length}</span>
                                                </div>
                                            </div>
                                            <div className="mt-8">
                                                <div className="flex justify-center">
                                                    <div className="relative h-48 w-48">
                                                        <svg className="h-48 w-48 transform -rotate-90">
                                                            <circle
                                                                cx="96"
                                                                cy="96"
                                                                r="80"
                                                                stroke="currentColor"
                                                                strokeWidth="12"
                                                                fill="none"
                                                                className="text-slate-200 dark:text-slate-700"
                                                            />
                                                            <circle
                                                                cx="96"
                                                                cy="96"
                                                                r="80"
                                                                stroke="currentColor"
                                                                strokeWidth="12"
                                                                fill="none"
                                                                strokeDasharray={`${(completionRate / 100) * 502} 502`}
                                                                className="text-emerald-500"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-3xl font-bold">{completionRate}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">Completion Rate</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Skills Tab */}
                            <TabsContent value="skills" className="mt-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Skills Overview */}
                                    <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                                        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                            <CardTitle className="flex items-center py-4">
                                                <FaAward className="h-5 w-5 mr-3" />
                                                Skills & Expertise
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Skill Level</h4>
                                                    <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                                        <SkillLevelBadge level={worker.skillLevel || 'beginner'} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Experience</h4>
                                                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                                        <p className="text-slate-900 dark:text-white text-center">
                                                            {worker.experience || 'No experience specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Skills</h4>
                                                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                                        <div className="flex flex-wrap gap-3 justify-center">
                                                            {skillsList.length > 0 ? (
                                                                skillsList.map((skill, index) => (
                                                                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                                                                        {skill}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-slate-500 dark:text-slate-400">No skills specified</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Task Categories */}
                                    <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center py-4">
                                                    <FaProjectDiagram className="h-5 w-5 mr-3" />
                                                    Task Categories
                                                </CardTitle>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-white hover:bg-white/20"
                                                    onClick={() => {
                                                        setSelectedCategory(null);
                                                        setFilteredTasks([]);
                                                    }}
                                                >
                                                    Reset Filter
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                {CATEGORY_OPTIONS.map((category) => {
                                                    const count = assignedWork.filter(w => w.category === category.value).length;
                                                    const isSelected = selectedCategory === category.value;
                                                    const percentage = assignedWork.length > 0 ? Math.round((count / assignedWork.length) * 100) : 0;
                                                    
                                                    return (
                                                        <div 
                                                            key={category.value} 
                                                            className={`p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer border-2 ${
                                                                isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
                                                            }`}
                                                            onClick={() => handleCategoryClick(category.value)}
                                                        >
                                                            <div className="text-3xl mb-3">{category.icon}</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{category.label}</div>
                                                            <div className="text-xl font-bold text-blue-600 mt-2">{count}</div>
                                                            {assignedWork.length > 0 && (
                                                                <div className="mt-3">
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                                        <div 
                                                                            className={`h-2 rounded-full ${TASK_CATEGORIES_COLORS[category.value]}`}
                                                                            style={{ width: `${percentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{percentage}%</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            
                                            {selectedCategory && (
                                                <div className="mt-6">
                                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center">
                                                        {CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.icon}
                                                        <span className="ml-2">
                                                            {CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.label} Tasks
                                                        </span>
                                                        <Badge className="ml-2">
                                                            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </h3>
                                                    
                                                    {filteredTasks.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {filteredTasks.map((task) => (
                                                                <div key={task._id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                                    <div className="flex items-center justify-between">
                                                                        <div>
                                                                            <h4 className="font-medium text-slate-900 dark:text-white">{task.title}</h4>
                                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                                                {task.description || 'No description'}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge 
                                                                                className={`${PRIORITY_OPTIONS.find(p => p.value === task.priority)?.color || 'bg-gray-100 text-gray-800'}`}
                                                                            >
                                                                                {PRIORITY_OPTIONS.find(p => p.value === task.priority)?.label || 'Medium'}
                                                                            </Badge>
                                                                            <StatusBadge status={task.status || 'pending'} size="sm" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <p className="text-slate-500 dark:text-slate-400">No tasks found in this category.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Skills Progress */}
                                <Card className="shadow-xl border-0 rounded-2xl mt-8">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center">
                                            <FaChartBar className="h-5 w-5 mr-3 text-blue-500" />
                                            Skills Progress
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {skillsList.length > 0 ? (
                                                skillsList.map((skill, index) => (
                                                    <SkillCard
                                                        key={index}
                                                        skill={skill}
                                                        level={worker.skillLevel || 'beginner'}
                                                    />
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center py-12">
                                                    <div className="mx-auto h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                                                        <FaAward className="h-10 w-10 text-slate-400" />
                                                    </div>
                                                    <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-3">No skills specified</h3>
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        This worker hasn't specified any skills yet.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}