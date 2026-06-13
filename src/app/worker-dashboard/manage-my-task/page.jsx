"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import {
  FaTasks,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaClock,
  FaChartLine,
  FaFlag,
  FaTag,
  FaEye,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPlay,
  FaPause,
  FaCheck,
  FaArchive,
  FaUndo,
  FaHourglassHalf,
  FaExclamationCircle,
  FaPlus,
  FaFileAlt,
  FaUsers,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

// Import the SubmitModal component
import SubmitModal from "../components/SubmitModal/SubmitModal";

// Constants
const STATUS_OPTIONS = [
  {
    value: "planning",
    label: "Planning",
    icon: <FaHourglassHalf />,
    color: "bg-gray-500",
  },
  {
    value: "in-progress",
    label: "In Progress",
    icon: <FaPlay />,
    color: "bg-blue-500",
  },
  {
    value: "completed",
    label: "Completed",
    icon: <FaCheckCircle />,
    color: "bg-green-500",
  },
  {
    value: "archived",
    label: "Archived",
    icon: <FaArchive />,
    color: "bg-gray-500",
  },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "urgent", label: "Urgent", color: "bg-red-500" },
];

const CATEGORY_OPTIONS = [
  { value: "development", label: "Development", icon: "💻" },
  { value: "design", label: "Design", icon: "🎨" },
  { value: "marketing", label: "Marketing", icon: "📢" },
  { value: "research", label: "Research", icon: "🔍" },
  { value: "maintenance", label: "Maintenance", icon: "🔧" },
  { value: "testing", label: "Testing", icon: "🧪" },
  { value: "documentation", label: "Documentation", icon: "📝" },
  { value: "other", label: "Other", icon: "📌" },
];

// Form schemas
const projectUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  category: z.string().min(1, "Category is required"),
  dueDate: z.string().optional(),
  estimatedHours: z.string().optional(),
  tags: z.array(z.string()).optional(),
  directions: z.string().optional(),
  progress: z.number().min(0).max(100),
});

// Helper Components
const StatusBadge = ({ status }) => {
  const statusOption = STATUS_OPTIONS.find((option) => option.value === status);

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 ${statusOption?.color} text-white`}
    >
      {statusOption?.icon}
      <span>{statusOption?.label || status}</span>
    </Badge>
  );
};

const PriorityBadge = ({ priority }) => {
  const priorityOption = PRIORITY_OPTIONS.find(
    (option) => option.value === priority
  );

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 ${priorityOption?.color} text-white`}
    >
      <FaFlag className="h-3 w-3" />
      <span>{priorityOption?.label || priority}</span>
    </Badge>
  );
};

const CategoryBadge = ({ category }) => {
  const categoryOption = CATEGORY_OPTIONS.find(
    (option) => option.value === category
  );

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <span>{categoryOption?.icon}</span>
      <span>{categoryOption?.label || category}</span>
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

// Form Field Component
const FormField = ({ label, error, children, required = false, tooltip }) => (
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
                <FaExclamationCircle className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    {children}
    {error && (
      <p className="text-sm font-medium text-destructive">{error.message}</p>
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
export default function ProjectManagement() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isViewingProject, setIsViewingProject] = useState(false);
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(10);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [userTeams, setUserTeams] = useState([]);

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Form for updating project
  const projectUpdateForm = useForm({
    resolver: zodResolver(projectUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      priority: "",
      category: "",
      dueDate: "",
      estimatedHours: "",
      tags: [],
      directions: "",
      progress: 0,
    },
  });

  // Form for creating project
  const projectCreateForm = useForm({
    resolver: zodResolver(projectUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "planning",
      priority: "medium",
      category: "other",
      dueDate: "",
      estimatedHours: "",
      tags: [],
      directions: "",
      progress: 0,
    },
  });

  // Helper function to make authenticated requests
  const authenticatedFetch = async (url, options = {}) => {
    // Get the session token from cookies
    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("next-auth.session-token=")
    );
    const token = sessionCookie ? sessionCookie.split("=")[1] : null;

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add the session token to the headers if it exists
    if (token) {
      headers.Cookie = `next-auth.session-token=${token}`;
    }

    // Log for debugging
    // //console.log(`Making ${options.method || "GET"} request to ${url}`, {
    //   headers,
    //   credentials: "include",
    // });

    return fetch(url, {
      ...options,
      headers,
      credentials: "include", // Include cookies in the request
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated") return;

      try {
        // Fetch current user info
        const userResponse = await authenticatedFetch(
          `/api/users/${session.user.id}`
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.data);
        }

        // Fetch teams
        const teamsResponse = await authenticatedFetch("/api/teams");
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          setTeams(teamsData);

          // Find teams where user is a leader or member
          const userTeamsData = teamsData.filter(
            (team) =>
              team.teamLeader === session.user.id ||
              (team.teamMembers && team.teamMembers.includes(session.user.id))
          );
          setUserTeams(userTeamsData);
        }

        // Fetch projects
        const projectsResponse = await authenticatedFetch("/api/projects");
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
        }

        // Fetch users
        const usersResponse = await authenticatedFetch("/api/users");
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to load data. Please try again.", "error");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  // Handle project update
  const handleProjectUpdate = async (data) => {
    if (!selectedProject) {
      console.error("handleProjectUpdate called without a selectedProject.");
      return;
    }

    // Ensure we're using the correct project ID format
    const projectId = selectedProject._id;
    //console.log("Updating project with ID:", projectId);
    //console.log("Update data:", data);

    setIsLoading(true);
    try {
      const response = await authenticatedFetch(`/api/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      //console.log("Response status:", response.status);
      //console.log("Response headers:", response.headers);

      if (!response.ok) {
        let errorData = {};
        let errorMessage = "Failed to update project";
        
        try {
          // Try to parse the error response as JSON
          const responseText = await response.text();
          //console.log("Error response text:", responseText);
          
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
              errorMessage = errorData.error || errorData.message || errorMessage;
            } catch (e) {
              // If it's not valid JSON, use the text as the error message
              errorMessage = responseText;
            }
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }

        // If it's a permission error, provide more context
        if (response.status === 403) {
          errorMessage = "Permission denied: You must be a team leader of a team assigned to this project to update it.";
        }

        throw new Error(errorMessage);
      }

      const updatedProject = await response.json();

      // Update project in the state
      setProjects(
        projects.map((project) =>
          project._id === selectedProject._id ? updatedProject.data : project
        )
      );

      setIsUpdatingProject(false);
      setSelectedProject(null);
      showNotification("Project updated successfully!", "success");
    } catch (error) {
      console.error("Error updating project:", error);
      showNotification(error.message || "Failed to update project.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle project creation with file upload
  const handleProjectCreate = async (formData) => {
    setIsLoading(true);
    try {
      // Add assigned teams to the form data
      const assignedTo = userTeams.map((team) => team._id);
      formData.append("assignedTo", JSON.stringify(assignedTo));

      // Get the session token
      const cookies = document.cookie.split(";");
      const sessionCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("next-auth.session-token=")
      );
      const token = sessionCookie ? sessionCookie.split("=")[1] : null;

      const headers = {};
      if (token) {
        headers.Cookie = `next-auth.session-token=${token}`;
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
        headers,
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        let errorData = {};
        let errorMessage = "Failed to create project";
        
        try {
          // Try to parse the error response as JSON
          const responseText = await response.text();
          //console.log("Error response text:", responseText);
          
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
              errorMessage = errorData.error || errorData.message || errorMessage;
            } catch (e) {
              // If it's not valid JSON, use the text as the error message
              errorMessage = responseText;
            }
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        
        throw new Error(errorMessage);
      }

      const newProject = await response.json();

      // Add the new project to the state
      setProjects([...projects, newProject.data]);

      setIsCreatingProject(false);
      showNotification("Project created successfully!", "success");
    } catch (error) {
      console.error("Error creating project:", error);
      showNotification(error.message || "Failed to create project.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Get user by ID
  const getUserById = (userId) => {
    return users.find((user) => user._id === userId);
  };

  // Get team by ID
  const getTeamById = (teamId) => {
    return teams.find((team) => team._id === teamId);
  };

  // Check if current user is a team leader
  const isCurrentUserTeamLeader = () => {
    if (!session) return false;
    return teams.some((team) => team.teamLeader === session.user.id);
  };

  // Check if current user is the leader of the selected project
  const isCurrentUserLeaderOfSelectedProject = () => {
    if (!session || !selectedProject || !selectedProject.assignedTo)
      return false;

    return selectedProject.assignedTo.some((teamId) => {
      const team = getTeamById(teamId);
      return team && team.teamLeader === session.user.id;
    });
  };

  // Check if current user is a team leader of a specific project
  const isCurrentUserLeaderOfProject = (project) => {
  if (!session || !project || !project.assignedTo) return false;

  // Check if the user is the leader of any team assigned to this project
  return project.assignedTo.some((teamId) => {
    const team = getTeamById(teamId);
    if (!team) return false;
    
    // Ensure both IDs are strings for comparison
    const teamLeaderId = typeof team.teamLeader === 'object' 
      ? team.teamLeader.toString() 
      : team.teamLeader.toString();
    
    const currentUserId = session.user.id;
    
    return teamLeaderId === currentUserId;
  });
};

  // Filter projects based on user's teams
  const userProjects = useMemo(() => {
    if (!session || !userTeams.length) return [];

    const userTeamIds = userTeams.map((team) => team._id);
    return projects.filter(
      (project) =>
        project.assignedTo &&
        project.assignedTo.some((id) => userTeamIds.includes(id))
    );
  }, [projects, userTeams, session]);

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return userProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || project.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" || project.category === categoryFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });
  }, [userProjects, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  // Pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Update form when selectedProject changes
  useEffect(() => {
    if (selectedProject) {
      projectUpdateForm.setValue("title", selectedProject.title || "");
      projectUpdateForm.setValue(
        "description",
        selectedProject.description || ""
      );
      projectUpdateForm.setValue("status", selectedProject.status || "");
      projectUpdateForm.setValue("priority", selectedProject.priority || "");
      projectUpdateForm.setValue("category", selectedProject.category || "");
      projectUpdateForm.setValue("dueDate", selectedProject.dueDate || "");
      projectUpdateForm.setValue(
        "estimatedHours",
        selectedProject.estimatedHours || ""
      );
      projectUpdateForm.setValue("tags", selectedProject.tags || []);
      projectUpdateForm.setValue(
        "directions",
        selectedProject.directions || ""
      );
      projectUpdateForm.setValue("progress", selectedProject.progress || 0);
    }
  }, [selectedProject, projectUpdateForm]);

  // Get project statistics
  const projectStats = useMemo(() => {
    const total = userProjects.length;
    const planning = userProjects.filter(
      (project) => project.status === "planning"
    ).length;
    const inProgress = userProjects.filter(
      (project) => project.status === "in-progress"
    ).length;
    const completed = userProjects.filter(
      (project) => project.status === "completed"
    ).length;
    const overdue = userProjects.filter((project) => {
      if (!project.dueDate || project.status === "completed") return false;
      const dueDate = new Date(project.dueDate);
      const today = new Date();
      return dueDate < today;
    }).length;

    return { total, planning, inProgress, completed, overdue };
  }, [userProjects]);

  // Calculate days until due date
  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;

    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Get due date badge
  const getDueDateBadge = (dueDate) => {
    const daysUntilDue = getDaysUntilDue(dueDate);

    if (daysUntilDue === null) return null;

    if (daysUntilDue < 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <FaExclamationTriangle className="h-3 w-3" />
          {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? "s" : ""}{" "}
          overdue
        </Badge>
      );
    } else if (daysUntilDue === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <FaExclamationTriangle className="h-3 w-3" />
          Due today
        </Badge>
      );
    } else if (daysUntilDue <= 3) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <FaClock className="h-3 w-3" />
          {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""} left
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <FaCalendarAlt className="h-3 w-3" />
          {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""} left
        </Badge>
      );
    }
  };

  if (status === "loading" || isInitialLoading) {
    return <LoadingSpinner message="Loading project data..." />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold mb-4">
              Authentication Required
            </h2>
            <p className="text-center text-muted-foreground">
              Please sign in to access the project management dashboard.
            </p>
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
              <FaExclamationTriangle className="text-xl" />
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
                    <FaTasks className="text-primary animate-pulse" />
                    Project Management
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Manage and track your team's projects
                  </CardDescription>
                </div>
                {isCurrentUserTeamLeader() && (
                  <AnimatedButton onClick={() => setIsCreatingProject(true)}>
                    <FaPlus className="mr-2 h-4 w-4" />
                    Create Project
                  </AnimatedButton>
                )}
              </div>
            </CardHeader>
          </AnimatedCard>

          {/* Project Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <AnimatedCard className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">{projectStats.total}</div>
                <div className="text-sm text-muted-foreground">
                  Total Projects
                </div>
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-500">
                  {projectStats.planning}
                </div>
                <div className="text-sm text-muted-foreground">Planning</div>
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-blue-500">
                  {projectStats.inProgress}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-green-500">
                  {projectStats.completed}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-red-500">
                  {projectStats.overdue}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Filters */}
          <AnimatedCard className="shadow-md">
            <CardContent className="py-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by title or description..."
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
                          <div className="flex items-center gap-2">
                            {option.icon}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {PRIORITY_OPTIONS.map((option) => (
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
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[180px] transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Projects Table */}
          <AnimatedCard className="shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProjects.map((project) => (
                    <TableRow
                      key={project._id}
                      className="hover:bg-muted/50 transition-all duration-200"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {project.description}
                          </div>
                          {project.category && (
                            <CategoryBadge
                              category={project.category}
                              className="mt-1"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell>
                        {project.priority && (
                          <PriorityBadge priority={project.priority} />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={project.progress || 0}
                            className="w-16"
                          />
                          <span className="text-sm">
                            {project.progress || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {project.dueDate ? (
                            <>
                              <span className="text-sm">
                                {new Date(project.dueDate).toLocaleDateString()}
                              </span>
                              {getDueDateBadge(project.dueDate)}
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No due date
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AnimatedButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsViewingProject(true);
                                }}
                              >
                                <FaEye className="h-4 w-4" />
                              </AnimatedButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Project Details</p>
                            </TooltipContent>
                          </Tooltip>
                          {isCurrentUserLeaderOfProject(project) && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AnimatedButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setIsUpdatingProject(true);
                                  }}
                                >
                                  <FaEdit className="h-4 w-4" />
                                </AnimatedButton>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Update Project</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredProjects.length === 0 && (
                <EmptyState
                  message="No projects found"
                  icon={
                    <FaTasks className="mx-auto h-12 w-12 text-muted-foreground" />
                  }
                />
              )}
            </CardContent>
          </AnimatedCard>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft className="h-4 w-4" />
              </AnimatedButton>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <FaChevronRight className="h-4 w-4" />
              </AnimatedButton>
            </div>
          )}

          {/* View Project Dialog */}
          <Dialog
            open={isViewingProject}
            onOpenChange={() => setIsViewingProject(false)}
          >
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FaTasks className="text-primary" />
                  Project Details
                </DialogTitle>
                <DialogDescription>View details of project</DialogDescription>
              </DialogHeader>
              {selectedProject && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Title
                      </h3>
                      <p className="font-medium">{selectedProject.title}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Status
                      </h3>
                      <StatusBadge status={selectedProject.status} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Priority
                      </h3>
                      {selectedProject.priority && (
                        <PriorityBadge priority={selectedProject.priority} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Category
                      </h3>
                      {selectedProject.category && (
                        <CategoryBadge category={selectedProject.category} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Due Date
                      </h3>
                      <div className="flex flex-col gap-1">
                        {selectedProject.dueDate ? (
                          <>
                            <span>
                              {new Date(
                                selectedProject.dueDate
                              ).toLocaleDateString()}
                            </span>
                            {getDueDateBadge(selectedProject.dueDate)}
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No due date
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Progress
                      </h3>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={selectedProject.progress || 0}
                          className="w-24"
                        />
                        <span className="text-sm">
                          {selectedProject.progress || 0}%
                        </span>
                      </div>
                    </div>
                    {selectedProject.estimatedHours && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Estimated Hours
                        </h3>
                        <p>{selectedProject.estimatedHours} hours</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Created Date
                      </h3>
                      <p>
                        {new Date(
                          selectedProject.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </h3>
                    <p>{selectedProject.description}</p>
                  </div>
                  {selectedProject.directions && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Directions
                      </h3>
                      <p>{selectedProject.directions}</p>
                    </div>
                  )}
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedProject.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProject.assignedTo &&
                    selectedProject.assignedTo.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Assigned Teams
                        </h3>
                        <div className="space-y-2">
                          {selectedProject.assignedTo.map((teamId) => {
                            const team = getTeamById(teamId);
                            return team ? (
                              <div
                                key={teamId}
                                className="flex items-center gap-3 p-2 bg-muted/20 rounded-md"
                              >
                                <FaUsers className="h-4 w-4 text-primary" />
                                <div>
                                  <div className="font-medium text-sm">
                                    {team.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Leader:{" "}
                                    {getUserById(team.teamLeader)?.name ||
                                      "Unknown"}
                                  </div>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                </div>
              )}
              <DialogFooter>
                <AnimatedButton
                  variant="outline"
                  onClick={() => setIsViewingProject(false)}
                >
                  Close
                </AnimatedButton>
                {isCurrentUserLeaderOfSelectedProject() && (
                  <AnimatedButton
                    onClick={() => {
                      setIsViewingProject(false);
                      setIsUpdatingProject(true);
                    }}
                  >
                    <FaEdit className="mr-2 h-4 w-4" />
                    Update Project
                  </AnimatedButton>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Update Project Dialog */}
          <Dialog
            open={isUpdatingProject}
            onOpenChange={() => setIsUpdatingProject(false)}
          >
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FaEdit className="text-primary" />
                  Update Project
                </DialogTitle>
                <DialogDescription>Update project details</DialogDescription>
              </DialogHeader>
              {selectedProject && (
                <form
                  onSubmit={projectUpdateForm.handleSubmit(handleProjectUpdate)}
                  className="space-y-4"
                >
                  <FormField
                    label="Title"
                    error={projectUpdateForm.formState.errors.title}
                    required
                    tooltip="Enter project title"
                  >
                    <Input
                      {...projectUpdateForm.register("title")}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormField>

                  <FormField
                    label="Description"
                    error={projectUpdateForm.formState.errors.description}
                    required
                    tooltip="Enter project description"
                  >
                    <Textarea
                      {...projectUpdateForm.register("description")}
                      rows={3}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Status"
                      error={projectUpdateForm.formState.errors.status}
                      required
                      tooltip="Select project status"
                    >
                      <Select
                        value={projectUpdateForm.watch("status")}
                        onValueChange={(value) =>
                          projectUpdateForm.setValue("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
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
                      label="Priority"
                      error={projectUpdateForm.formState.errors.priority}
                      required
                      tooltip="Select project priority"
                    >
                      <Select
                        value={projectUpdateForm.watch("priority")}
                        onValueChange={(value) =>
                          projectUpdateForm.setValue("priority", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((option) => (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Category"
                      error={projectUpdateForm.formState.errors.category}
                      required
                      tooltip="Select project category"
                    >
                      <Select
                        value={projectUpdateForm.watch("category")}
                        onValueChange={(value) =>
                          projectUpdateForm.setValue("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField
                      label="Due Date"
                      error={projectUpdateForm.formState.errors.dueDate}
                      tooltip="Select project due date"
                    >
                      <Input
                        type="date"
                        {...projectUpdateForm.register("dueDate")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Estimated Hours"
                      error={projectUpdateForm.formState.errors.estimatedHours}
                      tooltip="Enter estimated hours for project"
                    >
                      <Input
                        type="number"
                        {...projectUpdateForm.register("estimatedHours")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormField>

                    <FormField
                      label="Progress"
                      error={projectUpdateForm.formState.errors.progress}
                      required
                      tooltip="Update project progress (0-100%)"
                    >
                      <div className="space-y-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...projectUpdateForm.register("progress", {
                            valueAsNumber: true,
                          })}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                        <Progress
                          value={projectUpdateForm.watch("progress") || 0}
                        />
                      </div>
                    </FormField>
                  </div>

                  <FormField
                    label="Directions"
                    error={projectUpdateForm.formState.errors.directions}
                    tooltip="Enter any specific directions for project"
                  >
                    <Textarea
                      {...projectUpdateForm.register("directions")}
                      rows={2}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormField>

                  <FormField
                    label="Tags"
                    error={projectUpdateForm.formState.errors.tags}
                    tooltip="Enter project tags (comma separated)"
                  >
                    <Input
                      placeholder="tag1, tag2, tag3"
                      {...projectUpdateForm.register("tags")}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormField>

                  <DialogFooter>
                    <AnimatedButton
                      type="button"
                      variant="outline"
                      onClick={() => setIsUpdatingProject(false)}
                    >
                      Cancel
                    </AnimatedButton>
                    <AnimatedButton type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FaSave className="mr-2 h-4 w-4" />
                      )}
                      Save Changes
                    </AnimatedButton>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Submit Modal Component */}
          <SubmitModal
            isOpen={isCreatingProject}
            onClose={() => setIsCreatingProject(false)}
            onSubmit={handleProjectCreate}
            title="Create New Project"
            submitButtonText="Create Project"
            users={users}
            teams={userTeams}
            maxFileSize={10 * 1024 * 1024} // 10MB
            maxFiles={10}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}