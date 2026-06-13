// app/providers.js
"use client";

import { AuthProviders } from "@/providers/AuthProviders";
import Chatbot from "./components/Chatbot/Chatbot";
import BinaryBack from "./components/BinarayBack/BinaryBack";
import ClientLayout from "@/components/ui/ClientLayout/ClientLayout";
import Navbar1 from "./components/Navbar1/Navbar1";
import Footer from "./components/Footer/Footer";
import VerticalNavbar4 from "./components/VerticalNavbar4/VerticalNavbar4";

export default function Providers({ children }) {
  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {/* Interactive Background */}
      <BinaryBack />

      {/* Main Content Area */}
      <main className="flex-grow">
        <ClientLayout>
          <AuthProviders>
            {children}
            <Chatbot />
          </AuthProviders>
        </ClientLayout>
      </main>

      {/* Optional: Un-comment if you want these back */}
      {/* <Navbar1 /> */}

      {/* <VerticalNavbar4 /> */}
      {/* <Footer /> */}
    </div>
  );
}
