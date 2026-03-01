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
  FaUsers,
  FaUser,
  FaTasks,
  FaSpinner,
  FaUserPlus,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
  FaBriefcase,
  FaCheckCircle,
  FaProjectDiagram,
  FaCalendarAlt,
  FaClock,
  FaUserMinus,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

// Constants
const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    description: "Worker has registered but not yet approved",
  },
  {
    value: "approved",
    label: "Approved",
    description: "Worker has been approved but not yet active",
  },
  {
    value: "active",
    label: "Active",
    description: "Worker is currently active and can be assigned tasks",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Worker is not currently available for tasks",
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
const teamFormSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  teamLeader: z.string().min(1, "Team leader is required"),
  teamMembers: z.array(z.string()).optional(),
});

const projectFormSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  priority: z.string().default("medium"),
  category: z.string().default("other"),
  estimatedHours: z.string().optional(),
  tags: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.string().default("pending"),
});

// Helper Components
const StatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "active":
        return "default";
      case "inactive":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="mr-1 h-3 w-3" />;
      case "approved":
        return <FaCheckCircle className="mr-1 h-3 w-3" />;
      case "active":
        return <FaUserCheck className="mr-1 h-3 w-3" />;
      case "inactive":
        return <FaUserTimes className="mr-1 h-3 w-3" />;
      default:
        return <FaExclamationTriangle className="mr-1 h-3 w-3" />;
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
export default function ManageTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]); // This will store work items
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingTeam, setViewingTeam] = useState(null);
  const [assigningProjectTo, setAssigningProjectTo] = useState(null);
  const [selectedProjectsToAssign, setSelectedProjectsToAssign] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
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
  const teamForm = useForm({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      teamLeader: "",
      teamMembers: [],
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
      assignedTo: "",
      status: "pending",
    },
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, workersResponse, workResponse] =
          await Promise.all([
            fetch("/api/teams"),
<<<<<<< HEAD
            fetch("/api/users"),
            fetch("/api/projects"),
            // fetch("/api/projects"), // Changed from /api/projects to /api/projects
=======
            fetch("/api/workers"),
            fetch("/api/projects"), // Changed from /api/projects to /api/work
>>>>>>> 0da5af7ceb1e929fa7ae56ac841a048c631b8078
          ]);

        if (!teamsResponse.ok) throw new Error("Failed to fetch teams");
        if (!workersResponse.ok) throw new Error("Failed to fetch workers");
        if (!workResponse.ok) throw new Error("Failed to fetch work items");

        const teamsData = await teamsResponse.json();
        const workersData = await workersResponse.json();
        const workData = await workResponse.json();

        setTeams(teamsData);
        setWorkers(workersData);
        setProjects(workData); // Set work data as projects
        setTasks(workData); // Also set as tasks since they seem to be the same in your code
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to load data. Please try again.", "error");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle team creation/update
  const handleTeamSubmit = async (data) => {
    setIsLoading(true);
    let teamData = null;
    try {
      const url = editingTeam ? `/api/teams/${editingTeam._id}` : "/api/teams";
      const method = editingTeam ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save team");
      }

      const result = await response.json();
      teamData = result.data;

      // --- START: isTeamLeader LOGIC ---
      const newLeaderId = data.teamLeader;
      const oldLeaderId = editingTeam ? editingTeam.teamLeader : null;

      console.log("Team submit - New leader ID:", newLeaderId);
      console.log("Team submit - Old leader ID:", oldLeaderId);

      // 1. Set the new/selected leader's status to true
      try {
        console.log("Setting new team leader status to true for:", newLeaderId);

        // Log the full URL to make sure it's correct
        const updateUrl = `/api/users/${newLeaderId}`;
        console.log("Update URL:", updateUrl);

        const userResponse = await fetch(updateUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isTeamLeader: true }),
        });

        console.log("New leader response status:", userResponse.status);
        console.log("New leader response headers:", [
          ...userResponse.headers.entries(),
        ]);

        if (userResponse.ok) {
          const userResult = await userResponse.json();
          console.log("New leader update result:", userResult);

          setWorkers((prevWorkers) =>
            prevWorkers.map((worker) =>
              worker._id === newLeaderId
                ? { ...worker, isTeamLeader: true }
                : worker,
            ),
          );

          showNotification(
            "Team leader status updated successfully!",
            "success",
          );
        } else {
          // Try to get more detailed error information
          const responseText = await userResponse.text();
          console.error(
            "Failed to set new team leader status. Response text:",
            responseText,
          );

          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch (e) {
            errorData = { error: responseText };
          }

          console.error("Failed to set new team leader status:", errorData);
          showNotification(
            `Failed to update team leader status: ${errorData.error || "Unknown error"}`,
            "error",
          );
        }
      } catch (error) {
        console.error("Error setting new team leader status:", error);
        showNotification(
          `Error updating team leader status: ${error.message}`,
          "error",
        );
      }

      // 2. If editing and the leader changed, set the old leader's status to false
      if (editingTeam && oldLeaderId && oldLeaderId !== newLeaderId) {
        try {
          console.log(
            "Setting old team leader status to false for:",
            oldLeaderId,
          );
          const oldLeaderResponse = await fetch(`/api/users/${oldLeaderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isTeamLeader: false }),
          });

          console.log("Old leader response status:", oldLeaderResponse.status);

          if (oldLeaderResponse.ok) {
            const oldLeaderResult = await oldLeaderResponse.json();
            console.log("Old leader update result:", oldLeaderResult);

            setWorkers((prevWorkers) =>
              prevWorkers.map((worker) =>
                worker._id === oldLeaderId
                  ? { ...worker, isTeamLeader: false }
                  : worker,
              ),
            );
          } else {
            const errorData = await oldLeaderResponse.json();
            console.error("Failed to demote old team leader:", errorData);
            showNotification(
              `Failed to update previous team leader: ${errorData.error}`,
              "error",
            );
          }
        } catch (error) {
          console.error("Error demoting old team leader:", error);
          showNotification(
            `Error updating previous team leader: ${error.message}`,
            "error",
          );
        }
      }
      // --- END: isTeamLeader LOGIC ---

      if (editingTeam) {
        setTeams(teams.map((t) => (t._id === editingTeam._id ? teamData : t)));
        showNotification("Team updated successfully!", "success");
      } else {
        setTeams([...teams, teamData]);
        showNotification("Team created successfully!", "success");
      }

      setIsAddingTeam(false);
      setEditingTeam(null);
      teamForm.reset();
    } catch (error) {
      console.error("Error saving team:", error);
      showNotification(error.message || "Failed to save team.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle project creation/update
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
            `Failed to ${editingProject ? "update" : "create"} project`,
        );
      }

      if (editingProject) {
        setProjects(
          projects.map((p) => (p._id === editingProject._id ? result.data : p)),
        );
        setEditingProject(null);
        showNotification("Project updated successfully!", "success");
      } else {
        setProjects((prev) => [result.data, ...prev]);
        showNotification("Project created successfully!", "success");
      }

      projectForm.reset();
    } catch (error) {
      console.error("Error in handleProjectSubmit:", error);
      showNotification(
        error.message ||
          `Failed to ${editingProject ? "update" : "create"} project.`,
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle team deletion
  // Handle team deletion
  const handleDeleteTeam = async (teamId) => {
    if (
      !confirm(
        "Are you sure you want to delete this team? This action cannot be undone.",
      )
    )
      return;

    setIsLoading(true);
    try {
      // Find the team to get the leader's ID before deleting
      const teamToDelete = teams.find((t) => t._id === teamId);
      const leaderIdToDemote = teamToDelete?.teamLeader;

      const response = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team");

      // --- START: isTeamLeader LOGIC ---
      // If the team had a leader, set their isTeamLeader status to false
      if (leaderIdToDemote) {
        try {
          console.log(
            "Setting deleted team leader status to false for:",
            leaderIdToDemote,
          );
          const userResponse = await fetch(`/api/users/${leaderIdToDemote}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isTeamLeader: false }),
          });

          console.log(
            "Deleted team leader response status:",
            userResponse.status,
          );

          if (userResponse.ok) {
            const userResult = await userResponse.json();
            console.log("Deleted team leader update result:", userResult);

            setWorkers((prevWorkers) =>
              prevWorkers.map((worker) =>
                worker._id === leaderIdToDemote
                  ? { ...worker, isTeamLeader: false }
                  : worker,
              ),
            );
          } else {
            const errorData = await userResponse.json();
            console.error(
              "Failed to demote team leader after team deletion:",
              errorData,
            );
            showNotification(
              `Failed to update team leader: ${errorData.error}`,
              "error",
            );
          }
        } catch (error) {
          console.error(
            "Error demoting team leader after team deletion:",
            error,
          );
          showNotification(
            `Error updating team leader: ${error.message}`,
            "error",
          );
        }
      }
      // --- END: isTeamLeader LOGIC ---

      setTeams(teams.filter((t) => t._id !== teamId));
      showNotification("Team deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting team:", error);
      showNotification(error.message || "Failed to delete team.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          // Changed to /api/projects
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete project");

        setProjects(projects.filter((p) => p._id !== projectId));
        showNotification("Project deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting project:", error);
        showNotification(error.message || "Failed to delete project.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle project assignment to team
  const handleAssignProject = async () => {
    if (selectedProjectsToAssign.length === 0) {
      showNotification(
        "Please select at least one project to assign.",
        "error",
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/teams/${assigningProjectTo._id}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectIds: selectedProjectsToAssign }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign projects");
      }

      const result = await response.json();

      // Update team's assigned projects
      setTeams(
        teams.map((t) =>
          t._id === assigningProjectTo._id
            ? {
                ...t,
                assignedProjects: [
                  ...(t.assignedProjects || []),
                  ...result.data.assignedProjects.map((p) => p._id),
                ],
              }
            : t,
        ),
      );

      // Update projects with team assignment
      setProjects((prev) =>
        prev.map((project) => {
          const updatedProject = result.data.assignedProjects.find(
            (p) => p._id === project._id,
          );
          return updatedProject || project;
        }),
      );

      setAssigningProjectTo(null);
      setSelectedProjectsToAssign([]);
      showNotification("Projects assigned successfully!", "success");
    } catch (error) {
      console.error("Error assigning projects:", error);
      showNotification(error.message || "Failed to assign projects.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Get team member details
  const getTeamMemberDetails = (memberIds) => {
    return memberIds
      .map((id) => workers.find((w) => w._id === id))
      .filter(Boolean);
  };

  // Get projects assigned to team members
  const getTeamProjects = (team) => {
    const allMemberIds = [team.teamLeader, ...(team.teamMembers || [])];
    return projects.filter((project) =>
      allMemberIds.includes(project.assignedTo),
    );
  };

  // Get tasks assigned to team members
  const getTeamTasks = (team) => {
    const allMemberIds = [team.teamLeader, ...(team.teamMembers || [])];
    return tasks.filter((task) => allMemberIds.includes(task.assignedTo));
  };

  // Filter teams based on search term
  const filteredTeams = teams.filter((team) => {
    const teamLeader = workers.find((w) => w._id === team.teamLeader);
    const teamLeaderName = teamLeader ? teamLeader.name.toLowerCase() : "";
    return (
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teamLeaderName.includes(searchTerm.toLowerCase())
    );
  });

  // Filter workers for team leader selection
  const eligibleTeamLeaders = workers.filter(
    (w) => w.status === "active" || w.status === "approved",
  );

  // Filter workers for team member selection
  const eligibleTeamMembers = workers.filter(
    (w) =>
      (w.status === "active" || w.status === "approved") &&
      w._id !== teamForm.watch("teamLeader"),
  );

  // Filter projects for assignment - Added safety check
  const filteredProjectsForAssignment = Array.isArray(projects)
    ? projects.filter((project) => !project.assignedTo)
    : [];

  // Update form when editingTeam changes
  useEffect(() => {
    if (editingTeam) {
      teamForm.setValue("name", editingTeam.name || "");
      teamForm.setValue("teamLeader", editingTeam.teamLeader || "");
      teamForm.setValue("teamMembers", editingTeam.teamMembers || []);
    }
  }, [editingTeam, teamForm]);

  // Update form when editingProject changes
  useEffect(() => {
    if (editingProject) {
      projectForm.setValue("title", editingProject.title || "");
      projectForm.setValue("description", editingProject.description || "");
      projectForm.setValue("dueDate", editingProject.dueDate || "");
      projectForm.setValue("priority", editingProject.priority || "medium");
      projectForm.setValue("category", editingProject.category || "other");
      projectForm.setValue(
        "estimatedHours",
        editingProject.estimatedHours || "",
      );
      projectForm.setValue(
        "tags",
        editingProject.tags ? editingProject.tags.join(", ") : "",
      );
      projectForm.setValue("assignedTo", editingProject.assignedTo || "");
      projectForm.setValue("status", editingProject.status || "pending");
    }
  }, [editingProject, projectForm]);

  if (isInitialLoading)
    return <LoadingSpinner message="Loading team data..." />;

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
                    <FaUsers className="text-primary animate-pulse" />
                    Manage Teams & Projects
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Create teams, assign members, and manage projects
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <AnimatedButton
                    onClick={() => setIsAddingTeam(true)}
                    className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <FaUserPlus className="mr-2 h-4 w-4" />
                    Create New Team
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => setIsAddingProject(true)}
                    className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Create New Project
                  </AnimatedButton>
                </div>
              </div>
            </CardHeader>
          </AnimatedCard>

          {/* Search */}
          <AnimatedCard className="shadow-md">
            <CardContent className="py-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by team name or team leader..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Teams Table */}
          <AnimatedCard className="shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Team Leader</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team) => {
                    const teamLeader = workers.find(
                      (w) => w._id === team.teamLeader,
                    );
                    const teamMembers = getTeamMemberDetails(
                      team.teamMembers || [],
                    );
                    const teamProjects = getTeamProjects(team);
                    const teamTasks = getTeamTasks(team);

                    return (
                      <TableRow
                        key={team._id}
                        className="hover:bg-muted/50 transition-all duration-200"
                      >
                        <TableCell className="font-medium">
                          {team.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                              <FaUser className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {teamLeader?.name || "Unknown"}
                                {teamLeader?.isTeamLeader && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-100 text-green-800 border-green-200 text-xs"
                                  >
                                    Leader
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {teamLeader?.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{teamMembers.length}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <FaUsers className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {teamMembers.map((member) => (
                                    <div key={member._id}>{member.name}</div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{teamProjects.length}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <FaProjectDiagram className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1 max-w-xs">
                                  {teamProjects.slice(0, 3).map((project) => (
                                    <div key={project._id}>{project.title}</div>
                                  ))}
                                  {teamProjects.length > 3 && (
                                    <div className="text-xs text-muted-foreground">
                                      ...and {teamProjects.length - 3} more
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{teamTasks.length}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <FaTasks className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1 max-w-xs">
                                  {teamTasks.slice(0, 3).map((task) => (
                                    <div key={task._id}>{task.title}</div>
                                  ))}
                                  {teamTasks.length > 3 && (
                                    <div className="text-xs text-muted-foreground">
                                      ...and {teamTasks.length - 3} more
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AnimatedButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setViewingTeam(team)}
                                  className="cursor-pointer"
                                >
                                  <FaInfoCircle className="h-4 w-4" />
                                </AnimatedButton>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Team Details</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AnimatedButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setAssigningProjectTo(team)}
                                  className="cursor-pointer"
                                >
                                  <FaProjectDiagram className="h-4 w-4" />
                                </AnimatedButton>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Assign Projects</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AnimatedButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingTeam(team)}
                                  className="cursor-pointer"
                                >
                                  <FaEdit className="h-4 w-4" />
                                </AnimatedButton>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Team</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AnimatedButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTeam(team._id)}
                                  className="text-destructive hover:text-destructive cursor-pointer"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </AnimatedButton>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Team</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredTeams.length === 0 && (
                <EmptyState
                  message="No teams found"
                  icon={
                    <FaUsers className="mx-auto h-12 w-12 text-muted-foreground" />
                  }
                />
              )}
            </CardContent>
          </AnimatedCard>

          {/* Projects Table */}
          <AnimatedCard className="shadow-lg overflow-hidden py-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaProjectDiagram className="text-primary" />
                Projects
              </CardTitle>
              <CardDescription>
                Manage and assign projects to teams
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(projects) &&
                    projects.map((project) => (
                      <TableRow
                        key={project._id}
                        className="hover:bg-muted/50 transition-all duration-200"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.description}
                            </div>
                            {project.tags && project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {project.tags.slice(0, 3).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {project.tags.length > 3 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{project.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FaUser className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {project.assignedTo &&
                                (() => {
                                  const worker = workers.find(
                                    (w) => w._id === project.assignedTo,
                                  );
                                  const team = teams.find(
                                    (t) =>
                                      t.teamLeader === project.assignedTo ||
                                      (t.teamMembers || []).includes(
                                        project.assignedTo,
                                      ),
                                  );
                                  return team
                                    ? `${team.name} - ${
                                        worker?.name || "Unknown"
                                      }`
                                    : worker?.name || "Unassigned";
                                })()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={project.status} />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              PRIORITY_OPTIONS.find(
                                (p) => p.value === project.priority,
                              )?.color || "bg-gray-500"
                            } text-white`}
                          >
                            <span>
                              {PRIORITY_OPTIONS.find(
                                (p) => p.value === project.priority,
                              )?.label || project.priority}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {project.dueDate ? (
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {new Date(project.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              No due date
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AnimatedButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingProject(project)}
                                  className="cursor-pointer"
                                >
                                  <FaEdit className="h-4 w-4" />
                                </AnimatedButton>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Project</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AnimatedButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProject(project._id)
                                  }
                                  className="text-destructive hover:text-destructive cursor-pointer"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </AnimatedButton>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Project</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {!Array.isArray(projects) || projects.length === 0 ? (
                <EmptyState
                  message="No projects found"
                  icon={
                    <FaProjectDiagram className="mx-auto h-12 w-12 text-muted-foreground" />
                  }
                />
              ) : null}
            </CardContent>
          </AnimatedCard>

          {/* Create/Edit Team Dialog */}
          <Dialog
            open={isAddingTeam || !!editingTeam}
            onOpenChange={() => {
              setIsAddingTeam(false);
              setEditingTeam(null);
              teamForm.reset();
            }}
          >
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTeam ? "Edit Team" : "Create New Team"}
                </DialogTitle>
                <DialogDescription>
                  {editingTeam
                    ? "Update team details"
                    : "Create a new team with a team leader and members"}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={teamForm.handleSubmit(handleTeamSubmit)}
                className="space-y-6"
              >
                {/* Team Name */}
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    Team Name <span className="text-destructive">*</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FaQuestionCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter a descriptive name for your team</p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <Input
                    placeholder="e.g., Development Team, Marketing Team"
                    {...teamForm.register("name")}
                    className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  {teamForm.formState.errors.name && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {teamForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Team Leader Selection */}
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    Team Leader <span className="text-destructive">*</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FaQuestionCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Select a worker to lead this team. The team leader
                          will have special responsibilities.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <Select
                    value={teamForm.watch("teamLeader")}
                    onValueChange={(value) =>
                      teamForm.setValue("teamLeader", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select team leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleTeamLeaders.length > 0 ? (
                        eligibleTeamLeaders.map(
                          (worker) =>
                            // Only render SelectItem if worker has a valid ID
                            worker._id && (
                              <SelectItem key={worker._id} value={worker._id}>
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                    <FaUser className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {worker.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {worker.email}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {worker.status}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ),
                        )
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          No eligible team leaders available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {teamForm.formState.errors.teamLeader && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {teamForm.formState.errors.teamLeader.message}
                    </p>
                  )}
                </div>

                {/* Team Members Selection */}
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    Team Members
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FaQuestionCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Select workers to be part of this team. The team
                          leader cannot be selected as a member.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md mb-2">
                      <span className="text-sm font-medium">
                        {teamForm.watch("teamMembers")?.length || 0} member
                        {teamForm.watch("teamMembers")?.length !== 1
                          ? "s"
                          : ""}{" "}
                        selected
                      </span>
                      {teamForm.watch("teamMembers")?.length > 0 && (
                        <AnimatedButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => teamForm.setValue("teamMembers", [])}
                        >
                          Clear All
                        </AnimatedButton>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                      {eligibleTeamMembers.length > 0 ? (
                        <div className="space-y-2">
                          {eligibleTeamMembers.map((worker) => (
                            <div
                              key={worker._id}
                              className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md transition-all duration-200"
                            >
                              <Checkbox
                                id={`member-${worker._id}`}
                                checked={teamForm
                                  .watch("teamMembers")
                                  ?.includes(worker._id)}
                                onCheckedChange={(checked) => {
                                  const currentMembers =
                                    teamForm.watch("teamMembers") || [];
                                  if (checked) {
                                    teamForm.setValue("teamMembers", [
                                      ...currentMembers,
                                      worker._id,
                                    ]);
                                  } else {
                                    teamForm.setValue(
                                      "teamMembers",
                                      currentMembers.filter(
                                        (id) => id !== worker._id,
                                      ),
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`member-${worker._id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-3 flex-1"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                  <FaUser className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {worker.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {worker.email}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {worker.status}
                                  </Badge>
                                  <div className="text-xs text-muted-foreground">
                                    {worker.assignedWork
                                      ? worker.assignedWork.length
                                      : 0}{" "}
                                    tasks
                                  </div>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          {teamForm.watch("teamLeader")
                            ? "No other workers available for selection."
                            : "Please select a team leader first."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingTeam(false);
                      setEditingTeam(null);
                      teamForm.reset();
                    }}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FaSave className="mr-2 h-4 w-4" />
                    )}
                    {editingTeam ? "Update" : "Create"} Team
                  </AnimatedButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Create/Edit Project Dialog */}
          <Dialog
            open={isAddingProject || !!editingProject}
            onOpenChange={() => {
              setIsAddingProject(false);
              setEditingProject(null);
              projectForm.reset();
            }}
          >
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FaProjectDiagram className="text-primary animate-pulse" />
                  {editingProject ? "Edit Project" : "Create New Project"}
                </DialogTitle>
                <DialogDescription>
                  {editingProject
                    ? "Update project details"
                    : "Add a new project to the system"}
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
                    Project Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="assignment"
                    className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Assignment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Project Title{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="Enter project title"
                        {...projectForm.register("title")}
                        className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                      {projectForm.formState.errors.title && (
                        <p className="text-sm font-medium text-destructive mt-1">
                          {projectForm.formState.errors.title.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Category
                      </label>
                      <Select
                        value={projectForm.watch("category")}
                        onValueChange={(value) =>
                          projectForm.setValue("category", value)
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a category" />
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
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Description <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Enter project description"
                      {...projectForm.register("description")}
                      rows={3}
                      className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    {projectForm.formState.errors.description && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {projectForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Priority
                      </label>
                      <Select
                        value={projectForm.watch("priority")}
                        onValueChange={(value) =>
                          projectForm.setValue("priority", value)
                        }
                      >
                        <SelectTrigger className="mt-2">
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
                    </div>

                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Due Date
                      </label>
                      <Input
                        type="date"
                        {...projectForm.register("dueDate")}
                        className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Story Point
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 8"
                        {...projectForm.register("estimatedHours")}
                        className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Tags
                    </label>
                    <Input
                      placeholder="e.g., frontend, urgent, bug-fix"
                      {...projectForm.register("tags")}
                      className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    <span className="text-sm font-medium">
                      Created:{" "}
                      {editingProject
                        ? new Date(
                            editingProject.createdAt,
                          ).toLocaleDateString()
                        : new Date(currentDate).toLocaleDateString()}
                    </span>
                  </div>
                </TabsContent>

                <TabsContent value="assignment" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Status
                    </label>
                    <Select
                      value={projectForm.watch("status")}
                      onValueChange={(value) =>
                        projectForm.setValue("status", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
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

                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Assign To (Optional)
                    </label>
                    <Select
                      value={projectForm.watch("assignedTo")}
                      onValueChange={(value) =>
                        projectForm.setValue("assignedTo", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={team._id} value={team._id}>
                            <div className="flex items-center gap-2">
                              <FaUsers className="h-4 w-4" />
                              <div className="flex-1">
                                <div className="font-medium">{team.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Leader:{" "}
                                  {(() => {
                                    const leader = workers.find(
                                      (w) => w._id === team.teamLeader,
                                    );
                                    return leader ? leader.name : "Unknown";
                                  })()}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <AnimatedButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingProject(false);
                    setEditingProject(null);
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
                    <FaSave className="mr-2 h-4 w-4" />
                  )}
                  {editingProject ? "Update" : "Create"} Project
                </AnimatedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Assign Projects Dialog */}
          <Dialog
            open={!!assigningProjectTo}
            onOpenChange={() => {
              setAssigningProjectTo(null);
              setSelectedProjectsToAssign([]);
            }}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Assign Projects</DialogTitle>
                <DialogDescription>
                  Select projects to assign to {assigningProjectTo?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {filteredProjectsForAssignment.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProjectsForAssignment.map((project) => (
                      <div
                        key={project._id}
                        className="flex items-start space-x-2 p-2 hover:bg-muted rounded-md transition-all duration-200"
                      >
                        <Checkbox
                          id={`project-${project._id}`}
                          checked={selectedProjectsToAssign.includes(
                            project._id,
                          )}
                          onCheckedChange={() => {
                            if (
                              selectedProjectsToAssign.includes(project._id)
                            ) {
                              setSelectedProjectsToAssign(
                                selectedProjectsToAssign.filter(
                                  (id) => id !== project._id,
                                ),
                              );
                            } else {
                              setSelectedProjectsToAssign([
                                ...selectedProjectsToAssign,
                                project._id,
                              ]);
                            }
                          }}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`project-${project._id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {project.title}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {project.category || "General"}
                            </Badge>
                            <Badge
                              className={`${
                                PRIORITY_OPTIONS.find(
                                  (p) => p.value === project.priority,
                                )?.color || "bg-gray-500"
                              } text-white text-xs`}
                            >
                              {PRIORITY_OPTIONS.find(
                                (p) => p.value === project.priority,
                              )?.label || project.priority}
                            </Badge>
                          </div>
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
                    setAssigningProjectTo(null);
                    setSelectedProjectsToAssign([]);
                  }}
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleAssignProject}
                  disabled={isLoading || selectedProjectsToAssign.length === 0}
                >
                  {isLoading ? (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FaProjectDiagram className="mr-2 h-4 w-4" />
                  )}
                  Assign Selected
                </AnimatedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Team Details Dialog */}
          <Dialog
            open={!!viewingTeam}
            onOpenChange={() => setViewingTeam(null)}
          >
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FaUsers className="text-primary" />
                  {viewingTeam?.name}
                </DialogTitle>
                <DialogDescription>
                  Team details and assigned projects/tasks
                </DialogDescription>
              </DialogHeader>
              {viewingTeam && (
                <div className="space-y-6">
                  {/* Team Leader */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <FaUserCheck className="text-primary" />
                      Team Leader
                    </h3>
                    {(() => {
                      const teamLeader = workers.find(
                        (w) => w._id === viewingTeam.teamLeader,
                      );
                      return teamLeader ? (
                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-md">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                            <FaUser className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {teamLeader.name}
                              {teamLeader.isTeamLeader && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 border-green-200 text-xs"
                                >
                                  Leader
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {teamLeader.email}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusBadge status={teamLeader.status} />
                              <span className="text-xs text-muted-foreground">
                                {teamLeader.assignedWork
                                  ? teamLeader.assignedWork.length
                                  : 0}{" "}
                                tasks assigned
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No team leader assigned
                        </p>
                      );
                    })()}
                  </div>

                  {/* Team Members */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <FaUsers className="text-primary" />
                      Team Members (
                      {
                        getTeamMemberDetails(viewingTeam.teamMembers || [])
                          .length
                      }
                      )
                    </h3>
                    {(() => {
                      const teamMembers = getTeamMemberDetails(
                        viewingTeam.teamMembers || [],
                      );
                      return teamMembers.length > 0 ? (
                        <div className="space-y-2">
                          {teamMembers.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center gap-3 p-3 bg-muted/30 rounded-md"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                <FaUser className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {member.email}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StatusBadge status={member.status} />
                                  <span className="text-xs text-muted-foreground">
                                    {member.assignedWork
                                      ? member.assignedWork.length
                                      : 0}{" "}
                                    tasks assigned
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No team members assigned
                        </p>
                      );
                    })()}
                  </div>

                  {/* Team Projects */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <FaProjectDiagram className="text-primary" />
                      Assigned Projects ({getTeamProjects(viewingTeam).length})
                    </h3>
                    {(() => {
                      const teamProjects = getTeamProjects(viewingTeam);
                      return teamProjects.length > 0 ? (
                        <div className="space-y-2">
                          {teamProjects.map((project) => {
                            const assignedMember = workers.find(
                              (w) => w._id === project.assignedTo,
                            );
                            return (
                              <div
                                key={project._id}
                                className="p-3 border rounded-md"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {project.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {project.description}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline">
                                        {project.status}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {project.category || "General"}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Assigned to:{" "}
                                        {assignedMember?.name || "Unknown"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-3">
                                    <Badge
                                      className={`${
                                        PRIORITY_OPTIONS.find(
                                          (p) => p.value === project.priority,
                                        )?.color || "bg-gray-500"
                                      } text-white`}
                                    >
                                      {PRIORITY_OPTIONS.find(
                                        (p) => p.value === project.priority,
                                      )?.label || project.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No projects assigned to team members
                        </p>
                      );
                    })()}
                  </div>

                  {/* Team Tasks */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <FaTasks className="text-primary" />
                      Assigned Tasks ({getTeamTasks(viewingTeam).length})
                    </h3>
                    {(() => {
                      const teamTasks = getTeamTasks(viewingTeam);
                      return teamTasks.length > 0 ? (
                        <div className="space-y-2">
                          {teamTasks.map((task) => {
                            const assignedMember = workers.find(
                              (w) => w._id === task.assignedTo,
                            );
                            return (
                              <div
                                key={task._id}
                                className="p-3 border rounded-md"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {task.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {task.description}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline">
                                        {task.status}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Assigned to:{" "}
                                        {assignedMember?.name || "Unknown"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-3">
                                    <Badge
                                      className={`${
                                        PRIORITY_OPTIONS.find(
                                          (p) => p.value === task.priority,
                                        )?.color || "bg-gray-500"
                                      } text-white`}
                                    >
                                      {PRIORITY_OPTIONS.find(
                                        (p) => p.value === task.priority,
                                      )?.label || task.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No tasks assigned to team members
                        </p>
                      );
                    })()}
                  </div>

                  {/* Team Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-2xl font-bold">
                        {getTeamMemberDetails(viewingTeam.teamMembers || [])
                          .length + 1}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Members
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-2xl font-bold">
                        {getTeamProjects(viewingTeam).length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Projects
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-2xl font-bold">
                        {getTeamTasks(viewingTeam).length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Tasks
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <AnimatedButton onClick={() => setViewingTeam(null)}>
                  Close
                </AnimatedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
}
