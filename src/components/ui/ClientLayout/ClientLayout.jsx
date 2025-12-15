"use client";

import Footer from "@/app/components/Footer/Footer";
import Navbar1 from "@/app/components/Navbar1/Navbar1";
import VerticalNavbar4 from "@/app/components/VerticalNavbar4/VerticalNavbar4";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");
    const isClientDashboard = pathname.startsWith("/client-dashboard");

    return (
        <div className="relative z-10 flex flex-col min-h-screen">
            {/* Regular navbar for non-dashboard pages */}
            {!isDashboard && !isClientDashboard && <Navbar1 />}

            {/* Vertical navbar for admin/worker dashboard */}
            {isDashboard && <VerticalNavbar4 />}

            {/* Main content area */}
            <main className={`flex-grow ${isDashboard || isClientDashboard ? '' : 'pt-20'}`}>
                {children}
            </main>

            {/* Footer for non-dashboard pages */}
            {!isDashboard && !isClientDashboard && <Footer />}
        </div>
    );
}