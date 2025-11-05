// components/AuthDebug.jsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthDebug() {
    const { data: session, status } = useSession();

    useEffect(() => {
        console.log("=== AUTH DEBUG ===");
        console.log("Status:", status);
        console.log("Session:", session);
        console.log("User:", session?.user);
        console.log("==================");
    }, [session, status]);

    return (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg z-50 max-w-xs">
            <h3 className="text-sm font-bold mb-2">Auth Debug</h3>
            <p className="text-xs">Status: {status}</p>
            {session ? (
                <>
                    <p className="text-xs">User: {session.user?.name}</p>
                    <p className="text-xs">Email: {session.user?.email}</p>
                    <p className="text-xs">ID: {session.user?.id}</p>
                </>
            ) : (
                <p className="text-xs">Not authenticated</p>
            )}
        </div>
    );
}