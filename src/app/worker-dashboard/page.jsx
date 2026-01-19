"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Play,
  Pause,
  Square,
  Edit,
  LogOut,
  Moon,
  Sun,
  Bell,
  Settings,
  Target,
  Briefcase,
  FileText,
  Timer,
  BarChart3,
  Award,
  MapPin,
  Mail,
  Phone,
  Globe,
  X,
  Loader2,
  ChevronDown,
  Users,
  MoreHorizontal,
  Home,
  UserCheck,
  Activity,
  ChevronRight,
  Zap,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function WorkerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const profileDropdownRef = useRef(null);

  // State
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Chart State
  const [chartView, setChartView] = useState("weekly");
  const [chartData, setChartData] = useState([]);

  // Worker Data State
  const [workerData, setWorkerData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);

  // Time Tracking State
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [currentProject, setCurrentProject] = useState("");
  const [intervalId, setIntervalId] = useState(null);

  // Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
    phone: "",
    location: "",
    website: "",
  });

  const projects = [
    { id: 1, name: "Website Redesign", color: "bg-blue-500" },
    { id: 2, name: "Mobile App Development", color: "bg-green-500" },
    { id: 3, name: "API Integration", color: "bg-purple-500" },
  ];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    // Pass the session user data to the fetch functions
    fetchWorkerData(session.user);
    fetchTasks(session.user);
    fetchTimeEntries(session.user);
    fetchChartData(chartView);
  }, [session, status, router, chartView]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modified to use session user data
  useEffect(() => {
    if (!session) return;

    // Set user data from session
    const data = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image || null,
      // Add any additional fields you need
    };

    setWorkerData(data);
    setLoading(false);
  }, [session]);

  // Modified to use session user data
  const fetchWorkerData = async (user) => {
    try {
      // In a real app, you would fetch from your API:
      // const response = await fetch(`/api/workers/${user.id}`);
      // const data = await response.json();

      // Mock data with additional fields
      const mockWorkerData = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image || null,
        hourlyRate: 25, // Default hourly rate
        avgRating: 4.5, // Default rating
        // Add any other fields you need
      };

      setWorkerData(mockWorkerData);
    } catch (error) {
      toast.error("Failed to fetch worker data");
    }
  };

  // Modified to fetch real tasks from API
  const fetchTasks = async (user) => {
    try {
      // Fetch real tasks from your API
      const response = await fetch("/api/work");
      const data = await response.json();

      // Filter tasks assigned to the current user
      const userTasks = data.filter((task) => task.assignedTo === user.id);

      // Transform the data to match your component's expected format
      const transformedTasks = userTasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        project: task.project || "Default Project", // Add project field if not present
        dueDate: task.dueDate,
        priority: task.priority || "medium", // Add priority field if not present
        status: task.status,
        progress: task.progress || 0,
      }));

      setTasks(transformedTasks);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    }
  };

  // Modified to use session user data
  const fetchTimeEntries = async (user) => {
    try {
      // In a real app, you would fetch from your API:
      // const response = await fetch(`/api/time-entries?userId=${user.id}`);
      // const data = await response.json();

      const mockEntries = [
        {
          id: "e1",
          project: "Mobile App",
          task: "Implement User Authentication",
          duration: "2h 30m",
          date: "2023-06-20",
        },
        {
          id: "e2",
          project: "Website Redesign",
          task: "Design Homepage Mockup",
          duration: "4h 15m",
          date: "2023-06-19",
        },
      ];
      setTimeEntries(mockEntries);
    } catch (error) {
      toast.error("Failed to fetch time entries");
    }
  };

  const fetchChartData = (view) => {
    let data = [];
    if (view === "weekly") {
      data = [
        { name: "Mon", hours: 8 },
        { name: "Tue", hours: 7.5 },
        { name: "Wed", hours: 9 },
        { name: "Thu", hours: 6 },
        { name: "Fri", hours: 8.5 },
        { name: "Sat", hours: 4 },
        { name: "Sun", hours: 0 },
      ];
    } else if (view === "monthly") {
      data = [
        { name: "Week 1", hours: 42 },
        { name: "Week 2", hours: 38 },
        { name: "Week 3", hours: 45 },
        { name: "Week 4", hours: 40 },
      ];
    } else if (view === "yearly") {
      data = [
        { name: "Jan", hours: 160 },
        { name: "Feb", hours: 175 },
        { name: "Mar", hours: 150 },
        { name: "Apr", hours: 180 },
        { name: "May", hours: 165 },
        { name: "Jun", hours: 155 },
        { name: "Jul", hours: 0 },
        { name: "Aug", hours: 0 },
        { name: "Sep", hours: 0 },
        { name: "Oct", hours: 0 },
        { name: "Nov", hours: 0 },
        { name: "Dec", hours: 0 },
      ];
    }
    setChartData(data);
  };

  // Modified to update user profile in a real API
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // In a real app, you would update your API:
      // const response = await fetch(`/api/workers/${session.user.id}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(profileForm)
      // });

      setWorkerData((prev) => ({ ...prev, ...profileForm }));
      setIsProfileModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const startTracking = () => {
    if (!currentTask || !currentProject) {
      toast.error("Please select a task and project to start tracking.");
      return;
    }
    setIsTracking(true);
    const id = setInterval(() => setCurrentTime((prev) => prev + 1), 1000);
    setIntervalId(id);
    toast.success("Time tracking started");
  };

  const pauseTracking = () => {
    setIsTracking(false);
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    toast.success("Time tracking paused");
  };

  // Modified to save time entry with user ID
  const stopTracking = () => {
    if (!isTracking) return;
    setIsTracking(false);
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    const duration = formatTime(currentTime);
    const newEntry = {
      id: `e${Date.now()}`,
      project: currentProject,
      task: currentTask,
      duration,
      date: new Date().toISOString().split("T")[0],
      userId: session?.user?.id, // Add user ID to the time entry
    };

    // In a real app, you would save to your API:
    // await fetch('/api/time-entries', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(newEntry)
    // });

    setTimeEntries((prev) => [newEntry, ...prev]);
    setCurrentTime(0);
    setCurrentTask("");
    setCurrentProject("");
    toast.success(`Time entry saved: ${duration} for ${currentTask}`);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      medium:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[priority]}`}
      >
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      "in-progress":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      pending:
        "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
      completed:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      archived:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
      >
        {status.replace("-", " ")}
      </span>
    );
  };

  const calculateProfileCompletion = () => {
    const fields = ["name", "email", "bio", "phone", "location", "website"];
    const completedFields = fields.filter((field) => profileForm[field]).length;
    return (completedFields / fields.length) * 100;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100">
        {/* <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Worker Dashboard</h1>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    {isDarkMode ? <Sun className="w-5 h-5 text-slate-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                                </button>
                                <button className=" cursor-pointerp-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 relative transition-colors">
                                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                </button>
                                <div className="relative" ref={profileDropdownRef}>
                                    <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        {workerData.image ? (
                                            <img src={workerData.image} alt={workerData.name} className="h-8 w-8 rounded-full mr-2" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-2">
                                                {workerData.name?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        )}
                                        <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                                            <button onClick={() => { setIsProfileModalOpen(true); setIsProfileDropdownOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                <Settings className="w-4 h-4 mr-2" /> Settings
                                            </button>
                                            <button onClick={() => router.push('/api/auth/signout')} className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                <LogOut className="w-4 h-4 mr-2" /> Log Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header> */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {workerData.name}!
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Here's what's happening with your work today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Hours This Week</p>
                  <p className="text-3xl font-bold">32.5</p>
                  <div className="flex items-center text-sm text-blue-100 mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>12% from last week</span>
                  </div>
                </div>
                <Clock className="w-10 h-10 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Tasks Completed</p>
                  <p className="text-3xl font-bold">
                    {tasks.filter((t) => t.status === "completed").length}
                  </p>
                  <div className="flex items-center text-sm text-emerald-100 mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>8% from last week</span>
                  </div>
                </div>
                <CheckCircle className="w-10 h-10 text-emerald-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100">Current Earnings</p>
                  <p className="text-3xl font-bold">
                    $
                    {workerData.hourlyRate
                      ? (workerData.hourlyRate * 32.5).toFixed(2)
                      : "0.00"}
                  </p>
                  <div className="flex items-center text-sm text-amber-100 mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>5% from last week</span>
                  </div>
                </div>
                <DollarSign className="w-10 h-10 text-amber-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg. Rating</p>
                  <p className="text-3xl font-bold">
                    {workerData.avgRating || "0.0"}
                  </p>
                  <div className="flex items-center text-sm text-purple-100 mt-1">
                    <Star className="w-4 h-4 mr-1" />
                    <span>Excellent</span>
                  </div>
                </div>
                <Award className="w-10 h-10 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="flex border-b border-slate-200 dark:border-slate-700 relative">
              {["overview", "my-tasks", "time-tracking", "performance"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors capitalize relative z-10 ${
                      activeTab === tab
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    }`}
                  >
                    {tab.replace("-", " ")}
                  </button>
                ),
              )}
              <div
                className="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300"
                style={{
                  width: "25%",
                  transform: `translateX(${["overview", "my-tasks", "time-tracking", "performance"].indexOf(activeTab) * 100}%)`,
                }}
              ></div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Work Activity
                    </h3>
                    <div className="flex space-x-2" role="group">
                      {["weekly", "monthly", "yearly"].map((view) => (
                        <button
                          key={view}
                          onClick={() => setChartView(view)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${chartView === view ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
                        >
                          {view}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorHours"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                        stroke={isDarkMode ? "#475569" : "#E2E8F0"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={isDarkMode ? "#94A3B8" : "#64748B"}
                      />
                      <YAxis stroke={isDarkMode ? "#94A3B8" : "#64748B"} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorHours)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Upcoming Deadlines
                  </h4>
                  <ul className="space-y-3">
                    {tasks
                      .filter(
                        (t) =>
                          t.status !== "completed" && t.status !== "archived",
                      )
                      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                      .slice(0, 5)
                      .map((task) => (
                        <li
                          key={task.id}
                          className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border-l-4 border-amber-500 hover:shadow-md transition-shadow"
                        >
                          <p className="font-medium text-slate-900 dark:text-white">
                            {task.title}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* My Tasks Tab */}
            {activeTab === "my-tasks" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                          {task.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {task.project}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPriorityBadge(task.priority)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(task.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className=" cursor-pointertext-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Time Tracking Tab */}
            {activeTab === "time-tracking" && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8 p-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl">
                  <h3 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                    {formatTime(currentTime)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Current Session
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <select
                    value={currentProject}
                    onChange={(e) => setCurrentProject(e.target.value)}
                    className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Task</option>
                    {tasks
                      .filter(
                        (t) =>
                          t.status !== "completed" && t.status !== "archived",
                      )
                      .map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-center space-x-4">
                  {!isTracking ? (
                    <button
                      onClick={startTracking}
                      className="flex items-center px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
                    >
                      <Play className="w-5 h-5 mr-2" /> Start Tracking
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={pauseTracking}
                        className="flex items-center px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
                      >
                        <Pause className="w-5 h-5 mr-2" /> Pause
                      </button>
                      <button
                        onClick={stopTracking}
                        className="flex items-center px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                      >
                        <Square className="w-5 h-5 mr-2" /> Stop & Save
                      </button>
                    </>
                  )}
                </div>
                <div className="mt-8">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Recent Time Entries
                  </h4>
                  <div className="space-y-3">
                    {timeEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {entry.task}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {entry.project} - {entry.date}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {entry.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <div className="text-center">
                <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Excellent Performance!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Your average rating is {workerData.avgRating || "0.0"} out of
                  5.
                </p>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.floor(workerData.avgRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Edit Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => setIsProfileModalOpen(false)}
              ></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full p-6">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Edit Your Profile
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Profile Completion
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {calculateProfileCompletion()}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${calculateProfileCompletion()}%` }}
                    ></div>
                  </div>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            location: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(false)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updating ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
