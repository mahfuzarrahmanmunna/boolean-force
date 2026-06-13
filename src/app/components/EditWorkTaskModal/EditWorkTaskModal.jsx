"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaPlus,
  FaTimes,
  FaSave,
  FaBriefcase,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaEyeSlash,
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
  FaSpinner,
  FaTrash,
  FaFile,
  FaHourglassHalf,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlayCircle,
  FaPauseCircle,
  FaStopCircle,
  FaDollarSign,
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
  { value: 'planning', label: 'Planning', description: 'Task is in planning phase', color: 'bg-gray-500', icon: FaHourglassHalf },
  { value: 'in-progress', label: 'In Progress', description: 'Task is currently being worked on', color: 'bg-blue-500', icon: FaPlayCircle },
  { value: 'on-hold', label: 'On Hold', description: 'Task is temporarily paused', color: 'bg-yellow-500', icon: FaPauseCircle },
  { value: 'completed', label: 'Completed', description: 'Task has been completed', color: 'bg-green-500', icon: FaCheckCircle },
  { value: 'cancelled', label: 'Cancelled', description: 'Task has been cancelled', color: 'bg-red-500', icon: FaStopCircle }
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
const workFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().default("planning"),
  priority: z.string().default("medium"),
  category: z.string().default("other"),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.string().optional(),
  tags: z.string().optional(),
  directions: z.string().optional(),
  progress: z.number().default(0),
});

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusOption = STATUS_OPTIONS.find(s => s.value === status);
  const Icon = statusOption?.icon || FaExclamationTriangle;

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${statusOption?.color} text-white`}>
      <Icon className="h-3 w-3" />
      {statusOption?.label || status}
    </Badge>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const priorityOption = PRIORITY_OPTIONS.find(p => p.value === priority);

  return (
    <Badge variant="outline" className={`${priorityOption?.color} text-white`}>
      {priorityOption?.label || priority}
    </Badge>
  );
};

// Form Field Component
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

// FileUpload Component
const FileUpload = ({ files, setFiles, onRemoveFile }) => {
  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);

    // Upload each file and get the URL
    const uploadedFiles = await Promise.all(
      newFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to upload file");
          }

          const result = await response.json();

          return {
            name: file.name,
            size: file.size,
            type: file.type,
            url: result.url,
          };
        } catch (error) {
          console.error("Error uploading file:", error);
          // Return the file without URL if upload fails
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            url: null,
          };
        }
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Task Files
        </label>
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
              <p>Upload files related to this task (images, documents, etc.)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <FaPaperclip className="h-8 w-8 text-muted-foreground/50" />
          <div className="text-sm text-muted-foreground">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="font-medium text-primary">Click to upload</span>{" "}
              or drag and drop
            </label>
            <Input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, PDF, DOC up to 10MB each
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mt-2">
          <p className="text-sm font-medium">Attached Files:</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FaFile className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                  {file.url ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-xs text-destructive">
                      Upload failed
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <FaTrash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function EditWorkTaskModal({
  isOpen,
  onClose,
  teams,
  workers,
  availableWork,
  setAvailableWork,
  setTeams,
  showNotification,
  taskToEdit,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeamsForTask, setSelectedTeamsForTask] = useState([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [files, setFiles] = useState([]);

  // Current date for creation timestamp
  const currentDate = new Date().toISOString().split("T")[0];

  // Forms
  const workForm = useForm({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "planning",
      priority: "medium",
      category: "other",
      budget: "",
      startDate: "",
      endDate: "",
      dueDate: "",
      estimatedHours: "",
      tags: "",
      directions: "",
      progress: 0,
    },
  });

  // Update form when taskToEdit changes
  useEffect(() => {
    if (taskToEdit) {
      // Reset form with task data
      workForm.reset({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        status: taskToEdit.status || "planning",
        priority: taskToEdit.priority || "medium",
        category: taskToEdit.category || "other",
        budget: taskToEdit.budget || "",
        startDate: taskToEdit.startDate || "",
        endDate: taskToEdit.endDate || "",
        dueDate: taskToEdit.dueDate || "",
        estimatedHours: taskToEdit.estimatedHours || "",
        tags: taskToEdit.tags ? taskToEdit.tags.join(", ") : "",
        directions: taskToEdit.directions || "",
        progress: taskToEdit.progress || 0,
      });

      // Set selected teams
      setSelectedTeamsForTask(taskToEdit.assignedTeams || []);

      // Set existing files
      setFiles(taskToEdit.files || []);
    }
  }, [taskToEdit, workForm]);

  // Filter teams for task assignment based on search term
  const filteredTeamsForTask = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch = team.name
        .toLowerCase()
        .includes(teamSearchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [teams, teamSearchTerm]);

  // Get team member details
  const getTeamMemberDetails = (memberIds) => {
    return memberIds
      .map((id) => workers.find((w) => w._id === id))
      .filter(Boolean);
  };

  // Get projects assigned to a team
  const getTeamProjects = (team) => {
    return availableWork.filter((task) =>
      team.assignedProjects?.includes(task._id)
    );
  };

  // Handle removing a file from the list
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleWorkSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(data).forEach((key) => {
        if (key === "tags" && data[key]) {
          // Convert tags string to array
          formData.append(
            key,
            JSON.stringify(data[key].split(",").map((tag) => tag.trim()))
          );
        } else {
          formData.append(key, data[key]);
        }
      });

      // Add creation date
      formData.append("createdAt", taskToEdit?.createdAt || currentDate);
      formData.append("updatedAt", currentDate);

      // Add selected teams
      formData.append("assignedTeams", JSON.stringify(selectedTeamsForTask));

      // Add files
      files.forEach((file) => {
        // For each file, we need to fetch it and add to FormData
        // Since we only have the URL, we'll just add the file info
        // In a real implementation, you might need to re-upload or handle this differently
        formData.append("fileInfo", JSON.stringify(file));
      });

      // Update work task with file upload
      const response = await fetch(`/api/projects/${taskToEdit._id}`, {
        method: "PUT",
        body: formData, // Don't set Content-Type header when using FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update work task");
      }

      const result = await response.json();
      const updatedWork = result.data;

      // If teams are selected, assign task to them
      if (selectedTeamsForTask.length > 0) {
        // Create an array of promises for each assignment
        const assignmentPromises = selectedTeamsForTask.map((teamId) =>
          fetch(`/api/teams/${teamId}/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectIds: [updatedWork._id] }),
          })
        );

        // Wait for all promises to settle (either fulfilled or rejected)
        const assignmentResults = await Promise.allSettled(assignmentPromises);

        const failedAssignments = [];
        const successfulTeamIds = [];

        // Process each result
        for (let i = 0; i < assignmentResults.length; i++) {
          const result = assignmentResults[i];
          const teamId = selectedTeamsForTask[i];
          const team = teams.find((t) => t._id === teamId);
          const teamName = team ? team.name : `Team ID ${teamId}`;

          if (result.status === "fulfilled" && result.value.ok) {
            successfulTeamIds.push(teamId);

            // Update team in local state with response data
            try {
              const assignmentResult = await result.value.json();
              if (assignmentResult.success && assignmentResult.data.team) {
                setTeams((prevTeams) =>
                  prevTeams.map((t) =>
                    t._id === teamId ? assignmentResult.data.team : t
                  )
                );
              }
            } catch (parseError) {
              console.error("Error parsing assignment response:", parseError);
            }
          } else {
            let errorMessage = "Unknown error";
            if (result.status === "rejected") {
              errorMessage = result.reason.message || "Network or server error";
            } else {
              // The fetch was successful but server responded with an error status
              try {
                const errorData = await result.value.json();
                errorMessage =
                  errorData.error ||
                  `Server error (status: ${result.value.status})`;
              } catch (e) {
                errorMessage = `Server responded with status ${result.value.status}`;
              }
            }
            failedAssignments.push({ teamName, errorMessage });
          }
        }

        // If there were any failures, throw a detailed error
        if (failedAssignments.length > 0) {
          const failureMessages = failedAssignments
            .map(
              ({ teamName, errorMessage }) => `• ${teamName}: ${errorMessage}`
            )
            .join("<br>"); // Use <br> for HTML rendering in notification

          throw new Error(
            `Task updated, but failed to assign to some teams:<br>${failureMessages}`
          );
        }

        // Update available work list with the updated tasks
        if (successfulTeamIds.length > 0) {
          try {
            // Fetch the updated task to get the latest assignedTo information
            const updatedTaskResponse = await fetch(`/api/projects/${updatedWork._id}`);
            if (updatedTaskResponse.ok) {
              const updatedTaskData = await updatedTaskResponse.json();
              if (updatedTaskData.data) {
                setAvailableWork((prev) =>
                  prev.map((task) =>
                    task._id === updatedWork._id ? updatedTaskData.data : task
                  )
                );
              }
            }
          } catch (fetchError) {
            console.error("Error fetching updated task:", fetchError);
          }
        }
      } else {
        // If no teams are selected, update task in available work list
        setAvailableWork((prev) =>
          prev.map((task) =>
            task._id === taskToEdit._id ? updatedWork : task
          )
        );
      }

      // Reset form and show success
      onClose();
      workForm.reset();
      setSelectedTeamsForTask([]);
      setTeamSearchTerm("");
      setFiles([]);
      showNotification(
        "Work task updated and assigned successfully!",
        "success"
      );
    } catch (error) {
      console.error("Error in handleWorkSubmit:", error);
      showNotification(error.message || "Failed to update work task.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      workForm.reset();
      setSelectedTeamsForTask([]);
      setTeamSearchTerm("");
      setFiles([]);
      setActiveTab("details");
    }
  }, [isOpen, workForm]);

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaBriefcase className="text-primary animate-pulse" />
              Edit Work Task
            </DialogTitle>
            <DialogDescription>
              Update task details and assign it to teams
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                value="details"
                className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Task Details
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Timeline & Budget
              </TabsTrigger>
              <TabsTrigger
                value="directions"
                className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Directions
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Files
              </TabsTrigger>
              <TabsTrigger
                value="assignment"
                className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Team Assignment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <form
                onSubmit={workForm.handleSubmit(handleWorkSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Task Title"
                    error={workForm.formState.errors.title}
                    required
                    tooltip="Give your task a clear and descriptive title"
                  >
                    <Input
                      placeholder="Enter task title"
                      {...workForm.register("title")}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormField>
                  <FormField
                    label="Category"
                    error={workForm.formState.errors.category}
                    tooltip="Select the category that best describes this task"
                  >
                    <Select
                      value={workForm.watch("category")}
                      onValueChange={(value) =>
                        workForm.setValue("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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
                  error={workForm.formState.errors.description}
                  required
                  tooltip="Provide a detailed description of the task including requirements and expectations"
                >
                  <Textarea
                    placeholder="Enter task description"
                    {...workForm.register("description")}
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="Status"
                    error={workForm.formState.errors.status}
                    tooltip="Current status of the task"
                  >
                    <Select
                      value={workForm.watch("status")}
                      onValueChange={(value) =>
                        workForm.setValue("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    label="Priority"
                    error={workForm.formState.errors.priority}
                    tooltip="Set the priority level to help teams understand urgency"
                  >
                    <Select
                      value={workForm.watch("priority")}
                      onValueChange={(value) =>
                        workForm.setValue("priority", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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
                    label="Progress"
                    error={workForm.formState.errors.progress}
                    tooltip="Current progress of the task"
                  >
                    <div className="space-y-2">
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        {...workForm.register("progress", { valueAsNumber: true })}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>{workForm.watch("progress") || 0}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </FormField>
                </div>

                <FormField
                  label="Tags"
                  error={workForm.formState.errors.tags}
                  tooltip="Add tags to help categorize and find this task later"
                >
                  <Input
                    placeholder="e.g., frontend, urgent, bug-fix"
                    {...workForm.register("tags")}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>

                <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  <span className="text-sm font-medium">
                    Creation Date: {new Date(taskToEdit?.createdAt || currentDate).toLocaleDateString()}
                  </span>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Start Date"
                  error={workForm.formState.errors.startDate}
                  tooltip="When the task is scheduled to start"
                >
                  <Input
                    type="date"
                    {...workForm.register("startDate")}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>
                <FormField
                  label="End Date"
                  error={workForm.formState.errors.endDate}
                  tooltip="When the task is scheduled to be completed"
                >
                  <Input
                    type="date"
                    {...workForm.register("endDate")}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Due Date"
                  error={workForm.formState.errors.dueDate}
                  tooltip="Set a deadline for task completion"
                >
                  <Input
                    type="date"
                    {...workForm.register("dueDate")}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>
                <FormField
                  label="Budget"
                  error={workForm.formState.errors.budget}
                  tooltip="Estimated budget for the task"
                >
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...workForm.register("budget")}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>
              </div>

              <FormField
                label="Story Point"
                error={workForm.formState.errors.estimatedHours}
                tooltip="Provide an estimate of how long this task will take"
              >
                <Input
                  type="number"
                  placeholder="e.g., 8"
                  {...workForm.register("estimatedHours")}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormField>

              <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                <span className="text-sm font-medium">
                  Created: {new Date(taskToEdit?.createdAt || currentDate).toLocaleDateString()}
                </span>
              </div>
            </TabsContent>

            <TabsContent value="directions" className="space-y-4 mt-4">
              <FormField
                label="Work Directions"
                error={workForm.formState.errors.directions}
                tooltip="Provide detailed step-by-step instructions on how to complete this task"
                description="This is where you can explain the process, requirements, and expectations for completing this task"
              >
                <Textarea
                  placeholder="Enter detailed directions for this task..."
                  {...workForm.register("directions")}
                  rows={8}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormField>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <FaLightbulb className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Tips for effective directions:
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                      <li>• Be specific about requirements and expectations</li>
                      <li>• Break down complex tasks into smaller steps</li>
                      <li>• Include examples or references when helpful</li>
                      <li>• Specify any tools or resources needed</li>
                      <li>• Define what "done" looks like for this task</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4 mt-4">
              <FileUpload
                files={files}
                setFiles={setFiles}
                onRemoveFile={handleRemoveFile}
              />
            </TabsContent>

            <TabsContent value="assignment" className="space-y-4 mt-4">
              <FormField
                label="Assign to Teams (Optional)"
                tooltip="Select teams to assign this task to. Leave empty to make it available for any team."
              >
                <div className="space-y-3">
                  {/* Team Search Input */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search teams by name..."
                      value={teamSearchTerm}
                      onChange={(e) => setTeamSearchTerm(e.target.value)}
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Team Selection Stats */}
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <span className="text-sm font-medium">
                      {selectedTeamsForTask.length} team
                      {selectedTeamsForTask.length !== 1 ? "s" : ""} selected
                    </span>
                    {selectedTeamsForTask.length > 0 && (
                      <AnimatedButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTeamsForTask([])}
                      >
                        Clear All
                      </AnimatedButton>
                    )}
                  </div>

                  {/* Team List */}
                  <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                    {filteredTeamsForTask.length > 0 ? (
                      <div className="space-y-2">
                        {filteredTeamsForTask.map((team) => (
                          <div
                            key={team._id}
                            className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md transition-all duration-200"
                          >
                            <Checkbox
                              id={`team-${team._id}`}
                              checked={selectedTeamsForTask.includes(team._id)}
                              onCheckedChange={() => {
                                if (
                                  selectedTeamsForTask.includes(team._id)
                                ) {
                                  setSelectedTeamsForTask(
                                    selectedTeamsForTask.filter(
                                      (id) => id !== team._id
                                    )
                                  );
                                } else {
                                  setSelectedTeamsForTask([
                                    ...selectedTeamsForTask,
                                    team._id,
                                  ]);
                                }
                              }}
                            />
                            <label
                              htmlFor={`team-${team._id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 flex-1"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground transition-all duration-200 hover:scale-110">
                                <FaUsers className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span>{team.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {getTeamMemberDetails(
                                      team.teamMembers || []
                                    ).length + 1}{" "}
                                    members
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Leader:{" "}
                                  {(() => {
                                    const leader = workers.find(
                                      (w) => w._id === team.teamLeader
                                    );
                                    return leader ? leader.name : "Unknown";
                                  })()}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {getTeamProjects(team).length} tasks
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        {teamSearchTerm
                          ? "No teams match your search."
                          : "No teams available."}
                      </p>
                    )}
                  </div>
                </div>
              </FormField>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <AnimatedButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              disabled={isLoading}
              onClick={workForm.handleSubmit(handleWorkSubmit)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              {isLoading ? (
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FaSave className="mr-2 h-4 w-4" />
              )}
              Update Task
            </AnimatedButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}