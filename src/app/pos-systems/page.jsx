// app/services/pos-systems/page.jsx
"use client";

import { FaCreditCard, FaCheckCircle, FaArrowRight, FaStar, FaLightbulb, FaCashRegister, FaBarcode, FaReceipt, FaChartLine, FaMobileAlt, FaWifi, FaUsers } from 'react-icons/fa';
import ServiceTemplates from '@/components/ServiceTemplates/ServiceTemplates';
import { useEffect, useState } from 'react';
import LoadingPage from '../blog/loading';

// Create a mapping of icon names to icon components
const iconMap = {
    FaCreditCard,
    FaCheckCircle,
    FaArrowRight,
    FaStar,
    FaLightbulb,
    FaCashRegister,
    FaBarcode,
    FaReceipt,
    FaChartLine,
    FaMobileAlt,
    FaWifi,
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
                    const IconComponent = iconMap[section.data.icon] || FaCreditCard;
                    section.data.icon = <IconComponent />;
                }
            }

            // Handle features section icons
            if (section.type === 'features' && section.data && section.data.items) {
                section.data.items.forEach(item => {
                    if (item.icon && typeof item.icon === 'string') {
                        // Create a JSX element, not just assign the component reference
                        const IconComponent = iconMap[item.icon] || FaCreditCard;
                        item.icon = <IconComponent />;
                    }
                });
            }
        });
    }

    return processedData;
};

export default function POSSystems() {
    const [postData, setPosData] = useState(null);
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

                // Filter the data to get only the POS system
                const posSystem = data.find(service => service.name === 'POS Systems');
                console.log('POS System from API:', posSystem); // Debug log

                if (posSystem) {
                    // Process the data to convert icon strings to JSX elements
                    const processedData = processApiData(posSystem);
                    console.log('Processed Data:', processedData); // Debug log
                    setPosData(processedData);
                } else {
                    setError('POS Systems service not found');
                }
            } catch (error) {
                console.error("Error fetching POS data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

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

    if (!postData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
                    <p className="text-gray-600">The POS Systems service could not be loaded.</p>
                </div>
            </div>
        );
    }

    console.log('Final postData:', postData); // Debug log
    return <ServiceTemplates serviceData={postData} />;
}