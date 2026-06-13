// app/services/website-development/page.jsx
"use client";

import { FaGlobe, FaCheckCircle, FaArrowRight, FaStar, FaLightbulb, FaCode, FaMobileAlt, FaServer, FaChartLine, FaLock } from 'react-icons/fa';
import ServiceTemplates from '@/components/ServiceTemplates/ServiceTemplates';
import { useEffect, useState } from 'react';
import LoadingPage from '../loading';

// Create a mapping of icon names to icon components
const iconMap = {
    FaGlobe,
    FaCheckCircle,
    FaArrowRight,
    FaStar,
    FaLightbulb,
    FaCode,
    FaMobileAlt,
    FaServer,
    FaChartLine,
    FaLock
};

// Function to process API data and convert icon strings to JSX elements
const processApiData = (apiData) => {
    if (!apiData) return null;

    // Create a deep copy to avoid mutating the original
    const processedData = JSON.parse(JSON.stringify(apiData));

    // Process sections to convert icon strings to JSX elements
    if (processedData.sections) {
        processedData.sections.forEach(section => {
            // Handle hero section icon
            if (section.type === 'hero' && section.data && section.data.icon) {
                if (typeof section.data.icon === 'string') {
                    // Create a JSX element, not just assign the component reference
                    const IconComponent = iconMap[section.data.icon] || FaGlobe;
                    section.data.icon = <IconComponent />;
                }
            }

            // Handle features section icons
            if (section.type === 'features' && section.data && section.data.items) {
                section.data.items.forEach(item => {
                    if (item.icon && typeof item.icon === 'string') {
                        // Create a JSX element, not just assign the component reference
                        const IconComponent = iconMap[item.icon] || FaGlobe;
                        item.icon = <IconComponent />;
                    }
                });
            }
        });
    }

    return processedData;
};

export default function WebsiteDevelopment() {
    const [webData, setWebData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/services');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                //console.log('API Response:', data); // Debug log

                // Filter the data to get only the Website Development
                const webService = data.find(service => service.name === 'Website Development');
                //console.log('Website Service from API:', webService); // Debug log

                if (webService) {
                    // Process the data to convert icon strings to JSX elements
                    const processedData = processApiData(webService);
                    //console.log('Processed Data:', processedData); // Debug log
                    setWebData(processedData);
                } else {
                    setError('Website Development service not found');
                }
            } catch (error) {
                console.error("Error fetching Website Development service data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Error Loading Service</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!webData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
                    <p className="text-gray-600">The Website Development service could not be loaded.</p>
                </div>
            </div>
        );
    }

    //console.log('Final webData:', webData); // Debug log
    return <ServiceTemplates serviceData={webData} />;
}