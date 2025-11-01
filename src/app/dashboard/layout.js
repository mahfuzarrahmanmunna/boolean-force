"use client";

import { useState, useEffect } from 'react';
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
    Sun
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [activeSubmenu, setActiveSubmenu] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();

    // Sample notifications data
    const notifications = [
        { id: 1, title: 'New user registered', time: '5 min ago', read: false },
        { id: 2, title: 'System update available', time: '1 hour ago', read: false },
        { id: 3, title: 'Payment received', time: '3 hours ago', read: true },
        { id: 4, title: 'Server maintenance scheduled', time: '1 day ago', read: true }
    ];

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <Home className="w-5 h-5" />,
            href: '/dashboard',
            badge: null
        },
        {
            title: 'Users',
            icon: <Users className="w-5 h-5" />,
            href: '/admin/users',
            badge: '12',
            submenu: [
                { title: 'All Users', href: '/admin/users' },
                { title: 'Roles', href: '/admin/users/roles' },
                { title: 'Permissions', href: '/admin/users/permissions' }
            ]
        },
        {
            title: 'Content',
            icon: <FileText className="w-5 h-5" />,
            href: '/admin/content',
            badge: null,
            submenu: [
                { title: 'Pages', href: '/admin/content/pages' },
                { title: 'Posts', href: '/admin/content/posts' },
                { title: 'Media', href: '/admin/content/media' }
            ]
        },
        {
            title: 'Analytics',
            icon: <BarChart3 className="w-5 h-5" />,
            href: '/admin/analytics',
            badge: null
        },
        {
            title: 'Products',
            icon: <Package className="w-5 h-5" />,
            href: '/admin/products',
            badge: '5'
        },
        {
            title: 'Messages',
            icon: <Mail className="w-5 h-5" />,
            href: '/admin/messages',
            badge: '3'
        },
        {
            title: 'Calendar',
            icon: <Calendar className="w-5 h-5" />,
            href: '/admin/calendar',
            badge: null
        },
        {
            title: 'Settings',
            icon: <Settings className="w-5 h-5" />,
            href: '/admin/settings',
            badge: null,
            submenu: [
                { title: 'General', href: '/admin/settings/general' },
                { title: 'Security', href: '/admin/settings/security' },
                { title: 'API', href: '/admin/settings/api' },
                { title: 'Billing', href: '/admin/settings/billing' }
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
        if (href === '/admin') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="flex-1 flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0 z-40`}>
                    {/* Logo */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    BF
                                </div>
                                {sidebarOpen && (
                                    <span className="ml-3 text-xl font-semibold">Admin Panel</span>
                                )}
                            </div>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
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
                                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isActive(item.href)
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                            onClick={() => item.submenu && toggleSubmenu(item.title)}
                                        >
                                            <div className="flex items-center">
                                                <span className="flex-shrink-0">{item.icon}</span>
                                                {sidebarOpen && (
                                                    <span className="ml-3">{item.title}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                {item.badge && sidebarOpen && (
                                                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                {item.submenu && sidebarOpen && (
                                                    <ChevronDown
                                                        className={`w-4 h-4 ml-2 transition-transform ${activeSubmenu === item.title ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        </Link>

                                        {/* Submenu */}
                                        {item.submenu && activeSubmenu === item.title && sidebarOpen && (
                                            <ul className="mt-2 ml-10 space-y-1">
                                                {item.submenu.map((subitem) => (
                                                    <li key={subitem.title}>
                                                        <Link
                                                            href={subitem.href}
                                                            className={`block p-2 rounded-md transition-colors ${pathname === subitem.href
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            {sidebarOpen && <span className="ml-3">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Search Bar */}
                            <div className="flex items-center flex-1 max-w-md">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {unreadNotifications > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    {notificationsOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                                <h3 className="font-semibold">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-start">
                                                            <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'
                                                                }`}></div>
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
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            JD
                                        </div>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                                <p className="font-semibold">John Doe</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    href="/admin/profile"
                                                    className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <User className="w-4 h-4 mr-3" />
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/admin/settings"
                                                    className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 mr-3" />
                                                    Settings
                                                </Link>
                                                <Link
                                                    href="/admin/help"
                                                    className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <HelpCircle className="w-4 h-4 mr-3" />
                                                    Help
                                                </Link>
                                                <button className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400 w-full text-left">
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
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold">
                                {pathname === '/dashboard' && 'Dashboard'}
                                {pathname === '/admin/users' && 'User Management'}
                                {pathname === '/admin/content' && 'Content Management'}
                                {pathname === '/admin/analytics' && 'Analytics'}
                                {pathname === '/admin/products' && 'Product Management'}
                                {pathname === '/admin/messages' && 'Messages'}
                                {pathname === '/admin/calendar' && 'Calendar'}
                                {pathname === '/admin/settings' && 'Settings'}
                            </h1>
                        </div>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}