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

      {/*
        ── FIX ───────────────────────────────────────────────────────────────
        REMOVED "pt-20" from <main>.
        
        The old code had:  className={`flex-grow ${!isAnyDashboard ? "pt-20" : ""}`}
        That added 80px padding-top on every non-dashboard page ON TOP OF the
        76px padding-top already inside BooleanForceBanner's hero row,
        resulting in ~156px of dead space below the navbar.

        Each page/section is now responsible for its own top spacing to clear
        the fixed navbar (BooleanForceBanner already does this correctly with
        padding: "76px 48px 56px" on its hero row).

        If any OTHER page (e.g. /blog, /contact) looks too high after this
        change, add pt-[76px] to that specific page's top wrapper instead of
        putting it globally here.
        ──────────────────────────────────────────────────────────────────────
      */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer for non-dashboard pages */}
      {!isAnyDashboard && <Footer />}
    </div>
  );
}