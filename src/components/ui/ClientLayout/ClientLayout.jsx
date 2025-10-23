"use client";

import Footer from "@/app/components/Footer/Footer";
import Navbar1 from "@/app/components/Navbar1/Navbar1";
import VerticalNavbar4 from "@/app/components/VerticalNavbar4/VerticalNavbar4";
import { usePathname } from "next/navigation";
// import Navbar1 from "./Navbar1/Navbar1";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const hideLayout = pathname.startsWith("/admin");

    return (
        <div className="relative z-10 flex flex-col min-h-screen">
            {!hideLayout && <Navbar1 />}
            {!hideLayout && <VerticalNavbar4 />}
            <main className="flex-grow">{children}</main>
            {!hideLayout && <Footer />}
        </div>
    );
}
