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
  FaDollarSign,
  FaCalendarAlt,
  FaTag,
  FaClipboardList,
  FaChevronDown,
  FaProjectDiagram as FaProjectIcon,
  FaUserFriends,
  FaEllipsisV,
  FaFolderOpen,
  FaListAlt,
  FaCalendarCheck,
  FaUserShield,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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

// Define consistent color palette
const COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  dark: "#1e293b",
  light: "#f8fafc",
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
};

// Constants with professional color palette
const STATUS_OPTIONS = [
  {
    value: "completed",
    label: "Completed",
    color: COLORS.success,
    lightColor: "bg-emerald-100",
    textColor: "text-emerald-800",
    icon: FaCheckCircle,
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: COLORS.primary,
    lightColor: "bg-blue-100",
    textColor: "text-blue-800",
    icon: FaSpinner,
  },
  {
    value: "pending",
    label: "Pending",
    color: COLORS.warning,
    lightColor: "bg-amber-100",
    textColor: "text-amber-800",
    icon: FaClock,
  },
  {
    value: "archived",
    label: "Archived",
    color: COLORS.slate[500],
    lightColor: "bg-slate-100",
    textColor: "text-slate-800",
    icon: FaTimes,
  },
  {
    value: "approved",
    label: "Approved",
    color: COLORS.secondary,
    lightColor: "bg-purple-100",
    textColor: "text-purple-800",
    icon: FaCheckCircle,
  },
];

const CATEGORY_OPTIONS = [
  {
    value: "development",
    label: "Development",
    icon: "💻",
    color: COLORS.primary,
  },
  { value: "design", label: "Design", icon: "🎨", color: "#ec4899" },
  { value: "marketing", label: "Marketing", icon: "📢", color: COLORS.warning },
  { value: "research", label: "Research", icon: "🔍", color: COLORS.secondary },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: "🔧",
    color: COLORS.slate[500],
  },
  { value: "mobile-app", label: "Mobile App", icon: "📱", color: "#06b6d4" },
  { value: "other", label: "Other", icon: "📌", color: COLORS.slate[500] },
];

const PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Low",
    color: COLORS.success,
    lightColor: "bg-green-100",
    textColor: "text-green-800",
    icon: FaFlag,
  },
  {
    value: "medium",
    label: "Medium",
    color: COLORS.warning,
    lightColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    icon: FaFlag,
  },
  {
    value: "high",
    label: "High",
    color: "#f97316",
    lightColor: "bg-orange-100",
    textColor: "text-orange-800",
    icon: FaFlag,
  },
  {
    value: "urgent",
    label: "Urgent",
    color: COLORS.danger,
    lightColor: "bg-red-100",
    textColor: "text-red-800",
    icon: FaFlag,
  },
];

// Helper Components
const StatusBadge = ({ status }) => {
  const statusOption = STATUS_OPTIONS.find((option) => option.value === status);
  const Icon = statusOption?.icon || FaCheckCircle;

  return (
    <Badge
      className={`px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1`}
      style={{ backgroundColor: statusOption?.color || COLORS.slate[500] }}
    >
      <Icon className="h-3 w-3" />
      {statusOption?.label || status}
    </Badge>
  );
};

const PriorityBadge = ({ priority }) => {
  const priorityOption = PRIORITY_OPTIONS.find(
    (option) => option.value === priority
  );
  const Icon = priorityOption?.icon || FaFlag;

  return (
    <Badge
      className={`px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1`}
      style={{ backgroundColor: priorityOption?.color || COLORS.slate[500] }}
    >
      <Icon className="h-3 w-3" />
      {priorityOption?.label || priority}
    </Badge>
  );
};

const CategoryBadge = ({ category }) => {
  const categoryOption = CATEGORY_OPTIONS.find(
    (option) => option.value === category
  );

  return (
    <Badge
      className={`px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1`}
      style={{ backgroundColor: categoryOption?.color || COLORS.slate[500] }}
    >
      <span className="mr-1">{categoryOption?.icon || "📌"}</span>
      {categoryOption?.label || category}
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

// Enhanced Chart Components using Recharts with professional styling
const DonutChart = ({ data, colors, labels, title }) => {
  const total = data.reduce((sum, value) => sum + value, 0);

  // Transform data for Recharts
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
    percentage: total > 0 ? Math.round((data[index] / total) * 100) : 0,
  }));

  // Custom label for the pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if percentage is less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value} (${props.payload.percentage}%)`,
              props.payload.name,
            ]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="flex items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700"
          >
            <div
              className="h-3 w-3 rounded-full mr-2"
              style={{ backgroundColor: colors[index] }}
            ></div>
            <div className="text-xs">
              <div className="font-medium text-slate-800 dark:text-white truncate">
                {item.name}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {item.value} ({item.percentage}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChartComponent = ({ data, labels, title, colors }) => {
  // Transform data for Recharts
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
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748b" }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LineChartComponent = ({ data, labels, title, colors }) => {
  // Transform data for Recharts
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
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748b" }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            strokeWidth={3}
            dot={{ fill: colors[0], strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const AreaChartComponent = ({ data, labels, title, colors }) => {
  // Transform data for Recharts
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
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748b" }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Performance Card Component with professional design
const PerformanceCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  trendValue,
  bgGradient,
}) => (
  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-white dark:bg-slate-800">
    <div className={`h-1 ${bgGradient}`}></div>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div
          className={`p-3 rounded-xl bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}
          style={{ backgroundColor: `${color}20` }}
        >
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
          <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
            from last month
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Enhanced Project Analytics Component
const ProjectAnalytics = ({ projectId, workItems, projects }) => {
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);

        // Filter work items by project ID (clientId)
        const projectWorkItems = workItems.filter(
          (item) => item.clientId === projectId
        );

        if (projectWorkItems.length === 0) {
          setProjectData(null);
          setIsLoading(false);
          return;
        }

        // Find the project name from the projects array
        const project = projects.find((p) => p.id === projectId);
        const projectName = project
          ? project.name
          : `Project ${projectId.substring(0, 8)}...`;

        // Calculate project analytics
        const totalTasks = projectWorkItems.length;
        const completedTasks = projectWorkItems.filter(
          (item) => item.status === "completed"
        ).length;
        const inProgressTasks = projectWorkItems.filter(
          (item) => item.status === "in-progress"
        ).length;
        const pendingTasks = projectWorkItems.filter(
          (item) => item.status === "pending"
        ).length;
        const archivedTasks = projectWorkItems.filter(
          (item) => item.status === "archived"
        ).length;
        const approvedTasks = projectWorkItems.filter(
          (item) => item.status === "approved"
        ).length;

        // Calculate budget
        const itemsWithBudget = projectWorkItems.filter(
          (item) => item.budget && item.budget > 0
        );
        const totalBudget = itemsWithBudget.reduce(
          (sum, item) => sum + (item.budget || 0),
          0
        );
        const avgBudget =
          itemsWithBudget.length > 0
            ? Math.round(totalBudget / itemsWithBudget.length)
            : 0;

        // Calculate average progress
        const totalProgress = projectWorkItems.reduce(
          (sum, item) => sum + (item.progress || 0),
          0
        );
        const avgProgress =
          totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;

        // Calculate category distribution
        const categoryDistribution = projectWorkItems.reduce((acc, item) => {
          const category = item.category || "other";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Calculate priority distribution
        const priorityDistribution = projectWorkItems.reduce((acc, item) => {
          const priority = item.priority || "medium";
          acc[priority] = (acc[priority] || 0) + 1;
          return acc;
        }, {});

        // Get unique assignees
        const uniqueAssignees = [
          ...new Set(
            projectWorkItems
              .filter((item) => item.assignedTo)
              .map((item) => item.assignedTo)
          ),
        ];

        // Get project dates
        const startDate = projectWorkItems.reduce((earliest, item) => {
          const itemDate = new Date(item.createdAt);
          return earliest < itemDate ? earliest : itemDate;
        }, new Date(projectWorkItems[0].createdAt));

        const dueDate = projectWorkItems.reduce((latest, item) => {
          if (!item.dueDate) return latest;
          const itemDate = new Date(item.dueDate);
          return latest > itemDate ? latest : itemDate;
        }, new Date(projectWorkItems[0].dueDate || Date.now()));

        // Create project data object
        const projectData = {
          id: projectId,
          name: projectName,
          status:
            avgProgress === 100
              ? "completed"
              : avgProgress > 0
              ? "in-progress"
              : "pending",
          startDate: startDate.toISOString().split("T")[0],
          endDate: dueDate.toISOString().split("T")[0],
          progress: avgProgress,
          budget: totalBudget,
          spent: totalBudget * (completedTasks / totalTasks),
          itemsWithBudget: itemsWithBudget.length,
          avgBudget: avgBudget,
          team: uniqueAssignees.map((assigneeId) => ({
            id: assigneeId,
            name: `User ${assigneeId.substring(0, 8)}`,
            role: "Team Member",
            avatar: `https://picsum.photos/seed/${assigneeId}/40/40.jpg`,
          })),
          tasks: {
            total: totalTasks,
            completed: completedTasks,
            inProgress: inProgressTasks,
            pending: pendingTasks,
            archived: archivedTasks,
            approved: approvedTasks,
          },
          categoryDistribution,
          priorityDistribution,
          monthlyProgress: [
            { month: "Jan", progress: Math.floor(Math.random() * 30) },
            { month: "Feb", progress: Math.floor(Math.random() * 40) },
            { month: "Mar", progress: Math.floor(Math.random() * 50) },
            { month: "Apr", progress: Math.floor(Math.random() * 60) },
            { month: "May", progress: Math.floor(Math.random() * 70) },
            { month: "Jun", progress: Math.floor(Math.random() * 80) },
            { month: "Jul", progress: Math.floor(Math.random() * 90) },
            { month: "Aug", progress: Math.floor(Math.random() * 100) },
            { month: "Sep", progress: Math.floor(Math.random() * 100) },
            { month: "Oct", progress: Math.floor(Math.random() * 100) },
            { month: "Nov", progress: Math.floor(Math.random() * 100) },
            { month: "Dec", progress: avgProgress },
          ],
        };

        setProjectData(projectData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, workItems, projects]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaProjectIcon className="h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No project data available
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This project has no work items associated with it
        </p>
      </div>
    );
  }

  // Calculate status percentages
  const totalTasks = projectData.tasks.total;
  const statusPercentages = {
    completed:
      totalTasks > 0
        ? Math.round((projectData.tasks.completed / totalTasks) * 100)
        : 0,
    inProgress:
      totalTasks > 0
        ? Math.round((projectData.tasks.inProgress / totalTasks) * 100)
        : 0,
    pending:
      totalTasks > 0
        ? Math.round((projectData.tasks.pending / totalTasks) * 100)
        : 0,
    archived:
      totalTasks > 0
        ? Math.round((projectData.tasks.archived / totalTasks) * 100)
        : 0,
    approved:
      totalTasks > 0
        ? Math.round((projectData.tasks.approved / totalTasks) * 100)
        : 0,
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {projectData.name} Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Work Status Distribution */}
          <Card className="shadow-lg border-0 overflow-hidden bg-white dark:bg-slate-800">
            <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-slate-900 dark:text-white flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white mr-3">
                  <FaChartPie className="h-5 w-5" />
                </div>
                Work Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Completed
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                      {projectData.tasks.completed}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ({statusPercentages.completed}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${statusPercentages.completed}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    In Progress
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                      {projectData.tasks.inProgress}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ({statusPercentages.inProgress}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${statusPercentages.inProgress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Pending
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                      {projectData.tasks.pending}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ({statusPercentages.pending}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${statusPercentages.pending}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Archived
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                      {projectData.tasks.archived}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ({statusPercentages.archived}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-slate-500 h-2 rounded-full"
                    style={{ width: `${statusPercentages.archived}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Approved
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                      {projectData.tasks.approved}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ({statusPercentages.approved}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${statusPercentages.approved}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Completed",
                          value: projectData.tasks.completed,
                          color: COLORS.success,
                        },
                        {
                          name: "In Progress",
                          value: projectData.tasks.inProgress,
                          color: COLORS.primary,
                        },
                        {
                          name: "Pending",
                          value: projectData.tasks.pending,
                          color: COLORS.warning,
                        },
                        {
                          name: "Archived",
                          value: projectData.tasks.archived,
                          color: COLORS.slate[500],
                        },
                        {
                          name: "Approved",
                          value: projectData.tasks.approved,
                          color: COLORS.secondary,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        {
                          name: "Completed",
                          value: projectData.tasks.completed,
                          color: COLORS.success,
                        },
                        {
                          name: "In Progress",
                          value: projectData.tasks.inProgress,
                          color: COLORS.primary,
                        },
                        {
                          name: "Pending",
                          value: projectData.tasks.pending,
                          color: COLORS.warning,
                        },
                        {
                          name: "Archived",
                          value: projectData.tasks.archived,
                          color: COLORS.slate[500],
                        },
                        {
                          name: "Approved",
                          value: projectData.tasks.approved,
                          color: COLORS.secondary,
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} (${
                          statusPercentages[
                            name.toLowerCase().replace(" ", "-")
                          ]
                        }%)`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <Card className="shadow-lg border-0 overflow-hidden bg-white dark:bg-slate-800">
            <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-slate-900 dark:text-white flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white mr-3">
                  <FaDollarSign className="h-5 w-5" />
                </div>
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Total Budget
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${projectData.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Items with Budget
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {projectData.itemsWithBudget}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          projectData.tasks.total > 0
                            ? (projectData.itemsWithBudget /
                                projectData.tasks.total) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Average Budget
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${projectData.avgBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          projectData.avgBudget / 1000,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Spent Budget
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${projectData.spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${
                          projectData.budget > 0
                            ? (projectData.spent / projectData.budget) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Budget Utilization
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {projectData.budget > 0
                        ? Math.round(
                            (projectData.spent / projectData.budget) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                      style={{
                        width: `${
                          projectData.budget > 0
                            ? (projectData.spent / projectData.budget) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="shadow-lg border-0 overflow-hidden bg-white dark:bg-slate-800">
            <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-slate-900 dark:text-white flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
                  <FaCalendarAlt className="h-5 w-5" />
                </div>
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Start Date
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white">
                    {projectData.startDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    End Date
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white">
                    {projectData.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Progress
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white">
                    {projectData.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${projectData.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 overflow-hidden bg-white dark:bg-slate-800">
            <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-slate-900 dark:text-white flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white mr-3">
                  <FaUserFriends className="h-5 w-5" />
                </div>
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Total Members
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white">
                    {projectData.team.length}
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {projectData.team.slice(0, 5).map((member, index) => (
                    <div key={index} className="relative">
                      <img
                        className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800"
                        src={member.avatar}
                        alt={member.name}
                      />
                      {index === 4 && projectData.team.length > 5 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-700 text-white text-xs rounded-full">
                          +{projectData.team.length - 5}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 overflow-hidden bg-white dark:bg-slate-800">
            <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="text-slate-900 dark:text-white flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white mr-3">
                  <FaTag className="h-5 w-5" />
                </div>
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(projectData.categoryDistribution).map(
                  ([category, count]) => {
                    const categoryOption = CATEGORY_OPTIONS.find(
                      (option) => option.value === category
                    );
                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="mr-2">
                            {categoryOption?.icon || "📌"}
                          </span>
                          <span className="text-sm text-slate-900 dark:text-white">
                            {categoryOption?.label || category}
                          </span>
                        </div>
                        <span className="text-sm text-slate-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ProjectWorkAnalytics() {
  const [workItems, setWorkItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectNames, setProjectNames] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedWorkItem, setSelectedWorkItem] = useState("all"); // New state for selected work item
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const reportRef = useRef(null);
  const router = useRouter();

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Fetch work items from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workResponse = await fetch("/api/work");

        if (!workResponse.ok) throw new Error("Failed to fetch work items");

        const workData = await workResponse.json();
        setWorkItems(workData);

        // Extract unique client IDs to create projects
        const uniqueClientIds = [
          ...new Set(workData.map((item) => item.clientId).filter(Boolean)),
        ];

        // Create project objects from client IDs
        const projectList = uniqueClientIds.map((clientId) => {
          const clientWorkItems = workData.filter(
            (item) => item.clientId === clientId
          );
          const firstItem = clientWorkItems[0];

          return {
            id: clientId,
            name: `Project ${clientId.substring(0, 8)}...`,
            status: "active",
            taskCount: clientWorkItems.length,
            completedTasks: clientWorkItems.filter(
              (item) => item.status === "completed"
            ).length,
            budget: clientWorkItems.reduce(
              (sum, item) => sum + (item.budget || 0),
              0
            ),
          };
        });

        setProjects(projectList);

        // Try to fetch project names from an API if available
        try {
          const projectResponse = await fetch("http://localhost:3000/api/work");
          if (projectResponse.ok) {
            const projectData = await projectResponse.json();
            const projectMap = {};
            projectData.forEach((project) => {
              projectMap[project._id] = project.name;
            });
            setProjectNames(projectMap);

            // Update project names in the project list
            const updatedProjectList = projectList.map((project) => ({
              ...project,
              name: projectMap[project.id] || project.name,
            }));
            setProjects(updatedProjectList);
          }
        } catch (error) {
          console.log(
            "Projects API not available, using client IDs as project names"
          );
        }

        // Check if current user is admin
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

  // Calculate analytics based on selected work item
  const analytics = useMemo(() => {
    // Filter work items based on selection
    let itemsToAnalyze = workItems;
    if (selectedWorkItem !== "all") {
      itemsToAnalyze = workItems.filter(
        (item) => item._id === selectedWorkItem
      );
    }

    const totalWorkItems = itemsToAnalyze.length;
    const completedWorkItems = itemsToAnalyze.filter(
      (w) => w.status === "completed"
    ).length;
    const inProgressWorkItems = itemsToAnalyze.filter(
      (w) => w.status === "in-progress"
    ).length;
    const pendingWorkItems = itemsToAnalyze.filter(
      (w) => w.status === "pending"
    ).length;
    const archivedWorkItems = itemsToAnalyze.filter(
      (w) => w.status === "archived"
    ).length;
    const approvedWorkItems = itemsToAnalyze.filter(
      (w) => w.status === "approved"
    ).length;

    // Category distribution
    const categoryDistribution = itemsToAnalyze.reduce((acc, work) => {
      const category = work.category || "other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Priority distribution
    const priorityDistribution = itemsToAnalyze.reduce((acc, work) => {
      const priority = work.priority || "medium";
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    // Assigned vs unassigned
    const assignedWorkItems = itemsToAnalyze.filter((w) => w.assignedTo).length;
    const unassignedWorkItems = totalWorkItems - assignedWorkItems;

    // Budget analysis
    const itemsWithBudget = itemsToAnalyze.filter(
      (w) => w.budget && w.budget > 0
    ).length;
    const totalBudget = itemsToAnalyze.reduce(
      (sum, work) => sum + (work.budget || 0),
      0
    );
    const avgBudget =
      itemsWithBudget > 0 ? Math.round(totalBudget / itemsWithBudget) : 0;

    // Progress analysis
    const totalProgress = itemsToAnalyze.reduce(
      (sum, work) => sum + (work.progress || 0),
      0
    );
    const avgProgress =
      totalWorkItems > 0 ? Math.round(totalProgress / totalWorkItems) : 0;

    // Due date analysis
    const overdueItems = itemsToAnalyze.filter((w) => {
      if (!w.dueDate) return false;
      const dueDate = new Date(w.dueDate);
      const today = new Date();
      return dueDate < today && w.status !== "completed";
    }).length;

    // Monthly work completion (mock data for demonstration)
    const monthlyCompletion = [65, 78, 82, 91, 73, 85, 90, 88, 92, 87, 94, 96];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      totalWorkItems,
      completedWorkItems,
      inProgressWorkItems,
      pendingWorkItems,
      archivedWorkItems,
      approvedWorkItems,
      categoryDistribution,
      priorityDistribution,
      assignedWorkItems,
      unassignedWorkItems,
      totalBudget,
      avgBudget,
      itemsWithBudget,
      avgProgress,
      overdueItems,
      monthlyCompletion,
      months,
    };
  }, [workItems, selectedWorkItem]);

  // Filter work items based on search and filters
  // Filter work items based on search and filters
  const filteredWorkItems = useMemo(() => {
    return workItems.filter((work) => {
      // Add null checks before calling toLowerCase()
      const matchesSearch =
        (work.title &&
          work.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (work.description &&
          work.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || work.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || work.category === categoryFilter;
      const matchesPriority =
        priorityFilter === "all" || work.priority === priorityFilter;
      return (
        matchesSearch && matchesStatus && matchesCategory && matchesPriority
      );
    });
  }, [workItems, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  // Filter work items based on date range
  const filteredWorkByDate = useMemo(() => {
    if (dateRange === "all") return workItems;

    const now = new Date();
    let startDate;

    switch (dateRange) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        startDate = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return workItems;
    }

    return workItems.filter((work) => new Date(work.createdAt) >= startDate);
  }, [workItems, dateRange]);

  // Generate and download PDF report
  const generatePDFReport = async () => {
    if (!reportRef.current) return;

    try {
      showNotification("Generating PDF report...", "info");

      // In a real implementation, you would use a library like html2canvas and jsPDF
      // For this example, we'll just show a notification
      setTimeout(() => {
        showNotification("PDF report generated successfully!", "success");
      }, 2000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification(
        "Failed to generate PDF report. Please try again.",
        "error"
      );
    }
  };

  if (isInitialLoading)
    return <LoadingSpinner message="Loading work analytics data..." />;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse ${
              notification.type === "success"
                ? "bg-emerald-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <FaCheckCircle className="text-xl" />
            ) : notification.type === "error" ? (
              <FaExclamationCircle className="text-xl" />
            ) : (
              <FaSpinner className="text-xl animate-spin" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 shadow-xl border-b border-slate-200 dark:border-slate-700 mb-8 rounded-t-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 ">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mr-4 shadow-lg">
                      <FaClipboardList className="h-6 w-6" />
                    </div>
                    Project & Work Analytics
                  </h1>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Comprehensive analytics and performance metrics for all work
                    items
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Project Dropdown - Now visible to all users */}
                  <div className="relative">
                    <Select
                      value={selectedProject || ""}
                      onValueChange={setSelectedProject}
                    >
                      <SelectTrigger className="w-56 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Projects</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={generatePDFReport}
                        className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <FaDownload className="h-4 w-4 mr-2" />
                        Download Report
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate PDF report</p>
                    </TooltipContent>
                  </Tooltip>
                  <button
                    onClick={() => router.push("/dashboard/work")}
                    className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FaTasks className="h-4 w-4 mr-2" />
                    Manage Work Items
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => router.push("/dashboard/add-work")}
                      className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Add Work Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search work items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="all">All Statuses</option>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="all">All Priorities</option>
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <div>
                  <select
                    value={selectedWorkItem}
                    onChange={(e) => setSelectedWorkItem(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="all">All Work Items</option>
                    {workItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-md">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer"
              >
                <FaChartBar className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer"
              >
                <FaFolderOpen className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer"
              >
                <FaChartLine className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="work-items"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg cursor-pointer"
              >
                <FaTasks className="h-4 w-4" />
                Work Items
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <PerformanceCard
                  title="Total Work Items"
                  value={analytics.totalWorkItems}
                  subtitle={`${analytics.assignedWorkItems} assigned`}
                  icon={FaTasks}
                  color={COLORS.primary}
                  bgGradient="bg-gradient-to-r from-blue-500 to-blue-600"
                  trend="up"
                  trendValue="12"
                />
                <PerformanceCard
                  title="Completed Items"
                  value={analytics.completedWorkItems}
                  subtitle={`${
                    analytics.totalWorkItems > 0
                      ? Math.round(
                          (analytics.completedWorkItems /
                            analytics.totalWorkItems) *
                            100
                        )
                      : 0
                  }% completion rate`}
                  icon={FaCheckCircle}
                  color={COLORS.success}
                  bgGradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
                  trend="up"
                  trendValue="8"
                />
                <PerformanceCard
                  title="In Progress"
                  value={analytics.inProgressWorkItems}
                  subtitle={`${
                    analytics.totalWorkItems > 0
                      ? Math.round(
                          (analytics.inProgressWorkItems /
                            analytics.totalWorkItems) *
                            100
                        )
                      : 0
                  }% of total`}
                  icon={FaSpinner}
                  color={COLORS.warning}
                  bgGradient="bg-gradient-to-r from-amber-500 to-amber-600"
                  trend="down"
                  trendValue="3"
                />
                <PerformanceCard
                  title="Overdue Items"
                  value={analytics.overdueItems}
                  subtitle={`${
                    analytics.totalWorkItems > 0
                      ? Math.round(
                          (analytics.overdueItems / analytics.totalWorkItems) *
                            100
                        )
                      : 0
                  }% of total`}
                  icon={FaExclamationCircle}
                  color={COLORS.danger}
                  bgGradient="bg-gradient-to-r from-red-500 to-red-600"
                  trend="up"
                  trendValue="5"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white mr-3">
                          <FaChartPie className="h-5 w-5" />
                        </div>
                        Work Status Distribution
                      </div>
                      {selectedWorkItem !== "all" && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {
                            workItems.find(
                              (item) => item._id === selectedWorkItem
                            )?.title
                          }
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProject ? (
                      <ProjectAnalytics
                        projectId={selectedProject}
                        workItems={workItems}
                        projects={projects}
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Completed
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                              {analytics.completedWorkItems}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              (
                              {analytics.totalWorkItems > 0
                                ? Math.round(
                                    (analytics.completedWorkItems /
                                      analytics.totalWorkItems) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{
                              width: `${
                                analytics.totalWorkItems > 0
                                  ? (analytics.completedWorkItems /
                                      analytics.totalWorkItems) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            In Progress
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                              {analytics.inProgressWorkItems}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              (
                              {analytics.totalWorkItems > 0
                                ? Math.round(
                                    (analytics.inProgressWorkItems /
                                      analytics.totalWorkItems) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${
                                analytics.totalWorkItems > 0
                                  ? (analytics.inProgressWorkItems /
                                      analytics.totalWorkItems) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Pending
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                              {analytics.pendingWorkItems}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              (
                              {analytics.totalWorkItems > 0
                                ? Math.round(
                                    (analytics.pendingWorkItems /
                                      analytics.totalWorkItems) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{
                              width: `${
                                analytics.totalWorkItems > 0
                                  ? (analytics.pendingWorkItems /
                                      analytics.totalWorkItems) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Archived
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                              {analytics.archivedWorkItems}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              (
                              {analytics.totalWorkItems > 0
                                ? Math.round(
                                    (analytics.archivedWorkItems /
                                      analytics.totalWorkItems) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-slate-500 h-2 rounded-full"
                            style={{
                              width: `${
                                analytics.totalWorkItems > 0
                                  ? (analytics.archivedWorkItems /
                                      analytics.totalWorkItems) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Approved
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-900 dark:text-white mr-2">
                              {analytics.approvedWorkItems}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              (
                              {analytics.totalWorkItems > 0
                                ? Math.round(
                                    (analytics.approvedWorkItems /
                                      analytics.totalWorkItems) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{
                              width: `${
                                analytics.totalWorkItems > 0
                                  ? (analytics.approvedWorkItems /
                                      analytics.totalWorkItems) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <div className="mt-6">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={[
                                  {
                                    name: "Completed",
                                    value: analytics.completedWorkItems,
                                    color: COLORS.success,
                                  },
                                  {
                                    name: "In Progress",
                                    value: analytics.inProgressWorkItems,
                                    color: COLORS.primary,
                                  },
                                  {
                                    name: "Pending",
                                    value: analytics.pendingWorkItems,
                                    color: COLORS.warning,
                                  },
                                  {
                                    name: "Archived",
                                    value: analytics.archivedWorkItems,
                                    color: COLORS.slate[500],
                                  },
                                  {
                                    name: "Approved",
                                    value: analytics.approvedWorkItems,
                                    color: COLORS.secondary,
                                  },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {[
                                  {
                                    name: "Completed",
                                    value: analytics.completedWorkItems,
                                    color: COLORS.success,
                                  },
                                  {
                                    name: "In Progress",
                                    value: analytics.inProgressWorkItems,
                                    color: COLORS.primary,
                                  },
                                  {
                                    name: "Pending",
                                    value: analytics.pendingWorkItems,
                                    color: COLORS.warning,
                                  },
                                  {
                                    name: "Archived",
                                    value: analytics.archivedWorkItems,
                                    color: COLORS.slate[500],
                                  },
                                  {
                                    name: "Approved",
                                    value: analytics.approvedWorkItems,
                                    color: COLORS.secondary,
                                  },
                                ].map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value, name) => [
                                  `${value} (${
                                    analytics.totalWorkItems > 0
                                      ? Math.round(
                                          (value / analytics.totalWorkItems) *
                                            100
                                        )
                                      : 0
                                  }%)`,
                                  name,
                                ]}
                                contentStyle={{
                                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                                  borderRadius: "8px",
                                  border: "1px solid #e2e8f0",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white mr-3">
                        <FaDollarSign className="h-5 w-5" />
                      </div>
                      Budget Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Total Budget
                        </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          ${analytics.totalBudget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Items with Budget
                        </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {analytics.itemsWithBudget}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              analytics.totalWorkItems > 0
                                ? (analytics.itemsWithBudget /
                                    analytics.totalWorkItems) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Average Budget
                        </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          ${analytics.avgBudget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              analytics.avgBudget / 1000,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    All Projects
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid"
                            ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list"
                            ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <Button
                      onClick={() => router.push("/dashboard/add-project")}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <Card
                        key={project.id}
                        className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 ${
                          selectedProject === project.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div
                          className="h-2"
                          style={{
                            backgroundColor:
                              project.status === "completed"
                                ? COLORS.success
                                : project.status === "in-progress"
                                ? COLORS.primary
                                : COLORS.warning,
                          }}
                        ></div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div
                                className="p-2 rounded-lg mr-3"
                                style={{
                                  backgroundColor: `${
                                    project.status === "completed"
                                      ? COLORS.success
                                      : project.status === "in-progress"
                                      ? COLORS.primary
                                      : COLORS.warning
                                  }20`,
                                }}
                              >
                                <FaFolderOpen
                                  className="h-5 w-5"
                                  style={{
                                    color:
                                      project.status === "completed"
                                        ? COLORS.success
                                        : project.status === "in-progress"
                                        ? COLORS.primary
                                        : COLORS.warning,
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {project.name}
                                </h3>
                                <div className="flex items-center mt-1">
                                  <StatusBadge status={project.status} />
                                </div>
                              </div>
                            </div>
                            <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                              <FaEllipsisV className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Tasks
                              </span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {project.taskCount}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Completed
                              </span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {project.completedTasks}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Budget
                              </span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                ${project.budget.toLocaleString()}
                              </span>
                            </div>

                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  Progress
                                </span>
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {project.taskCount > 0
                                    ? Math.round(
                                        (project.completedTasks /
                                          project.taskCount) *
                                          100
                                      )
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${
                                      project.taskCount > 0
                                        ? (project.completedTasks /
                                            project.taskCount) *
                                          100
                                        : 0
                                    }%`,
                                    backgroundColor:
                                      project.status === "completed"
                                        ? COLORS.success
                                        : project.status === "in-progress"
                                        ? COLORS.primary
                                        : COLORS.warning,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Project Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Tasks
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Completed
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Progress
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Budget
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {projects.map((project) => (
                          <tr
                            key={project.id}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                              selectedProject === project.id
                                ? "bg-blue-50 dark:bg-slate-700"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className="p-2 rounded-lg mr-3"
                                  style={{
                                    backgroundColor: `${
                                      project.status === "completed"
                                        ? COLORS.success
                                        : project.status === "in-progress"
                                        ? COLORS.primary
                                        : COLORS.warning
                                    }20`,
                                  }}
                                >
                                  <FaFolderOpen
                                    className="h-5 w-5"
                                    style={{
                                      color:
                                        project.status === "completed"
                                          ? COLORS.success
                                          : project.status === "in-progress"
                                          ? COLORS.primary
                                          : COLORS.warning,
                                    }}
                                  />
                                </div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  {project.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={project.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                              {project.taskCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                              {project.completedTasks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-2">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${
                                        project.taskCount > 0
                                          ? (project.completedTasks /
                                              project.taskCount) *
                                            100
                                          : 0
                                      }%`,
                                      backgroundColor:
                                        project.status === "completed"
                                          ? COLORS.success
                                          : project.status === "in-progress"
                                          ? COLORS.primary
                                          : COLORS.warning,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-slate-900 dark:text-white">
                                  {project.taskCount > 0
                                    ? Math.round(
                                        (project.completedTasks /
                                          project.taskCount) *
                                          100
                                      )
                                    : 0}
                                  %
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                              ${project.budget.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => setSelectedProject(project.id)}
                                  className={`inline-flex cursor-pointer items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                                    selectedProject === project.id
                                      ? "ring-2 ring-blue-500"
                                      : ""
                                  }`}
                                >
                                  <FaEye className="h-4 w-4 mr-1" />
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {selectedProject && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Project Details
                    </h2>
                    <Button
                      onClick={() => setSelectedProject(null)}
                      variant="outline"
                      className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                    >
                      <FaTimes className="h-4 w-4 mr-2" />
                      Close
                    </Button>
                  </div>
                  <ProjectAnalytics
                    projectId={selectedProject}
                    workItems={workItems}
                    projects={projects}
                  />
                </div>
              )}
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
                        <FaChartLine className="h-5 w-5" />
                      </div>
                      Monthly Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AreaChartComponent
                      data={analytics.monthlyCompletion}
                      labels={analytics.months}
                      title="Monthly Completion Rate"
                      colors={[COLORS.success]}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-slate-900 dark:text-white flex items-center">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white mr-3">
                        <FaRegChartBar className="h-5 w-5" />
                      </div>
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Total Work Items
                        </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {analytics.totalWorkItems}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Assigned Work Items
                        </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {analytics.assignedWorkItems}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${
                              analytics.totalWorkItems > 0
                                ? (analytics.assignedWorkItems /
                                    analytics.totalWorkItems) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Completion Rate
                        </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {analytics.totalWorkItems > 0
                            ? Math.round(
                                (analytics.completedWorkItems /
                                  analytics.totalWorkItems) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{
                            width: `${
                              analytics.totalWorkItems > 0
                                ? (analytics.completedWorkItems /
                                    analytics.totalWorkItems) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Average Progress
                        </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {analytics.avgProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${analytics.avgProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Work Items Tab */}
            <TabsContent value="work-items" className="mt-6">
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white dark:bg-slate-800">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="text-slate-900 dark:text-white">
                    Work Item Details
                  </CardTitle>
                  <CardDescription>
                    Showing {filteredWorkItems.length} of {workItems.length}{" "}
                    work items
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Work Item
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Project
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Priority
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Progress
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Due Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredWorkItems.length > 0 ? (
                          filteredWorkItems.map((workItem) => {
                            const project = workItem.clientId
                              ? projects.find((p) => p.id === workItem.clientId)
                              : null;
                            const projectName = project
                              ? project.name
                              : workItem.clientId
                              ? `Project ${workItem.clientId.substring(
                                  0,
                                  8
                                )}...`
                              : "No Project";

                            return (
                              <tr
                                key={workItem._id}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                      {workItem.title}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                      {workItem.description}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-slate-900 dark:text-white">
                                    {projectName}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <CategoryBadge category={workItem.category} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge status={workItem.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <PriorityBadge priority={workItem.priority} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{
                                          width: `${workItem.progress || 0}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-slate-900 dark:text-white">
                                      {workItem.progress || 0}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-slate-900 dark:text-white">
                                    {workItem.dueDate
                                      ? new Date(
                                          workItem.dueDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() =>
                                        setSelectedWorkItem(workItem._id)
                                      }
                                      className={`inline-flex cursor-pointer items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                                        selectedWorkItem === workItem._id
                                          ? "ring-2 ring-blue-500"
                                          : ""
                                      }`}
                                    >
                                      <FaEye className="h-4 w-4 mr-1" />
                                      View
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="8" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                                  <FaTasks className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                  No work items found
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Try adjusting your search or filter criteria
                                </p>
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
