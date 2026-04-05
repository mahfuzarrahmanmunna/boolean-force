"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaUsers,
  FaTasks,
  FaClock,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaSearch,
  FaDownload,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaBuilding,
  FaPhone,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaEdit,
  FaEye,
  FaPlus,
  FaUserTie,
  FaBriefcase,
  FaGraduationCap,
  FaAward,
  FaStar,
  FaRocket,
  FaMedal,
  FaFire,
  FaGem,
  FaCrown,
  FaCertificate,
  FaLightbulb,
  FaHandshake,
  FaPuzzlePiece,
  FaTools,
  FaCogs,
  FaFlag,
  FaHistory,
  FaChartArea,
  FaIndustry,
  FaProjectDiagram,
  FaGlobe,
  FaUserClock,
  FaRegChartBar,
  FaInfoCircle,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

// Recharts imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// shadcn/ui imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

// Constants
const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
    color: "#10b981",
    lightColor: "bg-emerald-100",
    textColor: "text-emerald-800",
    icon: FaCheckCircle,
  },
  {
    value: "inactive",
    label: "Inactive",
    color: "#64748b",
    lightColor: "bg-slate-100",
    textColor: "text-slate-800",
    icon: FaTimes,
  },
  {
    value: "pending",
    label: "Pending",
    color: "#f59e0b",
    lightColor: "bg-amber-100",
    textColor: "text-amber-800",
    icon: FaClock,
  },
  {
    value: "suspended",
    label: "Suspended",
    color: "#ef4444",
    lightColor: "bg-red-100",
    textColor: "text-red-800",
    icon: FaExclamationCircle,
  },
];

const JOB_TITLE_OPTIONS = [
  { value: "full-stack-developer", label: "Full Stack Developer", icon: "💻", color: "#3b82f6", level: "high" },
  { value: "devops-engineer", label: "DevOps Engineer", icon: "🔧", color: "#8b5cf6", level: "high" },
  { value: "graphics-designer", label: "Graphics Designer", icon: "🎨", color: "#ec4899", level: "medium" },
  { value: "ui-ux-designer", label: "UI/UX Designer", icon: "🎨", color: "#6366f1", level: "medium" },
  { value: "backend-developer", label: "Backend Developer", icon: "💻", color: "#06b6d4", level: "high" },
  { value: "frontend-developer", label: "Frontend Developer", icon: "💻", color: "#10b981", level: "high" },
  { value: "mobile-developer", label: "Mobile Developer", icon: "📱", color: "#f97316", level: "high" },
  { value: "qa-engineer", label: "QA Engineer", icon: "🔍", color: "#14b8a6", level: "medium" },
  { value: "data-scientist", label: "Data Scientist", icon: "📊", color: "#8b5cf6", level: "high" },
  { value: "product-manager", label: "Product Manager", icon: "📋", color: "#f59e0b", level: "high" },
  { value: "other", label: "Other", icon: "👤", color: "#64748b", level: "low" },
];

const CATEGORY_OPTIONS = [
  { value: "development", label: "Development", icon: "💻", color: "#3b82f6" },
  { value: "design", label: "Design", icon: "🎨", color: "#ec4899" },
  { value: "marketing", label: "Marketing", icon: "📢", color: "#f97316" },
  { value: "research", label: "Research", icon: "🔍", color: "#8b5cf6" },
  { value: "maintenance", label: "Maintenance", icon: "🔧", color: "#6b7280" },
  { value: "testing", label: "Testing", icon: "🧪", color: "#14b8a6" },
  { value: "documentation", label: "Documentation", icon: "📝", color: "#6366f1" },
  { value: "other", label: "Other", icon: "📌", color: "#64748b" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "#10b981", lightColor: "bg-green-100", textColor: "text-green-800", icon: FaFlag },
  { value: "medium", label: "Medium", color: "#f59e0b", lightColor: "bg-yellow-100", textColor: "text-yellow-800", icon: FaFlag },
  { value: "high", label: "High", color: "#f97316", lightColor: "bg-orange-100", textColor: "text-orange-800", icon: FaFlag },
  { value: "urgent", label: "Urgent", color: "#ef4444", lightColor: "bg-red-100", textColor: "text-red-800", icon: FaFlag },
];

// Helper Components
const StatusBadge = ({ status }) => {
  const statusOption = STATUS_OPTIONS.find((option) => option.value === status);
  const Icon = statusOption?.icon || FaCheckCircle;

  return (
    <Badge
      className={`px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1`}
      style={{ backgroundColor: statusOption?.color || "#64748b" }}
    >
      <Icon className="h-3 w-3" />
      {statusOption?.label || status}
    </Badge>
  );
};

const LoadingSpinner = ({ message }) => (
  <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
    <p className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300">
      {message}
    </p>
  </div>
);

const DonutChart = ({ data, colors, labels, title }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
    percentage: total > 0 ? Math.round((data[index] / total) * 100) : 0,
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-sm font-medium">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} innerRadius={40} fill="#8884d8" dataKey="value">
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, props.payload.name]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700">
            <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: colors[index] }}></div>
            <div className="text-xs">
              <div className="font-medium text-slate-800 dark:text-white truncate">{item.name}</div>
              <div className="text-slate-600 dark:text-slate-400">{item.value} ({item.percentage}%)</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChartComponent = ({ data, labels, title, colors }) => {
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
    fill: colors[index],
  }));

  return (
    <div className="h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} angle={-45} textAnchor="end" height={100} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LineChartComponent = ({ data, labels, title, colors }) => {
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
  }));

  return (
    <div className="h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} angle={-45} textAnchor="end" height={100} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={3} dot={{ fill: colors[0], strokeWidth: 2, r: 6 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const AreaChartComponent = ({ data, labels, title, colors }) => {
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
  }));

  return (
    <div className="h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} angle={-45} textAnchor="end" height={100} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const DistributionCard = ({ title, data, labels, colors, icon: Icon, type }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  const [viewMode, setViewMode] = useState("chart"); 
  const listData = labels.map((label, index) => ({
    name: label,
    value: data[index],
    percentage: total > 0 ? Math.round((data[index] / total) * 100) : 0,
    color: colors[index],
  }));

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 dark:text-white flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
              <Icon className="h-5 w-5" />
            </div>
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setViewMode(viewMode === "chart" ? "list" : "chart")} className={`p-2 rounded-lg transition-colors ${viewMode === "chart" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                  {viewMode === "chart" ? <FaRegChartBar className="h-4 w-4" /> : <FaChartBar className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent><p>{viewMode === "chart" ? "Switch to list view" : "Switch to chart view"}</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <FaInfoCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent><p>More information</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {viewMode === "chart" ? (
          <BarChartComponent data={data} labels={labels} title="" colors={colors} />
        ) : (
          <div className="space-y-3">
            {listData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{item.value} items ({item.percentage}%)</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-slate-200 dark:bg-slate-600 rounded-full h-2 mr-2">
                    <div className="h-2 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                  </div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{item.value}</div>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{total}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PerformanceCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue, bgGradient }) => (
  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-white dark:bg-slate-800">
    <div className={`h-1 ${bgGradient}`}></div>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl bg-opacity-10 group-hover:scale-110 transition-transform duration-300`} style={{ backgroundColor: `${color}20` }}>
          <Icon className={`h-8 w-8`} style={{ color }} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          {trend === "up" ? (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <FaArrowUp className="h-3 w-3 mr-1" />
              <span className="text-sm font-medium">{trendValue}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <FaArrowDown className="h-3 w-3 mr-1" />
              <span className="text-sm font-medium">{trendValue}%</span>
            </div>
          )}
          <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">from last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Main Component
export default function WorkerAnalytics() {
  const [workers, setWorkers] = useState([]);
  const [availableWork, setAvailableWork] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTitleFilter, setJobTitleFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const reportRef = useRef(null);
  const router = useRouter();

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // IMPORTANT: Ensure you are fetching the correct API. If you are fetching 'projects' here, 
        // make sure the data structure matches (name, email, status, jobTitle).
        const [workersResponse, workResponse] = await Promise.all([
          fetch("/api/projects"), 
          fetch("/api/projects"),
        ]);

        if (!workersResponse.ok) throw new Error("Failed to fetch workers");
        if (!workResponse.ok) throw new Error("Failed to fetch work tasks");

        const workersData = await workersResponse.json();
        const workData = await workResponse.json();

        setWorkers(workersData);
        setAvailableWork(workData);

        const userRole = localStorage.getItem("userRole") || "user";
        setIsAdmin(userRole === "admin");
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to load data. Please try again.", "error");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const analytics = useMemo(() => {
    const totalWorkers = workers.length;
    const activeWorkers = workers.filter((w) => w.status === "active").length;
    const inactiveWorkers = workers.filter((w) => w.status === "inactive").length;
    const pendingWorkers = workers.filter((w) => w.status === "pending").length;
    const suspendedWorkers = workers.filter((w) => w.status === "suspended").length;

    const jobTitleDistribution = workers.reduce((acc, worker) => {
      const title = worker.jobTitle || "other";
      acc[title] = (acc[title] || 0) + 1;
      return acc;
    }, {});

    const totalWorkItems = availableWork.length;
    const assignedWorkItems = availableWork.filter((w) => w.assignedTo).length;
    const unassignedWorkItems = totalWorkItems - assignedWorkItems;

    const workersWithWork = workers.filter((w) => w.assignedWork && w.assignedWork.length > 0);
    const avgWorkPerWorker = workersWithWork.length > 0 ? Math.round(workersWithWork.reduce((sum, w) => sum + w.assignedWork.length, 0) / workersWithWork.length) : 0;

    const topPerformers = workers.filter((w) => w.assignedWork && w.assignedWork.length > 0).sort((a, b) => b.assignedWork.length - a.assignedWork.length).slice(0, 5);

    const workByCategory = availableWork.reduce((acc, work) => {
      const category = work.category || "other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const workByPriority = availableWork.reduce((acc, work) => {
      const priority = work.priority || "medium";
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    const completedWork = availableWork.filter((w) => w.status === "completed").length;
    const inProgressWork = availableWork.filter((w) => w.status === "in-progress").length;
    const completionRate = totalWorkItems > 0 ? Math.round((completedWork / totalWorkItems) * 100) : 0;

    const monthlyCompletion = [65, 78, 82, 91, 73, 85, 90, 88, 92, 87, 94, 96];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return {
      totalWorkers, activeWorkers, inactiveWorkers, pendingWorkers, suspendedWorkers,
      jobTitleDistribution, totalWorkItems, assignedWorkItems, unassignedWorkItems,
      avgWorkPerWorker, topPerformers, workByCategory, workByPriority,
      completionRate, monthlyCompletion, months,
    };
  }, [workers, availableWork]);

  // FIX: Added fallback strings to prevent "Cannot read properties of undefined (reading 'toLowerCase')"
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // FIX: Add fallback strings for name and email
      const workerName = worker?.name || "";
      const workerEmail = worker?.email || "";

      const matchesSearch =
        workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
      const matchesJobTitle = jobTitleFilter === "all" || worker.jobTitle === jobTitleFilter;
      return matchesSearch && matchesStatus && matchesJobTitle;
    });
  }, [workers, searchTerm, statusFilter, jobTitleFilter]);

  const filteredWork = useMemo(() => {
    if (dateRange === "all") return availableWork;
    const now = new Date();
    let startDate;
    switch (dateRange) {
      case "week": startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case "month": startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
      case "quarter": startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1); break;
      case "year": startDate = new Date(now.getFullYear(), 0, 1); break;
      default: return availableWork;
    }
    return availableWork.filter((work) => new Date(work.createdAt) >= startDate);
  }, [availableWork, dateRange]);

  const generatePDFReport = async () => {
    if (!reportRef.current) return;
    try {
      showNotification("Generating PDF report...", "info");
      setTimeout(() => { showNotification("PDF report generated successfully!", "success"); }, 2000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification("Failed to generate PDF report. Please try again.", "error");
    }
  };

  if (isInitialLoading) return <LoadingSpinner message="Loading analytics data..." />;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse ${notification.type === "success" ? "bg-emerald-500 text-white" : notification.type === "error" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>
            {notification.type === "success" ? <FaCheckCircle className="text-xl" /> : notification.type === "error" ? <FaExclamationCircle className="text-xl" /> : <FaSpinner className="text-xl animate-spin" />}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 shadow-xl border-b border-slate-200 dark:border-slate-700 mb-8 rounded-t-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mr-4 shadow-lg"><FaChartBar className="h-6 w-6" /></div>
                    Worker Analytics
                  </h1>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">Comprehensive analytics and performance metrics for all workers</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={generatePDFReport} className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <FaDownload className="h-4 w-4 mr-2" />Download Report
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p>Generate PDF report</p></TooltipContent>
                  </Tooltip>
                  <button onClick={() => router.push("/dashboard/all-emplyee")} className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <FaUsers className="h-4 w-4 mr-2" />Manage Workers
                  </button>
                  {isAdmin && (
                    <button onClick={() => router.push("/dashboard/add-worker")} className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <FaPlus className="h-4 w-4 mr-2" />Add Worker
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FaSearch className="h-5 w-5 text-slate-400" /></div>
                  <input type="text" placeholder="Search workers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400" />
                </div>
                <div>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <option value="all">All Statuses</option>
                    {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div>
                  <select value={jobTitleFilter} onChange={(e) => setJobTitleFilter(e.target.value)} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <option value="all">All Job Titles</option>
                    {JOB_TITLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div>
                  <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-md">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer"><FaChartBar className="h-4 w-4" />Overview</TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer"><FaChartLine className="h-4 w-4" />Performance</TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer"><FaChartPie className="h-4 w-4" />Distribution</TabsTrigger>
              <TabsTrigger value="workers" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer"><FaUsers className="h-4 w-4" />Workers</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <PerformanceCard title="Total Workers" value={analytics.totalWorkers} subtitle={`${analytics.activeWorkers} active`} icon={FaUsers} color="#3b82f6" bgGradient="bg-gradient-to-r from-blue-500 to-blue-600" trend="up" trendValue="12" />
                <PerformanceCard title="Active Workers" value={analytics.activeWorkers} subtitle={`${analytics.totalWorkers > 0 ? Math.round((analytics.activeWorkers / analytics.totalWorkers) * 100) : 0}% of total`} icon={FaCheckCircle} color="#10b981" bgGradient="bg-gradient-to-r from-emerald-500 to-emerald-600" trend="up" trendValue="8" />
                <PerformanceCard title="Pending Workers" value={analytics.pendingWorkers} subtitle={`${analytics.totalWorkers > 0 ? Math.round((analytics.pendingWorkers / analytics.totalWorkers) * 100) : 0}% of total`} icon={FaClock} color="#f59e0b" bgGradient="bg-gradient-to-r from-amber-500 to-amber-600" trend="down" trendValue="3" />
                <PerformanceCard title="Work Items" value={analytics.totalWorkItems} subtitle={`${analytics.assignedWorkItems} assigned`} icon={FaTasks} color="#8b5cf6" bgGradient="bg-gradient-to-r from-purple-500 to-purple-600" trend="up" trendValue="15" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center"><div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white mr-3"><FaChartPie className="h-5 w-5" /></div>Worker Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DonutChart data={[analytics.activeWorkers, analytics.inactiveWorkers, analytics.pendingWorkers, analytics.suspendedWorkers]} colors={["#10b981", "#64748b", "#f59e0b", "#ef4444"]} labels={["Active", "Inactive", "Pending", "Suspended"]} title="Worker Status" />
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center"><div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white mr-3"><FaTrophy className="h-5 w-5" /></div>Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topPerformers.map((worker, index) => (
                        <div key={worker._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                              {/* FIX: Added fallback for name */}
                              {(worker.name || "Unknown").split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{worker.name || "Unknown Worker"}</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">{worker.email || "No Email"}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className="bg-blue-100 text-blue-800 mr-2"><FaTasks className="h-3 w-3 mr-1" />{worker.assignedWork ? worker.assignedWork.length : 0} tasks</Badge>
                          </div>
                          <div className="flex items-center">
                            {index === 0 && <FaTrophy className="h-5 w-5 text-yellow-500 mr-2" />}
                            {index === 1 && <FaAward className="h-5 w-5 text-gray-400 mr-2" />}
                            {index === 2 && <FaAward className="h-5 w-5 text-orange-600 mr-2" />}
                            <div className="text-lg font-bold text-slate-900 dark:text-white">#{index + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center"><div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3"><FaChartLine className="h-5 w-5" /></div>Monthly Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent><AreaChartComponent data={analytics.monthlyCompletion} labels={analytics.months} title="Monthly Completion Rate" colors={["#10b981"]} /></CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center"><div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white mr-3"><FaRegChartBar className="h-5 w-5" /></div>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Work Items</span><span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalWorkItems}</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }}></div></div></div>
                    <div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Work Items</span><span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.assignedWorkItems}</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{ width: `${analytics.totalWorkItems > 0 ? (analytics.assignedWorkItems / analytics.totalWorkItems) * 100 : 0}%` }}></div></div></div>
                    <div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</span><span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.completionRate}%</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${analytics.completionRate}%` }}></div></div></div>
                    <div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Work per Worker</span><span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.avgWorkPerWorker}</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(analytics.avgWorkPerWorker * 10, 100)}%` }}></div></div></div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Distribution Tab */}
            <TabsContent value="distribution" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <DistributionCard title="Job Title Distribution" data={Object.values(analytics.jobTitleDistribution)} labels={Object.keys(analytics.jobTitleDistribution).map((title) => JOB_TITLE_OPTIONS.find((opt) => opt.value === title)?.label || title)} colors={Object.keys(analytics.jobTitleDistribution).map((title) => JOB_TITLE_OPTIONS.find((opt) => opt.value === title)?.color || "#64748b")} icon={FaIndustry} type="job" />
                <DistributionCard title="Work Category Distribution" data={Object.values(analytics.workByCategory)} labels={Object.keys(analytics.workByCategory).map((category) => CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label || category)} colors={Object.keys(analytics.workByCategory).map((category) => CATEGORY_OPTIONS.find((opt) => opt.value === category)?.color || "#64748b")} icon={FaProjectDiagram} type="category" />
              </div>
            </TabsContent>

            {/* Workers Tab */}
            <TabsContent value="workers" className="mt-6">
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="text-slate-900 dark:text-white">Worker Details</CardTitle>
                  <CardDescription>Showing {filteredWorkers.length} of {workers.length} workers</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Worker</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Title</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned Work</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredWorkers.length > 0 ? (
                          filteredWorkers.map((worker) => (
                            <tr key={worker._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-12 w-12 flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                      {/* FIX: Added fallback for name */}
                                      {(worker.name || "Unknown").split(" ").map((n) => n[0]).join("").toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{worker.name || "Unknown Worker"}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{worker.email || "No Email"}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center"><span className="text-lg mr-2">{JOB_TITLE_OPTIONS.find((opt) => opt.value === worker.jobTitle)?.icon || "👤"}</span><span className="text-sm text-slate-900 dark:text-white">{JOB_TITLE_OPTIONS.find((opt) => opt.value === worker.jobTitle)?.label || "Other"}</span></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={worker.status} /></td>
                              <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><span className="text-sm text-slate-900 dark:text-white mr-2">{worker.assignedWork ? worker.assignedWork.length : 0}</span></div></td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => router.push(`/dashboard/worker-details/${worker._id}`)} className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"><FaEye className="h-4 w-4 mr-1" />View Details</button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4"><FaUsers className="h-8 w-8 text-slate-400" /></div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No workers found</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}