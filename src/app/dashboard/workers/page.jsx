"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, UserCheck, UserX, MoreHorizontal, Calendar, Mail, Shield, Star, MapPin, Briefcase, Trash2, Edit, Eye, Loader2, Users, Filter, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Mock API function to fetch workers
const fetchWorkersFromAPI = async () => {
    // In a real application, you would fetch this from your API
    // const response = await fetch('/api/admin/workers');
    // const data = await response.json();
    // return data;

    // Mock data for demonstration
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'worker', status: 'active', joinDate: '2023-10-01', location: 'New York, USA', skills: ['React', 'Node.js', 'MongoDB'], rating: 4.8, tasksCompleted: 45, bio: 'Experienced full-stack developer with a passion for creating intuitive user interfaces.' },
                { _id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'worker', status: 'pending', joinDate: '2023-11-15', location: 'London, UK', skills: ['Python', 'Django', 'PostgreSQL'], rating: 0, tasksCompleted: 0, bio: 'Aspiring backend developer looking to apply my skills in real-world projects.' },
                { _id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'worker', status: 'inactive', joinDate: '2023-05-20', location: 'Paris, France', skills: ['UI/UX Design', 'Figma', 'Adobe XD'], rating: 4.5, tasksCompleted: 30, bio: 'Creative designer focused on user-centered design principles.' },
                { _id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'worker', status: 'active', joinDate: '2022-08-10', location: 'Berlin, Germany', skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes'], rating: 4.9, tasksCompleted: 60, bio: 'DevOps engineer specializing in cloud infrastructure and automation.' },
            ]);
        }, 1000); // Simulate network delay
    });
};

export default function ManageWorkersPage() {
    const [workers, setWorkers] = useState([]);
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'pending', 'inactive'
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Auto-suggestion states
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const getWorkers = async () => {
            setLoading(true);
            try {
                const data = await fetchWorkersFromAPI();
                setWorkers(data);
                setFilteredWorkers(data);
            } catch (error) {
                toast.error('Failed to fetch workers.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getWorkers();
    }, []);

    useEffect(() => {
        let result = workers;

        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(worker => worker.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery) {
            result = result.filter(worker =>
                worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                worker.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredWorkers(result);
    }, [workers, searchQuery, statusFilter]);

    // Generate suggestions based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filteredSuggestions = workers
            .filter(worker =>
                worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                worker.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 5); // Limit to 5 suggestions

        setSuggestions(filteredSuggestions);
        setShowSuggestions(filteredSuggestions.length > 0);
        setActiveSuggestionIndex(0);
    }, [searchQuery, workers]);

    const handleViewWorker = (worker) => {
        setSelectedWorker(worker);
        setIsDetailsModalOpen(true);
        setShowSuggestions(false);
    };

    const handleDeleteClick = (worker) => {
        setSelectedWorker(worker);
        setIsDeleteModalOpen(true);
        setShowSuggestions(false);
    };

    const confirmDeleteWorker = () => {
        // In a real app, call your delete API here
        // fetch(`/api/admin/workers/${selectedWorker._id}`, { method: 'DELETE' })
        toast.success(`Worker ${selectedWorker.name} has been deleted.`);
        setWorkers(workers.filter(w => w._id !== selectedWorker._id));
        setIsDeleteModalOpen(false);
        setSelectedWorker(null);
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedWorker) return;
        setUpdating(true);
        // In a real app, call your update API here
        // fetch(`/api/admin/workers/${selectedWorker._id}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) })

        const updatedWorkers = workers.map(w =>
            w._id === selectedWorker._id ? { ...w, status: newStatus } : w
        );
        setWorkers(updatedWorkers);
        setSelectedWorker({ ...selectedWorker, status: newStatus });
        setUpdating(false);
        toast.success(`Worker status updated to ${newStatus}.`);
    };

    // Handle suggestion selection
    const selectSuggestion = (worker) => {
        setSearchQuery(worker.name);
        setShowSuggestions(false);
        searchInputRef.current?.focus();
    };

    // Handle keyboard navigation for suggestions
    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev =>
                prev > 0 ? prev - 1 : suggestions.length - 1
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (suggestions[activeSuggestionIndex]) {
                selectSuggestion(suggestions[activeSuggestionIndex]);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
            pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
            inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
        };
        return (
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Workers Management</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Approve, manage, and overview all registered workers.</p>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1" ref={searchInputRef}>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (searchQuery.trim() !== '' && suggestions.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {suggestions.map((worker, index) => (
                                    <div
                                        key={worker._id}
                                        className={`px-4 py-3 cursor-pointer flex items-center hover:bg-slate-100 dark:hover:bg-slate-700 ${index === activeSuggestionIndex ? 'bg-slate-100 dark:bg-slate-700' : ''
                                            }`}
                                        onClick={() => selectSuggestion(worker)}
                                    >
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                                            {worker.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                {worker.name}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                                {worker.email}
                                            </p>
                                        </div>
                                        <div className="ml-2">
                                            {getStatusBadge(worker.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter('active')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setStatusFilter('inactive')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'inactive' ? 'bg-slate-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                        >
                            Inactive
                        </button>
                    </div>
                </div>

                {/* Workers Table */}
                <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Worker
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Join Date
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {loading ? (
                                    // Skeleton Loader
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                                                        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse ml-auto"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredWorkers.length > 0 ? (
                                    filteredWorkers.map((worker) => (
                                        <tr key={worker._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                            {worker.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{worker.name}</div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{worker.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(worker.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(worker.joinDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewWorker(worker)}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(worker)}
                                                    className="ml-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Delete Worker"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <Users className="mx-auto h-12 w-12 text-slate-400" />
                                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No workers found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Worker Details Modal */}
            {isDetailsModalOpen && selectedWorker && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="w-full">
                                        <div className="flex items-center mb-4">
                                            <div className="flex-shrink-0 h-16 w-16">
                                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                                                    {selectedWorker.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white" id="modal-title">
                                                    {selectedWorker.name}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedWorker.email}</p>
                                                <div className="mt-2">{getStatusBadge(selectedWorker.status)}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                                {selectedWorker.location}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                                Joined on {new Date(selectedWorker.joinDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                                                {selectedWorker.tasksCompleted} Tasks Completed
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <Star className="w-4 h-4 mr-2 flex-shrink-0 text-yellow-500" />
                                                {selectedWorker.rating > 0 ? `${selectedWorker.rating} / 5.0` : 'No ratings yet'}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedWorker.skills.map(skill => (
                                                    <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Bio</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{selectedWorker.bio}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                                {selectedWorker.status === 'pending' && (
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange('active')}
                                        disabled={updating}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {updating ? <Loader2 className="animate-spin h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                                        <span className="ml-2">Approve</span>
                                    </button>
                                )}
                                {selectedWorker.status === 'active' && (
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange('inactive')}
                                        disabled={updating}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-600 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {updating ? <Loader2 className="animate-spin h-5 w-5" /> : <UserX className="h-5 w-5" />}
                                        <span className="ml-2">Deactivate</span>
                                    </button>
                                )}
                                {selectedWorker.status === 'inactive' && (
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange('active')}
                                        disabled={updating}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {updating ? <Loader2 className="animate-spin h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                                        <span className="ml-2">Reactivate</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedWorker && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div> */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                                        <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white" id="modal-title">
                                            Delete Worker
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Are you sure you want to delete worker <span className="font-semibold">{selectedWorker.name}</span>? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={confirmDeleteWorker}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}