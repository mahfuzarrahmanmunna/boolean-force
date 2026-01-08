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
    FaIndustry, FaTools, FaCogs, FaChartArea, FaUserFriends, FaMoneyBillWave,
    FaDollarSign, FaPercent, FaHourglassHalf, FaPlayCircle, FaPauseCircle,
    FaFlag, FaStickyNote, FaFileAlt, FaUserPlus, FaUserMinus, FaCalendarCheck,
    FaCalendarTimes, FaTasks as FaProjectTasks
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
    { value: 'completed', label: 'Completed', color: 'bg-emerald-500', icon: <FaCheckCircle />, textColor: 'text-emerald-600', bgLight: 'bg-emerald-50' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500', icon: <FaPlayCircle />, textColor: 'text-blue-600', bgLight: 'bg-blue-50' },
    { value: 'pending', label: 'Pending', color: 'bg-amber-500', icon: <FaClock />, textColor: 'text-amber-600', bgLight: 'bg-amber-50' },
    { value: 'archived', label: 'Archived', color: 'bg-slate-500', icon: <FaTimes />, textColor: 'text-slate-600', bgLight: 'bg-slate-50' }
];

const CATEGORY_OPTIONS = [
    { value: 'development', label: 'Development', icon: '💻', color: 'bg-blue-100 text-blue-800', darkColor: 'dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'design', label: 'Design', icon: '🎨', color: 'bg-purple-100 text-purple-800', darkColor: 'dark:bg-purple-900/30 dark:text-purple-300' },
    { value: 'marketing', label: 'Marketing', icon: '📢', color: 'bg-pink-100 text-pink-800', darkColor: 'dark:bg-pink-900/30 dark:text-pink-300' },
    { value: 'research', label: 'Research', icon: '🔍', color: 'bg-indigo-100 text-indigo-800', darkColor: 'dark:bg-indigo-900/30 dark:text-indigo-300' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-green-100 text-green-800', darkColor: 'dark:bg-green-900/30 dark:text-green-300' },
    { value: 'mobile-app', label: 'Mobile App', icon: '📱', color: 'bg-cyan-100 text-cyan-800', darkColor: 'dark:bg-cyan-900/30 dark:text-cyan-300' },
    { value: 'other', label: 'Other', icon: '📌', color: 'bg-gray-100 text-gray-800', darkColor: 'dark:bg-gray-900/30 dark:text-gray-300' }
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'bg-emerald-100 text-emerald-800', darkColor: 'dark:bg-emerald-900/30 dark:text-emerald-300', icon: '🟢' },
    { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-800', darkColor: 'dark:bg-amber-900/30 dark:text-amber-300', icon: '🟡' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-900/30 dark:text-orange-300', icon: '🟠' },
    { value: 'urgent', label: 'Urgent', color: 'bg-rose-100 text-rose-800', darkColor: 'dark:bg-rose-900/30 dark:text-rose-300', icon: '🔴' }
];

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

const CategoryBadge = ({ category, size = "default" }) => {
    const categoryOption = CATEGORY_OPTIONS.find(option => option.value === category);
    const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs";
    
    return (
        <Badge className={`${sizeClasses} ${categoryOption?.color || 'bg-gray-100 text-gray-800'} flex items-center gap-1 shadow-sm`}>
            <span>{categoryOption?.icon || '📌'}</span>
            {categoryOption?.label || 'Other'}
        </Badge>
    );
};

const PriorityBadge = ({ priority, size = "default" }) => {
    const priorityOption = PRIORITY_OPTIONS.find(option => option.value === priority);
    const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs";
    
    return (
        <Badge className={`${sizeClasses} ${priorityOption?.color || 'bg-gray-100 text-gray-800'} flex items-center gap-1 shadow-sm`}>
            <span>{priorityOption?.icon || '🟡'}</span>
            {priorityOption?.label || 'Medium'}
        </Badge>
    );
};

const LoadingSpinner = ({ message }) => (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <FaProjectTasks className="h-8 w-8 text-blue-500 opacity-50" />
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

const TeamMemberCard = ({ member, onRemove, isAdmin }) => {
    return (
        <Card className="mb-4 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 rounded-xl">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">{member.name}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{member.email}</p>
                            <div className="flex items-center mt-1">
                                <Badge variant="outline" className="text-xs mr-2">
                                    {member.jobTitle || 'Team Member'}
                                </Badge>
                                {member.isAssigned && (
                                    <Badge className="text-xs bg-blue-100 text-blue-800">
                                        Assigned
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                <FaEnvelope className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 rounded-full text-rose-500 hover:text-rose-700"
                                onClick={() => onRemove && onRemove(member._id)}
                            >
                                <FaUserMinus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
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
export default function ProjectDetails() {
    const [project, setProject] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
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
    const projectId = params.id;

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Fetch project and team members from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [projectResponse, workersResponse] = await Promise.all([
                    fetch(`/api/projects/${projectId}`),
                    fetch('/api/workers')
                ]);

                if (!projectResponse.ok) throw new Error('Failed to fetch project');
                if (!workersResponse.ok) throw new Error('Failed to fetch workers');

                const projectData = await projectResponse.json();
                const workersData = await workersResponse.json();

                setProject(projectData.data);
                setEditForm(projectData.data);

                // Filter team members assigned to this project
                if (projectData.data.assignedTo) {
                    const assignedWorkers = Array.isArray(projectData.data.assignedTo) 
                        ? workersData.filter(worker => projectData.data.assignedTo.includes(worker._id))
                        : workersData.filter(worker => worker._id === projectData.data.assignedTo);
                    
                    setTeamMembers(assignedWorkers);
                }

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

        if (projectId) {
            fetchData();
        }
    }, [projectId]);

    // Handle form field changes
    const handleFormChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        if (!isAdmin) {
            showNotification('Only administrators can edit project details.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update project');
            }

            setProject(editForm);
            setIsEditing(false);
            showNotification('Project details updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating project:", error);
            showNotification(error.message || 'Failed to update project.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle status change
    const handleStatusChange = async (newStatus) => {
        if (!isAdmin) {
            showNotification('Only administrators can change project status.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update project status');
            }

            // Update project in state
            setProject(prev => ({ ...prev, status: newStatus }));
            setEditForm(prev => ({ ...prev, status: newStatus }));

            showNotification(`Project status updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error("Error updating status:", error);
            showNotification(error.message || 'Failed to update status.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle progress change
    const handleProgressChange = async (newProgress) => {
        if (!isAdmin) {
            showNotification('Only administrators can change project progress.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: newProgress }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update project progress');
            }

            // Update project in state
            setProject(prev => ({ ...prev, progress: newProgress }));
            setEditForm(prev => ({ ...prev, progress: newProgress }));

            showNotification(`Project progress updated to ${newProgress}%`, 'success');
        } catch (error) {
            console.error("Error updating progress:", error);
            showNotification(error.message || 'Failed to update progress.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle team member removal
    const handleRemoveTeamMember = async (memberId) => {
        if (!isAdmin) {
            showNotification('Only administrators can remove team members.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // Update assignedTo field to remove this member
            const updatedAssignedTo = Array.isArray(project.assignedTo) 
                ? project.assignedTo.filter(id => id !== memberId)
                : (project.assignedTo === memberId ? null : project.assignedTo);

            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignedTo: updatedAssignedTo }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to remove team member');
            }

            // Update project in state
            setProject(prev => ({ ...prev, assignedTo: updatedAssignedTo }));
            setEditForm(prev => ({ ...prev, assignedTo: updatedAssignedTo }));

            // Remove from team members list
            setTeamMembers(prev => prev.filter(member => member._id !== memberId));

            showNotification('Team member removed successfully!', 'success');
        } catch (error) {
            console.error("Error removing team member:", error);
            showNotification(error.message || 'Failed to remove team member.', 'error');
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
            pdf.text('Project Report', 20, 20);

            // Add project name
            pdf.setFontSize(headerFontSize);
            pdf.setTextColor(...textColor);
            pdf.text(`Title: ${project.title || 'Unknown Project'}`, 20, 30);

            // Add basic information
            pdf.setFontSize(headerFontSize);
            pdf.text('Basic Information', 20, 45);

            pdf.setFontSize(normalFontSize);
            pdf.text(`Description: ${project.description || 'No description provided'}`, 20, 55);
            pdf.text(`Category: ${CATEGORY_OPTIONS.find(opt => opt.value === project.category)?.label || 'Other'}`, 20, 65);
            pdf.text(`Priority: ${PRIORITY_OPTIONS.find(opt => opt.value === project.priority)?.label || 'Medium'}`, 20, 75);
            pdf.text(`Status: ${STATUS_OPTIONS.find(opt => opt.value === project.status)?.label || 'Unknown'}`, 20, 85);
            pdf.text(`Progress: ${project.progress || 0}%`, 20, 95);
            pdf.text(`Created Date: ${project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}`, 20, 105);
            pdf.text(`Due Date: ${project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not specified'}`, 20, 115);

            // Add budget information
            pdf.setFontSize(headerFontSize);
            pdf.text('Budget Information', 20, 130);

            pdf.setFontSize(normalFontSize);
            pdf.text(`Total Budget: $${(project.budget || 0).toLocaleString()}`, 20, 140);

            // Add team information
            pdf.setFontSize(headerFontSize);
            pdf.text('Team Information', 20, 155);

            pdf.setFontSize(normalFontSize);
            pdf.text(`Team Size: ${teamMembers.length} members`, 20, 165);

            if (teamMembers.length > 0) {
                let yPosition = 175;
                teamMembers.forEach((member, index) => {
                    pdf.text(`${index + 1}. ${member.name} - ${member.jobTitle || 'Team Member'}`, 20, yPosition);
                    yPosition += 10;
                });
            }

            // Add notes
            if (project.notes) {
                pdf.setFontSize(headerFontSize);
                pdf.text('Notes', 20, 210);

                pdf.setFontSize(normalFontSize);
                const splitNotes = pdf.splitTextToSize(project.notes, 170);
                pdf.text(splitNotes, 20, 220);
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

            // Save PDF
            pdf.save(`${project.title || 'project'}_report.pdf`);

            showNotification('PDF report generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('Failed to generate PDF report. Please try again.', 'error');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="Loading project details..." />;
    }

    if (!project) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="text-center max-w-md p-8">
                    <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <FaProjectTasks className="h-12 w-12 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Project Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        The project you're looking for doesn't exist or has been removed.
                    </p>
                    <Button
                        onClick={() => router.push('/dashboard/project-analytics')}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
                    >
                        <FaArrowLeft className="h-4 w-4 mr-2" />
                        Back to Analytics
                    </Button>
                </div>
            </div>
        );
    }

    // Calculate days remaining
    const daysRemaining = project.dueDate ? 
        Math.ceil((new Date(project.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 
        null;

    // Get category and priority options
    const categoryOption = CATEGORY_OPTIONS.find(opt => opt.value === project.category);
    const priorityOption = PRIORITY_OPTIONS.find(opt => opt.value === project.priority);
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === project.status);

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
                                    onClick={() => router.push('/dashboard/project-analytics')}
                                    variant="secondary"
                                    size="sm"
                                    className="mr-6 cursor-pointer bg-white/20 hover:bg-white/30 text-white border-white/20 px-4 py-2"
                                >
                                    <FaArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                                <div className="flex items-center">
                                    <div className="p-3 rounded-xl bg-white/20 text-white mr-6 shadow-lg">
                                        <span className="text-3xl">{categoryOption?.icon || '📌'}</span>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">
                                            {project.title || 'Untitled Project'}
                                        </h1>
                                        <div className="flex items-center gap-3 mt-2">
                                            <CategoryBadge category={project.category || 'other'} />
                                            <StatusBadge status={project.status || 'pending'} />
                                            <PriorityBadge priority={project.priority || 'medium'} />
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
                                        {isEditing ? 'Save Changes' : 'Edit Project'}
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
                        {/* Project Card */}
                        <Card className="shadow-xl overflow-hidden border-0 rounded-2xl">
                            <CardContent className="p-0">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-lg">Project Details</h3>
                                        <Badge className="bg-white/20 text-white hover:bg-white/30">
                                            {project.status || 'pending'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-lg mb-4">
                                            <span className="text-4xl">{categoryOption?.icon || '📌'}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{project.title || 'Untitled Project'}</h2>
                                        <CategoryBadge category={project.category || 'other'} className="mt-3" />
                                    </div>
                                    <div className="space-y-5">
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaCalendarAlt className="h-5 w-5 mr-4 text-blue-500" />
                                            <span className="text-sm">Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaCalendarCheck className="h-5 w-5 mr-4 text-green-500" />
                                            <span className="text-sm">Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not specified'}</span>
                                        </div>
                                        {daysRemaining !== null && (
                                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                                <FaHourglassHalf className="h-5 w-5 mr-4 text-amber-500" />
                                                <span className="text-sm">
                                                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Overdue'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                                            <FaDollarSign className="h-5 w-5 mr-4 text-emerald-500" />
                                            <span className="text-sm">Budget: ${(project.budget || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <div className="mt-8 py-6 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Change Status</span>
                                            </div>
                                            <Select value={project.status || 'pending'} onValueChange={handleStatusChange}>
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

                        {/* Progress Card */}
                        <Card className="shadow-xl border-0 rounded-2xl">
                            <CardHeader className="py-4">
                                <CardTitle className="text-lg flex items-center">
                                    <FaChartLine className="h-5 w-5 mr-3 text-blue-500" />
                                    Project Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 pb-24">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Progress</span>
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">{project.progress || 0}%</span>
                                </div>
                                <Progress value={project.progress || 0} className="h-3" />
                                {isAdmin && (
                                    <div className="flex gap-2 mt-4">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => handleProgressChange(Math.max(0, (project.progress || 0) - 10))}
                                        >
                                            <FaPauseCircle className="h-4 w-4 mr-2" />
                                            -10%
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => handleProgressChange(Math.min(100, (project.progress || 0) + 10))}
                                        >
                                            <FaPlayCircle className="h-4 w-4 mr-2" />
                                            +10%
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Team Size */}
                        <Card className="shadow-xl border-0 rounded-2xl">
                            <CardHeader className="py-4">
                                <CardTitle className="text-lg flex items-center">
                                    <FaUsers className="h-5 w-5 mr-3 text-blue-500" />
                                    Team Size
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Members</span>
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">{teamMembers.length}</span>
                                </div>
                                {isAdmin && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full mb-4"
                                        onClick={() => router.push(`/dashboard/assign-team/${projectId}`)}
                                    >
                                        <FaUserPlus className="h-4 w-4 mr-2" />
                                        Assign Team
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-md">
                                <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer rounded-lg py-3">
                                    <FaProjectTasks className="h-4 w-4" />
                                    <span className="hidden sm:inline">Overview</span>
                                </TabsTrigger>
                                <TabsTrigger value="team" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer rounded-lg py-3">
                                    <FaUsers className="h-4 w-4" />
                                    <span className="hidden sm:inline">Team</span>
                                </TabsTrigger>
                                <TabsTrigger value="timeline" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer rounded-lg py-3">
                                    <FaHistory className="h-4 w-4" />
                                    <span className="hidden sm:inline">Timeline</span>
                                </TabsTrigger>
                                <TabsTrigger value="budget" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white cursor-pointer rounded-lg py-3">
                                    <FaMoneyBillWave className="h-4 w-4" />
                                    <span className="hidden sm:inline">Budget</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="mt-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Basic Information */}
                                    <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                            <CardTitle className="flex items-center py-4">
                                                <FaProjectTasks className="h-5 w-5 mr-3" />
                                                Basic Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {isEditing ? (
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                                                        <Input
                                                            value={editForm.title || ''}
                                                            onChange={(e) => handleFormChange('title', e.target.value)}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                                                        <Textarea
                                                            value={editForm.description || ''}
                                                            onChange={(e) => handleFormChange('description', e.target.value)}
                                                            className="mt-2"
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                                                        <Select value={editForm.category || 'other'} onValueChange={(value) => handleFormChange('category', value)}>
                                                            <SelectTrigger className="mt-2">
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {CATEGORY_OPTIONS.map(option => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        <div className="flex items-center gap-2">
                                                                            <span>{option.icon}</span>
                                                                            {option.label}
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                                                        <Select value={editForm.priority || 'medium'} onValueChange={(value) => handleFormChange('priority', value)}>
                                                            <SelectTrigger className="mt-2">
                                                                <SelectValue placeholder="Select priority" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {PRIORITY_OPTIONS.map(option => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        <div className="flex items-center gap-2">
                                                                            <span>{option.icon}</span>
                                                                            {option.label}
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex items-center gap-3 pt-4">
                                                        <Button onClick={handleSaveChanges} disabled={isLoading} size="sm" className="px-4 py-2">
                                                            <FaSave className="h-4 w-4 mr-2" />
                                                            Save
                                                        </Button>
                                                        <Button variant="outline" onClick={() => {
                                                            setIsEditing(false);
                                                            setEditForm(project);
                                                        }} size="sm" className="px-4 py-2">
                                                            <FaTimes className="h-4 w-4 mr-2" />
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-0">
                                                    <InfoField
                                                        label="Title"
                                                        value={project?.title}
                                                        icon={<FaProjectTasks className="h-4 w-4" />}
                                                    />
                                                    <InfoField
                                                        label="Description"
                                                        value={project.description}
                                                        icon={<FaStickyNote className="h-4 w-4" />}
                                                        type="textarea"
                                                    />
                                                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                                        <div className="flex items-center">
                                                            <div className="mr-4 text-slate-400">
                                                                <FaTag className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</span>
                                                        </div>
                                                        <CategoryBadge category={project.category || 'other'} />
                                                    </div>
                                                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                                        <div className="flex items-center">
                                                            <div className="mr-4 text-slate-400">
                                                                <FaFlag className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</span>
                                                        </div>
                                                        <PriorityBadge priority={project.priority || 'medium'} />
                                                    </div>
                                                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                                        <div className="flex items-center">
                                                            <div className="mr-4 text-slate-400">
                                                                <FaCheckCircle className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                                                        </div>
                                                        <StatusBadge status={project.status || 'pending'} />
                                                    </div>
                                                    <InfoField
                                                        label="Created Date"
                                                        value={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                                                        icon={<FaCalendar className="h-4 w-4" />}
                                                    />
                                                    <InfoField
                                                        label="Due Date"
                                                        value={project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not specified'}
                                                        icon={<FaCalendarCheck className="h-4 w-4" />}
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Additional Information */}
                                    <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                                        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                            <CardTitle className="flex items-center py-4">
                                                <FaFileAlt className="h-5 w-5 mr-3" />
                                                Additional Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-5">
                                                <InfoField
                                                    label="Client ID"
                                                    value={project.clientId || 'Not specified'}
                                                    icon={<FaBuilding className="h-4 w-4" />}
                                                />
                                                <InfoField
                                                    label="Start Date"
                                                    value={project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not specified'}
                                                    icon={<FaCalendarAlt className="h-4 w-4" />}
                                                />
                                                <InfoField
                                                    label="End Date"
                                                    value={project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not specified'}
                                                    icon={<FaCalendarTimes className="h-4 w-4" />}
                                                />
                                                <InfoField
                                                    label="Story Point"
                                                    value={project.estimatedHours || 'Not specified'}
                                                    icon={<FaStopwatch className="h-4 w-4" />}
                                                />
                                                <InfoField
                                                    label="Notes"
                                                    value={project.notes || 'No notes'}
                                                    icon={<FaStickyNote className="h-4 w-4" />}
                                                    type="textarea"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Budget Overview */}
                                <Card className="shadow-xl border-0 rounded-2xl">
                                    <CardHeader className="bg-gradient-to-r rounded-tl-2xl rounded-tr-2xl from-green-500 to-green-600 text-white">
                                        <CardTitle className="flex items-center py-4">
                                            <FaMoneyBillWave className="h-5 w-5 mr-3" />
                                            Budget Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Budget</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">${(project.budget || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                                <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                            <div className="pt-4">
                                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Budget Allocation</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">Personnel</span>
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white">${((project.budget || 0) * 0.6).toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">Resources</span>
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white">${((project.budget || 0) * 0.25).toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">Contingency</span>
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white">${((project.budget || 0) * 0.15).toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Team Tab */}
                            <TabsContent value="team" className="mt-8">
                                <Card className="shadow-xl border-0 rounded-2xl">
                                    <CardHeader className="bg-gradient-to-r rounded-tr-2xl rounded-tl-2xl from-blue-500 to-blue-600 text-white">
                                        <div className="flex items-center justify-between py-4">
                                            <CardTitle className="flex items-center">
                                                <FaUsers className="h-5 w-5 mr-3" />
                                                Team Members
                                                <Badge className="ml-3 bg-white/20 text-white hover:bg-white/30">
                                                    {teamMembers.length} members
                                                </Badge>
                                            </CardTitle>
                                            {isAdmin && (
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className="bg-white/20 hover:bg-white/30 text-white"
                                                    onClick={() => router.push(`/dashboard/assign-team/${projectId}`)}
                                                >
                                                    <FaUserPlus className="h-4 w-4 mr-2" />
                                                    Add Member
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {teamMembers.length > 0 ? (
                                            <div className="space-y-4">
                                                {teamMembers.map((member) => (
                                                    <TeamMemberCard
                                                        key={member._id}
                                                        member={member}
                                                        onRemove={handleRemoveTeamMember}
                                                        isAdmin={isAdmin}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16">
                                                <div className="mx-auto h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                                                    <FaUsers className="h-10 w-10 text-slate-400" />
                                                </div>
                                                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-3">No team members</h3>
                                                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                                    This project doesn't have any team members assigned yet.
                                                </p>
                                                {isAdmin && (
                                                    <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                                                        <FaUserPlus className="h-4 w-4 mr-2" />
                                                        Assign Team Members
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Timeline Tab */}
                            <TabsContent value="timeline" className="mt-8">
                                <Card className="shadow-xl border-0 rounded-2xl">
                                    <CardHeader className="bg-gradient-to-r rounded-tl-2xl rounded-tr-2xl from-indigo-500 to-indigo-600 text-white">
                                        <CardTitle className="flex items-center py-4">
                                            <FaHistory className="h-5 w-5 mr-3" />
                                            Project Timeline
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-8">
                                            {/* Created */}
                                            <div className="flex">
                                                <div className="flex flex-col items-center mr-4">
                                                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                        <FaCalendarAlt className="h-5 w-5" />
                                                    </div>
                                                    <div className="w-0.5 h-full bg-slate-300 dark:bg-slate-700"></div>
                                                </div>
                                                <div className="pb-8">
                                                    <h4 className="font-medium text-slate-900 dark:text-white">Project Created</h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown date'}
                                                    </p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                                        Project was created and added to the system.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Started */}
                                            {project.startDate && (
                                                <div className="flex">
                                                    <div className="flex flex-col items-center mr-4">
                                                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                                            <FaPlayCircle className="h-5 w-5" />
                                                        </div>
                                                        <div className="w-0.5 h-full bg-slate-300 dark:bg-slate-700"></div>
                                                    </div>
                                                    <div className="pb-8">
                                                        <h4 className="font-medium text-slate-900 dark:text-white">Project Started</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {new Date(project.startDate).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                                            Project work officially began.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Current Status */}
                                            <div className="flex">
                                                <div className="flex flex-col items-center mr-4">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${
                                                        project.status === 'completed' ? 'bg-emerald-500' : 
                                                        project.status === 'in-progress' ? 'bg-blue-500' : 
                                                        project.status === 'pending' ? 'bg-amber-500' : 'bg-slate-500'
                                                    }`}>
                                                        {project.status === 'completed' ? <FaCheckCircle className="h-5 w-5" /> : 
                                                         project.status === 'in-progress' ? <FaPlayCircle className="h-5 w-5" /> : 
                                                         project.status === 'pending' ? <FaClock className="h-5 w-5" /> : 
                                                         <FaTimes className="h-5 w-5" />}
                                                    </div>
                                                    <div className="w-0.5 h-full bg-slate-300 dark:bg-slate-700"></div>
                                                </div>
                                                <div className="pb-8">
                                                    <h4 className="font-medium text-slate-900 dark:text-white">
                                                        Current Status: {statusOption?.label || 'Unknown'}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        Progress: {project.progress || 0}%
                                                    </p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                                        {project.status === 'completed' ? 'Project has been completed successfully.' : 
                                                         project.status === 'in-progress' ? 'Project is currently in progress.' : 
                                                         project.status === 'pending' ? 'Project is pending to start.' : 
                                                         'Project has been archived.'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Due Date */}
                                            {project.dueDate && (
                                                <div className="flex">
                                                    <div className="flex flex-col items-center mr-4">
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${
                                                            daysRemaining > 0 ? 'bg-amber-500' : 'bg-red-500'
                                                        }`}>
                                                            <FaCalendarCheck className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-slate-900 dark:text-white">Due Date</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {new Date(project.dueDate).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                                            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Project is overdue'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Completed */}
                                            {project.status === 'completed' && project.endDate && (
                                                <div className="flex">
                                                    <div className="flex flex-col items-center mr-4">
                                                        <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                                            <FaCheckCircle className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-slate-900 dark:text-white">Project Completed</h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {new Date(project.endDate).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                                            Project was completed successfully.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Budget Tab */}
                            <TabsContent value="budget" className="mt-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Budget Overview */}
                                    <Card className="shadow-xl border-0 rounded-2xl">
                                        <CardHeader className="bg-gradient-to-r rounded-tl-2xl rounded-tr-2xl from-green-500 to-green-600 text-white">
                                            <CardTitle className="flex items-center py-4">
                                                <FaMoneyBillWave className="h-5 w-5 mr-3" />
                                                Budget Overview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Budget</span>
                                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">${(project.budget || 0).toLocaleString()}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                                                </div>
                                                <div className="pt-4">
                                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Budget Allocation</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-600 dark:text-slate-400">Personnel</span>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">${((project.budget || 0) * 0.6).toLocaleString()}</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-600 dark:text-slate-400">Resources</span>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">${((project.budget || 0) * 0.25).toLocaleString()}</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-600 dark:text-slate-400">Contingency</span>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">${((project.budget || 0) * 0.15).toLocaleString()}</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Budget Utilization */}
                                    <Card className="shadow-xl border-0 rounded-2xl">
                                        <CardHeader className="bg-gradient-to-r rounded-tl-2xl rounded-tr-2xl from-indigo-500 to-indigo-600 text-white">
                                            <CardTitle className="flex items-center py-4">
                                                <FaPercent className="h-5 w-5 mr-3" />
                                                Budget Utilization
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Spent</span>
                                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                                        ${((project.budget || 0) * (project.progress || 0) / 100).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                                    <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Remaining</span>
                                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                                        ${((project.budget || 0) * (1 - (project.progress || 0) / 100)).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${100 - (project.progress || 0)}%` }}></div>
                                                </div>
                                                <div className="pt-4">
                                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Budget Metrics</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-600 dark:text-slate-400">Utilization Rate</span>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{project.progress || 0}%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-600 dark:text-slate-400">Days Remaining</span>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {daysRemaining !== null ? (daysRemaining > 0 ? daysRemaining : 'Overdue') : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-600 dark:text-slate-400">Budget Burn Rate</span>
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                                ${((project.budget || 0) / 30).toLocaleString()}/day
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}