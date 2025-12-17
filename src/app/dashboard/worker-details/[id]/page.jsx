"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaBuilding, FaBriefcase,
    FaTasks, FaClock, FaArrowLeft, FaEdit, FaSave, FaTimes, FaSpinner,
    FaCheckCircle, FaExclamationCircle, FaUserTie, FaCode, FaServer, FaPalette,
    FaShieldAlt, FaChartLine, FaDownload, FaFilePdf, FaGraduationCap, FaAward,
    FaTrophy, FaStar, FaUserClock, FaChartPie, FaChartBar, FaProjectDiagram
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

// Constants
const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'bg-green-500' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-500' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'suspended', label: 'Suspended', color: 'bg-red-500' }
];

const JOB_TITLE_OPTIONS = [
    { value: 'full-stack-developer', label: 'Full Stack Developer', icon: '💻' },
    { value: 'devops-engineer', label: 'DevOps Engineer', icon: '🔧' },
    { value: 'graphics-designer', label: 'Graphics Designer', icon: '🎨' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer', icon: '🎨' },
    { value: 'backend-developer', label: 'Backend Developer', icon: '💻' },
    { value: 'frontend-developer', label: 'Frontend Developer', icon: '💻' },
    { value: 'mobile-developer', label: 'Mobile Developer', icon: '📱' },
    { value: 'qa-engineer', label: 'QA Engineer', icon: '🔍' },
    { value: 'data-scientist', label: 'Data Scientist', icon: '📊' },
    { value: 'product-manager', label: 'Product Manager', icon: '📋' },
    { value: 'other', label: 'Other', icon: '👤' }
];

const SKILL_LEVEL_OPTIONS = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-500' },
    { value: 'advanced', label: 'Advanced', color: 'bg-purple-500' },
    { value: 'expert', label: 'Expert', color: 'bg-red-500' }
];

const CATEGORY_OPTIONS = [
    { value: 'development', label: 'Development', icon: '💻' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'research', label: 'Research', icon: '🔍' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'testing', label: 'Testing', icon: '🧪' },
    { value: 'documentation', label: 'Documentation', icon: '📝' },
    { value: 'other', label: 'Other', icon: '📌' }
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

const JobTitleBadge = ({ title }) => {
    const jobOption = JOB_TITLE_OPTIONS.find(option => option.value === title);
    return (
        <Badge variant="outline" className="flex items-center gap-1">
            <span className="text-lg">{jobOption?.icon || '👤'}</span>
            <span className="ml-1">{jobOption?.label || 'Other'}</span>
        </Badge>
    );
};

const SkillLevelBadge = ({ level }) => {
    const skillOption = SKILL_LEVEL_OPTIONS.find(option => option.value === level);
    return (
        <Badge className={`px-2 py-1 text-xs font-medium text-white ${skillOption?.color || 'bg-gray-500'}`}>
            {skillOption?.label || 'Unknown'}
        </Badge>
    );
};

const LoadingSpinner = ({ message }) => (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="w-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-6 text-lg font-medium text-center">{message}</p>
        </div>
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
    const reportRef = useRef(null);
    const router = useRouter();
    const params = useParams();
    const workerId = params.id;

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
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

                setWorker(workerData);
                
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
            
            showNotification(`Worker status updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error("Error updating status:", error);
            showNotification(error.message || 'Failed to update status.', 'error');
        } finally {
            setIsLoading(false);
        }
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
                body: JSON.stringify(worker),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update worker');
            }

            setIsEditing(false);
            showNotification('Worker details updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating worker:", error);
            showNotification(error.message || 'Failed to update worker.', 'error');
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
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="w-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    <p className="mt-6 text-lg font-medium text-center">Loading worker details...</p>
                </div>
            </div>
        );
    }

    if (!worker) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="w-96 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold mb-2">Worker Not Found</h2>
                    <p className="text-gray-600 mb-6">The worker you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => router.push('/dashboard/worker-analytics')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                    >
                        <FaArrowLeft className="h-4 w-4 mr-2" />
                        Back to Analytics
                    </button>
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

    return (
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
                            <div className="flex items-center">
                                <button
                                    onClick={() => router.push('/dashboard/worker-analytics')}
                                    className="inline-flex items-center px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-all duration-200 mr-4"
                                >
                                    <FaArrowLeft className="h-4 w-4" />
                                    Back to Analytics
                                </button>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mr-3 shadow-lg">
                                        <FaUserTie className="h-6 w-6" />
                                    </div>
                                    {worker.name || 'Unknown Worker'}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={generatePDFReport}
                                    disabled={isGeneratingPDF}
                                    className="inline-flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-sm font-medium transition-all duration-200"
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
                                </button>
                                {isAdmin && (
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200"
                                    >
                                        {isEditing ? <FaSave className="h-4 w-4 mr-2" /> : <FaEdit className="h-4 w-4 mr-2" />}
                                        {isEditing ? 'Save Changes' : 'Edit Worker'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="mb-6 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
                                        {worker && worker.name ? worker.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{worker.name || 'Unknown Worker'}</h2>
                                    <JobTitleBadge title={worker.jobTitle || 'other'} className="mb-4" />
                                    <StatusBadge status={worker.status || 'inactive'} className="mb-4" />
                                    
                                    <div className="w-full space-y-3">
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaEnvelope className="h-4 w-4 mr-3 text-blue-500" />
                                            <span className="text-sm truncate">{worker.email || 'Not provided'}</span>
                                        </div>
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaPhone className="h-4 w-4 mr-3 text-green-500" />
                                            <span className="text-sm">{worker.phone || 'Not provided'}</span>
                                        </div>
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaCalendar className="h-4 w-4 mr-3 text-purple-500" />
                                            <span className="text-sm">Joined: {worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</span>
                                    <span className="font-bold text-lg">{assignedWork.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                                    <span className="font-bold text-lg text-green-600">{completedTasks}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">In Progress</span>
                                    <span className="font-bold text-lg text-blue-600">{inProgressTasks}</span>
                                </div>
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</span>
                                        <span className="font-bold text-lg">{completionRate}%</span>
                                    </div>
                                    <Progress value={completionRate} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-md">
                                <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                    <FaUser className="h-4 w-4" />
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="tasks" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                    <FaTasks className="h-4 w-4" />
                                    Tasks
                                </TabsTrigger>
                                <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                    <FaChartLine className="h-4 w-4" />
                                    Performance
                                </TabsTrigger>
                                <TabsTrigger value="skills" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                    <FaAward className="h-4 w-4" />
                                    Skills
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <Card className="shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                                <FaUser className="h-5 w-5 mr-2 text-blue-500" />
                                                Basic Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <span className="text-slate-900 dark:text-white">{worker.name || 'Not provided'}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <span className="text-slate-900 dark:text-white">{worker.email || 'Not provided'}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <span className="text-slate-900 dark:text-white">{worker.phone || 'Not provided'}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Title</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <JobTitleBadge title={worker.jobTitle || 'other'} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <StatusBadge status={worker.status || 'inactive'} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Joined Date</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <span className="text-slate-900 dark:text-white">{worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Professional Information */}
                                    <Card className="shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                                <FaBriefcase className="h-5 w-5 mr-2 text-purple-500" />
                                                Professional Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skill Level</label>
                                                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                    <SkillLevelBadge level={worker.skillLevel || 'beginner'} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills</label>
                                                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                    <div className="flex flex-wrap gap-2">
                                                        {worker.skills ? worker.skills.split(',').map((skill, index) => (
                                                            <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                                                                {skill.trim()}
                                                            </Badge>
                                                        )) : (
                                                            <span className="text-slate-500 dark:text-slate-400">No skills specified</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Experience</label>
                                                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                    <span className="text-slate-900 dark:text-white">
                                                        {worker.experience || 'No experience specified'}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Tasks Tab */}
                            <TabsContent value="tasks" className="mt-6">
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-white flex items-center justify-between">
                                            <div className="flex items-center">
                                                <FaTasks className="h-5 w-5 mr-2 text-blue-500" />
                                                Work Assignment
                                                <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{assignedWork.length} tasks</Badge>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {assignedWork.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                Title
                                                            </th>
                                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                Category
                                                            </th>
                                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                Priority
                                                            </th>
                                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                Date
                                                            </th>
                                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                                        {assignedWork.map((work) => (
                                                            <tr key={work._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{work.title || 'Untitled'}</div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <span className="text-lg">{CATEGORY_OPTIONS.find(opt => opt.value === work.category)?.icon || '📌'}</span>
                                                                        <span className="ml-2 text-sm text-slate-900 dark:text-white">{CATEGORY_OPTIONS.find(opt => opt.value === work.category)?.label || 'Other'}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <span className="text-lg">{PRIORITY_OPTIONS.find(opt => opt.value === work.priority)?.icon || '📊'}</span>
                                                                        <span className="ml-2 text-sm text-slate-900 dark:text-white">{PRIORITY_OPTIONS.find(opt => opt.value === work.priority)?.label || 'Medium'}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <StatusBadge status={work.status || 'pending'} />
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                                    {work.createdAt ? new Date(work.createdAt).toLocaleDateString() : 'Unknown'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <div className="flex items-center justify-end space-x-2">
                                                                        <button
                                                                            onClick={() => handleWorkStatusChange(work._id, work.status === 'completed' ? 'in-progress' : 'completed')}
                                                                            disabled={!isAdmin}
                                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        >
                                                                            {work.status === 'completed' ? (
                                                                                <>
                                                                                    <FaClock className="h-4 w-4 mr-1" />
                                                                                    Resume
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FaCheckCircle className="h-4 w-4 mr-1" />
                                                                                    Complete
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                                                    <FaTasks className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No assigned work</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    This worker has not been assigned any tasks yet.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Performance Tab */}
                            <TabsContent value="performance" className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Performance Metrics */}
                                    <Card className="shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                                <FaChartLine className="h-5 w-5 mr-2 text-green-500" />
                                                Performance Metrics
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Tasks</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{assignedWork.length}</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Completed</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">In Progress</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{completionRate}%</div>
                                                        <Progress value={completionRate} className="h-2 mt-2" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Time per Task</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                            {assignedWork.length > 0 ? '2.5 days' : 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tasks This Month</label>
                                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{tasksThisMonth}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Task Status Distribution */}
                                    <Card className="shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                                <FaChartPie className="h-5 w-5 mr-2 text-purple-500" />
                                                Task Status Distribution
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-4 w-4 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">Completed</span>
                                                    </div>
                                                    <span className="font-bold">{completedTasks}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-4 w-4 bg-blue-500 rounded-full mr-2"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">In Progress</span>
                                                    </div>
                                                    <span className="font-bold">{inProgressTasks}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-4 w-4 bg-yellow-500 rounded-full mr-2"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">Pending</span>
                                                    </div>
                                                    <span className="font-bold">{assignedWork.filter(w => w.status === 'pending').length}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">Suspended</span>
                                                    </div>
                                                    <span className="font-bold">{assignedWork.filter(w => w.status === 'suspended').length}</span>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <div className="flex justify-center">
                                                    <div className="relative h-40 w-40">
                                                        <svg className="h-40 w-40 transform -rotate-90">
                                                            <circle
                                                                cx="80"
                                                                cy="80"
                                                                r="70"
                                                                stroke="currentColor"
                                                                strokeWidth="12"
                                                                fill="none"
                                                                className="text-slate-200 dark:text-slate-700"
                                                            />
                                                            <circle
                                                                cx="80"
                                                                cy="80"
                                                                r="70"
                                                                stroke="currentColor"
                                                                strokeWidth="12"
                                                                fill="none"
                                                                strokeDasharray={`${(completionRate / 100) * 440} 440`}
                                                                className="text-green-500"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-2xl font-bold">{completionRate}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">Completion Rate</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Skills Tab */}
                            <TabsContent value="skills" className="mt-6">
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-white flex items-center">
                                            <FaAward className="h-5 w-5 mr-2 text-purple-500" />
                                            Skills & Expertise
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Skill Level</h3>
                                                <div className="flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                    <SkillLevelBadge level={worker.skillLevel || 'beginner'} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Experience</h3>
                                                <div className="p-6 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                    <p className="text-slate-900 dark:text-white text-center">
                                                        {worker.experience || 'No experience specified'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Skills</h3>
                                            <div className="p-6 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                                <div className="flex flex-wrap gap-3 justify-center">
                                                    {worker.skills ? worker.skills.split(',').map((skill, index) => (
                                                        <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 text-sm">
                                                            {skill.trim()}
                                                        </Badge>
                                                    )) : (
                                                        <span className="text-slate-500 dark:text-slate-400">No skills specified</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Task Categories</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {CATEGORY_OPTIONS.map((category) => {
                                                    const count = assignedWork.filter(w => w.category === category.value).length;
                                                    return (
                                                        <div key={category.value} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
                                                            <div className="text-2xl mb-2">{category.icon}</div>
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{category.label}</div>
                                                            <div className="text-lg font-bold text-blue-600">{count}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
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