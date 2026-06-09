import React from "react";
import AboutContent from "./AboutContent";
export const metadata = {
  title:
    "BooleanForce | Decoding Complex Problems & Delivering Logical Solutions",
  description:
    "BooleanForce transforms abstract concepts into digital realities. Specializing in Brand Identity, Web Development, ERP Software, POS Systems, and AI Chatbots. Learn about our journey, team, and values.",
  keywords: [
    "BooleanForce",
    "Web Development",
    "Brand Identity",
    "ERP Software",
    "POS Systems",
    "AI Chatbots",
    "Digital Agency",
    "Tech Solutions",
    "UI/UX Design",
  ],
  authors: [{ name: "BooleanForce Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://booleanforce.com/about", // Replace with your actual URL
    title: "About BooleanForce - Human Logic Meets Digital Force",
    description:
      "Discover the team behind the code. We are a new-age creative technology business bridging the gap between imagination and binary intelligence.",
    siteName: "BooleanForce",
    images: [
      {
        url: "https://booleanforce.com/og-image.jpg", // Replace with a real image
        width: 1200,
        height: 630,
        alt: "BooleanForce Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BooleanForce",
    description:
      "We specialize in transforming abstract concepts into high-performance digital realities.",
    images: ["https://booleanforce.com/og-image.jpg"], // Replace with a real image
  },
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
  verification: {
    // google: "your-google-verification-code",
  },
};
const AboutPages = () => {
  return <AboutContent />;
};

export default AboutPages;
