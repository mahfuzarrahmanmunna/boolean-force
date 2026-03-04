"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCheck,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaInfoCircle,
  FaQuestionCircle,
  FaCalendarAlt,
  FaUser,
  FaBriefcase,
  FaGlobe,
  FaIndustry,
  FaTasks,
  FaClipboardList,
  FaFlag,
  FaTag,
  FaClock,
  FaChartLine,
  FaLightbulb,
  FaCheckCircle,
  FaUserTie,
  FaIdBadge,
  FaCode,
  FaServer,
  FaPalette,
  FaShieldAlt,
} from "react-icons/fa";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
    description: "Worker is currently active and available for assignments",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Worker is not currently active",
  },
  {
    value: "pending",
    label: "Pending",
    description: "Worker registration is pending approval",
  },
  {
    value: "suspended",
    label: "Suspended",
    description: "Worker account has been suspended",
  },
];

const SKILL_LEVEL_OPTIONS = [
  {
    value: "beginner",
    label: "Beginner",
    color: "bg-green-500",
    description: "New to the field",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    color: "bg-blue-500",
    description: "Has some experience",
  },
  {
    value: "advanced",
    label: "Advanced",
    color: "bg-purple-500",
    description: "Highly skilled",
  },
  {
    value: "expert",
    label: "Expert",
    color: "bg-red-500",
    description: "Mastery level skills",
  },
];

const JOB_TITLE_OPTIONS = [
  {
    value: "full-stack-developer",
    label: "Full Stack Developer",
    icon: <FaCode />,
    description: "Develops both front-end and back-end applications",
  },
  {
    value: "devops-engineer",
    label: "DevOps Engineer",
    icon: <FaServer />,
    description: "Manages deployment, operations, and infrastructure",
  },
  {
    value: "graphics-designer",
    label: "Graphics Designer",
    icon: <FaPalette />,
    description: "Creates visual concepts and designs",
  },
  {
    value: "ui-ux-designer",
    label: "UI/UX Designer",
    icon: <FaPalette />,
    description: "Designs user interfaces and experiences",
  },
  {
    value: "backend-developer",
    label: "Backend Developer",
    icon: <FaCode />,
    description: "Develops server-side logic and databases",
  },
  {
    value: "frontend-developer",
    label: "Frontend Developer",
    icon: <FaCode />,
    description: "Develops user interfaces and client-side logic",
  },
  {
    value: "mobile-developer",
    label: "Mobile Developer",
    icon: <FaCode />,
    description: "Develops mobile applications",
  },
  {
    value: "qa-engineer",
    label: "QA Engineer",
    icon: <FaShieldAlt />,
    description: "Tests and ensures quality of software",
  },
  {
    value: "data-scientist",
    label: "Data Scientist",
    icon: <FaChartLine />,
    description: "Analyzes and interprets complex data",
  },
  {
    value: "product-manager",
    label: "Product Manager",
    icon: <FaBriefcase />,
    description: "Manages product development and strategy",
  },
  {
    value: "other",
    label: "Other",
    icon: <FaUser />,
    description: "Other job title",
  },
];

// Form schema
const workerFormSchema = z.object({
  name: z.string().min(1, "Worker name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  status: z.string().default("pending"),
  phone: z.string().optional(),
  jobTitle: z.string().default("other"),
  skills: z.string().optional(),
  experience: z.string().optional(),
  skillLevel: z.string().default("beginner"),
});

// Helper Components
const StatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      case "suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="mr-1 h-3 w-3" />;
      case "inactive":
        return <FaTimes className="mr-1 h-3 w-3" />;
      case "pending":
        return <FaSpinner className="mr-1 h-3 w-3" />;
      case "suspended":
        return <FaExclamationCircle className="mr-1 h-3 w-3" />;
      default:
        return <FaQuestionCircle className="mr-1 h-3 w-3" />;
    }
  };

  return (
    <Badge
      variant={getStatusVariant(status)}
      className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
    >
      {getStatusIcon(status)}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
    </Badge>
  );
};

const JobTitleBadge = ({ title }) => {
  const jobOption = JOB_TITLE_OPTIONS.find((option) => option.value === title);

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      {jobOption?.icon || <FaUser className="h-3 w-3" />}
      {jobOption?.label || "Unknown"}
    </Badge>
  );
};

const SkillLevelBadge = ({ level }) => {
  const skillOption = SKILL_LEVEL_OPTIONS.find(
    (option) => option.value === level,
  );

  return (
    <Badge
      className={`flex items-center gap-1 text-white ${skillOption?.color || "bg-gray-500"}`}
    >
      <FaIdBadge className="h-3 w-3" />
      {skillOption?.label || "Unknown"}
    </Badge>
  );
};

const LoadingSpinner = ({ message }) => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    <Card className="w-96">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="mt-6 text-lg font-medium text-muted-foreground">
          {message}
        </p>
      </CardContent>
    </Card>
  </div>
);

// Form Field Component (without shadcn form)
const FormField = ({
  label,
  error,
  children,
  required = false,
  description,
  tooltip,
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaQuestionCircle className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {description && (
        <FaInfoCircle
          className="h-3 w-3 text-muted-foreground"
          title={description}
        />
      )}
    </div>
    {children}
    {error && (
      <p className="text-sm font-medium text-destructive animate-pulse">
        {error.message}
      </p>
    )}
  </div>
);

// Main Component
export default function ManageWorkers() {
  const [workers, setWorkers] = useState([]);
  const [availableWork, setAvailableWork] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [editingWorker, setEditingWorker] = useState(null);
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [assigningWorkTo, setAssigningWorkTo] = useState(null);
  const [selectedTasksToAssign, setSelectedTasksToAssign] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isAdmin, setIsAdmin] = useState(false); // State to track if current user is admin

  // Current date for creation timestamp
  const currentDate = new Date().toISOString().split("T")[0];
  // State for tab animation
  const [activeTab, setActiveTab] = useState("details");

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Forms
  const workerForm = useForm({
    resolver: zodResolver(workerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "pending",
      phone: "",
      jobTitle: "other",
      skills: "",
      experience: "",
      skillLevel: "beginner",
    },
  });

  // Fetch workers and work from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Check if current user is admin (you might need to adjust this based on your auth system)
        // This is a placeholder - replace with your actual admin check logic
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

  // Handle worker creation/update
  const handleWorkerSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Add creation date to data
      const workerData = {
        ...data,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      let response;
      if (editingWorker) {
        // Update existing worker - make sure we have a valid ID
        if (!editingWorker._id) {
          throw new Error("Invalid worker ID for update");
        }

        response = await fetch(`/api/projects/${editingWorker._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workerData),
        });
      } else {
        // Create new worker
        response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workerData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingWorker ? "update" : "create"} worker`,
        );
      }

      const result = await response.json();

      if (editingWorker) {
        // Update worker in the list
        setWorkers(
          workers.map((w) => (w._id === editingWorker._id ? result.data : w)),
        );
        showNotification("Worker updated successfully!", "success");
        setEditingWorker(null);
      } else {
        // Add the new worker to the list
        setWorkers([...workers, result.data]);
        showNotification("Worker created successfully!", "success");
        setIsAddingWorker(false);
      }

      // Reset form
      workerForm.reset();
    } catch (error) {
      console.error("Error in handleWorkerSubmit:", error);
      showNotification(
        error.message ||
          `Failed to ${editingWorker ? "update" : "create"} worker.`,
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle worker deletion
  const handleDeleteWorker = async (workerId) => {
    if (
      confirm(
        "Are you sure you want to delete this worker? This action cannot be undone.",
      )
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/projects/${workerId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete worker");

        setWorkers(workers.filter((w) => w._id !== workerId));
        showNotification("Worker deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting worker:", error);
        showNotification(error.message || "Failed to delete worker.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (worker, newStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${worker._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update worker status");
      }

      // Update worker in the list
      setWorkers(
        workers.map((w) =>
          w._id === worker._id
            ? { ...w, status: newStatus, updatedAt: new Date().toISOString() }
            : w,
        ),
      );

      showNotification(`Worker status updated to ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification(error.message || "Failed to update status.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job title change (admin only)
  const handleJobTitleChange = async (worker, newJobTitle) => {
    if (!isAdmin) {
      showNotification("Only administrators can change job titles.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${worker._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: newJobTitle }), // Only send jobTitle, not status
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update worker job title");
      }

      // Update worker in the list
      setWorkers(
        workers.map((w) =>
          w._id === worker._id
            ? {
                ...w,
                jobTitle: newJobTitle,
                updatedAt: new Date().toISOString(),
              }
            : w,
        ),
      );

      showNotification(
        `Worker job title updated to ${JOB_TITLE_OPTIONS.find((opt) => opt.value === newJobTitle)?.label || newJobTitle}`,
        "success",
      );
    } catch (error) {
      console.error("Error updating job title:", error);
      showNotification(error.message || "Failed to update job title.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle assigning work to a worker
  const handleAssignWork = async () => {
    if (selectedTasksToAssign.length === 0) {
      showNotification("Please select at least one task to assign.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/projects/${assigningWorkTo._id}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskIds: selectedTasksToAssign }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign work");
      }

      const result = await response.json();

      // Update worker's assigned work
      setWorkers(
        workers.map((w) =>
          w._id === assigningWorkTo._id
            ? {
                ...w,
                assignedWork: [
                  ...(w.assignedWork || []),
                  ...selectedTasksToAssign,
                ],
              }
            : w,
        ),
      );

      // Update available work list
      setAvailableWork((prev) =>
        prev.map((work) => {
          if (selectedTasksToAssign.includes(work._id)) {
            return {
              ...work,
              assignedTo: assigningWorkTo._id,
              status: "in-progress",
            };
          }
          return work;
        }),
      );

      setAssigningWorkTo(null);
      setSelectedTasksToAssign([]);
      showNotification("Work assigned successfully!", "success");
    } catch (error) {
      console.error("Error assigning work:", error);
      showNotification(error.message || "Failed to assign work.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter workers based on search and status
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const matchesSearch =
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || worker.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [workers, searchTerm, statusFilter]);

  // Update form when editingWorker changes
  useEffect(() => {
    if (editingWorker) {
      workerForm.reset(editingWorker);
    }
  }, [editingWorker, workerForm]);

  if (isInitialLoading)
    return <LoadingSpinner message="Loading worker data..." />;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaExclamationCircle className="text-xl" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mr-3 shadow-lg">
                      <FaUserTie className="h-6 w-6" />
                    </div>
                    Manage Workers
                  </h1>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    Manage worker information and assignments
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {isAdmin && (
                    <button
                      onClick={() => setIsAddingWorker(true)}
                      className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Add New Worker
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-0 border-b-2 border-slate-300 dark:border-slate-600 rounded-t-xl focus:ring-0 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <FaFilter className="text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 border-0 border-b-2 border-slate-300 dark:border-slate-600 rounded-t-xl focus:ring-0 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white"
                    >
                      <option value="all">All Statuses</option>
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing{" "}
              <span className="font-medium text-slate-900 dark:text-white">
                {filteredWorkers.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900 dark:text-white">
                {workers.length}
              </span>{" "}
              workers
            </p>
          </div>

          {/* Worker Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Worker
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Job Title
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
                      Assigned Work
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Joined
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredWorkers.length > 0 ? (
                    filteredWorkers.map((worker) => (
                      <tr
                        key={worker._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {worker.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {worker.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {worker.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <JobTitleBadge title={worker.jobTitle || "other"} />
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  const currentTitle =
                                    worker.jobTitle || "other";
                                  const titleOptions = JOB_TITLE_OPTIONS.map(
                                    (opt) => opt.value,
                                  );
                                  const currentIndex =
                                    titleOptions.indexOf(currentTitle);
                                  const nextIndex =
                                    (currentIndex + 1) % titleOptions.length;
                                  const nextTitle = titleOptions[nextIndex];
                                  handleJobTitleChange(worker, nextTitle);
                                }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Change Job Title (Admin Only)"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={worker.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-slate-900 dark:text-white mr-2">
                              {worker.assignedWork
                                ? worker.assignedWork.length
                                : 0}
                            </span>
                            <button
                              onClick={() => {
                                setAssigningWorkTo(worker);
                                setSelectedTasksToAssign([]);
                              }}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <FaPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {new Date(worker.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setEditingWorker(worker)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit Worker"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setAssigningWorkTo(worker);
                                setSelectedTasksToAssign([]);
                              }}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Assign Work"
                            >
                              <FaTasks className="h-4 w-4" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteWorker(worker._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete Worker"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                            <FaUserTie className="h-8 w-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                            No workers found
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Try adjusting your search or filter criteria
                          </p>
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("all");
                            }}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
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
        </div>

        {/* Add/Edit Worker Dialog */}
        <Dialog
          open={isAddingWorker || !!editingWorker}
          onOpenChange={() => {
            setIsAddingWorker(false);
            setEditingWorker(null);
            workerForm.reset();
          }}
        >
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FaUserTie className="text-primary animate-pulse" />
                {editingWorker ? "Edit Worker" : "Add New Worker"}
              </DialogTitle>
              <DialogDescription>
                {editingWorker
                  ? "Update worker information"
                  : "Add a new worker to the system"}
              </DialogDescription>
            </DialogHeader>

            {/* Form that wraps both tabs */}
            <form
              onSubmit={workerForm.handleSubmit(handleWorkerSubmit)}
              className="space-y-4"
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="details"
                    className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="additional"
                    className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Additional Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Name"
                      error={workerForm.formState.errors.name}
                      required
                      tooltip="Enter the full name of the worker"
                    >
                      <Input
                        placeholder="Enter worker name"
                        {...workerForm.register("name")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>
                    <FormField
                      label="Email"
                      error={workerForm.formState.errors.email}
                      required
                      tooltip="Worker's email address"
                    >
                      <Input
                        type="email"
                        placeholder="worker@example.com"
                        {...workerForm.register("email")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Phone"
                      error={workerForm.formState.errors.phone}
                      tooltip="Worker's phone number"
                    >
                      <Input
                        placeholder="01817886592"
                        {...workerForm.register("phone")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>
                    <FormField
                      label="Status"
                      error={workerForm.formState.errors.status}
                      tooltip="Set the current status of this worker"
                    >
                      <Select
                        value={workerForm.watch("status")}
                        onValueChange={(value) =>
                          workerForm.setValue("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Job Title"
                      error={workerForm.formState.errors.jobTitle}
                      tooltip="Select the worker's job title"
                    >
                      <Select
                        value={workerForm.watch("jobTitle")}
                        onValueChange={(value) =>
                          workerForm.setValue("jobTitle", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a job title" />
                        </SelectTrigger>
                        <SelectContent>
                          {JOB_TITLE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                {option.icon}
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField
                      label="Skill Level"
                      error={workerForm.formState.errors.skillLevel}
                      tooltip="Select the worker's skill level"
                    >
                      <Select
                        value={workerForm.watch("skillLevel")}
                        onValueChange={(value) =>
                          workerForm.setValue("skillLevel", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill level" />
                        </SelectTrigger>
                        <SelectContent>
                          {SKILL_LEVEL_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${option.color}`}
                                ></div>
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-4 mt-4">
                  <FormField
                    label="Skills"
                    error={workerForm.formState.errors.skills}
                    tooltip="List the worker's skills and expertise"
                  >
                    <Textarea
                      placeholder="Enter worker's skills"
                      {...workerForm.register("skills")}
                      rows={3}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormField>

                  <FormField
                    label="Experience"
                    error={workerForm.formState.errors.experience}
                    tooltip="Describe the worker's relevant experience"
                  >
                    <Textarea
                      placeholder="Enter worker's experience"
                      {...workerForm.register("experience")}
                      rows={4}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormField>

                  <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    <span className="text-sm font-medium">
                      {editingWorker
                        ? `Created: ${new Date(editingWorker.createdAt).toLocaleDateString()}`
                        : `Creation Date: ${new Date(currentDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingWorker(false);
                    setEditingWorker(null);
                    workerForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FaSave className="mr-2 h-4 w-4" />
                  )}
                  {editingWorker ? "Update Worker" : "Create Worker"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Assign Work Dialog */}
        <Dialog
          open={!!assigningWorkTo}
          onOpenChange={() => {
            setAssigningWorkTo(null);
            setSelectedTasksToAssign([]);
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Work</DialogTitle>
              <DialogDescription>
                Select work to assign to {assigningWorkTo?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {availableWork.length > 0 ? (
                <div className="space-y-2">
                  {availableWork.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-start space-x-2 p-2 hover:bg-muted rounded-md"
                    >
                      <Checkbox
                        id={`task-${task._id}`}
                        checked={selectedTasksToAssign.includes(task._id)}
                        onCheckedChange={() => {
                          if (selectedTasksToAssign.includes(task._id)) {
                            setSelectedTasksToAssign(
                              selectedTasksToAssign.filter(
                                (id) => id !== task._id,
                              ),
                            );
                          } else {
                            setSelectedTasksToAssign([
                              ...selectedTasksToAssign,
                              task._id,
                            ]);
                          }
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`task-${task._id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {task.title}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                        {task.assignedTo && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Currently assigned to:
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {workers.find((w) => w._id === task.assignedTo)
                                ?.name || "Unknown Worker"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No available work to assign.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAssigningWorkTo(null);
                  setSelectedTasksToAssign([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignWork}
                disabled={isLoading || selectedTasksToAssign.length === 0}
              >
                {isLoading ? (
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FaClipboardList className="mr-2 h-4 w-4" />
                )}
                Assign Selected
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
