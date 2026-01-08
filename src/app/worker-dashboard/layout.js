"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart3,
  Package,
  Mail,
  Calendar,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  HelpCircle,
  Shield,
  CreditCard,
  Globe,
  Zap,
  Layers,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  TrendingUp,
  Activity,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  Archive,
  LayoutDashboard,
  PieChart,
  Target,
  Briefcase,
  Star,
  CheckSquare,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Grid3x3,
  Sparkles,
  Gem,
  Award,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight as ChevronRightIcon,
  UserCheck,
  UserClock,
  UserPlus,
  UserX,
  UserCog,
  Crown,
  ClipboardList,
  FileCheck,
  Clock,
  Timer,
  Award as AwardIcon,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  FileText as FileTextIcon,
  MessageSquare as MessageSquareIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  HelpCircle as HelpCircleIcon,
  Bell as BellIcon,
  Home as HomeIcon,
  Building,
  UserPlus as UserPlusIcon,
  FileText as DocumentIcon,
  BarChart as BarChartIcon,
  Mail as MailIcon,
  Star as StarIcon,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Command,
  ArrowRight as ArrowRightIcon,
  ExternalLink,
  Clock as ClockIcon,
  TrendingUp as TrendingUpIcon2,
  FileText as FileTextIcon2,
  User as UserIcon2,
  Settings as SettingsIcon2,
  BarChart3 as BarChart3Icon,
  MessageSquare as MessageSquareIcon2,
  ShoppingCart as ShoppingCartIcon,
  Calendar as CalendarIcon2,
  Shield as ShieldIcon,
  CreditCard as CreditCardIcon,
  Zap as ZapIcon,
  Globe as GlobeIcon,
  Layers as LayersIcon,
  Database as DatabaseIcon,
  Cloud as CloudIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function WorkerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [screenSize, setScreenSize] = useState("lg");
  const [isHovering, setIsHovering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Refs for dropdowns to handle clicks outside
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New task assigned",
      time: "5 min ago",
      read: false,
      type: "success",
      description: "You have been assigned a new task",
    },
    {
      id: 2,
      title: "Task approved",
      time: "1 hour ago",
      read: false,
      type: "info",
      description: "Your submitted task has been approved",
    },
    {
      id: 3,
      title: "Payment received",
      time: "3 hours ago",
      read: true,
      type: "success",
      description: "Payment of $250 received",
    },
    {
      id: 4,
      title: "Deadline reminder",
      time: "1 day ago",
      read: true,
      type: "warning",
      description: "Task deadline approaching",
    },
  ];

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("sm");
        setSidebarOpen(false);
      } else if (window.innerWidth < 1024) {
        setScreenSize("md");
        setSidebarOpen(false);
      } else if (window.innerWidth < 1280) {
        setScreenSize("lg");
        setSidebarOpen(true);
      } else {
        setScreenSize("xl");
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing search history:", error);
      }
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
      if (
        showLogoutConfirm &&
        !event.target.closest(".logout-confirm-dialog")
      ) {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogoutConfirm]);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { data: session, status } = useSession();

  // Check authentication and role
  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/login");
      return;
    }

    // Save user role to localStorage for persistence
    if (session.user?.role) {
      localStorage.setItem("userRole", session.user.role);
      localStorage.setItem("userName", session.user.name || "");
      localStorage.setItem("userEmail", session.user.email || "");
    }
  }, [session, status, router, pathname]);

  // Load user data from localStorage if session is not available yet
  useEffect(() => {
    if (status !== "loading" && !session) {
      const savedRole = localStorage.getItem("userRole");
      if (savedRole && savedRole !== "worker") {
        router.push("/unauthorized");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 bg-emerald-500 rounded-full opacity-75 animate-ping"></div>
            <div className="w-16 h-16 bg-emerald-600 rounded-full relative flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "worker") {
    return null; // Will redirect
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "WK"; // Default for worker
  };

  // Handle logout with confirmation
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Sign out from NextAuth
      await signOut({ redirect: false });

      // Clear all localStorage items
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");

      // Clear any session storage items
      sessionStorage.clear();

      // Reset all state
      setSidebarOpen(true);
      setSidebarCollapsed(false);
      setActiveSubmenu("");
      setSearchQuery("");
      setNotificationsOpen(false);
      setProfileOpen(false);

      // Close logout confirmation dialog
      setShowLogoutConfirm(false);

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, try to redirect to login
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show logout confirmation dialog
  const showLogoutConfirmation = () => {
    setShowLogoutConfirm(true);
    setProfileOpen(false);
  };

  // Enhanced search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Check if query is a URL
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (urlRegex.test(query.trim())) {
      // Add protocol if missing
      let url = query.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      setSearchResults([
        {
          type: "url",
          title: `Navigate to: ${url}`,
          description: "Open this URL in a new tab",
          icon: <ExternalLink className="w-4 h-4" />,
          action: () => {
            window.open(url, "_blank");
            addToSearchHistory(query);
            setSearchQuery("");
            setSearchResults([]);
            setSearchFocused(false);
          },
        },
      ]);
      return;
    }

    // Filter menu items based on query
    const filteredItems = workerMenuItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.href && item.href.toLowerCase().includes(query.toLowerCase()))
    );

    // Flatten submenu items
    const submenuItems = [];
    workerMenuItems.forEach((item) => {
      if (item.submenu) {
        item.submenu.forEach((subitem) => {
          if (
            subitem.title.toLowerCase().includes(query.toLowerCase()) ||
            subitem.href.toLowerCase().includes(query.toLowerCase())
          ) {
            submenuItems.push({
              ...subitem,
              parentTitle: item.title,
              parentIcon: item.icon,
            });
          }
        });
      }
    });

    // Combine results
    const results = [
      ...filteredItems.map((item) => ({
        type: "menu",
        title: item.title,
        description: `Navigate to ${item.title}`,
        icon: item.icon,
        href: item.href,
        action: () => {
          if (item.href) {
            router.push(item.href);
            addToSearchHistory(query);
            setSearchQuery("");
            setSearchResults([]);
            setSearchFocused(false);
          }
        },
      })),
      ...submenuItems.map((item) => ({
        type: "submenu",
        title: item.title,
        description: `${item.parentTitle} > ${item.title}`,
        icon: item.parentIcon,
        href: item.href,
        action: () => {
          if (item.href) {
            router.push(item.href);
            addToSearchHistory(query);
            setSearchQuery("");
            setSearchResults([]);
            setSearchFocused(false);
          }
        },
      })),
    ];

    setSearchResults(results);
  };

  // Add query to search history
  const addToSearchHistory = (query) => {
    const newHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Worker menu items
  const workerMenuItems = [
    {
      title: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/dashboard/workers",
      badge: null,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "My Tasks",
      icon: <ClipboardList className="w-5 h-5" />,
      href: "/worker-dashboard/manage-my-task",
      badge: "5",
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      submenu: [
        { title: "All Tasks", href: "/dashboard/workers/manage-my-tasks" },
        {
          title: "Pending Tasks",
          href: "/dashboard/workers/manage-my-tasks/pending",
        },
        {
          title: "In Progress",
          href: "/dashboard/workers/manage-my-tasks/in-progress",
        },
        {
          title: "Completed",
          href: "/dashboard/workers/manage-my-tasks/completed",
        },
      ],
    },
    {
      title: "Submit Task",
      icon: <FileCheck className="w-5 h-5" />,
      href: "/dashboard/workers/manage-submit-task",
      badge: null,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Time Tracking",
      icon: <Clock className="w-5 h-5" />,
      href: "/dashboard/workers/manage-time-tracking",
      badge: null,
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Performance",
      icon: <TrendingUpIcon className="w-5 h-5" />,
      href: "/dashboard/manage-performance",
      badge: null,
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Earnings",
      icon: <DollarSign className="w-5 h-5" />,
      href: "/dashboard/manage-earnings",
      badge: null,
      color: "green",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Messages",
      icon: <MessageSquareIcon className="w-5 h-5" />,
      href: "worker-dashboard/free-chat-support",
      badge: "2",
      color: "teal",
      gradient: "from-teal-500 to-teal-600",
    },
    {
      title: "Calendar",
      icon: <CalendarIcon className="w-5 h-5" />,
      href: "/dashboard/manage-calendar",
      badge: null,
      color: "pink",
      gradient: "from-pink-500 to-pink-600",
    },
    {
      title: "Profile",
      icon: <UserIcon className="w-5 h-5" />,
      href: "/dashboard/manage-profile",
      badge: null,
      color: "gray",
      gradient: "from-gray-500 to-gray-600",
    },
    {
      title: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      href: "/dashboard/manage-worker-settings",
      badge: null,
      color: "gray",
      gradient: "from-gray-500 to-gray-600",
    },
  ];

  const toggleSubmenu = (title) => {
    if (activeSubmenu === title) {
      setActiveSubmenu("");
    } else {
      setActiveSubmenu(title);
    }
  };

  const isActive = (href) => {
    if (href === "/dashboard/workers") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckSquare className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColorClasses = (color, isActive = false) => {
    if (isActive) {
      switch (color) {
        case "blue":
          return "text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg shadow-blue-500/10";
        case "purple":
          return "text-purple-600 dark:text-purple-400 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-lg shadow-purple-500/10";
        case "green":
          return "text-green-600 dark:text-green-400 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg shadow-green-500/10";
        case "teal":
          return "text-teal-600 dark:text-teal-400 bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/30 dark:to-teal-800/20 border-teal-200 dark:border-teal-700 shadow-lg shadow-teal-500/10";
        case "orange":
          return "text-orange-600 dark:text-orange-400 bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 shadow-lg shadow-orange-500/10";
        case "pink":
          return "text-pink-600 dark:text-pink-400 bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/30 dark:to-pink-800/20 border-pink-200 dark:border-pink-700 shadow-lg shadow-pink-500/10";
        case "indigo":
          return "text-indigo-600 dark:text-indigo-400 bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700 shadow-lg shadow-indigo-500/10";
        case "emerald":
          return "text-emerald-600 dark:text-emerald-400 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700 shadow-lg shadow-emerald-500/10";
        default:
          return "text-gray-600 dark:text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-800/20 border-gray-200 dark:border-gray-700 shadow-lg shadow-gray-500/10";
      }
    } else {
      switch (color) {
        case "blue":
          return "text-slate-300 dark:text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-900/20 hover:border-blue-500/30 dark:hover:border-blue-700";
        case "purple":
          return "text-slate-300 dark:text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 dark:hover:bg-purple-900/20 hover:border-purple-500/30 dark:hover:border-purple-700";
        case "green":
          return "text-slate-300 dark:text-slate-400 hover:text-green-400 hover:bg-green-500/10 dark:hover:bg-green-900/20 hover:border-green-500/30 dark:hover:border-green-700";
        case "teal":
          return "text-slate-300 dark:text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 dark:hover:bg-teal-900/20 hover:border-teal-500/30 dark:hover:border-teal-700";
        case "orange":
          return "text-slate-300 dark:text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 dark:hover:bg-orange-900/20 hover:border-orange-500/30 dark:hover:border-orange-700";
        case "pink":
          return "text-slate-300 dark:text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 dark:hover:bg-pink-900/20 hover:border-pink-500/30 dark:hover:border-pink-700";
        case "indigo":
          return "text-slate-300 dark:text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 dark:hover:bg-indigo-900/20 hover:border-indigo-500/30 dark:hover:border-indigo-700";
        case "emerald":
          return "text-slate-300 dark:text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-900/20 hover:border-emerald-500/30 dark:hover:border-emerald-700";
        default:
          return "text-slate-300 dark:text-slate-400 hover:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-900/20 hover:border-gray-500/30 dark:hover:border-gray-700";
      }
    }
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard/workers") return "Worker Dashboard";
    if (pathname === "/dashboard/workers/manage-my-tasks") return "My Tasks";
    if (pathname.startsWith("/dashboard/workers/manage-my-tasks/"))
      return "Task Details";
    if (pathname === "/dashboard/workers/manage-submit-task")
      return "Submit Task";
    if (pathname === "/dashboard/workers/manage-time-tracking")
      return "Time Tracking";
    if (pathname === "/dashboard/manage-performance") return "Performance";
    if (pathname === "/dashboard/manage-earnings") return "Earnings";
    if (pathname === "/dashboard/manage-messages") return "Messages";
    if (pathname === "/dashboard/manage-calendar") return "Calendar";
    if (pathname === "/dashboard/manage-profile") return "Profile";
    if (pathname === "/dashboard/manage-worker-settings") return "Settings";

    return "Worker Dashboard";
  };

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Dashboard", href: "/dashboard/workers" }];

    if (paths.length > 1) {
      const pageName = paths[paths.length - 1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({ name: pageName, href: pathname });
    }

    return breadcrumbs;
  };

  const isChatRoute = pathname.includes("/free-chat-support");
  if (isChatRoute) {
    return <>{children}</>;
  }
  return (
    <div
      className={`flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && screenSize !== "xl" && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Toggle Button */}
      {sidebarOpen && (
        <div
          className={`fixed top-4 z-50 transition-all duration-500 ease-in-out ${
            sidebarCollapsed ? "left-16" : "left-72"
          }`}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`group relative flex items-center justify-center w-11 h-11 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ${
              sidebarCollapsed
                ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400"
                : "bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-400"
            } text-white border-2 border-white/20 backdrop-blur-sm`}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <div
              className={`transition-transform duration-300 ${
                sidebarCollapsed ? "rotate-0" : "rotate-180"
              }`}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </div>
            <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-all duration-300"></span>
          </button>
        </div>
      )}

      {/* Enhanced Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${
          sidebarCollapsed ? "w-16" : "w-72"
        } fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl transition-all duration-500 ease-in-out z-50 flex flex-col shadow-2xl`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : ""
            } transition-all duration-300`}
          >
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-teal-500/50 group-hover:shadow-teal-500/70">
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="relative z-10">WK</span>
                <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 transition-opacity duration-300">
                <span className="text-xl font-bold text-white block">
                  Worker Portal
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Work Management
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5">
            {workerMenuItems.map((item, index) => (
              <li key={item.title}>
                <div>
                  <Link
                    href={item.href}
                    className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${
                      isActive(item.href)
                        ? `${getColorClasses(item.color, true)} border-2`
                        : `${getColorClasses(
                            item.color,
                            false
                          )} border-transparent`
                    } relative overflow-hidden`}
                    onClick={() => item.submenu && toggleSubmenu(item.title)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full"></div>

                    <div className="flex items-center relative z-10">
                      <span
                        className={`flex-shrink-0 transition-transform duration-300 ${
                          isActive(item.href)
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <span className="ml-3 text-sm font-semibold transition-opacity duration-300">
                          {item.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                      {item.badge && !sidebarCollapsed && (
                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.color}-500/30`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.submenu && !sidebarCollapsed && (
                        <ChevronDown
                          className={`w-4 h-4 transition-all duration-300 ${
                            activeSubmenu === item.title
                              ? "rotate-180 text-blue-400"
                              : "text-slate-400 group-hover:text-slate-300"
                          }`}
                        />
                      )}
                    </div>
                  </Link>

                  {/* Enhanced Submenu */}
                  {item.submenu &&
                    activeSubmenu === item.title &&
                    !sidebarCollapsed && (
                      <ul className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                        {item.submenu.map((subitem, subIndex) => (
                          <li key={subitem.title}>
                            <Link
                              href={subitem.href}
                              className={`group flex items-center p-2.5 rounded-lg transition-all duration-200 ${
                                pathname === subitem.href
                                  ? `${getColorClasses(
                                      item.color,
                                      true
                                    )} shadow-md`
                                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                              }`}
                              style={{ animationDelay: `${subIndex * 30}ms` }}
                            >
                              <ChevronRightIcon className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span className="text-sm font-medium">
                                {subitem.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dark Mode Toggle */}
        <div className="p-4 border-t border-slate-700/50 mt-auto bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="group w-full flex items-center justify-center p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg"
          >
            <div className="relative">
              {darkMode ? (
                <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 text-sm font-semibold transition-opacity duration-300">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${
          sidebarOpen ? (sidebarCollapsed ? "ml-16" : "ml-72") : "ml-0"
        }`}
      >
        {/* Enhanced Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-all duration-200 border border-slate-200 dark:border-slate-700"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>

              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                {getBreadcrumbs().map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    {index > 0 && (
                      <ChevronRightIcon className="w-4 h-4 text-slate-400 mx-2" />
                    )}
                    <Link
                      href={crumb.href}
                      className={`font-medium transition-colors ${
                        index === getBreadcrumbs().length - 1
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      {crumb.name}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Enhanced Search Bar */}
              <div
                className="flex items-center flex-1 max-w-lg mx-4"
                ref={searchRef}
              >
                <div className="relative w-full group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="global-search"
                    type="text"
                    placeholder="Search or type a URL..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchResults.length > 0) {
                        searchResults[0].action();
                      }
                    }}
                    className="w-full pl-12 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 text-xs font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                      <Command className="w-3 h-3 mr-1" />K
                    </kbd>
                  </div>

                  {/* Enhanced Search Results Dropdown */}
                  {searchFocused && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden backdrop-blur-xl max-h-96 overflow-y-auto">
                      {/* Search History */}
                      {searchQuery === "" && searchHistory.length > 0 && (
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Recent Searches
                            </h3>
                            <button
                              onClick={clearSearchHistory}
                              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                          <ul className="space-y-1">
                            {searchHistory.map((query, index) => (
                              <li key={index}>
                                <button
                                  onClick={() => {
                                    setSearchQuery(query);
                                    handleSearch(query);
                                  }}
                                  className="flex items-center w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                                >
                                  <ClockIcon className="w-4 h-4 text-slate-400 mr-2" />
                                  <span className="text-sm text-slate-700 dark:text-slate-300">
                                    {query}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Search Results */}
                      {searchQuery !== "" && searchResults.length > 0 && (
                        <ul className="py-2">
                          {searchResults.map((result, index) => (
                            <li key={index}>
                              <button
                                onClick={result.action}
                                className="flex items-center w-full p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group"
                              >
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                  {result.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {result.title}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {result.description}
                                  </p>
                                </div>
                                {result.type === "url" && (
                                  <ExternalLink className="w-4 h-4 text-slate-400 ml-2" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* No Results */}
                      {searchQuery !== "" && searchResults.length === 0 && (
                        <div className="p-6 text-center">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No results found for `{searchQuery}`
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Try searching for a different term or enter a URL
                          </p>
                        </div>
                      )}

                      {/* Search Tips */}
                      {searchQuery === "" && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Search Tips
                          </h3>
                          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              Type a URL to navigate directly to a website
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              Search for pages, settings, or features
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              Use{" "}
                              <kbd className="px-1 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                                Ctrl+K
                              </kbd>{" "}
                              to quickly open search
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
                  >
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                    )}
                  </button>

                  {/* Enhanced Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden backdrop-blur-xl">
                      <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                            Notifications
                          </h3>
                          {unreadNotifications > 0 && (
                            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
                              {unreadNotifications} new
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                              !notification.read
                                ? "bg-blue-50/50 dark:bg-blue-900/10"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-slate-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  {notification.description}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <button className=" cursor-pointerw-full text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Profile */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl group-hover:shadow-opacity-50 transition-all duration-300 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-teal-500/30 group-hover:shadow-teal-500/50">
                      {getUserInitials()}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-600 dark:text-slate-300 hidden sm:block transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Enhanced Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden backdrop-blur-xl">
                      <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
                            {getUserInitials()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {session?.user?.name || "User"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {session?.user?.email || "user@example.com"}
                            </p>
                            <div className="flex items-center mt-1">
                              <UserCheck className="w-3 h-3 text-emerald-500 mr-1" />
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 capitalize">
                                Worker
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                        >
                          <User className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Profile
                          </span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                        >
                          <Settings className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Settings
                          </span>
                        </Link>
                        <Link
                          href="/help"
                          className="flex items-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                        >
                          <HelpCircle className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Help & Support
                          </span>
                        </Link>
                        <div className="my-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                        <button
                          onClick={showLogoutConfirmation}
                          className="flex items-center w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">
                            Logout
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Manage your tasks and track your performance
              </p>
            </div>
            {children}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full mx-4 logout-confirm-dialog">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
              Confirm Logout
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
              Are you sure you want to logout? Any unsaved changes will be lost.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}
