// app/admin/workers/page.jsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaUser, FaTasks, FaClipboardList,
    FaHourglassHalf, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaUserPlus,
    FaBriefcase, FaCalendarAlt, FaSearch, FaFilter, FaEye, FaEyeSlash, FaUserClock,
    FaUserCheck, FaUserTimes, FaExclamationCircle
} from 'react-icons/fa';

// Constants
const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
];

// Helper Components
const StatusBadge = ({ status }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'approved':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaHourglassHalf className="mr-1" />;
            case 'approved':
                return <FaCheckCircle className="mr-1" />;
            case 'active':
                return <FaUserCheck className="mr-1" />;
            case 'inactive':
                return <FaUserTimes className="mr-1" />;
            default:
                return <FaExclamationTriangle className="mr-1" />;
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
            {getStatusIcon(status)}
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
        </span>
    );
};

const Notification = ({ notification }) => {
    if (!notification.show) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
            } animate-pulse`}>
            {notification.type === 'success' ? <FaCheckCircle className="text-xl" /> : <FaExclamationTriangle className="text-xl" />}
            <span>{notification.message}</span>
        </div>
    );
};

const LoadingSpinner = ({ message }) => (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">{message}</p>
        </div>
    </div>
);

const EmptyState = ({ message, icon }) => (
    <div className="text-center py-12">
        {icon}
        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">{message}</h3>
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="w-full">
                                <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-4">
                                    {title}
                                </h3>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditWorkerStatusModal = ({ isOpen, onClose, worker, onSubmit, isSubmitting }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            status: worker?.status || ''
        }
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Update Status for ${worker?.name}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                    <select
                        {...register("status", { required: "Status is required" })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    >
                        {STATUS_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>}
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const AssignWorkModal = ({ isOpen, onClose, worker, availableWork, selectedTasks, setSelectedTasks, onAssign, isLoading }) => {
    const handleTaskToggle = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter(id => id !== taskId));
        } else {
            setSelectedTasks([...selectedTasks, taskId]);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Assign Work to ${worker?.name}`}>
            <div className="mb-4">
                <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-lg p-2">
                    {availableWork.length > 0 ? (
                        availableWork.map((task) => (
                            <label key={task._id} className="flex items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={task._id}
                                    checked={selectedTasks.includes(task._id)}
                                    onChange={() => handleTaskToggle(task._id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                />
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{task.description}</div>
                                </div>
                            </label>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-4">No available work tasks to assign.</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500"
                >
                    Cancel
                </button>
                <button
                    onClick={onAssign}
                    disabled={isLoading || selectedTasks.length === 0}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaTasks className="mr-2" />}
                    Assign Selected
                </button>
            </div>
        </Modal>
    );
};

const AddWorkModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Work Task">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Task Title</label>
                        <input
                            {...register("title", { required: "Title is required" })}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Due Date (Optional)</label>
                        <input
                            type="date"
                            {...register("dueDate")}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaPlus className="mr-2" />}
                        Create Task
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Main Component
export default function ManageWorkers() {
    const [workers, setWorkers] = useState([]);
    const [availableWork, setAvailableWork] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [editingWorker, setEditingWorker] = useState(null);
    const [isAddingWork, setIsAddingWork] = useState(false);
    const [assigningWorkTo, setAssigningWorkTo] = useState(null);
    const [selectedTasksToAssign, setSelectedTasksToAssign] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Fetch workers and available work from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workersResponse, workResponse] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/work')
                ]);

                if (!workersResponse.ok) throw new Error('Failed to fetch workers');
                if (!workResponse.ok) throw new Error('Failed to fetch work tasks');

                const workersData = await workersResponse.json();
                const workData = await workResponse.json();

                setWorkers(workersData);
                setAvailableWork(workData);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('Failed to load data. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle worker status update
    const handleEditSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/workers/${editingWorker._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: data.status }),
            });

            if (!response.ok) throw new Error('Failed to update worker status');

            const updatedWorker = await response.json();
            setWorkers(workers.map(w => w._id === editingWorker._id ? updatedWorker.data : w));
            setEditingWorker(null);
            showNotification('Worker status updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating worker:", error);
            showNotification(error.message || 'Failed to update worker.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle adding new work task
    const handleWorkSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/work', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to create work task');

            const newWork = await response.json();
            setAvailableWork([...availableWork, newWork.data]);
            setIsAddingWork(false);
            showNotification('New work task created successfully!', 'success');
        } catch (error) {
            console.error("Error creating work:", error);
            showNotification(error.message || 'Failed to create work task.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle assigning work to a worker
    const handleAssignWork = async () => {
        if (selectedTasksToAssign.length === 0) {
            showNotification('Please select at least one task to assign.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/workers/${assigningWorkTo._id}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskIds: selectedTasksToAssign }),
            });

            if (!response.ok) throw new Error('Failed to assign work');

            const result = await response.json();

            // Update worker's assigned work
            setWorkers(workers.map(w =>
                w._id === assigningWorkTo._id
                    ? { ...w, assignedWork: [...(w.assignedWork || []), ...result.data.assignedTasks] }
                    : w
            ));

            // Remove assigned tasks from available work list
            setAvailableWork(availableWork.filter(w => !selectedTasksToAssign.includes(w._id)));

            setAssigningWorkTo(null);
            setSelectedTasksToAssign([]);
            showNotification('Work assigned successfully!', 'success');
        } catch (error) {
            console.error("Error assigning work:", error);
            showNotification(error.message || 'Failed to assign work.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle worker deletion
    const handleDeleteWorker = async (workerId) => {
        if (confirm('Are you sure you want to delete this worker? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/workers/${workerId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Failed to delete worker');

                setWorkers(workers.filter(w => w._id !== workerId));
                showNotification('Worker deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting worker:", error);
                showNotification(error.message || 'Failed to delete worker.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Filter workers based on search and status
    const filteredWorkers = useMemo(() => {
        return workers.filter(worker => {
            const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [workers, searchTerm, statusFilter]);

    if (isInitialLoading) return <LoadingSpinner message="Loading worker data..." />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <Notification notification={notification} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 backdrop-blur-lg bg-opacity-90">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                                    <FaUserClock className="mr-3 text-blue-500" />
                                    Manage Workers
                                </h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Approve workers and assign tasks</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex gap-3">
                                <button
                                    onClick={() => setIsAddingWork(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md transition-all duration-200 transform hover:scale-105"
                                >
                                    <FaBriefcase className="mr-2" />
                                    Create New Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-slate-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            >
                                <option value="all">All Statuses</option>
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Worker Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Worker</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Assigned Tasks</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredWorkers.map((worker) => (
                                    <tr key={worker._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                                                    <FaUser />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{worker.name}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{worker.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={worker.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {worker.assignedWork ? worker.assignedWork.length : 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(worker.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setEditingWorker(worker)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                                title="Edit Status"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAssigningWorkTo(worker);
                                                    setSelectedTasksToAssign([]);
                                                }}
                                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-4"
                                                title="Assign Work"
                                            >
                                                <FaTasks />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWorker(worker._id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                title="Delete Worker"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredWorkers.length === 0 && (
                        <EmptyState
                            message="No workers found"
                            icon={<FaUserTimes className="mx-auto h-12 w-12 text-slate-400" />}
                        />
                    )}
                </div>

                {/* Modals */}
                <EditWorkerStatusModal
                    isOpen={!!editingWorker}
                    onClose={() => setEditingWorker(null)}
                    worker={editingWorker}
                    onSubmit={handleEditSubmit}
                    isSubmitting={isLoading}
                />

                <AssignWorkModal
                    isOpen={!!assigningWorkTo}
                    onClose={() => {
                        setAssigningWorkTo(null);
                        setSelectedTasksToAssign([]);
                    }}
                    worker={assigningWorkTo}
                    availableWork={availableWork}
                    selectedTasks={selectedTasksToAssign}
                    setSelectedTasks={setSelectedTasksToAssign}
                    onAssign={handleAssignWork}
                    isLoading={isLoading}
                />

                <AddWorkModal
                    isOpen={isAddingWork}
                    onClose={() => setIsAddingWork(false)}
                    onSubmit={handleWorkSubmit}
                    isSubmitting={isLoading}
                />
            </div>
        </div>
    );
}