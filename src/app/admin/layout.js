"use client";

import Link from "next/link";

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <nav className="flex flex-col space-y-2">
                    <Link href="/admin" className="hover:text-blue-400">
                        Dashboard
                    </Link>
                    <Link href="/admin/users" className="hover:text-blue-400">
                        Users
                    </Link>
                    <Link href="/admin/settings" className="hover:text-blue-400">
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
                {children}
            </main>
        </div>
    );
}
