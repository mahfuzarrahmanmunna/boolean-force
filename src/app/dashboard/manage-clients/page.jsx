"use client";

// app/dashboard/manage-clients/page.jsx
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
import { FaCheckCircle } from "react-icons/fa";

// Constants
const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
    description: "Client is currently active and has ongoing projects",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Client is not currently active",
  },
  {
    value: "pending",
    label: "Pending",
    description: "Client registration is pending approval",
  },
  {
    value: "suspended",
    label: "Suspended",
    description: "Client account has been suspended",
  },
];

const INDUSTRY_OPTIONS = [
  {
    value: "technology",
    label: "Technology",
    icon: "💻",
    description: "Software, hardware, IT services",
  },
  {
    value: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    description: "Medical services, pharmaceuticals",
  },
  {
    value: "finance",
    label: "Finance",
    icon: "💰",
    description: "Banking, insurance, financial services",
  },
  {
    value: "retail",
    label: "Retail",
    icon: "🛒",
    description: "Consumer goods, e-commerce",
  },
  {
    value: "manufacturing",
    label: "Manufacturing",
    icon: "🏭",
    description: "Production, industrial goods",
  },
  {
    value: "education",
    label: "Education",
    icon: "🎓",
    description: "Schools, universities, training",
  },
  {
    value: "government",
    label: "Government",
    icon: "🏛️",
    description: "Public sector services",
  },
  {
    value: "other",
    label: "Other",
    icon: "📌",
    description: "Other industries",
  },
];

const PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Low",
    color: "bg-green-500",
    description: "Low priority task, can be completed when time permits",
  },
  {
    value: "medium",
    label: "Medium",
    color: "bg-yellow-500",
    description: "Standard priority task",
  },
  {
    value: "high",
    label: "High",
    color: "bg-orange-500",
    description: "High priority task, should be completed soon",
  },
  {
    value: "urgent",
    label: "Urgent",
    color: "bg-red-500",
    description: "Urgent task, requires immediate attention",
  },
];

const CATEGORY_OPTIONS = [
  {
    value: "development",
    label: "Development",
    icon: "💻",
    description: "Software development tasks",
  },
  {
    value: "design",
    label: "Design",
    icon: "🎨",
    description: "UI/UX design tasks",
  },
  {
    value: "marketing",
    label: "Marketing",
    icon: "📢",
    description: "Marketing and promotional tasks",
  },
  {
    value: "research",
    label: "Research",
    icon: "🔍",
    description: "Research and analysis tasks",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: "🔧",
    description: "System maintenance tasks",
  },
  {
    value: "testing",
    label: "Testing",
    icon: "🧪",
    description: "Quality assurance and testing tasks",
  },
  {
    value: "documentation",
    label: "Documentation",
    icon: "📝",
    description: "Documentation tasks",
  },
  {
    value: "other",
    label: "Other",
    icon: "📌",
    description: "Other types of tasks",
  },
];

// Form schemas
const clientFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().default("other"),
  status: z.string().default("pending"),
  contactPerson: z.string().optional(),
  contactEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
});

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  priority: z.string().default("medium"),
  category: z.string().default("other"),
  estimatedHours: z.string().optional(),
  tags: z.string().optional(),
  clientId: z.string().optional(),
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

const EmptyState = ({ message, icon }) => (
  <div className="flex flex-col items-center justify-center py-12">
    {icon}
    <h3 className="mt-2 text-sm font-medium text-foreground">{message}</h3>
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

// Animated Card Component
const AnimatedCard = ({ children, className, ...props }) => (
  <Card
    className={`transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${className}`}
    {...props}
  >
    {children}
  </Card>
);

// Animated Button Component
const AnimatedButton = ({ children, className, ...props }) => (
  <Button
    className={`transition-all duration-200 transform hover:scale-105 active:scale-95 ${className}`}
    {...props}
  >
    {children}
  </Button>
);

// Main Component
export default function ManageClients() {
  const [clients, setClients] = useState([]);
  const [availableWork, setAvailableWork] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedClientForProject, setSelectedClientForProject] =
    useState(null);
  const [assigningWorkTo, setAssigningWorkTo] = useState(null);
  const [selectedTasksToAssign, setSelectedTasksToAssign] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  // Current date for creation timestamp
  const currentDate = new Date().toISOString().split("T")[0];
  // State for tab animation
  const [activeTab, setActiveTab] = useState("details");
  const [projectTab, setProjectTab] = useState("details");

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Forms
  const clientForm = useForm({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      industry: "other",
      status: "pending",
      contactPerson: "",
      contactEmail: "",
      notes: "",
    },
  });

  const projectForm = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      category: "other",
      estimatedHours: "",
      tags: "",
      clientId: "",
    },
  });

  // Fetch clients and work from API (used on mount and on retry)
  const fetchData = async () => {
    setFetchError(null);
    setIsInitialLoading(true);
    try {
      const [clientsResponse, workResponse] = await Promise.all([
        fetch("/api/admin/clients"),
        fetch("/api/projects"),
      ]);

      if (!clientsResponse.ok) {
        const errBody = await clientsResponse.json().catch(() => ({}));
        const msg = errBody?.error || "Failed to fetch clients";
        setFetchError(msg);
        setIsInitialLoading(false);
        return;
      }
      if (!workResponse.ok) {
        const errBody = await workResponse.json().catch(() => ({}));
        const msg = errBody?.error || "Failed to fetch projects";
        setFetchError(msg);
        setIsInitialLoading(false);
        return;
      }

      const clientsData = await clientsResponse.json();
      const workData = await workResponse.json();

      setClients(Array.isArray(clientsData) ? clientsData : []);
      setAvailableWork(Array.isArray(workData) ? workData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      const message =
        error.message || "Failed to load data. Check your connection and try again.";
      setFetchError(message);
      showNotification(message, "error");
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle client creation/update
  const handleClientSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Add creation date to data
      const clientData = {
        ...data,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      let response;
      if (editingClient) {
        // Update existing client
        response = await fetch(`/api/admin/clients/${editingClient._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientData),
        });
      } else {
        // Create new client
        response = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingClient ? "update" : "create"} client`
        );
      }

      const result = await response.json();

      if (editingClient) {
        // Update client in the list
        setClients(
          clients.map((c) => (c._id === editingClient._id ? result.data : c))
        );
        showNotification("Client updated successfully!", "success");
        setEditingClient(null);
      } else {
        // Add the new client to the list
        setClients([...clients, result.data]);
        showNotification("Client created successfully!", "success");
        setIsAddingClient(false);
      }

      // Reset form
      clientForm.reset();
    } catch (error) {
      console.error("Error in handleClientSubmit:", error);
      showNotification(
        error.message ||
          `Failed to ${editingClient ? "update" : "create"} client.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle project creation
  const handleProjectSubmit = async (data) => {
    setIsLoading(true);
    try {
      const projectData = {
        ...data,
        budget: data.budget ? parseFloat(data.budget) : 0,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        status: editingProject ? data.status : "planning",
        progress: editingProject ? data.progress : 0,
        createdAt: editingProject ? data.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Failed to ${editingProject ? "update" : "create"} project`
        );
      }

      if (editingProject) {
        // বিদ্যমান প্রজেক্ট আপডেট করুন
        setProjects(
          projects.map((p) => (p._id === editingProject._id ? result.data : p))
        );
        setEditingProject(null);
        showNotification("Project updated successfully!", "success");
      } else {
        // নতুন প্রজেক্ট যোগ করুন
        setProjects((prev) => [result.data, ...prev]);
        showNotification("Project created successfully!", "success");
      }

      projectForm.reset();
    } catch (error) {
      console.error("Error in handleProjectSubmit:", error);
      showNotification(
        error.message ||
          `Failed to ${editingProject ? "update" : "create"} project.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle client deletion
  const handleDeleteClient = async (clientId) => {
    if (
      confirm(
        "Are you sure you want to delete this client? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/clients/${clientId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete client");

        setClients(clients.filter((c) => c._id !== clientId));
        showNotification("Client deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting client:", error);
        showNotification(error.message || "Failed to delete client.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

const getAuthToken = () => {
 
  return localStorage.getItem('token') || document.cookie.split('=')[1];
};


  // Handle assigning work to a client

const handleAssignWork = async () => {
  if (selectedTasksToAssign.length === 0) {
    showNotification("Please select at least one project to assign.", "error");
    return;
  }
console.log(selectedTasksToAssign);
  setIsLoading(true);
  try {
    const updatePromises = selectedTasksToAssign.map((taskId) =>
     
      fetch(`/api/projects/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
        body: JSON.stringify({
          clientId: assigningWorkTo._id,
        }),
      })
    );

    const updateResults = await Promise.all(updatePromises);

    // Check each response for errors
    const failedUpdates = [];
    const successfulUpdates = [];

    for (let i = 0; i < updateResults.length; i++) {
      const result = updateResults[i];
      const taskId = selectedTasksToAssign[i];
      
      if (!result.ok) {
        failedUpdates.push(taskId);
        try {
          const errorData = await result.json();
          console.error(`Failed to update project ${taskId}:`, errorData);
        } catch (e) {
          console.error(`Failed to update project ${taskId}:`, result.statusText);
        }
      } else {
        successfulUpdates.push(taskId);
      }
    }

    if (failedUpdates.length > 0) {
      console.error("Some projects were not updated:", failedUpdates);
      showNotification(
        `${failedUpdates.length} project(s) could not be assigned. Please try again.`,
        "error"
      );
      
      // Still update the successful ones in the UI
      if (successfulUpdates.length > 0) {
        // Update available work list with the updated projects
        const updatedProjects = await Promise.all(
          successfulUpdates.map(async (projectId) => {
            try {
              const response = await fetch(`/api/projects/${projectId}`);
              if (response.ok) {
                const project = await response.json();
                return project;
              }
            } catch (error) {
              console.error(`Error fetching updated project ${projectId}:`, error);
            }
            return null;
          })
        );

        setAvailableWork((prev) =>
          prev.map((project) => {
            const updatedProject = updatedProjects.find(
              (p) => p && p._id === project._id
            );
            return updatedProject || project;
          })
        );
      }
    } else {
      // All updates were successful
      const updatedProjects = await Promise.all(
        successfulUpdates.map(async (projectId) => {
          const response = await fetch(`/api/projects/${projectId}`);
          if (response.ok) {
            const project = await response.json();
            return project;
          }
          return null;
        })
      );

      setAvailableWork((prev) =>
        prev.map((project) => {
          const updatedProject = updatedProjects.find(
            (p) => p && p._id === project._id
          );
          return updatedProject || project;
        })
      );

      showNotification("Projects assigned successfully!", "success");
    }

    setAssigningWorkTo(null);
    setSelectedTasksToAssign([]);
  } catch (error) {
    console.error("Error assigning work:", error);
    showNotification(error.message || "Failed to assign projects.", "error");
  } finally {
    setIsLoading(false);
  }
};

  // Filter clients based on search and status
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.contactPerson &&
          client.contactPerson
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  // Update form when editingClient changes
  useEffect(() => {
    if (editingClient) {
      clientForm.reset(editingClient);
    }
  }, [editingClient, clientForm]);

  // Update project form when selectedClientForProject changes
  useEffect(() => {
    if (selectedClientForProject) {
      projectForm.setValue("clientId", selectedClientForProject._id);
    }
  }, [selectedClientForProject, projectForm]);

  if (isInitialLoading)
    return <LoadingSpinner message="Loading client data..." />;

  if (fetchError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <FaExclamationCircle className="h-16 w-16 text-destructive mb-4" />
            <CardTitle className="text-xl mb-2">Could not load clients</CardTitle>
            <CardDescription className="mb-6">
              {fetchError}
            </CardDescription>
            <p className="text-sm text-muted-foreground mb-6">
              This often happens when the database is unreachable. Check your connection and try again.
            </p>
            <Button onClick={() => fetchData()} variant="default" size="lg">
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
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

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <AnimatedCard className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-3xl font-bold flex items-center gap-3">
                    <FaBuilding className="text-primary animate-pulse" />
                    Manage Clients
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Manage client information and projects
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <AnimatedButton
                    onClick={() => setIsAddingProject(true)}
                    className="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Create Project
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => setIsAddingClient(true)}
                    className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Add New Client
                  </AnimatedButton>
                </div>
              </div>
            </CardHeader>
          </AnimatedCard>

          {/* Filters */}
          <AnimatedCard className="shadow-md">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or contact person..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaFilter className="text-muted-foreground h-4 w-4" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 w-full">
                                {option.label}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{option.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Client Table */}
          <AnimatedCard className="shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow
                      key={client._id}
                      className="hover:bg-muted/50 transition-all duration-200"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-primary-foreground transition-all duration-200 hover:scale-110">
                            <FaBuilding className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <FaEnvelope className="h-3 w-3" />
                              {client.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <span>
                                {
                                  INDUSTRY_OPTIONS.find(
                                    (i) => i.value === client.industry
                                  )?.icon
                                }
                              </span>
                              <span>
                                {
                                  INDUSTRY_OPTIONS.find(
                                    (i) => i.value === client.industry
                                  )?.label
                                }
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {INDUSTRY_OPTIONS.find(
                                (i) => i.value === client.industry
                              )?.description || "No description available"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <StatusBadge status={client.status} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {STATUS_OPTIONS.find(
                                (s) => s.value === client.status
                              )?.description || "No description available"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {client.contactPerson ? (
                          <div>
                            <div className="font-medium">
                              {client.contactPerson}
                            </div>
                            {client.contactEmail && (
                              <div className="text-sm text-muted-foreground">
                                {client.contactEmail}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No contact person
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>
                            {
                              availableWork.filter(
                                (work) => work.clientId === client._id
                              ).length
                            }
                          </span>
                          <AnimatedButton
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setAssigningWorkTo(client);
                              setSelectedTasksToAssign([]);
                            }}
                            title="Assign Projects"
                          >
                            <FaPlus className="h-3 w-3" />
                          </AnimatedButton>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(client.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AnimatedButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedClientForProject(client);
                                  setIsAddingProject(true);
                                }}
                                className="cursor-pointer"
                              >
                                <FaBriefcase className="h-4 w-4" />
                              </AnimatedButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Create Project for Client</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AnimatedButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingClient(client)}
                                className="cursor-pointer"
                              >
                                <FaEdit className="h-4 w-4" />
                              </AnimatedButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Client</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AnimatedButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setAssigningWorkTo(client);
                                  setSelectedTasksToAssign([]);
                                }}
                              >
                                <FaTasks className="h-4 w-4" />
                              </AnimatedButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Manage Projects</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AnimatedButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClient(client._id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <FaTrash className="h-4 w-4" />
                              </AnimatedButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Client</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredClients.length === 0 && (
                <EmptyState
                  message="No clients found"
                  icon={
                    <FaBuilding className="mx-auto h-12 w-12 text-muted-foreground" />
                  }
                />
              )}
            </CardContent>
          </AnimatedCard>

          {/* Add/Edit Client Dialog */}
          <Dialog
            open={isAddingClient || !!editingClient}
            onOpenChange={() => {
              setIsAddingClient(false);
              setEditingClient(null);
              clientForm.reset();
            }}
          >
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FaBuilding className="text-primary animate-pulse" />
                  {editingClient ? "Edit Client" : "Add New Client"}
                </DialogTitle>
                <DialogDescription>
                  {editingClient
                    ? "Update client information"
                    : "Add a new client to the system"}
                </DialogDescription>
              </DialogHeader>

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
                  <form
                    onSubmit={clientForm.handleSubmit(handleClientSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Company Name"
                        error={clientForm.formState.errors.name}
                        required
                        tooltip="Enter the full legal name of the company"
                      >
                        <Input
                          placeholder="Enter company name"
                          {...clientForm.register("name")}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormField>
                      <FormField
                        label="Email"
                        error={clientForm.formState.errors.email}
                        required
                        tooltip="Company's primary email address"
                      >
                        <Input
                          type="email"
                          placeholder="company@example.com"
                          {...clientForm.register("email")}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Phone"
                        error={clientForm.formState.errors.phone}
                        tooltip="Company's primary phone number"
                      >
                        <Input
                          placeholder="+1 (555) 123-4567"
                          {...clientForm.register("phone")}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormField>
                      <FormField
                        label="Website"
                        error={clientForm.formState.errors.website}
                        tooltip="Company's website URL"
                      >
                        <Input
                          placeholder="https://example.com"
                          {...clientForm.register("website")}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Industry"
                        error={clientForm.formState.errors.industry}
                        tooltip="Select the industry that best describes this client"
                      >
                        <Select
                          value={clientForm.watch("industry")}
                          onValueChange={(value) =>
                            clientForm.setValue("industry", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRY_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                      <span>{option.icon}</span>
                                      <span>{option.label}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{option.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                      <FormField
                        label="Status"
                        error={clientForm.formState.errors.status}
                        tooltip="Set the current status of this client"
                      >
                        <Select
                          value={clientForm.watch("status")}
                          onValueChange={(value) =>
                            clientForm.setValue("status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                      {option.label}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{option.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>

                    <FormField
                      label="Address"
                      error={clientForm.formState.errors.address}
                      tooltip="Company's physical address"
                    >
                      <Textarea
                        placeholder="Enter full address"
                        {...clientForm.register("address")}
                        rows={2}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>
                  </form>
                </TabsContent>

                <TabsContent value="additional" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Contact Person"
                      error={clientForm.formState.errors.contactPerson}
                      tooltip="Primary contact person at the company"
                    >
                      <Input
                        placeholder="John Doe"
                        {...clientForm.register("contactPerson")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>
                    <FormField
                      label="Contact Email"
                      error={clientForm.formState.errors.contactEmail}
                      tooltip="Email address of the primary contact person"
                    >
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...clientForm.register("contactEmail")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Notes"
                    error={clientForm.formState.errors.notes}
                    tooltip="Any additional notes about this client"
                  >
                    <Textarea
                      placeholder="Enter any additional notes"
                      {...clientForm.register("notes")}
                      rows={4}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormField>

                  <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    <span className="text-sm font-medium">
                      {editingClient
                        ? `Created: ${new Date(
                            editingClient.createdAt
                          ).toLocaleDateString()}`
                        : `Creation Date: ${new Date(
                            currentDate
                          ).toLocaleDateString()}`}
                    </span>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <AnimatedButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingClient(false);
                    setEditingClient(null);
                    clientForm.reset();
                  }}
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  type="submit"
                  disabled={isLoading}
                  onClick={clientForm.handleSubmit(handleClientSubmit)}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  {isLoading ? (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FaSave className="mr-2 h-4 w-4" />
                  )}
                  {editingClient ? "Update Client" : "Create Client"}
                </AnimatedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Project Dialog */}
          <Dialog
            open={isAddingProject}
            onOpenChange={() => {
              setIsAddingProject(false);
              setSelectedClientForProject(null);
              projectForm.reset();
            }}
          >
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FaBriefcase className="text-primary animate-pulse" />
                  Create New Project
                </DialogTitle>
                <DialogDescription>
                  Add a new project and assign it to a client
                </DialogDescription>
              </DialogHeader>

              <Tabs
                value={projectTab}
                onValueChange={setProjectTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="details"
                    className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Project Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="assignment"
                    className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Assignment
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <form
                    onSubmit={projectForm.handleSubmit(handleProjectSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Project Title"
                        error={projectForm.formState.errors.title}
                        required
                        tooltip="Give your project a clear and descriptive title"
                      >
                        <Input
                          placeholder="Enter project title"
                          {...projectForm.register("title")}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormField>
                      <FormField
                        label="Category"
                        error={projectForm.formState.errors.category}
                        tooltip="Select the category that best describes this project"
                      >
                        <Select
                          value={projectForm.watch("category")}
                          onValueChange={(value) =>
                            projectForm.setValue("category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORY_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                      <span>{option.icon}</span>
                                      <span>{option.label}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{option.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>

                    <FormField
                      label="Description"
                      error={projectForm.formState.errors.description}
                      required
                      tooltip="Provide a detailed description of the project including requirements and expectations"
                    >
                      <Textarea
                        placeholder="Enter project description"
                        {...projectForm.register("description")}
                        rows={3}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Priority"
                        error={projectForm.formState.errors.priority}
                        tooltip="Set the priority level to help understand urgency"
                      >
                        <Select
                          value={projectForm.watch("priority")}
                          onValueChange={(value) =>
                            projectForm.setValue("priority", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITY_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-3 h-3 rounded-full ${option.color}`}
                                      ></div>
                                      <span>{option.label}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{option.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField
                        label="Due Date"
                        error={projectForm.formState.errors.dueDate}
                        tooltip="Set a deadline for project completion"
                      >
                        <Input
                          type="date"
                          {...projectForm.register("dueDate")}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormField>

                      <FormField
                        label="Story Point"
                        error={projectForm.formState.errors.estimatedHours}
                        tooltip="Provide an estimate of how long this project will take"
                      >
                        <Input
                          type="number"
                          placeholder="e.g., 8"
                          {...projectForm.register("estimatedHours")}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Tags"
                      error={projectForm.formState.errors.tags}
                      tooltip="Add tags to help categorize and find this project later"
                    >
                      <Input
                        placeholder="e.g., frontend, urgent, bug-fix"
                        {...projectForm.register("tags")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>

                    <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" />
                      <span className="text-sm font-medium">
                        Creation Date:{" "}
                        {new Date(currentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="assignment" className="space-y-4 mt-4">
                  <FormField
                    label="Assign to Client (Optional)"
                    tooltip="Select a client to assign this project to. Leave empty to make it available for anyone."
                  >
                    <div className="space-y-3">
                      <Select
                        value={projectForm.watch("clientId")}
                        onValueChange={(value) =>
                          projectForm.setValue("clientId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client._id} value={client._id}>
                              <div className="flex items-center gap-2">
                                <span>
                                  {
                                    INDUSTRY_OPTIONS.find(
                                      (i) => i.value === client.industry
                                    )?.icon
                                  }
                                </span>
                                <span>{client.name}</span>
                                <StatusBadge status={client.status} />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {projectForm.watch("clientId") && (
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Selected Client:
                            </span>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <FaBuilding className="h-3 w-3" />
                              {clients.find(
                                (c) => c._id === projectForm.watch("clientId")
                              )?.name || "Unknown Client"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormField>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4 mt-4">
                  <AnimatedCard className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          {projectForm.watch("title") || "Project Title"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
                              >
                                {
                                  CATEGORY_OPTIONS.find(
                                    (c) =>
                                      c.value === projectForm.watch("category")
                                  )?.icon
                                }
                                {CATEGORY_OPTIONS.find(
                                  (c) =>
                                    c.value === projectForm.watch("category")
                                )?.label || "No Category"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {CATEGORY_OPTIONS.find(
                                  (c) =>
                                    c.value === projectForm.watch("category")
                                )?.description || "No description available"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className={`flex items-center gap-1 transition-all duration-200 hover:scale-105 ${
                                  PRIORITY_OPTIONS.find(
                                    (p) =>
                                      p.value === projectForm.watch("priority")
                                  )?.color
                                } text-white`}
                              >
                                <FaFlag className="h-3 w-3" />
                                {PRIORITY_OPTIONS.find(
                                  (p) =>
                                    p.value === projectForm.watch("priority")
                                )?.label || "No Priority"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {PRIORITY_OPTIONS.find(
                                  (p) =>
                                    p.value === projectForm.watch("priority")
                                )?.description || "No description available"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          Created: {new Date(currentDate).toLocaleDateString()}
                        </span>
                        {projectForm.watch("dueDate") && (
                          <span className="flex items-center gap-1">
                            <FaClock />
                            Due:{" "}
                            {new Date(
                              projectForm.watch("dueDate")
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {projectForm.watch("estimatedHours") && (
                          <span className="flex items-center gap-1">
                            <FaChartLine />
                            Est. {projectForm.watch("estimatedHours")} hours
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        {projectForm.watch("description") ||
                          "Project description will appear here..."}
                      </p>

                      {projectForm.watch("tags") && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {projectForm
                            .watch("tags")
                            .split(",")
                            .map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs transition-all duration-200 hover:scale-105"
                              >
                                {tag.trim()}
                              </Badge>
                            ))}
                        </div>
                      )}

                      {projectForm.watch("clientId") && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Assigned to:
                          </h4>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
                          >
                            <FaBuilding className="h-3 w-3" />
                            {clients.find(
                              (c) => c._id === projectForm.watch("clientId")
                            )?.name || "Unknown Client"}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </AnimatedCard>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <AnimatedButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingProject(false);
                    setSelectedClientForProject(null);
                    projectForm.reset();
                  }}
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  type="submit"
                  disabled={isLoading}
                  onClick={projectForm.handleSubmit(handleProjectSubmit)}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  {isLoading ? (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FaPlus className="mr-2 h-4 w-4" />
                  )}
                  Create Project
                </AnimatedButton>
              </DialogFooter>
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
                <DialogTitle>Assign Projects</DialogTitle>
                <DialogDescription>
                  Select projects to assign to {assigningWorkTo?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {availableWork.length > 0 ? (
                  <div className="space-y-2">
                    {availableWork.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-start space-x-2 p-2 hover:bg-muted rounded-md transition-all duration-200"
                      >
                        <Checkbox
                          id={`task-${task._id}`}
                          checked={selectedTasksToAssign.includes(task._id)}
                          onCheckedChange={() => {
                            if (selectedTasksToAssign.includes(task._id)) {
                              setSelectedTasksToAssign(
                                selectedTasksToAssign.filter(
                                  (id) => id !== task._id
                                )
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
                          {task.clientId && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Currently assigned to:
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {clients.find((c) => c._id === task.clientId)
                                  ?.name || "Unknown Client"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No available projects to assign.
                  </p>
                )}
              </div>
              <DialogFooter>
                <AnimatedButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAssigningWorkTo(null);
                    setSelectedTasksToAssign([]);
                  }}
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleAssignWork}
                  disabled={isLoading || selectedTasksToAssign.length === 0}
                >
                  {isLoading ? (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FaClipboardList className="mr-2 h-4 w-4" />
                  )}
                  Assign Selected
                </AnimatedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
}
