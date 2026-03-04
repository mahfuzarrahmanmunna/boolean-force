// app/admin/managecontact/page.jsx (Fixed and Responsive)
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaFilter,
  FaCheck,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaSync,
  FaArchive,
  FaPaperPlane,
  FaSortAmountUp,
  FaSortAmountDown,
  FaStickyNote,
  FaReply,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";

// Import shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Status options with colors
const statusOptions = [
  {
    value: "new",
    label: "New",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    value: "contacted",
    label: "Contacted",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    value: "in-progress",
    label: "In Progress",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    value: "completed",
    label: "Completed",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    value: "closed",
    label: "Closed",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
];

// Service options
const serviceOptions = [
  { id: "pos", name: "POS Systems", icon: "💳" },
  { id: "brand", name: "Tagline Visual Identity", icon: "🎨" },
  { id: "2", name: "ERP Software Solutions", icon: "📊" },
  { id: "web", name: "Web Development", icon: "🌐" },
  { id: "mobile", name: "Mobile App Development", icon: "📱" },
  { id: "cloud", name: "Cloud Solutions", icon: "☁️" },
];

// Email templates - FIXED with proper string formatting
const emailTemplates = [
  {
    id: "initial-response",
    name: "Initial Response",
    subject: "Thank you for contacting BooleanForce",
    message: `Dear [Name],

Thank you for reaching out to BooleanForce. We have received your inquiry and are excited about the possibility of working with you.

Based on your interest in [Services], we believe our team can provide the solutions you're looking for. We'll review your requirements in detail and get back to you within 24 hours with more specific information.

In the meantime, feel free to browse our portfolio at [website] to see examples of our work.

Best regards,
The BooleanForce Team`,
  },
  {
    id: "follow-up",
    name: "Follow-up",
    subject: "Following up on your inquiry",
    message: `Dear [Name],

I hope this email finds you well. I'm following up on your recent inquiry about [Services].

I wanted to let you know that we've reviewed your requirements and are preparing a detailed proposal for you. We expect to have it ready within [timeframe].

If you have any questions in the meantime, please don't hesitate to reach out.

Best regards,
The BooleanForce Team`,
  },
  {
    id: "proposal-sent",
    name: "Proposal Sent",
    subject: "Your custom proposal from BooleanForce",
    message: `Dear [Name],

Thank you for your patience. I'm pleased to inform you that we've prepared a detailed proposal for your [Services] project.

You can review the proposal at [proposal link]. It includes a detailed scope of work, timeline, and pricing information.

We're excited about the possibility of working with you and look forward to your feedback.

Best regards,
The BooleanForce Team`,
  },
  {
    id: "custom",
    name: "Custom Message",
    subject: "",
    message: "",
  },
];

// Main component
export default function ManageContact() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [emailingContact, setEmailingContact] = useState(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [savingContactId, setSavingContactId] = useState(null);
  const [deletingContactId, setDeletingContactId] = useState(null);
  const [sendingEmailId, setSendingEmailId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("initial-response");

  // Form for editing contacts
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    watch: watchEdit,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm();

  // Form for adding notes
  const {
    register: registerNote,
    handleSubmit: handleNoteSubmit,
    reset: resetNote,
    formState: { errors: noteErrors, isSubmitting: isNoteSubmitting },
  } = useForm();

  // Form for sending emails
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    reset: resetEmail,
    setValue: setEmailValue,
    watch: watchEmail,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm();

  // Watch for template changes
  const watchedTemplate = watchEmail("template");

  // Update email form when template changes
  useEffect(() => {
    if (watchedTemplate && emailingContact) {
      const template = emailTemplates.find((t) => t.id === watchedTemplate);
      if (template) {
        const contact = contacts.find((c) => c._id === emailingContact);
        if (contact) {
          let personalizedMessage = template.message
            .replace(/\[Name\]/g, contact.name)
            .replace(
              /\[Services\]/g,
              contact.services && contact.services.length > 0
                ? contact.services
                    .map((sId) => {
                      const service = serviceOptions.find(
                        (opt) => opt.id === sId,
                      );
                      return service ? service.name : "";
                    })
                    .join(", ")
                : "our services",
            )
            .replace(/\[website\]/g, "https://booleanforce.com")
            .replace(/\[proposal link\]/g, "https://BooleanForce.com/proposal")
            .replace(/\[timeframe\]/g, "the next 2-3 business days");

          setEmailValue("subject", template.subject);
          setEmailValue("message", personalizedMessage);
        }
      }
    }
  }, [watchedTemplate, emailingContact, contacts, setEmailValue]);

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contact");
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();
        setContacts(data);
        setFilteredContacts(data);
        console.log("Fetched contacts:", data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        showNotification("Failed to load contacts. Please try again.", "error");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...contacts];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.company &&
            contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
          contact.message.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((contact) => contact.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "date":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case "status":
          aValue = a.status || "new";
          bValue = b.status || "new";
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredContacts(result);
  }, [contacts, searchTerm, statusFilter, sortBy, sortOrder]);

  // Handle opening the edit modal and populate the form
  const handleEditModalOpen = (contactId) => {
    const contact = contacts.find((c) => c._id === contactId);
    if (contact) {
      // Populate the form with existing data
      setEditValue("name", contact.name || "");
      setEditValue("email", contact.email || "");
      setEditValue("phone", contact.phone || "");
      setEditValue("company", contact.company || "");
      setEditValue("status", contact.status || "new");
      setEditValue("budget", contact.budget || "");
      setEditValue("timeline", contact.timeline || "");
      setEditValue("message", contact.message || "");

      // For services, set the array of selected service IDs
      if (contact.services && contact.services.length > 0) {
        setEditValue("services", contact.services);
      } else {
        setEditValue("services", []);
      }

      setEditingContact(contactId);
    }
  };

  // Handle form submission for editing
  const onEditSubmit = async (data) => {
    setIsLoading(true);
    setSavingContactId(editingContact);

    try {
      // Process services data to ensure it's an array
      const services = Array.isArray(data.services)
        ? data.services
        : Object.keys(data.services || {}).filter((key) => data.services[key]);

      const processedData = {
        ...data,
        services,
      };

      const response = await fetch(`/api/contact/${editingContact}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update contact");
      }

      const responseData = await response.json();

      // Update the local state with the updated contact
      if (responseData.data) {
        const updatedData = contacts.map((contact) =>
          contact._id === editingContact ? responseData.data : contact,
        );
        setContacts(updatedData);
      }

      setEditingContact(null);
      resetEdit();
      showNotification("Contact updated successfully!", "success");
    } catch (error) {
      console.error("Error updating contact:", error);
      showNotification(
        error.message || "Failed to update contact. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
      setSavingContactId(null);
    }
  };

  // Handle form submission for adding notes
  const onNoteSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/contact/${viewingContact}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: data.note,
          author: "Admin",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add note");
      }

      const responseData = await response.json();

      // Update the local state with the updated contact
      if (responseData.data) {
        const updatedData = contacts.map((contact) =>
          contact._id === viewingContact ? responseData.data : contact,
        );
        setContacts(updatedData);
        setViewingContact(responseData.data);
      }

      setIsAddingNote(false);
      resetNote();
      showNotification("Note added successfully!", "success");
    } catch (error) {
      console.error("Error adding note:", error);
      showNotification(
        error.message || "Failed to add note. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for sending emails
  const onEmailSubmit = async (data) => {
    setIsLoading(true);
    setSendingEmailId(emailingContact);

    try {
      const contact = contacts.find((c) => c._id === emailingContact);

      const response = await fetch("/api/contact/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: contact.email,
          subject: data.subject,
          message: data.message,
          fromName: "BooleanForce Team",
          fromEmail:
            process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "consult@booleanforce.com",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }

      // Add a note about the sent email
      const noteResponse = await fetch(`/api/contact/${emailingContact}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: `Email sent with subject: "${data.subject}"`,
          author: "System",
        }),
      });

      if (noteResponse.ok) {
        const noteData = await noteResponse.json();
        if (noteData.data) {
          const updatedData = contacts.map((contact) =>
            contact._id === emailingContact ? noteData.data : contact,
          );
          setContacts(updatedData);
        }
      }

      // Update contact status to 'contacted' if it was 'new'
      if (contact.status === "new") {
        await handleStatusUpdate(emailingContact, "contacted");
      }

      setEmailingContact(null);
      resetEmail();
      showNotification("Email sent successfully!", "success");
    } catch (error) {
      console.error("Error sending email:", error);
      showNotification(
        error.message || "Failed to send email. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
      setSendingEmailId(null);
    }
  };

  // Handle contact delete
  const handleDeleteContact = async (contactId) => {
    if (
      confirm(
        "Are you sure you want to delete this contact? This action cannot be undone.",
      )
    ) {
      setDeletingContactId(contactId);

      try {
        const response = await fetch(`/api/contact/${contactId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete contact");
        }

        // Update the local state by removing the deleted contact
        const updatedData = contacts.filter(
          (contact) => contact._id !== contactId,
        );
        setContacts(updatedData);
        showNotification("Contact deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting contact:", error);
        showNotification(
          error.message || "Failed to delete contact. Please try again.",
          "error",
        );
      } finally {
        setDeletingContactId(null);
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      const responseData = await response.json();

      // Update the local state with the updated contact
      if (responseData.data) {
        const updatedData = contacts.map((contact) =>
          contact._id === contactId ? responseData.data : contact,
        );
        setContacts(updatedData);
      }

      showNotification("Status updated successfully!", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification(
        error.message || "Failed to update status. Please try again.",
        "error",
      );
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedContacts.length === 0) {
      showNotification("Please select at least one contact", "error");
      return;
    }

    try {
      const response = await fetch("/api/contact/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          contactIds: selectedContacts,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} contacts`);
      }

      // Refresh the contacts list
      const fetchResponse = await fetch("/api/contact");
      if (fetchResponse.ok) {
        const updatedData = await fetchResponse.json();
        setContacts(updatedData);
      }

      setSelectedContacts([]);
      setSelectAll(false);
      showNotification(`${action} completed successfully!`, "success");
    } catch (error) {
      console.error(`Error ${action} contacts:`, error);
      showNotification(
        error.message || `Failed to ${action} contacts. Please try again.`,
        "error",
      );
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((contact) => contact._id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual selection
  const handleSelectContact = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/contact");
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data);
      showNotification("Data refreshed successfully!", "success");
    } catch (error) {
      console.error("Error refreshing contacts:", error);
      showNotification("Failed to refresh data. Please try again.", "error");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status,
    );
    return statusOption ? statusOption.color : statusOptions[0].color;
  };

  // Handle email modal open
  const handleEmailModalOpen = (contactId) => {
    setEmailingContact(contactId);
    setSelectedTemplate("initial-response");
    resetEmail();
  };

  if (isInitialLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">
            Loading contacts...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } animate-pulse`}
        >
          {notification.type === "success" ? (
            <FaCheckCircle className="text-xl" />
          ) : (
            <FaExclamationTriangle className="text-xl" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                    <FaEnvelope className="mr-3 text-blue-500" />
                    Contact Management
                  </h1>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Manage and respond to customer inquiries
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setPreviewMode(!previewMode)}
                    variant={previewMode ? "default" : "outline"}
                    className="bg-slate-600 text-white hover:bg-slate-700"
                  >
                    {previewMode ? (
                      <FaEyeSlash className="mr-2 h-4 w-4" />
                    ) : (
                      <FaEye className="mr-2 h-4 w-4" />
                    )}
                    {previewMode ? "Edit Mode" : "Preview Mode"}
                  </Button>
                  <Button
                    onClick={refreshData}
                    disabled={refreshing}
                    variant="outline"
                  >
                    {refreshing ? (
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FaSync className="mr-2 h-4 w-4" />
                    )}
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-slate-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => handleSort(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Sort by Date</SelectItem>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="status">Sort by Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    variant="outline"
                    className="w-full"
                  >
                    {sortOrder === "asc" ? (
                      <FaSortAmountUp className="mr-2 h-4 w-4" />
                    ) : (
                      <FaSortAmountDown className="mr-2 h-4 w-4" />
                    )}
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <div className="mb-6">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {selectedContacts.length} contact
                      {selectedContacts.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleBulkAction("mark-contacted")}
                      variant="outline"
                      size="sm"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                    >
                      Mark as Contacted
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("mark-in-progress")}
                      variant="outline"
                      size="sm"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200"
                    >
                      Mark as In Progress
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("archive")}
                      variant="outline"
                      size="sm"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                    >
                      <FaArchive className="mr-1 h-4 w-4" />
                      Archive
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("delete")}
                      variant="outline"
                      size="sm"
                      className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                    >
                      <FaTrash className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {previewMode ? (
          // Preview Mode - Display the contacts as cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <Card
                key={contact._id}
                className="overflow-hidden hover:shadow-xl transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <CardTitle className="text-lg">
                          {contact.name}
                        </CardTitle>
                        {contact.company && (
                          <CardDescription>{contact.company}</CardDescription>
                        )}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(contact.status)}`}>
                      {statusOptions.find(
                        (option) => option.value === contact.status,
                      )?.label || "New"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <FaEnvelope className="mr-2 text-slate-400" />
                    {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <FaPhone className="mr-2 text-slate-400" />
                      {contact.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <FaCalendarAlt className="mr-2 text-slate-400" />
                    {formatDate(contact.createdAt)}
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Message
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {contact.message}
                    </p>
                  </div>
                  {contact.services && contact.services.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Services
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {contact.services.map((serviceId) => {
                          const service = serviceOptions.find(
                            (s) => s.id === serviceId,
                          );
                          return service ? (
                            <Badge
                              key={serviceId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {service.icon} {service.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button
                    onClick={() => setViewingContact(contact._id)}
                    variant="outline"
                    size="sm"
                  >
                    <FaEye className="mr-1 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    onClick={() => handleEmailModalOpen(contact._id)}
                    size="sm"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <FaReply className="mr-1 h-4 w-4" />
                    Reply
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          // Edit Mode - Table view
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortBy === "name" &&
                          (sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1" />
                          ) : (
                            <FaSortAmountDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Contact Info
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Services
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortBy === "status" &&
                          (sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1" />
                          ) : (
                            <FaSortAmountDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">
                        Date
                        {sortBy === "date" &&
                          (sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1" />
                          ) : (
                            <FaSortAmountDown className="ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Checkbox
                          checked={selectedContacts.includes(contact._id)}
                          onCheckedChange={() =>
                            handleSelectContact(contact._id)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {contact.name}
                            </div>
                            {contact.company && (
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {contact.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white">
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {contact.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {contact.services &&
                            contact.services.slice(0, 2).map((serviceId) => {
                              const service = serviceOptions.find(
                                (s) => s.id === serviceId,
                              );
                              return service ? (
                                <Badge
                                  key={serviceId}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {service.icon}
                                </Badge>
                              ) : null;
                            })}
                          {contact.services && contact.services.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{contact.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select
                          value={contact.status || "new"}
                          onValueChange={(value) =>
                            handleStatusUpdate(contact._id, value)
                          }
                        >
                          <SelectTrigger
                            className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${getStatusColor(contact.status || "new")}`}
                          >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={() => setViewingContact(contact._id)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => handleEmailModalOpen(contact._id)}
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Send Email"
                          >
                            <FaReply />
                          </Button>
                          <Button
                            onClick={() => handleEditModalOpen(contact._id)}
                            variant="ghost"
                            size="sm"
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            onClick={() => handleDeleteContact(contact._id)}
                            disabled={deletingContactId === contact._id}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingContactId === contact._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* View Contact Modal */}
      <Dialog
        open={!!viewingContact}
        onOpenChange={(open) => !open && setViewingContact(null)}
      >
        <DialogContent className="sm:max-w-[425px] md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              View and manage contact information
            </DialogDescription>
          </DialogHeader>
          {contacts.find((c) => c._id === viewingContact) && (
            <div className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="project">Project Details</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                        {contacts.find((c) => c._id === viewingContact).name}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                        {contacts.find((c) => c._id === viewingContact).email}
                      </div>
                    </div>
                    {contacts.find((c) => c._id === viewingContact).phone && (
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {contacts.find((c) => c._id === viewingContact).phone}
                        </div>
                      </div>
                    )}
                    {contacts.find((c) => c._id === viewingContact).company && (
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {
                            contacts.find((c) => c._id === viewingContact)
                              .company
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="project" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <div className="mt-1">
                        <Badge
                          className={`${getStatusColor(contacts.find((c) => c._id === viewingContact).status || "new")}`}
                        >
                          {statusOptions.find(
                            (option) =>
                              option.value ===
                              (contacts.find((c) => c._id === viewingContact)
                                .status || "new"),
                          )?.label || "New"}
                        </Badge>
                      </div>
                    </div>
                    {contacts.find((c) => c._id === viewingContact).services &&
                      contacts.find((c) => c._id === viewingContact).services
                        .length > 0 && (
                        <div>
                          <Label htmlFor="services">Services</Label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {contacts
                              .find((c) => c._id === viewingContact)
                              .services.map((serviceId) => {
                                const service = serviceOptions.find(
                                  (s) => s.id === serviceId,
                                );
                                return service ? (
                                  <Badge
                                    key={serviceId}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {service.icon} {service.name}
                                  </Badge>
                                ) : null;
                              })}
                          </div>
                        </div>
                      )}
                    {contacts.find((c) => c._id === viewingContact).budget && (
                      <div>
                        <Label htmlFor="budget">Budget</Label>
                        <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {
                            contacts.find((c) => c._id === viewingContact)
                              .budget
                          }
                        </div>
                      </div>
                    )}
                    {contacts.find((c) => c._id === viewingContact)
                      .timeline && (
                      <div>
                        <Label htmlFor="timeline">Timeline</Label>
                        <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {
                            contacts.find((c) => c._id === viewingContact)
                              .timeline
                          }
                        </div>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="submitted">Submitted</Label>
                      <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                        {formatDate(
                          contacts.find((c) => c._id === viewingContact)
                            .createdAt,
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div>
                <Label htmlFor="message">Message</Label>
                <div className="mt-1 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {contacts.find((c) => c._id === viewingContact).message}
                  </p>
                </div>
              </div>
              {contacts.find((c) => c._id === viewingContact).notes &&
                contacts.find((c) => c._id === viewingContact).notes.length >
                  0 && (
                  <div>
                    <Label htmlFor="notes">Notes History</Label>
                    <div className="mt-2 space-y-3">
                      {contacts
                        .find((c) => c._id === viewingContact)
                        .notes.map((note, index) => (
                          <Card
                            key={index}
                            className="bg-slate-50 dark:bg-slate-700/30"
                          >
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  {note.author}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatDate(note.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {note.content}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              {isAddingNote ? (
                <form
                  onSubmit={handleNoteSubmit(onNoteSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="note">Add Note</Label>
                    <Textarea
                      {...registerNote("note", {
                        required: "Note is required",
                      })}
                      rows={3}
                      className="mt-1"
                    />
                    {noteErrors.note && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {noteErrors.note.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isNoteSubmitting}>
                      {isNoteSubmitting ? (
                        <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FaStickyNote className="mr-2 h-4 w-4" />
                      )}
                      Add Note
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setIsAddingNote(true)}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <FaStickyNote className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                  <Button
                    onClick={() => handleEmailModalOpen(viewingContact)}
                    className="bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <FaReply className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingContact(null)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog
        open={!!editingContact}
        onOpenChange={(open) => !open && setEditingContact(null)}
      >
        <DialogContent className="sm:max-w-[425px] md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update contact information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  {...registerEdit("name", { required: "Name is required" })}
                  className="mt-1"
                />
                {editErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {editErrors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  {...registerEdit("email", { required: "Email is required" })}
                  className="mt-1"
                />
                {editErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {editErrors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input type="tel" {...registerEdit("phone")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  type="text"
                  {...registerEdit("company")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  {...registerEdit("status")}
                  onValueChange={(value) => setEditValue("status", value)}
                  defaultValue="new"
                  className="mt-1"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Select
                  {...registerEdit("budget")}
                  onValueChange={(value) => setEditValue("budget", value)}
                  className="mt-1"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k+">$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select
                  {...registerEdit("timeline")}
                  onValueChange={(value) => setEditValue("timeline", value)}
                  className="mt-1"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-3months">1-3 months</SelectItem>
                    <SelectItem value="3-6months">3-6 months</SelectItem>
                    <SelectItem value="6months+">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                {...registerEdit("message", {
                  required: "Message is required",
                })}
                rows={4}
                className="mt-1"
              />
              {editErrors.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {editErrors.message.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="services">Services</Label>
              <div className="mt-2 space-y-2">
                {serviceOptions.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      value={service.id}
                      {...registerEdit("services")}
                    />
                    <Label
                      htmlFor={`service-${service.id}`}
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      {service.icon} {service.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setEditingContact(null)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isEditSubmitting || savingContactId === editingContact
                }
              >
                {isEditSubmitting || savingContactId === editingContact ? (
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FaSave className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <Dialog
        open={!!emailingContact}
        onOpenChange={(open) => !open && setEmailingContact(null)}
      >
        <DialogContent className="sm:max-w-[425px] md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Compose and send an email to the contact
            </DialogDescription>
          </DialogHeader>
          {contacts.find((c) => c._id === emailingContact) && (
            <div className="space-y-4">
              <Card className="bg-slate-50 dark:bg-slate-700/30">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {contacts
                        .find((c) => c._id === emailingContact)
                        .name.charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {contacts.find((c) => c._id === emailingContact).name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {contacts.find((c) => c._id === emailingContact).email}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <form
                onSubmit={handleEmailSubmit(onEmailSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="template">Email Template</Label>
                  <Select
                    {...registerEmail("template")}
                    onValueChange={(value) => setEmailValue("template", value)}
                    defaultValue="initial-response"
                    className="mt-1"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    type="text"
                    {...registerEmail("subject", {
                      required: "Subject is required",
                    })}
                    className="mt-1"
                  />
                  {emailErrors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {emailErrors.subject.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    {...registerEmail("message", {
                      required: "Message is required",
                    })}
                    rows={10}
                    className="mt-1"
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                  {emailErrors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {emailErrors.message.message}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => setEmailingContact(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isEmailSubmitting || sendingEmailId === emailingContact
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isEmailSubmitting || sendingEmailId === emailingContact ? (
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FaPaperPlane className="mr-2 h-4 w-4" />
                    )}
                    Send Email
                  </Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
