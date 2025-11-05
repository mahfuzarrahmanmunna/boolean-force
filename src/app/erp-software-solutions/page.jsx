// app/services/erp-software-solutions/page.jsx
"use client";

import { FaChartBar, FaCheckCircle, FaArrowRight, FaStar, FaLightbulb, FaCogs, FaDatabase, FaCloud, FaSync, FaShieldAlt, FaUsers } from 'react-icons/fa';
import ServiceTemplates from '@/components/ServiceTemplates/ServiceTemplates';
import { useEffect, useState } from 'react';
import LoadingPage from '../loading';

// Create a mapping of icon names to icon components
const iconMap = {
    FaChartBar,
    FaCheckCircle,
    FaArrowRight,
    FaStar,
    FaLightbulb,
    FaCogs,
    FaDatabase,
    FaCloud,
    FaSync,
    FaShieldAlt,
    FaUsers
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
                    const IconComponent = iconMap[section.data.icon] || FaChartBar;
                    section.data.icon = <IconComponent />;
                }
            }

            // Handle features section icons
            if (section.type === 'features' && section.data && section.data.items) {
                section.data.items.forEach(item => {
                    if (item.icon && typeof item.icon === 'string') {
                        // Create a JSX element, not just assign the component reference
                        const IconComponent = iconMap[item.icon] || FaChartBar;
                        item.icon = <IconComponent />;
                    }
                });
            }
        });
    }

    return processedData;
};

export default function ERPSoftwareSolutions() {
    const [erpData, setErpData] = useState(null);
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
                console.log('API Response:', data); // Debug log

                // Filter the data to get only the ERP Software Solutions
                const erpService = data.find(service => service.name === 'ERP Software Solutions');
                console.log('ERP Service from API:', erpService); // Debug log

                if (erpService) {
                    // Process the data to convert icon strings to JSX elements
                    const processedData = processApiData(erpService);
                    console.log('Processed Data:', processedData); // Debug log
                    setErpData(processedData);
                } else {
                    setError('ERP Software Solutions service not found');
                }
            } catch (error) {
                console.error("Error fetching ERP service data:", error);
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

    if (!erpData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
                    <p className="text-gray-600">The ERP Software Solutions service could not be loaded.</p>
                </div>
            </div>
        );
    }

    console.log('Final erpData:', erpData); // Debug log
    return <ServiceTemplates serviceData={erpData} />;
}