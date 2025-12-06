// src/app/dashboard/all-employee/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Filter,
    User,
    Mail,
    Calendar,
    MapPin,
    Briefcase,
    Phone,
    MessageCircle,
    Linkedin,
    Facebook,
    Eye,
    Edit,
    Shield,
    UserCheck,
    UserX,
    ChevronDown,
    RefreshCw,
    Download,
    Grid3x3,
    List
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AllEmployeePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'status'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // State for dropdown visibility
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    // Fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            if (status === 'loading') return;

            if (!session) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/api/users');

                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }

                const data = await response.json();
                setEmployees(data);
                setFilteredEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
                toast.error('Failed to load employees');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, [session, status, router]);

    // Apply filters and sorting
    useEffect(() => {
        let result = employees;

        // Filter by search query
        if (searchQuery) {
            result = result.filter(employee =>
                employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (employee.city && employee.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (employee.department && employee.department.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(employee => employee.status === statusFilter);
        }

        // Filter by role
        if (roleFilter !== 'all') {
            result = result.filter(employee => employee.role === roleFilter);
        }

        // Filter by department
        if (departmentFilter !== 'all') {
            result = result.filter(employee => employee.department === departmentFilter);
        }

        // Sort the results
        result.sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortBy === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'status') {
                return sortOrder === 'asc'
                    ? a.status.localeCompare(b.status)
                    : b.status.localeCompare(a.status);
            }
            return 0;
        });

        setFilteredEmployees(result);
    }, [employees, searchQuery, statusFilter, roleFilter, departmentFilter, sortBy, sortOrder]);

    // Handle view employee details
    const handleViewEmployee = (employee) => {
        router.push(`/dashboard/employee-profile/${employee._id}`);
    };

    // Handle status change
    const handleStatusChange = async (employee, newStatus) => {
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: employee.email,
                    status: newStatus
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            setEmployees(prev => prev.map(emp =>
                emp.email === employee.email ? { ...emp, status: newStatus } : emp
            ));

            toast.success(`Employee status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Active
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400">
                        <UserX className="w-3 h-3 mr-1" />
                        Inactive
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                        {status}
                    </span>
                );
        }
    };

    // Get role badge
    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                    </span>
                );
            case 'worker':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Worker
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                        {role}
                    </span>
                );
        }
    };

    // Get department options for filter
    const getDepartmentOptions = () => {
        const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
        return ['all', ...departments];
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Employee Directory</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Browse and connect with all employees in your organization
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => {
                                const dataStr = JSON.stringify(employees);
                                const blob = new Blob([dataStr], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = 'employees.json';
                                link.click();
                            }}
                            className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email, or department..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </button>

                        {statusDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-700">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setStatusFilter('all');
                                            setStatusDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        All Status
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStatusFilter('active');
                                            setStatusDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Active
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStatusFilter('pending');
                                            setStatusDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Pending
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStatusFilter('inactive');
                                            setStatusDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Inactive
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Role Filter */}
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Role: {roleFilter === 'all' ? 'All' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </button>

                        {roleDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-700">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setRoleFilter('all');
                                            setRoleDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        All Roles
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRoleFilter('admin');
                                            setRoleDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Admin
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRoleFilter('worker');
                                            setRoleDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Worker
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Department Filter */}
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}
                        >
                            <Briefcase className="h-4 w-4 mr-2" />
                            Department: {departmentFilter === 'all' ? 'All' : departmentFilter}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </button>

                        {departmentDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-700">
                                <div className="py-1 max-h-48 overflow-y-auto">
                                    <button
                                        onClick={() => {
                                            setDepartmentFilter('all');
                                            setDepartmentDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        All Departments
                                    </button>
                                    {getDepartmentOptions().map((dept, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setDepartmentFilter(dept);
                                                setDepartmentDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sort Options */}
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                        >
                            Sort By: {sortBy === 'name' ? 'Name' : sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </button>

                        {sortDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-700">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setSortBy('name');
                                            setSortDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Name
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSortBy('date');
                                            setSortDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Join Date
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSortBy('status');
                                            setSortDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Status
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Showing <span className="font-medium">{filteredEmployees.length}</span> of <span className="font-medium">{employees.length}</span> employees
                </p>
                <button
                    onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setRoleFilter('all');
                        setDepartmentFilter('all');
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                    Reset Filters
                </button>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                            <div key={employee._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="h-16 w-16 flex-shrink-0">
                                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">{employee.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{employee.email}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {getRoleBadge(employee.role)}
                                                {getStatusBadge(employee.status)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            {employee.department || 'Not specified'}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {employee.city || 'Not specified'}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Joined {new Date(employee.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                            <Phone className="h-4 w-4 mr-2" />
                                            {employee.phone || 'Not specified'}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {employee.email}
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleViewEmployee(employee)}
                                            className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                const newStatus = employee.status === 'active' ? 'inactive' : 'active';
                                                handleStatusChange(employee, newStatus);
                                            }}
                                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${employee.status === 'active'
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                }`}
                                        >
                                            {employee.status === 'active' ? (
                                                <>
                                                    <UserX className="h-4 w-4 mr-2" />
                                                    Deactivate
                                                </>
                                            ) : (
                                                <>
                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                    Activate
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <User className="h-12 w-12 text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">No employees found matching your criteria</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setRoleFilter('all');
                                        setDepartmentFilter('all');
                                    }}
                                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Join Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((employee) => (
                                        <tr key={employee._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{employee.name}</div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{employee.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRoleBadge(employee.role)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">{employee.department || 'Not specified'}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(employee.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(employee.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewEmployee(employee)}
                                                        className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const newStatus = employee.status === 'active' ? 'inactive' : 'active';
                                                            handleStatusChange(employee, newStatus);
                                                        }}
                                                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${employee.status === 'active'
                                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                            }`}
                                                    >
                                                        {employee.status === 'active' ? (
                                                            <>
                                                                <UserX className="h-4 w-4 mr-2" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="h-4 w-4 mr-2" />
                                                                Activate
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <User className="h-12 w-12 text-slate-400 mb-2" />
                                                <p className="text-sm text-slate-500 dark:text-slate-400">No employees found matching your criteria</p>
                                                <button
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setStatusFilter('all');
                                                        setRoleFilter('all');
                                                        setDepartmentFilter('all');
                                                    }}
                                                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                                                >
                                                    Reset Filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}