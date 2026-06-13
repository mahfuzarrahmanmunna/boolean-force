"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    Shield,
    Building,
    Award,
    TrendingUp,
    Clock,
    Edit,
    ArrowLeft,
    Download,
    MessageCircle,
    Linkedin,
    Facebook,
    Twitter,
    Globe,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Activity,
    Target,
    BarChart3,
    Users,
    Star,
    Settings,
    Camera,
    Upload,
    Save,
    X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployeeDetails() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (status === 'loading' || !params.id) return;

            try {
                const response = await fetch(`/api/users/${params.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch employee details');
                }

                const data = await response.json();
                setEmployee(data);
                setEditForm(data);
            } catch (error) {
                console.error('Error fetching employee:', error);
                toast.error('Failed to load employee details');
                router.push('/dashboard/all-employee');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployee();
    }, [params.id, status, router]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/users/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) {
                throw new Error('Failed to update employee');
            }

            const updatedEmployee = await response.json();
            setEmployee(updatedEmployee);
            setIsEditing(false);
            toast.success('Employee updated successfully');
        } catch (error) {
            console.error('Error updating employee:', error);
            toast.error('Failed to update employee');
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200 dark:from-emerald-900/20 dark:to-emerald-900/30 dark:text-emerald-400">
                        <div className="relative mr-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                        Active
                    </div>
                );
            case 'pending':
                return (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200 dark:from-amber-900/20 dark:to-amber-900/30 dark:text-amber-400">
                        <div className="relative mr-2">
                            <Clock className="h-4 w-4" />
                            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
                        </div>
                        Pending
                    </div>
                );
            case 'inactive':
                return (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border border-slate-200 dark:from-slate-900/20 dark:to-slate-900/30 dark:text-slate-400">
                        <div className="relative mr-2">
                            <XCircle className="h-4 w-4" />
                        </div>
                        Inactive
                    </div>
                );
            default:
                return (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200 dark:from-gray-900/20 dark:to-gray-900/30 dark:text-gray-400">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {status}
                    </div>
                );
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border border-purple-200 dark:from-purple-900/20 dark:to-purple-900/30 dark:text-purple-400">
                        <Shield className="h-4 w-4 mr-2" />
                        Administrator
                    </div>
                );
            case 'worker':
                return (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 dark:from-blue-900/20 dark:to-blue-900/30 dark:text-blue-400">
                        <User className="h-4 w-4 mr-2" />
                        Worker
                    </div>
                );
            default:
                return (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200 dark:from-gray-900/20 dark:to-gray-900/30 dark:text-gray-400">
                        <User className="h-4 w-4 mr-2" />
                        {role}
                    </div>
                );
        }
    };

    // Mock data for demonstration
    const performanceData = {
        score: 87,
        trend: '+12%',
        completedTasks: 142,
        ongoingTasks: 8,
        pendingTasks: 3,
        efficiency: 94,
        attendance: 96,
        rating: 4.5
    };

    const activityData = [
        { id: 1, type: 'task', title: 'Complete project documentation', date: '2024-01-15', status: 'completed' },
        { id: 2, type: 'meeting', title: 'Team standup meeting', date: '2024-01-14', status: 'completed' },
        { id: 3, type: 'task', title: 'Review pull requests', date: '2024-01-13', status: 'in-progress' },
        { id: 4, type: 'leave', title: 'Sick leave', date: '2024-01-12', status: 'approved' },
        { id: 5, type: 'task', title: 'Update client presentation', date: '2024-01-11', status: 'completed' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                <User className="h-10 w-10" />
                            </div>
                            <div className="absolute -bottom-1 -right-1">
                                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                    <div className="h-3 w-3 rounded-full bg-white animate-ping"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Loading Employee Details</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 text-center max-w-xs">
                            Please wait while we fetch the employee information...
                        </p>
                        <div className="mt-6 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
                    <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Employee Not Found</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        The employee you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/all-employee')}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Employees
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.push('/dashboard/all-employee')}
                                className="inline-flex items-center px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Employees
                            </button>
                            <div className="ml-4">
                                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Employee Details</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => {
                                    const dataStr = JSON.stringify(employee);
                                    const blob = new Blob([dataStr], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `${employee.name.replace(/\s+/g, '_')}_details.json`;
                                    link.click();
                                }}
                                className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isEditing
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {isEditing ? (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                ) : (
                                    <>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                            {/* Profile Header */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-6">
                                <button
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            toast.success('Profile picture updated');
                                        }
                                    }}
                                />
                                <div className="flex items-center">
                                    <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl border-2 border-white/30">
                                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h2 className="text-2xl font-bold text-white">{employee.name}</h2>
                                        <p className="text-white/80">{employee.email}</p>
                                        <div className="flex items-center space-x-3 mt-2">
                                            {getRoleBadge(employee.role)}
                                            {getStatusBadge(employee.status)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Body */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center text-sm">
                                        <Briefcase className="h-4 w-4 mr-3 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Department</p>
                                            <p className="text-slate-600 dark:text-slate-400">{employee.department || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <MapPin className="h-4 w-4 mr-3 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Location</p>
                                            <p className="text-slate-600 dark:text-slate-400">{employee.city || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Phone className="h-4 w-4 mr-3 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Phone</p>
                                            <p className="text-slate-600 dark:text-slate-400">{employee.phone || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Joined</p>
                                            <p className="text-slate-600 dark:text-slate-400">{new Date(employee.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Activity className="h-4 w-4 mr-3 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Last Active</p>
                                            <p className="text-slate-600 dark:text-slate-400">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="mt-6 py-6 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">Social Profiles</p>
                                    <div className="flex justify-center space-x-3">
                                        {employee.social?.linkedin && (
                                            <a href={employee.social.linkedin} className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                                                <Linkedin className="h-4 w-4" />
                                            </a>
                                        )}
                                        {employee.social?.facebook && (
                                            <a href={employee.social.facebook} className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                                                <Facebook className="h-4 w-4" />
                                            </a>
                                        )}
                                        {employee.social?.twitter && (
                                            <a href={employee.social.twitter} className="p-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors">
                                                <Twitter className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle & Right Columns - Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="border-b border-slate-200 dark:border-slate-700">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === 'overview'
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('performance')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === 'performance'
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        Performance
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('activity')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === 'activity'
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        Activity
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === 'settings'
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        Settings
                                    </button>
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.name || ''}
                                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        value={editForm.email || ''}
                                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.department || ''}
                                                        onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={editForm.phone || ''}
                                                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.city || ''}
                                                        onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                                        <User className="h-5 w-5 mr-2 text-blue-500" />
                                                        Personal Information
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center text-sm">
                                                            <span className="w-24 text-slate-500 dark:text-slate-400">Email:</span>
                                                            <span className="font-medium text-slate-900 dark:text-white">{employee.email}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <span className="w-24 text-slate-500 dark:text-slate-400">Phone:</span>
                                                            <span className="font-medium text-slate-900 dark:text-white">{employee.phone || 'Not specified'}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <span className="w-24 text-slate-500 dark:text-slate-400">Location:</span>
                                                            <span className="font-medium text-slate-900 dark:text-white">{employee.city || 'Not specified'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                                        <Building className="h-5 w-5 mr-2 text-blue-500" />
                                                        Professional Information
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center text-sm">
                                                            <span className="w-24 text-slate-500 dark:text-slate-400">Department:</span>
                                                            <span className="font-medium text-slate-900 dark:text-white">{employee.department || 'Not specified'}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <span className="w-24 text-slate-500 dark:text-slate-400">Role:</span>
                                                            <div>{getRoleBadge(employee.role)}</div>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <span className="w-24 text-slate-500 dark:text-slate-400">Status:</span>
                                                            <div>{getStatusBadge(employee.status)}</div>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <span className="w-24 text-slate-500 dark:text-slate-400">Join Date:</span>
                                                            <span className="font-medium text-slate-900 dark:text-white">{new Date(employee.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Performance Tab */}
                                {activeTab === 'performance' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Performance Score</span>
                                                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">{performanceData.score}</div>
                                                <div className="text-sm text-blue-700 dark:text-blue-500">+12% from last month</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Tasks Completed</span>
                                                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">{performanceData.completedTasks}</div>
                                                <div className="text-sm text-emerald-700 dark:text-emerald-500">This month</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/30 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-amber-800 dark:text-amber-400">Ongoing Tasks</span>
                                                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div className="text-3xl font-bold text-amber-900 dark:text-amber-300">{performanceData.ongoingTasks}</div>
                                                <div className="text-sm text-amber-700 dark:text-amber-500">In progress</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-purple-800 dark:text-purple-400">Efficiency</span>
                                                    <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div className="text-3xl font-bold text-purple-900 dark:text-purple-300">{performanceData.efficiency}%</div>
                                                <div className="text-sm text-purple-700 dark:text-purple-500">Above average</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-900/30 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-400">Attendance</span>
                                                    <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                </div>
                                                <div className="text-3xl font-bold text-slate-900 dark:text-slate-300">{performanceData.attendance}%</div>
                                                <div className="text-sm text-slate-700 dark:text-slate-500">This quarter</div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                                <Star className="h-5 w-5 mr-2 text-amber-500" />
                                                Performance Rating
                                            </h3>
                                            <div className="flex items-center">
                                                <div className="flex space-x-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-6 w-6 ${
                                                                star <= Math.floor(performanceData.rating)
                                                                    ? 'text-amber-400 fill-current'
                                                                    : 'text-slate-300 dark:text-slate-600'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="ml-3 text-2xl font-bold text-slate-900 dark:text-white">{performanceData.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Activity Tab */}
                                {activeTab === 'activity' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                                        <div className="space-y-3">
                                            {activityData.map((activity) => (
                                                <div key={activity.id} className="flex items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                                                        activity.type === 'task' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                        activity.type === 'meeting' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                                        activity.type === 'leave' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                                        'bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400'
                                                    }`}>
                                                        {activity.type === 'task' && <FileText className="h-5 w-5" />}
                                                        {activity.type === 'meeting' && <Users className="h-5 w-5" />}
                                                        {activity.type === 'leave' && <Calendar className="h-5 w-5" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-sm text-slate-500 dark:text-slate-400">{activity.date}</span>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                                activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                                activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                activity.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                                'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
                                                            }`}>
                                                                {activity.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Settings Tab */}
                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                            <Settings className="h-5 w-5 mr-2 text-blue-500" />
                                            Account Settings
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Receive email updates about your account</p>
                                                </div>
                                                <button className=" cursor-pointerrelative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                    <span className="sr-only">Toggle email notifications</span>
                                                    <span className="inline-block h-4 w-4 rounded-full bg-blue-600 transition-transform translate-x-0"></span>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security</p>
                                                </div>
                                                <button className=" cursor-pointerpx-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                                    Enable 2FA
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">Profile Visibility</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Control who can see your profile</p>
                                                </div>
                                                <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                                    <option>Everyone</option>
                                                    <option>Team Only</option>
                                                    <option>Private</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Changes Button (when editing) */}
                {isEditing && (
                    <div className="lg:col-span-3 flex justify-end mt-6">
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditForm(employee);
                                }}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}