"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    PanelLeftOpen
} from 'lucide-react';

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
    const [toggleHover, setToggleHover] = useState(false);
    const pathname = usePathname();

    // Refs for dropdowns to handle clicks outside
    const notificationsRef = useRef(null);
    const profileRef = useRef(null);

    // Sample notifications data
    const notifications = [
        { id: 1, title: 'New user registered', time: '5 min ago', read: false, type: 'success' },
        { id: 2, title: 'System update available', time: '1 hour ago', read: false, type: 'info' },
        { id: 3, title: 'Payment received', time: '3 hours ago', read: true, type: 'success' },
        { id: 4, title: 'Server maintenance scheduled', time: '1 day ago', read: true, type: 'warning' }
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
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
            title: 'Analytics',
            icon: <BarChart3 className="w-5 h-5" />,
            href: '/dashboard/analytics',
            badge: null,
            color: 'orange',
            gradient: 'from-orange-500 to-orange-600'
        },
        {
            title: 'Orders',
            icon: <ShoppingCart className="w-5 h-5" />,
            href: '/dashboard/orders',
            badge: '5',
            color: 'pink',
            gradient: 'from-pink-500 to-pink-600'
        },
        {
            title: 'Messages',
            icon: <MessageSquare className="w-5 h-5" />,
            href: '/dashboard/messages',
            badge: '3',
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600'
        },
        {
            title: 'Settings',
            icon: <Settings className="w-5 h-5" />,
            href: '/dashboard/settings',
            badge: null,
            color: 'gray',
            gradient: 'from-gray-500 to-gray-600',
            submenu: [
                { title: 'General', href: '/dashboard/settings/general' },
                { title: 'Security', href: '/dashboard/settings/security' },
                { title: 'API', href: '/dashboard/settings/api' },
                { title: 'Billing', href: '/dashboard/settings/billing' }
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
            case 'success': return <CheckSquare className="w-4 h-4 text-green-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const getColorClasses = (color, isActive = false) => {
        if (isActive) {
            switch (color) {
                case 'blue': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
                case 'purple': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
                case 'green': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
                case 'orange': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
                case 'pink': return 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800';
                case 'indigo': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800';
                default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
            }
        } else {
            switch (color) {
                case 'blue': return 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800';
                case 'purple': return 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800';
                case 'green': return 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800';
                case 'orange': return 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-800';
                case 'pink': return 'text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-200 dark:hover:border-pink-800';
                case 'indigo': return 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800';
                default: return 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20 hover:border-gray-200 dark:hover:border-gray-800';
            }
        }
    };

    return (
        <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && screenSize !== 'xl' && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Professional Sidebar Toggle Button */}
            {/* {sidebarOpen && (
                <div
                    className={`fixed top-24 z-50 transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'left-16' : 'left-72'}`}
                    onMouseEnter={() => setToggleHover(true)}
                    onMouseLeave={() => setToggleHover(false)}
                >
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={`relative flex items-center justify-center w-12 h-12 rounded-r-2xl shadow-xl transition-all duration-300 transform ${toggleHover ? 'scale-110' : 'scale-100'} ${sidebarCollapsed
                            ? 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500'
                            : 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600'
                            } text-white border-t border-b border-r border-slate-600`}
                        title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <div className={`relative transition-transform duration-300 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                            {sidebarCollapsed ? (
                                <ChevronRight className="w-6 h-6" />
                            ) : (
                                <ChevronLeft className="w-6 h-6" />
                            )}
                        </div>

                        <div className={`absolute left-full ml-2 px-3 py-1 bg-slate-900 text-white text-sm rounded-md shadow-lg whitespace-nowrap transition-all duration-300 ${toggleHover ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} pointer-events-none`}>
                            {sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                        </div>

                        <span className="absolute inset-0 rounded-r-2xl bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
                    </button>
                </div>
            )} */}

            {/* Alternative Toggle Button at Top */}
            {sidebarOpen && (
                <div className={`fixed top-4 z-50 transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'left-16' : 'left-72'}`}>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={`group relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${sidebarCollapsed
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                            } text-white`}
                        title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <div className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                            {sidebarCollapsed ? (
                                <PanelLeftOpen className="w-5 h-5" />
                            ) : (
                                <PanelLeftClose className="w-5 h-5" />
                            )}
                        </div>

                        {/* Glow Effect */}
                        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></span>
                    </button>
                </div>
            )}

            {/* Sidebar - Fixed/Sticky Position */}
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarCollapsed ? 'w-16' : 'w-72'} fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 transition-all duration-500 ease-in-out z-50 flex flex-col shadow-2xl`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-700">
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300" />
                                BF
                            </div>
                        </div>
                        {!sidebarCollapsed && (
                            <span className="ml-3 text-xl font-bold text-white transition-opacity duration-300">Admin Panel</span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.title}>
                                <div>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 border ${isActive(item.href)
                                            ? `${getColorClasses(item.color, true)} shadow-md`
                                            : 'border-transparent hover:border-slate-700'
                                            }`}
                                        onClick={() => item.submenu && toggleSubmenu(item.title)}
                                    >
                                        <div className="flex items-center">
                                            <span className={`flex-shrink-0 ${isActive(item.href) ? '' : 'text-slate-400'}`}>
                                                {item.icon}
                                            </span>
                                            {!sidebarCollapsed && (
                                                <span className="ml-3 text-white font-medium transition-opacity duration-300">{item.title}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            {item.badge && !sidebarCollapsed && (
                                                <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${item.gradient} text-white shadow-sm`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            {item.submenu && !sidebarCollapsed && (
                                                <ChevronDown
                                                    className={`w-4 h-4 ml-2 transition-transform text-slate-400 ${activeSubmenu === item.title ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    </Link>

                                    {/* Submenu */}
                                    {item.submenu && activeSubmenu === item.title && !sidebarCollapsed && (
                                        <ul className="mt-2 ml-10 space-y-1">
                                            {item.submenu.map((subitem) => (
                                                <li key={subitem.title}>
                                                    <Link
                                                        href={subitem.href}
                                                        className={`block p-2 rounded-md transition-all duration-200 ${pathname === subitem.href
                                                            ? `${getColorClasses(item.color, true)} shadow-sm`
                                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        {subitem.title}
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
                <div className="p-4 border-t border-slate-700 mt-auto">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-full flex items-center justify-center p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 text-slate-300 hover:text-white"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {!sidebarCollapsed && (
                            <span className="ml-3 transition-opacity duration-300">{darkMode ? 'Light' : 'Dark'}</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${sidebarOpen ? (sidebarCollapsed ? 'ml-16' : 'ml-72') : 'ml-0'}`}>
                {/* Header */}
                <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 lg:hidden transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Search Bar */}
                        <div className="flex items-center flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 relative transition-colors"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {notificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-50">
                                        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                                            <h3 className="font-semibold">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="mr-3 mt-0.5">
                                                            {getNotificationIcon(notification.type)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium">{notification.title}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{notification.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-2 text-center">
                                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        JD
                                    </div>
                                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                                </button>

                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-50">
                                        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                                            <p className="font-semibold">John Doe</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                href="/admin/profile"
                                                className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <User className="w-4 h-4 mr-3" />
                                                Profile
                                            </Link>
                                            <Link
                                                href="/admin/settings"
                                                className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <Settings className="w-4 h-4 mr-3" />
                                                Settings
                                            </Link>
                                            <Link
                                                href="/admin/help"
                                                className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <HelpCircle className="w-4 h-4 mr-3" />
                                                Help
                                            </Link>
                                            <button className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-red-600 dark:text-red-400 w-full text-left">
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-slate-900">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {pathname === '/dashboard' && 'Dashboard'}
                            {pathname === '/dashboard/manage-services' && 'Services Management'}
                            {pathname.startsWith('/dashboard/manage-services/') && 'Service Details'}
                            {pathname === '/dashboard/manage-pricing-card' && 'Pricing Plans'}
                            {pathname === '/dashboard/analytics' && 'Analytics'}
                            {pathname === '/dashboard/orders' && 'Order Management'}
                            {pathname === '/dashboard/messages' && 'Messages'}
                            {pathname === '/dashboard/settings' && 'Settings'}
                        </h1>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}