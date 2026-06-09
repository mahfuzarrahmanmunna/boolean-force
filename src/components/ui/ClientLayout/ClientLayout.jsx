"use client";

import Footer from "@/app/components/Footer/Footer";
import Navbar1 from "@/app/components/Navbar1/Navbar1";
import SmoothScroll from "@/app/components/SmoothScroll/SmoothScroll";
import VerticalNavbar4 from "@/app/components/VerticalNavbar4/VerticalNavbar4";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isClientDashboard = pathname.startsWith("/client-dashboard");
  const isWorkerDashboard = pathname.startsWith("/worker-dashboard");
  const isMessengerWorker = pathname.startsWith("/worker-dashboard/(chat)");
  const isMessengerAdmin = pathname.startsWith("/dashboard/(chat)");
  const isAnyDashboard = isDashboard || isClientDashboard || isWorkerDashboard;

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {/* Regular navbar for non-dashboard pages */}
      {!isAnyDashboard && <Navbar1 />}

      {/* Vertical navbar for admin dashboard */}
      <div className="hidden md:flex">{!isDashboard && <VerticalNavbar4 />}</div>
      {/* <SmoothScroll/> */}

      {/* Note: Client and Worker dashboards should have their own vertical navbars in their respective layout files */}

      {/* Main content area */}
      <main className={`flex-grow ${!isAnyDashboard ? "pt-20" : ""}`}>
        {children}
      </main>

      {/* Footer for non-dashboard pages */}
      {!isAnyDashboard && <Footer />}
    </div>
  );
}
