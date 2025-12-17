// src/app/dashboard/manage-calendar/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    Users,
    Briefcase,
    CheckCircle,
    AlertCircle,
    X,
    Filter,
    Search,
    Grid3X3,
    List,
    Download,
    Upload,
    RefreshCw,
    UserPlus,
    Edit2,
    Trash2,
    Video,
    Phone,
    Mail,
    Star,
    TrendingUp,
    User,
    CalendarDays,
    Activity,
    Target,
    BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CalendarPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month'); // 'month', 'week', 'day', 'overview'
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [eventFilter, setEventFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for demonstration
    const mockEvents = [
        {
            id: 1,
            title: 'Team Meeting',
            date: new Date(),
            type: 'meeting',
            description: 'Weekly team sync to discuss project progress',
            attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
            location: 'Conference Room A',
            assignedTo: 'Alice Johnson'
        },
        {
            id: 2,
            title: 'Project Deadline',
            date: new Date(new Date().setDate(new Date().getDate() + 5)),
            type: 'deadline',
            description: 'Submit final project deliverables',
            priority: 'high',
            assignedTo: 'Bob Williams'
        },
        {
            id: 3,
            title: 'Client Presentation',
            date: new Date(new Date().setDate(new Date().getDate() + 10)),
            type: 'appointment',
            description: 'Present Q4 results to the client',
            location: 'Client Office',
            assignedTo: 'Charlie Brown'
        },
        {
            id: 4,
            title: 'Company Holiday',
            date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
            type: 'holiday',
            description: 'Company-wide holiday',
            allDay: true
        }
    ];

    const mockTasks = [
        {
            id: 1,
            title: 'Complete Dashboard UI',
            dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
            status: 'pending',
            priority: 'medium',
            assignedTo: 'Alice Johnson'
        },
        {
            id: 2,
            title: 'Database Migration',
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            status: 'in-progress',
            priority: 'high',
            assignedTo: 'Bob Williams'
        },
        {
            id: 3,
            title: 'API Documentation',
            dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
            status: 'completed',
            priority: 'low',
            assignedTo: 'Charlie Brown'
        }
    ];

    const mockUsers = [
        {
            _id: '1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'worker',
            status: 'active',
            joinDate: '2023-10-01',
            location: 'New York, USA',
            skills: ['React', 'Node.js', 'MongoDB'],
            rating: 4.8,
            tasksCompleted: 45,
            bio: 'Experienced full-stack developer with a passion for creating intuitive user interfaces.'
        },
        {
            _id: '2',
            name: 'Bob Williams',
            email: 'bob@example.com',
            role: 'worker',
            status: 'active',
            joinDate: '2023-11-15',
            location: 'London, UK',
            skills: ['Python', 'Django', 'PostgreSQL'],
            rating: 4.5,
            tasksCompleted: 32,
            bio: 'Backend developer specializing in Python and Django frameworks.'
        },
        {
            _id: '3',
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            role: 'worker',
            status: 'active',
            joinDate: '2023-05-20',
            location: 'Paris, France',
            skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
            rating: 4.7,
            tasksCompleted: 28,
            bio: 'Creative designer focused on user-centered design principles.'
        },
        {
            _id: '4',
            name: 'Diana Prince',
            email: 'diana@example.com',
            role: 'worker',
            status: 'active',
            joinDate: '2022-08-10',
            location: 'Berlin, Germany',
            skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
            rating: 4.9,
            tasksCompleted: 67,
            bio: 'DevOps engineer specializing in cloud infrastructure and automation.'
        }
    ];

    // Fetch calendar data
    useEffect(() => {
        const fetchCalendarData = async () => {
            if (status === 'loading') return;

            if (!session) {
                router.push('/login');
                return;
            }

            setIsLoading(true);

            try {
                // In a real app, fetch from your API
                // const eventsResponse = await fetch('/api/calendar/events');
                // const tasksResponse = await fetch('/api/tasks');
                // const usersResponse = await fetch('/api/users');

                // For demo, use mock data
                setTimeout(() => {
                    setEvents(mockEvents);
                    setTasks(mockTasks);
                    setUsers(mockUsers);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                toast.error('Failed to load calendar data');
            }
        };

        fetchCalendarData();
    }, [session, status, router]);

    // Get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonthCount = new Date(year, month + 1, 0).getDate();
        const days = [];

        // Add nulls for days before 1st of month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of month, starting from 1
        for (let i = 1; i <= daysInMonthCount; i++) {
            days.push(i);
        }

        return days;
    };

    // Check if a date has events or tasks
    const hasEventsOrTasks = (date) => {
        if (!date) return false;

        const dateEvents = getEventsForDate(date);
        const dateTasks = getTasksForDate(date);

        return dateEvents.length > 0 || dateTasks.length > 0;
    };

    // Get user's events and tasks
    const getUserEventsAndTasks = (userName) => {
        const userEvents = events.filter(event => event.assignedTo === userName);
        const userTasks = tasks.filter(task => task.assignedTo === userName);

        return { userEvents, userTasks };
    };

    // Handle date navigation
    const handlePreviousMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handlePreviousWeek = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    };

    const handlePreviousDay = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
    };

    const handleNextDay = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
    };

    const handleDateClick = (day) => {
        if (day) {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        }
    };

    // Handle view change
    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    // Handle event creation
    const handleCreateEvent = () => {
        setSelectedEvent(null);
        setShowEventModal(true);
    };

    const handleSaveEvent = async (eventData) => {
        try {
            const newEvent = {
                ...eventData,
                id: Date.now(),
                createdBy: session?.user?.name || 'Unknown User'
            };

            setEvents(prev => [...prev, newEvent]);
            setShowEventModal(false);
            toast.success('Event created successfully');
        } catch (error) {
            console.error('Error saving event:', error);
            toast.error('Failed to save event');
        }
    };

    // Handle task creation
    const handleCreateTask = () => {
        setSelectedTask(null);
        setShowTaskModal(true);
    };

    const handleSaveTask = async (taskData) => {
        try {
            const newTask = {
                ...taskData,
                id: Date.now(),
                assignedTo: session?.user?.name || 'Unknown User'
            };

            setTasks(prev => [...prev, newTask]);
            setShowTaskModal(false);
            toast.success('Task created successfully');
        } catch (error) {
            console.error('Error saving task:', error);
            toast.error('Failed to save task');
        }
    };

    // Get events for current date
    const getEventsForDate = (date) => {
        if (!date) return [];
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    // Get tasks for current date
    const getTasksForDate = (date) => {
        if (!date) return [];
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    // Check if date is today
    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Get filtered events
    const getFilteredEvents = () => {
        let filtered = events;

        if (eventFilter !== 'all') {
            filtered = filtered.filter(event => event.type === eventFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    // Get filtered tasks
    const getFilteredTasks = () => {
        if (searchQuery) {
            return tasks.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return tasks;
    };

    // Render month view
    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(currentDate);

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {monthNames[month]} {year}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePreviousMonth}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-6">
                    {weekDays.map((day, index) => (
                        <div key={index} className="text-center">
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                {day}
                            </div>
                            <div className="space-y-2 min-h-[100px]">
                                {daysInMonth.map((day, dayIndex) => {
                                    const date = day ? new Date(year, month, day) : null;
                                    const today = day ? isToday(date) : false;
                                    const hasWork = day ? hasEventsOrTasks(date) : false;

                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`border border-slate-200 dark:border-slate-600 rounded p-1 min-h-[80px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${today ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' :
                                                hasWork ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : ''
                                                }`}
                                            onClick={() => day && handleDateClick(day)}
                                        >
                                            <div className={`text-sm font-medium ${today ? 'text-blue-600 dark:text-blue-400 font-bold' :
                                                hasWork ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                                                }`}>
                                                {day || ''}
                                                {today && (
                                                    <span className="ml-1 text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5">Today</span>
                                                )}
                                                {hasWork && !today && (
                                                    <span className="ml-1 text-xs bg-amber-600 text-white rounded-full px-1.5 py-0.5">Work</span>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                {getEventsForDate(date).map(event => (
                                                    <div key={event.id} className={`text-xs p-1 rounded truncate ${event.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                                        event.type === 'deadline' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                                            event.type === 'appointment' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                                                'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                                        }`}>
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {getTasksForDate(date).map(task => (
                                                    <div key={task.id} className={`text-xs p-1 rounded truncate ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                                        task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                        }`}>
                                                        {task.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        onClick={handlePreviousWeek}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        <ChevronLeft className="w-5 h-5 inline mr-2" />
                        Previous Week
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        Next Week
                        <ChevronRight className="w-5 h-5 inline ml-2" />
                    </button>
                </div>
            </div>
        );
    };

    // Render week view
    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Week of {weekDays[0].toLocaleDateString()}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePreviousWeek}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNextWeek}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((date, index) => {
                        const today = isToday(date);
                        const hasWork = hasEventsOrTasks(date);

                        return (
                            <div key={index} className={`text-center border border-slate-200 dark:border-slate-600 rounded p-2 ${today ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' :
                                hasWork ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : ''
                                }`}>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className={`text-lg font-bold mb-2 ${today ? 'text-blue-600 dark:text-blue-400' :
                                    hasWork ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                                    }`}>
                                    {date.getDate()}
                                    {today && (
                                        <span className="ml-1 text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5 block mt-1">Today</span>
                                    )}
                                    {hasWork && !today && (
                                        <span className="ml-1 text-xs bg-amber-600 text-white rounded-full px-1.5 py-0.5 block mt-1">Work</span>
                                    )}
                                </div>
                                <div className="space-y-1 min-h-[120px]">
                                    {getEventsForDate(date).map(event => (
                                        <div
                                            key={event.id}
                                            className={`p-1 rounded text-xs truncate ${event.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                                event.type === 'deadline' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                                    event.type === 'appointment' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                                        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                                }`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {getTasksForDate(date).map(task => (
                                        <div
                                            key={task.id}
                                            className={`p-1 rounded text-xs truncate ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                                task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                }`}
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render day view
    const renderDayView = () => {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {isToday(currentDate) && (
                            <span className="ml-2 text-sm bg-blue-600 text-white rounded-full px-2 py-1">Today</span>
                        )}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePreviousDay}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNextDay}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Events
                        </h3>
                        <div className="space-y-3">
                            {getEventsForDate(currentDate).map((event) => (
                                <div
                                    key={event.id}
                                    className={`p-4 rounded-lg border-l-4 ${event.type === 'meeting' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                                        event.type === 'deadline' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                                            event.type === 'appointment' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                                                event.type === 'holiday' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                                                    'border-gray-300 bg-gray-50 dark:bg-gray-800'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white">{event.title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {event.time} - {event.location}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Assigned to: {event.assignedTo || 'Unassigned'}
                                            </p>
                                        </div>
                                        {event.priority === 'high' && (
                                            <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                                High Priority
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {getEventsForDate(currentDate).length === 0 && (
                                <p className="text-slate-500 dark:text-slate-400">No events for today.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Tasks
                        </h3>
                        <div className="space-y-3">
                            {getTasksForDate(currentDate).map((task) => (
                                <div
                                    key={task.id}
                                    className={`p-4 rounded-lg border-l-4 ${task.status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                                        task.status === 'in-progress' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                                            'border-gray-300 bg-gray-50 dark:bg-gray-800'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white">{task.title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Assigned to: {task.assignedTo || 'Unassigned'}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`w-4 h-4 ${task.status === 'completed' ? 'text-green-500' : 'text-slate-400'
                                                }`} />
                                            {task.priority === 'high' && (
                                                <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                                    High
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {getTasksForDate(currentDate).length === 0 && (
                                <p className="text-slate-500 dark:text-slate-400">No tasks due today.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render overview view
    const renderOverview = () => {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {users.map((user) => {
                        const { userEvents, userTasks } = getUserEventsAndTasks(user.name);
                        const activeTasks = userTasks.filter(task => task.status !== 'completed');
                        const completedTasks = userTasks.filter(task => task.status === 'completed');
                        const upcomingEvents = userEvents.filter(event => new Date(event.date) >= new Date());

                        return (
                            <div key={user._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{user.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Active Tasks</span>
                                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{activeTasks.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Completed Tasks</span>
                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{completedTasks.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Upcoming Events</span>
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{upcomingEvents.length}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Recent Work</h4>
                                    <div className="space-y-2">
                                        {activeTasks.slice(0, 2).map(task => (
                                            <div key={task.id} className="flex items-center text-xs">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${task.priority === 'high' ? 'bg-red-500' :
                                                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`} />
                                                <span className="text-slate-600 dark:text-slate-400 truncate">{task.title}</span>
                                            </div>
                                        ))}
                                        {upcomingEvents.slice(0, 2).map(event => (
                                            <div key={event.id} className="flex items-center text-xs">
                                                <Calendar className="w-3 h-3 mr-2 text-blue-500" />
                                                <span className="text-slate-600 dark:text-slate-400 truncate">{event.title}</span>
                                            </div>
                                        ))}
                                        {activeTasks.length === 0 && upcomingEvents.length === 0 && (
                                            <p className="text-xs text-slate-400 dark:text-slate-500">No active work</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button classname=" cursor-pointertext-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar & Overview</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleViewChange('overview')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${currentView === 'overview' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                <BarChart3 className="w-4 h-4 inline mr-2" />
                                Overview
                            </button>
                            <button
                                onClick={() => handleViewChange('month')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${currentView === 'month' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Month
                            </button>
                            <button
                                onClick={() => handleViewChange('week')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${currentView === 'week' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                <Grid3X3 className="w-4 h-4 inline mr-2" />
                                Week
                            </button>
                            <button
                                onClick={() => handleViewChange('day')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${currentView === 'day' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                <List className="w-4 h-4 inline mr-2" />
                                Day
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <select
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                                <option value="all">All Events</option>
                                <option value="meeting">Meetings</option>
                                <option value="deadline">Deadlines</option>
                                <option value="appointment">Appointments</option>
                                <option value="holiday">Holidays</option>
                            </select>

                            <button
                                onClick={handleCreateEvent}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search events or tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Calendar View */}
            {currentView === 'overview' && renderOverview()}
            {currentView === 'month' && renderMonthView()}
            {currentView === 'week' && renderWeekView()}
            {currentView === 'day' && renderDayView()}

            {/* Task Creation Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div> */}

                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium cursor-pointer text-slate-900 dark:text-white">Create New Task</h3>
                                    <button
                                        onClick={() => setShowTaskModal(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveTask({
                                    title: e.target.title.value,
                                    description: e.target.description.value,
                                    dueDate: e.target.dueDate.value,
                                    priority: e.target.priority.value
                                });
                            }}>
                                <div className="px-4 pb-4 sm:p-6 sm:pb-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Task Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Due Date
                                            </label>
                                            <input
                                                type="date"
                                                name="dueDate"
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Priority
                                            </label>
                                            <select
                                                name="priority"
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 px-4 pb-4 sm:px-6 sm:pb-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTaskModal(false)}
                                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                    >
                                        Create Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Creation Modal */}
            {showEventModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div> */}

                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Create New Event</h3>
                                    <button
                                        onClick={() => setShowEventModal(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveEvent({
                                    title: e.target.title.value,
                                    description: e.target.description.value,
                                    date: e.target.date.value,
                                    time: e.target.time.value,
                                    location: e.target.location.value,
                                    type: e.target.type.value
                                });
                            }}>
                                <div className="px-4 pb-4 sm:p-6 sm:pb-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Event Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Time
                                            </label>
                                            <input
                                                type="time"
                                                name="time"
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                placeholder="e.g., Conference Room A"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Event Type
                                        </label>
                                        <select
                                            name="type"
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        >
                                            <option value="meeting">Meeting</option>
                                            <option value="deadline">Deadline</option>
                                            <option value="appointment">Appointment</option>
                                            <option value="holiday">Holiday</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 px-4 pb-4 sm:px-6 sm:pb-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEventModal(false)}
                                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                    >
                                        Create Event
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}