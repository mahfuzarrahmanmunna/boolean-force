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
  FaUser,
  FaTasks,
  FaClipboardList,
  FaHourglassHalf,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaUserPlus,
  FaBriefcase,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaEyeSlash,
  FaUserClock,
  FaUserCheck,
  FaUserTimes,
  FaExclamationCircle,
  FaFlag,
  FaTag,
  FaInfoCircle,
  FaPaperclip,
  FaStar,
  FaClock,
  FaChartLine,
  FaQuestionCircle,
  FaLightbulb,
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
import CreateWorkTaskModal from "@/app/components/CreateWorkTaskModal/page";

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

// Form schemas
const statusFormSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

const teamFormSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  teamLeader: z.string().min(1, "Team leader is required"),
  teamMembers: z.array(z.string()).optional(),
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
        return <FaHourglassHalf className="mr-1 h-3 w-3" />;
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
export default function ManageWorkers() {
  const [workers, setWorkers] = useState([]);
  const [availableWork, setAvailableWork] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [editingWorker, setEditingWorker] = useState(null);
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [viewingTeam, setViewingTeam] = useState(null);
  const [assigningWorkTo, setAssigningWorkTo] = useState(null);
  const [selectedTasksToAssign, setSelectedTasksToAssign] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Forms
  const statusForm = useForm({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status: "",
    },
  });

  const teamForm = useForm({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      teamLeader: "",
      teamMembers: [],
    },
  });

  // Fetch workers, available work, and teams from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workersResponse, workResponse, teamsResponse] = await Promise.all([
          fetch("/api/workers"),
          fetch("/api/work"),
          fetch("/api/teams"),
        ]);

        if (!workersResponse.ok) throw new Error("Failed to fetch workers");
        if (!workResponse.ok) throw new Error("Failed to fetch work tasks");
        if (!teamsResponse.ok) throw new Error("Failed to fetch teams");

        const workersData = await workersResponse.json();
        const workData = await workResponse.json();
        const teamsData = await teamsResponse.json();

        setWorkers(workersData);
        setAvailableWork(workData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to load data. Please try again.", "error");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update form when editingWorker changes
  useEffect(() => {
    if (editingWorker) {
      statusForm.setValue("status", editingWorker.status || "");
    }
  }, [editingWorker, statusForm]);

  // Update form when editingTeam changes
  useEffect(() => {
    if (editingTeam) {
      teamForm.setValue("name", editingTeam.name || "");
      teamForm.setValue("teamLeader", editingTeam.teamLeader || "");
      teamForm.setValue("teamMembers", editingTeam.teamMembers || []);
    }
  }, [editingTeam, teamForm]);

  // Handle worker status update
  const handleEditSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/workers/${editingWorker._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let errorMessage = "Failed to update worker status";

      if (!response.ok) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Update workers list
      setWorkers(
        workers.map((w) => (w._id === editingWorker._id ? result.data : w))
      );

      setEditingWorker(null);
      showNotification("Worker status updated successfully!", "success");
    } catch (error) {
      console.error("Error updating worker status:", error);
      showNotification(error.message || "Failed to update worker status.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle assigning work to a team
  const handleAssignWork = async () => {
    if (selectedTasksToAssign.length === 0) {
      showNotification("Please select at least one task to assign.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/teams/${assigningWorkTo._id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds: selectedTasksToAssign }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || result.details || "Failed to assign work";
        throw new Error(errorMessage);
      }

      // Update team's assigned work
      setTeams(
        teams.map((t) =>
          t._id === assigningWorkTo._id
            ? {
                ...t,
                assignedProjects: [
                  ...(t.assignedProjects || []),
                  ...result.data.assignedProjects.map((p) => p._id),
                ],
              }
            : t
        )
      );

      // Update available work list with the updated tasks
      setAvailableWork((prev) =>
        prev.map((task) => {
          const updatedTask = result.data.assignedProjects.find(
            (p) => p._id === task._id
          );
          return updatedTask || task;
        })
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

  // Handle worker deletion
  const handleDeleteWorker = async (workerId) => {
    if (
      confirm(
        "Are you sure you want to delete this worker? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/workers/${workerId}`, {
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

  // Handle team creation/update
  const handleTeamSubmit = async (data) => {
    setIsLoading(true);
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

      if (editingTeam) {
        setTeams(
          teams.map((t) => (t._id === editingTeam._id ? result.data : t))
        );
        showNotification("Team updated successfully!", "success");
      } else {
        setTeams([...teams, result.data]);
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

  // Handle team deletion
  const handleDeleteTeam = async (teamId) => {
    if (
      confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/teams/${teamId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete team");

        setTeams(teams.filter((t) => t._id !== teamId));
        showNotification("Team deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting team:", error);
        showNotification(error.message || "Failed to delete team.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get team member details
  const getTeamMemberDetails = (memberIds) => {
    return memberIds
      .map((id) => workers.find((w) => w._id === id))
      .filter(Boolean);
  };

  // Get tasks assigned to team members
  const getTeamTasks = (team) => {
    const allMemberIds = [team.teamLeader, ...(team.teamMembers || [])];
    return availableWork.filter((task) =>
      allMemberIds.includes(task.assignedTo)
    );
  };

  // Get projects assigned to a team
  const getTeamProjects = (team) => {
    return availableWork.filter((task) =>
      team.assignedProjects?.includes(task._id)
    );
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

  if (isInitialLoading)
    return <LoadingSpinner message="Loading worker data..." />;


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
                    <FaUserClock className="text-primary animate-pulse" />
                    Manage Workers & Teams
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Approve workers, create teams, and assign tasks to teams
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <AnimatedButton
                    onClick={() => setIsAddingTeam(true)}
                    className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <FaUsers className="mr-2 h-4 w-4" />
                    Create Team
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => setIsAddingWork(true)}
                    className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <FaBriefcase className="mr-2 h-4 w-4" />
                    Create New Task
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
                    placeholder="Search by name or email..."
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

          {/* Teams Section */}
          {teams.length > 0 && (
            <AnimatedCard className="shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaUsers className="text-primary" />
                  Teams
                </CardTitle>
                <CardDescription>
                  Manage your teams and their assigned tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Team Leader</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Assigned Tasks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => {
                      const teamLeader = workers.find(
                        (w) => w._id === team.teamLeader,
                      );
                      const teamMembers = getTeamMemberDetails(
                        team.teamMembers || [],
                      );
                      const teamProjects = getTeamProjects(team);

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
                                <div className="font-medium">
                                  {teamLeader?.name || "Unknown"}
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
                                    <FaTasks className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1 max-w-xs">
                                    {teamProjects.slice(0, 3).map((task) => (
                                      <div key={task._id}>{task.title}</div>
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
                                    onClick={() => {
                                      setAssigningWorkTo(team);
                                      setSelectedTasksToAssign([]);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <FaTasks className="h-4 w-4" />
                                  </AnimatedButton>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Assign Work</p>
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
                                    className="text-destructive hover:text-destructive"
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
              </CardContent>
            </AnimatedCard>
          )}

          {/* Worker Table */}
          <AnimatedCard className="shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker) => (
                    <TableRow
                      key={worker._id}
                      className="hover:bg-muted/50 transition-all duration-200"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground transition-all duration-200 hover:scale-110">
                            <FaUser className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{worker.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {worker.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <StatusBadge status={worker.status} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {STATUS_OPTIONS.find(
                                (s) => s.value === worker.status,
                              )?.description || "No description available"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const team = teams.find(
                            (t) =>
                              t.teamLeader === worker._id ||
                              (t.teamMembers || []).includes(worker._id),
                          );
                          return team ? (
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <FaUsers className="h-3 w-3" />
                              {team.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">
                              No team
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        {new Date(worker.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AnimatedButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingWorker(worker)}
                                className="cursor-pointer"
                              >
                                <FaEdit className="h-4 w-4" />
                              </AnimatedButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Worker Status</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AnimatedButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteWorker(worker._id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <FaTrash className="h-4 w-4" />
                              </AnimatedButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Worker</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredWorkers.length === 0 && (
                <EmptyState
                  message="No workers found"
                  icon={
                    <FaUserTimes className="mx-auto h-12 w-12 text-muted-foreground" />
                  }
                />
              )}
            </CardContent>
          </AnimatedCard>

          {/* Edit Worker Status Dialog */}
          <Dialog
            open={!!editingWorker}
            onOpenChange={() => setEditingWorker(null)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Status</DialogTitle>
                <DialogDescription>
                  Change status for {editingWorker?.name}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={statusForm.handleSubmit(handleEditSubmit)}
                className="space-y-4"
              >
                <FormField
                  label="Status"
                  error={statusForm.formState.errors.status}
                  required
                  tooltip="Select the appropriate status for this worker"
                >
                  <Select
                    value={statusForm.watch("status")}
                    onValueChange={(value) =>
                      statusForm.setValue("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.label}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <FaQuestionCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{option.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <DialogFooter>
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    onClick={() => setEditingWorker(null)}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FaSave className="mr-2 h-4 w-4" />
                    )}
                    Save
                  </AnimatedButton>
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
                  Select tasks to assign to {assigningWorkTo?.name} team
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
                          {/* Display currently assigned teams for this task */}
                          {task?.assignedTo && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Assigned to:
                              </span>
                              {
                                // Convert to array if it's a string (old format) or use as-is if already an array
                                (Array.isArray(task.assignedTo)
                                  ? task.assignedTo
                                  : [task.assignedTo]
                                )
                                  .filter(Boolean) // Remove any falsy values (null, undefined, empty string)
                                  .map((teamId) => {
                                    const team = teams.find(
                                      (t) => t._id === teamId,
                                    );
                                    return team ? (
                                      <Badge
                                        key={teamId}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        <FaUsers className="h-3 w-3 mr-1" />
                                        {team.name}
                                      </Badge>
                                    ) : null;
                                  })
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No available work tasks to assign.
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
                    <FaTasks className="mr-2 h-4 w-4" />
                  )}
                  Assign Selected
                </AnimatedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create/Edit Team Dialog */}
          <Dialog
            open={isAddingTeam || !!editingTeam}
            onOpenChange={() => {
              setIsAddingTeam(false);
              setEditingTeam(null);
              teamForm.reset();
            }}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTeam ? "Edit Team" : "Create New Team"}
                </DialogTitle>
                <DialogDescription>
                  {editingTeam
                    ? "Update team details"
                    : "Create a new team with a leader and members"}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={teamForm.handleSubmit(handleTeamSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Team Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Enter team name"
                    {...teamForm.register("name")}
                    className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  {teamForm.formState.errors.name && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {teamForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Team Leader <span className="text-destructive">*</span>
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
                      {workers
                        .filter(
                          (w) =>
                            w.status === "active" || w.status === "approved",
                        )
                        .map((worker) => (
                          <SelectItem key={worker._id} value={worker._id}>
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                <FaUser className="h-3 w-3" />
                              </div>
                              <div>
                                <div className="font-medium">{worker.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {worker.email}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {teamForm.formState.errors.teamLeader && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {teamForm.formState.errors.teamLeader.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Team Members
                  </label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {workers
                      .filter(
                        (w) =>
                          (w.status === "active" || w.status === "approved") &&
                          w._id !== teamForm.watch("teamLeader"),
                      )
                      .map((worker) => (
                        <div
                          key={worker._id}
                          className="flex items-center space-x-2"
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
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 flex-1"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                              <FaUser className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{worker.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {worker.email}
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
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
                    {editingTeam ? "Update" : "Create"}
                  </AnimatedButton>
                </DialogFooter>
              </form>
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
                  Team details and assigned tasks
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
                          <div>
                            <div className="font-medium">{teamLeader.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {teamLeader.email}
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
                      Team Members
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
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {member.email}
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

                  {/* Team Tasks */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <FaTasks className="text-primary" />
                      Assigned Tasks
                    </h3>
                    {(() => {
                      const teamProjects = getTeamProjects(viewingTeam);
                      return teamProjects.length > 0 ? (
                        <div className="space-y-2">
                          {teamProjects.map((task) => (
                            <div
                              key={task._id}
                              className="p-3 border rounded-md"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">
                                    {task.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {task.description}
                                  </div>
                                </div>
                                <Badge variant="outline">{task.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No tasks assigned to this team
                        </p>
                      );
                    })()}
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

          {/* Create Work Task Modal Component */}
          <CreateWorkTaskModal
            isOpen={isAddingWork}
            onClose={() => setIsAddingWork(false)}
            teams={teams}
            workers={workers}
            availableWork={availableWork}
            setAvailableWork={setAvailableWork}
            setTeams={setTeams}
            showNotification={showNotification}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
