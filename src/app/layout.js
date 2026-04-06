// app/layout.jsx

// "use client";
// NOTE: "use client" has been removed to allow the "export const metadata" below to work.
// This is required for SEO and Favicon configuration in Next.js App Router.
// The child components (ClientLayout, AuthProviders) will still handle client-side interactivity.

import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ui/ClientLayout/ClientLayout";
import BinaryBack from "./components/BinarayBack/BinaryBack";
import { AuthProviders } from "@/providers/AuthProviders";
import Chatbot from "./components/Chatbot/Chatbot";

const inter = Inter({
  subsets: ["latin"],
  preload: false, // Add this temporarily
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// SEO Meta Tags and Favicon Configuration
export const metadata = {
  title: "Boolean Force | Innovative Digital Solutions",
  description:
    "Expert Web Development, AI Chatbots, and ERP Systems designed to scale your business with precision and logic.",
  keywords: [
    "Web Development",
    "AI Chatbots",
    "ERP Systems",
    "POS Systems",
    "Brand Identity",
  ],
  authors: [{ name: "Boolean Force" }],
  creator: "Boolean Force",
  publisher: "Boolean Force",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Boolean Force | Innovative Digital Solutions",
    description:
      "Expert Web Development, AI Chatbots, and ERP Systems designed to scale your business.",
    url: "http://localhost:3000",
    siteName: "Boolean Force",
    images: [
      {
        url: "/og-image.png", // Ensure you have an image in your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boolean Force",
    description: "Expert Web Development, AI Chatbots, and ERP Systems.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico", // Place favicon.ico in your 'app' or 'public' folder
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json", // Optional: if you have a PWA manifest
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-arp="" data-theme="dark" className="scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        {/* The background is a fixed layer behind everything */}
        {/* <BinaryBackground /> */}
        <BinaryBack />

        {/* This container holds the actual page layout */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* {!hideLayout && <Navbar1 />}
          <VerticalNavbar4 /> */}

          <main className="flex-grow">
            {/* <AnimatedCursor
              showSystemCursor={true}
              color="#fff"
              innerSize={8}
              outerSize={35}
              innerScale={1}
              outerScale={1.7}
              outerAlpha={0}
              outerStyle={{
                border: "2px solid rgba(0,150,255,0.8)",
                backgroundColor: "transparent",
                borderRadius: "50%",
              }}
              innerStyle={{
                backgroundColor: "rgba(0,150,255,1)",
                borderRadius: "50%",
              }}
            /> */}

            <ClientLayout>
              <AuthProviders>
                {children}
                <Chatbot />
              </AuthProviders>
            </ClientLayout>
          </main>

          {/* Footer is always at the bottom of the flex container */}
          {/* {!hideLayout && <Footer />} */}
        </div>

        {/* Debug component */}
        {/* <AuthDebug /> */}
      </body>
    </html>
  );
}
