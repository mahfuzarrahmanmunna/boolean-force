import React from "react";
import Portfolio from "./PortfollioPage";

// --- SEO CONFIGURATION ---
// Removed ": Metadata" because this is a .js file
export const metadata = {
  title: "Booleanforce | Next-Gen Digital Solutions Portfolio",
  description:
    "Explore the portfolio of Booleanforce. We specialize in custom software development, POS systems, ERP solutions, and cloud infrastructure designed to transform your business.",
  keywords: [
    "Web Development",
    "Mobile Apps",
    "Cloud Solutions",
    "POS Systems",
    "Brand Identity",
    "React",
    "Next.js",
    "Booleanforce",
  ],
  authors: [{ name: "Booleanforce", url: "https://booleanforce.com" }],
  creator: "Booleanforce",
  publisher: "Booleanforce",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://booleanforce.com/portfolio",
    title: "Booleanforce | Next-Gen Digital Solutions Portfolio",
    description:
      "Explore our recent projects and see how we've helped businesses transform with cutting-edge technology.",
    siteName: "Booleanforce",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Booleanforce Portfolio Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Booleanforce | Next-Gen Digital Solutions Portfolio",
    description:
      "Explore our recent projects and see how we've helped businesses transform with cutting-edge technology.",
    images: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

// --- MAIN PAGE COMPONENT ---
const PortfolioMainPage = () => {
  return (
    <>
      {/* 
         JSON-LD Structured Data 
         This helps search engines understand that this page represents an Organization 
         and describes the services offered.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Booleanforce",
            url: "https://booleanforce.com",
            logo: "https://booleanforce.com/logo.png",
            description:
              "Empowering innovation through next-gen digital transformation. We craft custom software, branding, and cloud infrastructure.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-555-0199",
              contactType: "Customer Service",
              areaServed: "US",
              availableLanguage: "English",
            },
            sameAs: [
              "https://www.facebook.com/booleanforce",
              "https://www.twitter.com/booleanforce",
              "https://www.linkedin.com/company/booleanforce",
              "https://github.com/booleanforce",
            ],
          }),
        }}
      />

      {/* The Main Portfolio Component */}
      <Portfolio />
    </>
  );
};

export default PortfolioMainPage;
