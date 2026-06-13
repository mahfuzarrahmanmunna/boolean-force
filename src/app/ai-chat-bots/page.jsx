"use client";

import {
  FaRobot,
  FaBrain,
  FaComments,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaLightbulb,
  FaCode,
  FaMobileAlt,
  FaServer,
  FaChartLine,
  FaLock,
  FaCogs,
  FaProjectDiagram,
} from "react-icons/fa";

import ServiceTemplates from "@/components/ServiceTemplates/ServiceTemplates";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";

// Create a mapping of icon names to icon components
const iconMap = {
  FaRobot,
  FaBrain,
  FaComments,
  FaClock,
  FaCogs,
  FaProjectDiagram,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaLightbulb,
  FaCode,
  FaMobileAlt,
  FaServer,
  FaChartLine,
  FaLock,
};

// Function to process data and convert icon strings to JSX elements
const processApiData = (data) => {
  if (!data) return null;

  const processedData = JSON.parse(JSON.stringify(data));

  if (processedData.sections) {
    processedData.sections.forEach((section) => {
      // Handle hero section icon
      if (section.type === "hero" && section.data && section.data.icon) {
        if (typeof section.data.icon === "string") {
          const IconComponent = iconMap[section.data.icon] || FaRobot;
          section.data.icon = <IconComponent />;
        }
      }

      // Handle features section icons
      if (section.type === "features" && section.data && section.data.items) {
        section.data.items.forEach((item) => {
          if (item.icon && typeof item.icon === "string") {
            const IconComponent = iconMap[item.icon] || FaBrain;
            item.icon = <IconComponent />;
          }
        });
      }

      // Handle tech stack or lists if they have icons
      if (section.type === "tech-stack" && section.data && section.data.items) {
        section.data.items.forEach((item) => {
          if (item.icon && typeof item.icon === "string") {
            const IconComponent = iconMap[item.icon] || FaCode;
            item.icon = <IconComponent />;
          }
        });
      }
    });
  }

  return processedData;
};

export default function AiChatBots() {
  const [webData, setWebData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFakeData = async () => {
      try {
        setLoading(true);

        // --- CORRECTED FAKE API RESPONSE DATA ---
        // Added 'colors' object and fixed hero keys to match ServiceTemplate expectations
        const fakeApiResponse = [
          {
            name: "AI Chat Bots",
            slug: "ai-chat-bots",
            // CRITICAL: ServiceTemplates requires this 'colors' object
            colors: {
              accent: "text-indigo-400",
              accentBg: "bg-indigo-500/10",
              primaryButtonColor:
                "bg-gradient-to-r from-indigo-600 to-purple-600",
            },
            sections: [
              {
                type: "hero",
                data: {
                  title: "AI Chat Bots",
                  // Template expects 'subtitle', not 'description'
                  subtitle:
                    "We build smart, conversational interfaces that understand user intent and automate engagement. Because when AI handles the noise, your team can focus on the signal.",
                  icon: "FaRobot",
                  // Template expects these gradient props
                  iconGradient: "from-indigo-500 to-purple-500",
                  textGradient: "from-white to-indigo-200",
                  primaryButtonColor:
                    "bg-gradient-to-r from-indigo-600 to-purple-600",
                  primaryButtonText: "Deploy AI Bot",
                  secondaryButtonLink: "/contact",
                  secondaryButtonText: "View Demo",
                  image:
                    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2070&auto=format&fit=crop",
                },
              },
              {
                type: "features",
                data: {
                  title: "Intelligent Capabilities",
                  subtitle: "Powered by advanced machine learning models.",
                  // Template expects 'name' and 'description' keys
                  items: [
                    {
                      icon: "FaBrain",
                      name: "Natural Language Processing",
                      description:
                        "Understand context, sentiment, and intent with human-like accuracy.",
                    },
                    {
                      icon: "FaClock",
                      name: "24/7 Availability",
                      description:
                        "Provide instant support to your customers around the clock, anywhere.",
                    },
                    {
                      icon: "FaCogs",
                      name: "Seamless Integration",
                      description:
                        "Connects effortlessly with your CRM, ticketing systems, and databases.",
                    },
                    {
                      icon: "FaProjectDiagram",
                      name: "Self-Learning",
                      description:
                        "Our bots improve over time by analyzing interactions and feedback.",
                    },
                  ],
                },
              },
              {
                type: "tech-stack",
                data: {
                  title: "Powered By",
                  items: [
                    { icon: "FaCode", name: "Python & TensorFlow" },
                    { icon: "FaServer", name: "OpenAI API" },
                    { icon: "FaComments", name: "Dialogflow" },
                    { icon: "FaMobileAlt", name: "WhatsApp & Messenger" },
                  ],
                },
              },
            ],
          },
        ];
        // -----------------------------------

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const aiService = fakeApiResponse.find(
          (service) => service.name === "AI Chat Bots",
        );

        if (aiService) {
          const processedData = processApiData(aiService);
          setWebData(processedData);
        } else {
          setError("AI Chat Bots service not found");
        }
      } catch (error) {
        console.error("Error fetching AI Chat Bots data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFakeData();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Service</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!webData) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <p className="text-gray-600">
            The AI Chat Bots service could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return <ServiceTemplates serviceData={webData} />;
}
