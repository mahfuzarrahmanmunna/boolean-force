// app/unauthorized/page.js
'use client'; // Add this line to use client-side hooks like signOut
import Link from "next/link";
import { signOut } from "next-auth/react"; // Import signOut
import { FaExclamationTriangle, FaSignOutAlt } from "react-icons/fa"; 
// Import a logout icon

export default function Unauthorized() {
    // Function to handle the logout process
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' }); // Redirect to login page after logout
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
                <FaExclamationTriangle className="text-6xl text-yellow-400 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                <p className="text-xl text-gray-400 mb-8">
                    You don't have permission to access this page.
                </p>

                <div className="flex gap-4 justify-center">
                    {/* Return to Login Button */}
                    <Link
                        href="/login"
                        className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                        Return to Login
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}