// src/app/dashboard/time-tracking/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Clock,
    Calendar,
    Play,
    Pause,
    Square,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Plus,
    Edit2,
    Trash2,
    Download,
    Filter,
    Search,
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Activity,
    CheckCircle,
    AlertCircle,
    X,
    Save,
    Timer,
    Zap,
    Coffee,
    Briefcase,
    FileText,
    Settings,
    Bell,
    LogOut,
    User,
    Moon,
    Sun
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TimeTrackingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State for time tracking
    const [isTracking, setIsTracking] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [currentTask, setCurrentTask] = useState('');
    const [currentProject, setCurrentProject] = useState('');
    const [intervalId, setIntervalId] = useState(null);

    // State for time entries
    const [timeEntries, setTimeEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('day'); // day, week, month

    // State for projects and tasks
    const [projects, setProjects] = useState([
        { id: 1, name: 'Website Redesign', color: 'bg-blue-500' },
        { id: 2, name: 'Mobile App', color: 'bg-green-500' },
        { id: 3, name: 'Marketing Campaign', color: 'bg-purple-500' },
        { id: 4, name: 'API Development', color: 'bg-orange-500' },
        { id: 5, name: 'Documentation', color: 'bg-pink-500' }
    ]);

    const [tasks, setTasks] = useState([
        { id: 1, name: 'Design Homepage', projectId: 1 },
        { id: 2, name: 'Implement Authentication', projectId: 2 },
        { id: 3, name: 'Create Landing Page', projectId: 3 },
        { id: 4, name: 'Build REST API', projectId: 4 },
        { id: 5, name: 'Write User Guide', projectId: 5 }
    ]);

    // State for modals
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);
    const [showEditEntryModal, setShowEditEntryModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [showStatsModal, setShowStatsModal] = useState(false);

    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [projectFilter, setProjectFilter] = useState('all');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // State for new entry
    const [newEntry, setNewEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        duration: '',
        task: '',
        project: '',
        description: ''
    });

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
            return;
        }

        // Load mock data
        loadMockTimeEntries();
    }, [session, status, router]);

    useEffect(() => {
        // Filter entries based on selected date and filters
        filterEntries();
    }, [timeEntries, selectedDate, viewMode, searchTerm, projectFilter]);

    useEffect(() => {
        // Update timer every second when tracking
        if (isTracking && startTime) {
            const id = setInterval(() => {
                setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            setIntervalId(id);
            return () => clearInterval(id);
        }
    }, [isTracking, startTime]);

    const loadMockTimeEntries = () => {
        const mockEntries = [
            {
                id: 1,
                date: '2024-01-15',
                startTime: '09:00',
                endTime: '11:30',
                duration: '2:30',
                task: 'Design Homepage',
                project: 'Website Redesign',
                description: 'Created wireframes and mockups'
            },
            {
                id: 2,
                date: '2024-01-15',
                startTime: '13:00',
                endTime: '15:00',
                duration: '2:00',
                task: 'Implement Authentication',
                project: 'Mobile App',
                description: 'User login and registration'
            },
            {
                id: 3,
                date: '2024-01-14',
                startTime: '10:00',
                endTime: '12:00',
                duration: '2:00',
                task: 'Create Landing Page',
                project: 'Marketing Campaign',
                description: 'Responsive design implementation'
            }
        ];
        setTimeEntries(mockEntries);
    };

    const filterEntries = () => {
        let filtered = [...timeEntries];

        // Filter by date range based on view mode
        if (viewMode === 'day') {
            const dateStr = selectedDate.toISOString().split('T')[0];
            filtered = filtered.filter(entry => entry.date === dateStr);
        } else if (viewMode === 'week') {
            const weekStart = new Date(selectedDate);
            weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            filtered = filtered.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= weekStart && entryDate <= weekEnd;
            });
        } else if (viewMode === 'month') {
            const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

            filtered = filtered.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= monthStart && entryDate <= monthEnd;
            });
        }

        // Filter by project
        if (projectFilter !== 'all') {
            filtered = filtered.filter(entry => entry.project === projectFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(entry =>
                entry.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredEntries(filtered);
    };

    const startTracking = () => {
        if (!currentTask || !currentProject) {
            toast.error('Please select a task and project');
            return;
        }
        setIsTracking(true);
        setStartTime(Date.now());
        setCurrentTime(0);
        toast.success('Time tracking started');
    };

    const pauseTracking = () => {
        setIsTracking(false);
        if (intervalId) {
            clearInterval(intervalId);
        }
        toast.success('Time tracking paused');
    };

    const stopTracking = () => {
        if (!isTracking || currentTime === 0) return;

        const endTime = new Date();
        const duration = formatTime(currentTime);

        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            startTime: new Date(startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            duration: duration,
            task: currentTask,
            project: currentProject,
            description: `Worked on ${currentTask}`
        };

        setTimeEntries(prev => [newEntry, ...prev]);
        setIsTracking(false);
        setCurrentTime(0);
        setStartTime(null);
        setCurrentTask('');
        setCurrentProject('');
        if (intervalId) {
            clearInterval(intervalId);
        }
        toast.success('Time entry saved');
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const addManualEntry = () => {
        if (!newEntry.startTime || !newEntry.endTime || !newEntry.task) {
            toast.error('Please fill in all required fields');
            return;
        }

        const start = new Date(`2000-01-01T${newEntry.startTime}`);
        const end = new Date(`2000-01-01T${newEntry.endTime}`);
        const durationSeconds = Math.floor((end - start) / 1000);

        const entry = {
            id: Date.now(),
            date: newEntry.date,
            startTime: newEntry.startTime,
            endTime: newEntry.endTime,
            duration: formatTime(durationSeconds),
            task: newEntry.task,
            project: newEntry.project,
            description: newEntry.description
        };

        setTimeEntries(prev => [entry, ...prev]);
        setShowAddEntryModal(false);
        setNewEntry({
            date: new Date().toISOString().split('T')[0],
            startTime: '',
            endTime: '',
            duration: '',
            task: '',
            project: '',
            description: ''
        });
        toast.success('Time entry added successfully');
    };

    const deleteEntry = (id) => {
        setTimeEntries(prev => prev.filter(entry => entry.id !== id));
        toast.success('Time entry deleted');
    };

    const editEntry = (entry) => {
        setEditingEntry(entry);
        setShowEditEntryModal(true);
    };

    const updateEntry = () => {
        if (!editingEntry) return;

        setTimeEntries(prev => prev.map(entry =>
            entry.id === editingEntry.id ? editingEntry : entry
        ));
        setShowEditEntryModal(false);
        setEditingEntry(null);
        toast.success('Time entry updated');
    };

    const getTotalTime = (entries) => {
        let totalSeconds = 0;
        entries.forEach(entry => {
            const [hours, minutes, seconds] = entry.duration.split(':').map(Number);
            totalSeconds += hours * 3600 + minutes * 60 + seconds;
        });
        return formatTime(totalSeconds);
    };

    const exportTimeEntries = () => {
        const csvContent = [
            ['Date', 'Start Time', 'End Time', 'Duration', 'Task', 'Project', 'Description'],
            ...filteredEntries.map(entry => [
                entry.date,
                entry.startTime,
                entry.endTime,
                entry.duration,
                entry.task,
                entry.project,
                entry.description
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `time-entries-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Time entries exported');
    };

    const changeDate = (direction) => {
        const newDate = new Date(selectedDate);
        if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() + direction);
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + direction);
        }
        setSelectedDate(newDate);
    };

    const getFilteredTasks = () => {
        if (!currentProject) return tasks;
        return tasks.filter(task => {
            const project = projects.find(p => p.name === currentProject);
            return project && task.projectId === project.id;
        });
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
                <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-white bg-blue-600 rounded-lg shadow-md">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 8 0 0-4 4 0 018 8z"></path>
                        </svg>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <button
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 mr-2"
                                onClick={() => router.back()}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Time Tracking</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                                <Settings className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Timer and Quick Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Timer Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
                                <Timer className="w-5 h-5 mr-2" />
                                Active Timer
                            </h2>

                            <div className="text-center">
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                    {formatTime(currentTime)}
                                </div>

                                {!isTracking ? (
                                    <div className="space-y-4">
                                        <select
                                            value={currentProject}
                                            onChange={(e) => setCurrentProject(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        >
                                            <option value="">Select Project</option>
                                            {projects.map(project => (
                                                <option key={project.id} value={project.name}>{project.name}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={currentTask}
                                            onChange={(e) => setCurrentTask(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        >
                                            <option value="">Select Task</option>
                                            {getFilteredTasks().map(task => (
                                                <option key={task.id} value={task.name}>{task.name}</option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={startTracking}
                                            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                                        >
                                            <Play className="w-5 h-5 mr-2" />
                                            Start Tracking
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-400">
                                                {currentProject} - {currentTask}
                                            </p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={pauseTracking}
                                                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center justify-center"
                                            >
                                                <Pause className="w-4 h-4 mr-1" />
                                                Pause
                                            </button>
                                            <button
                                                onClick={stopTracking}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                                            >
                                                <Square className="w-4 h-4 mr-1" />
                                                Stop
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2" />
                                Today's Stats
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Time</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {getTotalTime(filteredEntries)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Entries</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {filteredEntries.length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Projects</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {new Set(filteredEntries.map(e => e.project)).size}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Zap className="w-5 h-5 mr-2" />
                                Quick Actions
                            </h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowAddEntryModal(true)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Manual Entry
                                </button>
                                <button
                                    onClick={exportTimeEntries}
                                    className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export CSV
                                </button>
                                <button
                                    onClick={() => setShowStatsModal(true)}
                                    className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center"
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    View Statistics
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Time Entries */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            {/* Header with Date Navigation */}
                            <div className="border-b border-slate-200 dark:border-slate-700 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => changeDate(-1)}
                                            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {viewMode === 'day' && selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            {viewMode === 'week' && `Week of ${selectedDate.toLocaleDateString()}`}
                                            {viewMode === 'month' && selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                        </h3>
                                        <button
                                            onClick={() => changeDate(1)}
                                            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setViewMode('day')}
                                            className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                                        >
                                            Day
                                        </button>
                                        <button
                                            onClick={() => setViewMode('week')}
                                            className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                                        >
                                            Week
                                        </button>
                                        <button
                                            onClick={() => setViewMode('month')}
                                            className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                                        >
                                            Month
                                        </button>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="flex space-x-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search entries..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <select
                                        value={projectFilter}
                                        onChange={(e) => setProjectFilter(e.target.value)}
                                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="all">All Projects</option>
                                        {projects.map(project => (
                                            <option key={project.id} value={project.name}>{project.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Time Entries List */}
                            <div className="p-6">
                                {filteredEntries.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600 dark:text-slate-400">No time entries found</p>
                                        <button
                                            onClick={() => setShowAddEntryModal(true)}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Add Your First Entry
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredEntries.map(entry => (
                                            <div key={entry.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <div className={`w-3 h-3 rounded-full mr-2 ${projects.find(p => p.name === entry.project)?.color || 'bg-gray-500'}`}></div>
                                                            <h4 className="font-medium text-slate-900 dark:text-white">{entry.task}</h4>
                                                        </div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{entry.project}</p>
                                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-500">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {entry.date}
                                                            <Clock className="w-4 h-4 ml-3 mr-1" />
                                                            {entry.startTime} - {entry.endTime}
                                                            <Timer className="w-4 h-4 ml-3 mr-1" />
                                                            <span className="font-medium">{entry.duration}</span>
                                                        </div>
                                                        {entry.description && (
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{entry.description}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => editEntry(entry)}
                                                            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteEntry(entry.id)}
                                                            className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Entry Modal */}
            {showAddEntryModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Add Time Entry</h3>
                                    <button
                                        onClick={() => setShowAddEntryModal(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={newEntry.date}
                                            onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Time</label>
                                            <input
                                                type="time"
                                                value={newEntry.startTime}
                                                onChange={(e) => setNewEntry(prev => ({ ...prev, startTime: e.target.value }))}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Time</label>
                                            <input
                                                type="time"
                                                value={newEntry.endTime}
                                                onChange={(e) => setNewEntry(prev => ({ ...prev, endTime: e.target.value }))}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project</label>
                                        <select
                                            value={newEntry.project}
                                            onChange={(e) => setNewEntry(prev => ({ ...prev, project: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        >
                                            <option value="">Select Project</option>
                                            {projects.map(project => (
                                                <option key={project.id} value={project.name}>{project.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Task</label>
                                        <input
                                            type="text"
                                            value={newEntry.task}
                                            onChange={(e) => setNewEntry(prev => ({ ...prev, task: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            placeholder="Enter task name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                        <textarea
                                            value={newEntry.description}
                                            onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            placeholder="Optional description"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={addManualEntry}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Add Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Entry Modal */}
            {showEditEntryModal && editingEntry && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Edit Time Entry</h3>
                                    <button
                                        onClick={() => setShowEditEntryModal(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={editingEntry.date}
                                            onChange={(e) => setEditingEntry(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Time</label>
                                            <input
                                                type="time"
                                                value={editingEntry.startTime}
                                                onChange={(e) => setEditingEntry(prev => ({ ...prev, startTime: e.target.value }))}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Time</label>
                                            <input
                                                type="time"
                                                value={editingEntry.endTime}
                                                onChange={(e) => setEditingEntry(prev => ({ ...prev, endTime: e.target.value }))}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project</label>
                                        <select
                                            value={editingEntry.project}
                                            onChange={(e) => setEditingEntry(prev => ({ ...prev, project: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        >
                                            {projects.map(project => (
                                                <option key={project.id} value={project.name}>{project.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Task</label>
                                        <input
                                            type="text"
                                            value={editingEntry.task}
                                            onChange={(e) => setEditingEntry(prev => ({ ...prev, task: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                        <textarea
                                            value={editingEntry.description}
                                            onChange={(e) => setEditingEntry(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={updateEntry}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistics Modal */}
            {showStatsModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Time Tracking Statistics</h3>
                                    <button
                                        onClick={() => setShowStatsModal(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                            <h4 className="font-medium text-blue-900 dark:text-blue-400">Total Time Tracked</h4>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-400">156:45:30</p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">This month</p>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <Target className="w-5 h-5 text-green-600 mr-2" />
                                            <h4 className="font-medium text-green-900 dark:text-green-400">Most Productive Day</h4>
                                        </div>
                                        <p className="text-2xl font-bold text-green-900 dark:text-green-400">Monday</p>
                                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">8h 24m average</p>
                                    </div>

                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <Briefcase className="w-5 h-5 text-purple-600 mr-2" />
                                            <h4 className="font-medium text-purple-900 dark:text-purple-400">Top Project</h4>
                                        </div>
                                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-400">Website Redesign</p>
                                        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">45h 30m this month</p>
                                    </div>

                                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <Activity className="w-5 h-5 text-orange-600 mr-2" />
                                            <h4 className="font-medium text-orange-900 dark:text-orange-400">Daily Average</h4>
                                        </div>
                                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-400">7h 48m</p>
                                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">Last 30 days</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-medium text-slate-900 dark:text-white mb-4">Project Breakdown</h4>
                                    <div className="space-y-3">
                                        {projects.map(project => (
                                            <div key={project.id} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full mr-2 ${project.color}`}></div>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">{project.name}</span>
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">12h 30m</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setShowStatsModal(false)}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}