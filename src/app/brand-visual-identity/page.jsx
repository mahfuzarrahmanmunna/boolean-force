// app/services/brand-visual-identity/page.jsx
"use client";

import { FaPalette, FaCheckCircle, FaArrowRight, FaStar, FaLightbulb } from 'react-icons/fa';
import ServiceTemplates from '@/components/ServiceTemplates/ServiceTemplates';
import { useEffect, useState } from 'react';
import LoadingPage from '../loading';

// Create a mapping of icon names to icon components
const iconMap = {
    FaPalette,
    FaCheckCircle,
    FaArrowRight,
    FaStar,
    FaLightbulb
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
                    const IconComponent = iconMap[section.data.icon] || FaPalette;
                    section.data.icon = <IconComponent />;
                }
            }

            // Handle features section icons
            if (section.type === 'features' && section.data && section.data.items) {
                section.data.items.forEach(item => {
                    if (item.icon && typeof item.icon === 'string') {
                        // Create a JSX element, not just assign the component reference
                        const IconComponent = iconMap[item.icon] || FaPalette;
                        item.icon = <IconComponent />;
                    }
                });
            }
        });
    }

    return processedData;
};

export default function BrandVisualIdentity() {
    const [brandData, setBrandData] = useState(null);
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

                // Filter the data to get only the Brand Visual Identity
                const brandService = data.find(service => service.name === 'Brand Visual Identity');
                //console.log('Brand Service from API:', brandService); // Debug log

                if (brandService) {
                    // Process the data to convert icon strings to JSX elements
                    const processedData = processApiData(brandService);
                    //console.log('Processed Data:', processedData); // Debug log
                    setBrandData(processedData);
                } else {
                    setError('Brand Visual Identity service not found');
                }
            } catch (error) {
                console.error("Error fetching Brand Visual Identity service data:", error);
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

    if (!brandData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
                    <p className="text-gray-600">The Brand Visual Identity service could not be loaded.</p>
                </div>
            </div>
        );
    }

    //console.log('Final brandData:', brandData); // Debug log
    return <ServiceTemplates serviceData={brandData} />;
}