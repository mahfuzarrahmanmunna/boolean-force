"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [activeSubmenu, setActiveSubmenu] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [screenSize, setScreenSize] = useState('lg');
    const [isHovering, setIsHovering] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const pathname = usePathname();

    // Refs for dropdowns to handle clicks outside
    const notificationsRef = useRef(null);
    const profileRef = useRef(null);

    // Sample notifications data
    const notifications = [
        { id: 1, title: 'New user registered', time: '5 min ago', read: false, type: 'success', description: 'A new user has joined your platform' },
        { id: 2, title: 'System update available', time: '1 hour ago', read: false, type: 'info', description: 'Version 2.0.1 is now available' },
        { id: 3, title: 'Payment received', time: '3 hours ago', read: true, type: 'success', description: 'Payment of $1,250 received' },
        { id: 4, title: 'Server maintenance scheduled', time: '1 day ago', read: true, type: 'warning', description: 'Scheduled for tomorrow at 2 AM' }
    ];

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setScreenSize('sm');
                setSidebarOpen(false);
            } else if (window.innerWidth < 1024) {
                setScreenSize('md');
                setSidebarOpen(false);
            } else if (window.innerWidth < 1280) {
                setScreenSize('lg');
                setSidebarOpen(true);
            } else {
                setScreenSize('xl');
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
            if (showLogoutConfirm && !event.target.closest('.logout-confirm-dialog')) {
                setShowLogoutConfirm(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLogoutConfirm]);

    const { data: session, status } = useSession();
    const router = useRouter();

    // Check authentication and role
    useEffect(() => {
        if (status === "loading") return; // Still loading

        if (!session) {
            router.push("/login");
            return;
        }

        // Save user role to localStorage for persistence
        if (session.user?.role) {
            localStorage.setItem('userRole', session.user.role);
            localStorage.setItem('userName', session.user.name || '');
            localStorage.setItem('userEmail', session.user.email || '');
        }

        if (session.user.role !== "admin") {
            router.push("/unauthorized");
            return;
        }
    }, [session, status, router]);

    // Load user data from localStorage if session is not available yet
    useEffect(() => {
        if (status !== "loading" && !session) {
            const savedRole = localStorage.getItem('userRole');
            if (savedRole && savedRole !== "admin") {
                router.push("/unauthorized");
            }
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!session || session.user.role !== "admin") {
        return null; // Will redirect
    }

    // Get user initials for avatar
    const getUserInitials = () => {
        if (session?.user?.name) {
            return session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return 'AD'; // Default for admin
    };

    // Handle logout with confirmation
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Sign out from NextAuth
            await signOut({ redirect: false });

            // Clear all localStorage items
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');

            // Clear any session storage items
            sessionStorage.clear();

            // Reset all state
            setSidebarOpen(true);
            setSidebarCollapsed(false);
            setActiveSubmenu('');
            setSearchQuery('');
            setNotificationsOpen(false);
            setProfileOpen(false);

            // Close logout confirmation dialog
            setShowLogoutConfirm(false);

            // Redirect to login page
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, try to redirect to login
            router.push('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Show logout confirmation dialog
    const showLogoutConfirmation = () => {
        setShowLogoutConfirm(true);
        setProfileOpen(false);
    };

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            href: '/dashboard',
            badge: null,
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Services',
            icon: <Briefcase className="w-5 h-5" />,
            href: '/dashboard/manage-services',
            badge: '4',
            color: 'purple',
            gradient: 'from-purple-500 to-purple-600',
            submenu: [
                { title: 'POS Systems', href: '/dashboard/manage-services/pos-systems' },
                { title: 'Website Development', href: '/dashboard/manage-services/website-development' },
                { title: 'ERP Software', href: '/dashboard/manage-services/erp-software-solutions' },
                { title: 'Brand Identity', href: '/dashboard/manage-services/brand-visual-identity' }
            ]
        },
        {
            title: 'Pricing',
            icon: <DollarSign className="w-5 h-5" />,
            href: '/dashboard/manage-pricing-card',
            badge: '12',
            color: 'green',
            gradient: 'from-green-500 to-green-600'
        },
        {
            title: 'Blogs',
            icon: <FileText className="w-5 h-5" />,
            href: '/dashboard/manage-and-post-blogs',
            badge: null,
            color: 'teal',
            gradient: 'from-teal-500 to-teal-600'
        },
        {
            title: 'Analytics',
            icon: <BarChart3 className="w-5 h-5" />,
            href: 'manage-analytics',
            badge: null,
            color: 'orange',
            gradient: 'from-orange-500 to-orange-600'
        },
        {
            title: 'Orders',
            icon: <ShoppingCart className="w-5 h-5" />,
            href: 'manage-orders',
            badge: '5',
            color: 'pink',
            gradient: 'from-pink-500 to-pink-600'
        },
        {
            title: 'Messages',
            icon: <MessageSquare className="w-5 h-5" />,
            href: 'manage-contacts',
            badge: '3',
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600'
        },
        {
            title: 'Settings',
            icon: <Settings className="w-5 h-5" />,
            href: 'manage-settings',
            badge: null,
            color: 'gray',
            gradient: 'from-gray-500 to-gray-600',
            submenu: [
                { title: 'General', href: '/settings/general' },
                { title: 'Security', href: '/settings/security' },
                { title: 'API', href: '/settings/api' },
                { title: 'Billing', href: '/settings/billing' }
            ]
        }
    ];

    const toggleSubmenu = (title) => {
        if (activeSubmenu === title) {
            setActiveSubmenu('');
        } else {
            setActiveSubmenu(title);
        }
    };

    const isActive = (href) => {
        if (href === '/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckSquare className="w-5 h-5 text-emerald-500" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getColorClasses = (color, isActive = false) => {
        if (isActive) {
            switch (color) {
                case 'blue': return 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg shadow-blue-500/10';
                case 'purple': return 'text-purple-600 dark:text-purple-400 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-lg shadow-purple-500/10';
                case 'green': return 'text-green-600 dark:text-green-400 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg shadow-green-500/10';
                case 'teal': return 'text-teal-600 dark:text-teal-400 bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/30 dark:to-teal-800/20 border-teal-200 dark:border-teal-700 shadow-lg shadow-teal-500/10';
                case 'orange': return 'text-orange-600 dark:text-orange-400 bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 shadow-lg shadow-orange-500/10';
                case 'pink': return 'text-pink-600 dark:text-pink-400 bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/30 dark:to-pink-800/20 border-pink-200 dark:border-pink-700 shadow-lg shadow-pink-500/10';
                case 'indigo': return 'text-indigo-600 dark:text-indigo-400 bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700 shadow-lg shadow-indigo-500/10';
                default: return 'text-gray-600 dark:text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-800/20 border-gray-200 dark:border-gray-700 shadow-lg shadow-gray-500/10';
            }
        } else {
            switch (color) {
                case 'blue': return 'text-slate-300 dark:text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-900/20 hover:border-blue-500/30 dark:hover:border-blue-700';
                case 'purple': return 'text-slate-300 dark:text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 dark:hover:bg-purple-900/20 hover:border-purple-500/30 dark:hover:border-purple-700';
                case 'green': return 'text-slate-300 dark:text-slate-400 hover:text-green-400 hover:bg-green-500/10 dark:hover:bg-green-900/20 hover:border-green-500/30 dark:hover:border-green-700';
                case 'teal': return 'text-slate-300 dark:text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 dark:hover:bg-teal-900/20 hover:border-teal-500/30 dark:hover:border-teal-700';
                case 'orange': return 'text-slate-300 dark:text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 dark:hover:bg-orange-900/20 hover:border-orange-500/30 dark:hover:border-orange-700';
                case 'pink': return 'text-slate-300 dark:text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 dark:hover:bg-pink-900/20 hover:border-pink-500/30 dark:hover:border-pink-700';
                case 'indigo': return 'text-slate-300 dark:text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 dark:hover:bg-indigo-900/20 hover:border-indigo-500/30 dark:hover:border-indigo-700';
                default: return 'text-slate-300 dark:text-slate-400 hover:text-gray-400 hover:bg-gray-500/10 dark:hover:bg-gray-900/20 hover:border-gray-500/30 dark:hover:border-gray-700';
            }
        }
    };

    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'Dashboard';
        if (pathname === '/dashboard/manage-services') return 'Services Management';
        if (pathname.startsWith('/dashboard/manage-services/')) return 'Service Details';
        if (pathname === '/dashboard/manage-pricing-card') return 'Pricing Plans';
        if (pathname === '/dashboard/manage-and-post-blogs') return 'Blog Management';
        if (pathname === 'dashboard/manage-analytics') return 'Analytics';
        if (pathname === 'dashboard/manage-orders') return 'Order Management';
        if (pathname === 'dashboard/manage-messages') return 'Messages';
        if (pathname === 'dashboard/manage-settings') return 'Settings';
        return 'Dashboard';
    };

    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [{ name: 'Dashboard', href: '/dashboard' }];

        if (paths.length > 1) {
            const pageName = paths[paths.length - 1].split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            breadcrumbs.push({ name: pageName, href: pathname });
        }

        return breadcrumbs;
    };

    return (
        <div className={`flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${darkMode ? 'dark' : ''}`}>
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && screenSize !== 'xl' && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Toggle Button */}
            {sidebarOpen && (
                <div className={`fixed top-4 z-50 transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'left-16' : 'left-72'}`}>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={`group relative flex items-center justify-center w-11 h-11 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ${sidebarCollapsed
                            ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-400 hover:via-blue-500 hover:to-purple-500'
                            : 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 hover:from-purple-400 hover:via-purple-500 hover:to-pink-500'
                            } text-white border-2 border-white/20 backdrop-blur-sm`}
                        title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <div className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`}>
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
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarCollapsed ? 'w-16' : 'w-72'} fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl transition-all duration-500 ease-in-out z-50 flex flex-col shadow-2xl`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} transition-all duration-300`}>
                        <div className="relative group">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/50 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-500/70">
                                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
                                <span className="relative z-10">BF</span>
                                <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
                            </div>
                        </div>
                        {!sidebarCollapsed && (
                            <div className="ml-3 transition-opacity duration-300">
                                <span className="text-xl font-bold text-white block">Admin Panel</span>
                                <span className="text-xs text-slate-400 font-medium">Control Center</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-1.5">
                        {menuItems.map((item, index) => (
                            <li key={item.title}>
                                <div>
                                    <Link
                                        href={item.href}
                                        className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${isActive(item.href)
                                            ? `${getColorClasses(item.color, true)} border-2`
                                            : `${getColorClasses(item.color, false)} border-transparent`
                                            } relative overflow-hidden`}
                                        onClick={() => item.submenu && toggleSubmenu(item.title)}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full"></div>

                                        <div className="flex items-center relative z-10">
                                            <span className={`flex-shrink-0 transition-transform duration-300 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                {item.icon}
                                            </span>
                                            {!sidebarCollapsed && (
                                                <span className="ml-3 text-sm font-semibold transition-opacity duration-300">{item.title}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 relative z-10">
                                            {item.badge && !sidebarCollapsed && (
                                                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.color}-500/30`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            {item.submenu && !sidebarCollapsed && (
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-all duration-300 ${activeSubmenu === item.title ? 'rotate-180 text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    </Link>

                                    {/* Enhanced Submenu */}
                                    {item.submenu && activeSubmenu === item.title && !sidebarCollapsed && (
                                        <ul className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                                            {item.submenu.map((subitem, subIndex) => (
                                                <li key={subitem.title}>
                                                    <Link
                                                        href={subitem.href}
                                                        className={`group flex items-center p-2.5 rounded-lg transition-all duration-200 ${pathname === subitem.href
                                                            ? `${getColorClasses(item.color, true)} shadow-md`
                                                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                                            }`}
                                                        style={{ animationDelay: `${subIndex * 30}ms` }}
                                                    >
                                                        <ChevronRightIcon className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className="text-sm font-medium">{subitem.title}</span>
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
                            <span className="ml-3 text-sm font-semibold transition-opacity duration-300">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${sidebarOpen ? (sidebarCollapsed ? 'ml-16' : 'ml-72') : 'ml-0'}`}>
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
                                        {index > 0 && <ChevronRightIcon className="w-4 h-4 text-slate-400 mx-2" />}
                                        <Link
                                            href={crumb.href}
                                            className={`font-medium transition-colors ${index === getBreadcrumbs().length - 1
                                                ? 'text-slate-900 dark:text-white'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            {crumb.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="flex items-center flex-1 max-w-lg mx-4">
                                <div className="relative w-full group">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search anything..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    />
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
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Notifications</h3>
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
                                                        className={`p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5 flex-shrink-0">
                                                                {getNotificationIcon(notification.type)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-semibold text-sm text-slate-900 dark:text-white">{notification.title}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.description}</p>
                                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{notification.time}</p>
                                                            </div>
                                                            {!notification.read && (
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                                <button className="w-full text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
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
                                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300">
                                            {getUserInitials()}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-600 dark:text-slate-300 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Enhanced Profile Dropdown */}
                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden backdrop-blur-xl">
                                            <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {getUserInitials()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{session?.user?.name || 'Admin User'}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{session?.user?.email || 'admin@example.com'}</p>
                                                        <div className="flex items-center mt-1">
                                                            <Shield className="w-3 h-3 text-purple-500 mr-1" />
                                                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 capitalize">{session?.user?.role || 'admin'}</span>
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
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile</span>
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="flex items-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                                                >
                                                    <Settings className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Settings</span>
                                                </Link>
                                                <Link
                                                    href="/help"
                                                    className="flex items-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                                                >
                                                    <HelpCircle className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Help & Support</span>
                                                </Link>
                                                <div className="my-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                                                <button
                                                    onClick={showLogoutConfirmation}
                                                    className="flex items-center w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                                                >
                                                    <LogOut className="w-4 h-4 mr-3 text-red-600 dark:text-red-400" />
                                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Logout</span>
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
                                Manage and monitor your dashboard activities
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
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging out...
                                    </>
                                ) : (
                                    'Logout'
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