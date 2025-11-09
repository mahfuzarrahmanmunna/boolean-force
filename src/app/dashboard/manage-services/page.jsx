// app/admin/services/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowUp, FaArrowDown,
    FaCheck, FaCode, FaRocket, FaShieldAlt, FaUsers, FaBolt, FaClock,
    FaStar, FaInfinity, FaHeadset, FaDatabase, FaCloud, FaGitAlt,
    FaReact, FaNodeJs, FaArrowRight, FaEye, FaEyeSlash, FaGripVertical,
    FaInfoCircle, FaSpinner, FaExclamationTriangle, FaCheckCircle,
    FaCopy, FaLock, FaUnlock, FaMagic, FaChartLine, FaCrown, FaPalette,
    FaGlobe, FaLightbulb, FaCogs, FaBars, FaLayerGroup, FaFileAlt,
    FaImages, FaCreditCard, FaBarcode, FaMobileAlt, FaWifi,
    FaSync, FaChartBar
} from 'react-icons/fa';

// Icon mapping with additional professional icons
const iconMap = {
    FaCheck, FaCode, FaRocket, FaShieldAlt, FaUsers, FaBolt, FaClock, FaStar,
    FaInfinity, FaHeadset, FaDatabase, FaCloud, FaGitAlt, FaReact, FaNodeJs,
    FaLock, FaUnlock, FaMagic, FaChartLine, FaCrown, FaPalette, FaGlobe,
    FaLightbulb, FaCogs, FaBars, FaLayerGroup, FaFileAlt, FaImages,
    FaCreditCard, FaBarcode, FaChartLine, FaMobileAlt, FaWifi, FaSync, FaChartBar
};

// Helper function to render icon
const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : <FaCheck />;
};

// Main component
export default function ServicesAdmin() {
    const [servicesData, setServicesData] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [savingServiceId, setSavingServiceId] = useState(null);
    const [deletingServiceId, setDeletingServiceId] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    // Form for editing existing services
    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
        control: editControl,
        formState: { errors: editErrors, isSubmitting: isEditSubmitting },
        setValue: setEditValue,
        watch: watchEdit
    } = useForm();

    // Form for adding new services
    const {
        register: registerNew,
        handleSubmit: handleNewSubmit,
        reset: resetNew,
        control: newControl,
        formState: { errors: newErrors, isSubmitting: isNewSubmitting },
        setValue: setNewValue,
        watch: watchNew
    } = useForm({
        defaultValues: {
            name: "",
            colors: {
                accent: "text-blue-400",
                accentBg: "bg-blue-600 bg-opacity-20"
            },
            sections: [
                {
                    type: "hero",
                    data: {
                        hueShift: 200,
                        title: "",
                        subtitle: "",
                        icon: "FaRocket",
                        iconGradient: "from-blue-500 to-purple-600",
                        textGradient: "from-blue-400 to-purple-600",
                        primaryButtonText: "Get Started",
                        primaryButtonColor: "bg-blue-600",
                        secondaryButtonText: "Learn More",
                        secondaryButtonLink: "#"
                    }
                },
                {
                    type: "overview",
                    data: {
                        title: "",
                        description1: "",
                        description2: "",
                        image: "",
                        imageAlt: "",
                        keyPoints: []
                    }
                },
                {
                    type: "process",
                    data: {
                        title: "",
                        subtitle: "",
                        steps: []
                    }
                },
                {
                    type: "features",
                    data: {
                        title: "",
                        subtitle: "",
                        items: []
                    }
                },
                {
                    type: "benefits",
                    data: {
                        title: "",
                        subtitle: "",
                        items: []
                    }
                },
                {
                    type: "testimonials",
                    data: {
                        items: []
                    }
                },
                {
                    type: "cta",
                    data: {
                        title: "",
                        subtitle: "",
                        buttonText: "",
                        gradient: "from-blue-900 to-purple-900"
                    }
                }
            ]
        }
    });

    // Field arrays for dynamic content in edit form
    const {
        fields: editKeyPoints,
        append: appendEditKeyPoint,
        remove: removeEditKeyPoint
    } = useFieldArray({
        control: editControl,
        name: "sections.1.data.keyPoints"
    });

    const {
        fields: editProcessSteps,
        append: appendEditProcessStep,
        remove: removeEditProcessStep
    } = useFieldArray({
        control: editControl,
        name: "sections.2.data.steps"
    });

    const {
        fields: editFeatures,
        append: appendEditFeature,
        remove: removeEditFeature
    } = useFieldArray({
        control: editControl,
        name: "sections.3.data.items"
    });

    const {
        fields: editBenefits,
        append: appendEditBenefit,
        remove: removeEditBenefit
    } = useFieldArray({
        control: editControl,
        name: "sections.4.data.items"
    });

    const {
        fields: editTestimonials,
        append: appendEditTestimonial,
        remove: removeEditTestimonial
    } = useFieldArray({
        control: editControl,
        name: "sections.5.data.items"
    });

    // Field arrays for dynamic content in new form
    const {
        fields: newKeyPoints,
        append: appendNewKeyPoint,
        remove: removeNewKeyPoint
    } = useFieldArray({
        control: newControl,
        name: "sections.1.data.keyPoints"
    });

    const {
        fields: newProcessSteps,
        append: appendNewProcessStep,
        remove: removeNewProcessStep
    } = useFieldArray({
        control: newControl,
        name: "sections.2.data.steps"
    });

    const {
        fields: newFeatures,
        append: appendNewFeature,
        remove: removeNewFeature
    } = useFieldArray({
        control: newControl,
        name: "sections.3.data.items"
    });

    const {
        fields: newBenefits,
        append: appendNewBenefit,
        remove: removeNewBenefit
    } = useFieldArray({
        control: newControl,
        name: "sections.4.data.items"
    });

    const {
        fields: newTestimonials,
        append: appendNewTestimonial,
        remove: removeNewTestimonial
    } = useFieldArray({
        control: newControl,
        name: "sections.5.data.items"
    });

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Fetch services data from API
    useEffect(() => {
        const fetchServicesData = async () => {
            try {
                const response = await fetch('/api/services');
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }
                const data = await response.json();
                setServicesData(data);
                console.log("Fetched services:", data);
            } catch (error) {
                console.error("Error fetching services:", error);
                showNotification('Failed to load services. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchServicesData();
    }, []);

    // Log data to console whenever it changes
    useEffect(() => {
        console.log("Current Services Data:", servicesData);
    }, [servicesData]);

    // Handle form submission for editing with improved error handling
    const onEditSubmit = async (data) => {
        setIsLoading(true);
        setSavingServiceId(editingService);
        console.log("Submitting edit form data:", data);
        console.log("Editing service ID:", editingService);

        try {
            // Validate required fields
            if (!data.name || !data.sections[0].data.title) {
                throw new Error('Please fill in all required fields');
            }

            // Find the original service to compare with
            const originalService = servicesData.find(service => service._id === editingService);
            if (!originalService) {
                throw new Error('Original service not found');
            }

            // Create a clean copy of the data to send
            const cleanData = JSON.parse(JSON.stringify(data));

            // Remove the _id field from the update data to avoid MongoDB error
            delete cleanData._id;

            // Check if there are any actual changes
            const hasChanges = JSON.stringify(originalService) !== JSON.stringify({ ...originalService, ...cleanData });

            if (!hasChanges) {
                showNotification('No changes were made to the service.', 'info');
                return;
            }

            // Remove any potential circular references or non-serializable data
            if (cleanData.sections) {
                cleanData.sections = cleanData.sections.map(section => {
                    if (section.data && section.data.icon && typeof section.data.icon === 'object') {
                        // If icon is an object (React component), convert to string
                        section.data.icon = section.data.icon.type?.name || 'FaRocket';
                    }

                    // Handle feature icons
                    if (section.data && section.data.items) {
                        section.data.items = section.data.items.map(item => {
                            if (item.icon && typeof item.icon === 'object') {
                                item.icon = item.icon.type?.name || 'FaCheck';
                            }
                            return item;
                        });
                    }

                    return section;
                });
            }

            const requestBody = JSON.stringify(cleanData);

            console.log("Request body:", requestBody);
            console.log("Request URL:", `/api/services/${editingService}`);

            const response = await fetch(`/api/services/${editingService}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            // Get the response text first to see what we're getting
            const responseText = await response.text();
            console.log("Response text:", responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                console.error("Error parsing response JSON:", parseError);
                throw new Error('Invalid response from server');
            }

            console.log("API Response:", responseData);

            if (!response.ok) {
                // Provide more specific error messages
                if (response.status === 404) {
                    throw new Error(`Service with ID ${editingService} not found. Please refresh the page and try again.`);
                } else {
                    throw new Error(responseData.error || responseData.message || 'Failed to update service');
                }
            }

            // Update the local state with the updated service from the API response
            if (responseData.data) {
                const updatedData = servicesData.map(service =>
                    service._id === editingService ? responseData.data : service
                );
                setServicesData(updatedData);
            } else {
                // Fallback to updating with the form data if API doesn't return the updated document
                const updatedData = servicesData.map(service =>
                    service._id === editingService ? { ...service, ...cleanData, _id: editingService } : service
                );
                setServicesData(updatedData);
            }

            setEditingService(null);
            resetEdit();
            showNotification('Service updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating service:", error);
            showNotification(error.message || 'Failed to update service. Please try again.', 'error');
        } finally {
            setIsLoading(false);
            setSavingServiceId(null);
        }
    };

    // Handle form submission for adding new service with improved error handling
    const onNewSubmit = async (data) => {
        setIsLoading(true);
        console.log("Submitting new service data:", data);

        try {
            // Validate required fields
            if (!data.name || !data.sections[0].data.title) {
                throw new Error('Please fill in all required fields');
            }

            const response = await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create service');
            }

            const result = await response.json();
            console.log("Create response:", result);

            // Update the local state with the new service from the API response
            if (result.data) {
                setServicesData([...servicesData, result.data]);
            } else {
                // Fallback to fetching the updated list if API doesn't return the new document
                const fetchResponse = await fetch('/api/services');
                if (fetchResponse.ok) {
                    const updatedData = await fetchResponse.json();
                    setServicesData(updatedData);
                }
            }

            setIsAddingNew(false);
            resetNew();
            showNotification('New service added successfully!', 'success');
        } catch (error) {
            console.error("Error creating service:", error);
            showNotification(error.message || 'Failed to create service. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle service delete with improved error handling
    const handleDeleteService = async (serviceId) => {
        if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            console.log("Deleting service with ID:", serviceId);
            setDeletingServiceId(serviceId);

            try {
                const response = await fetch(`/api/services/${serviceId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete service');
                }

                const result = await response.json();
                console.log("Delete response:", result);

                // Update the local state by removing the deleted service
                const updatedData = servicesData.filter(service => service._id !== serviceId);
                setServicesData(updatedData);
                showNotification('Service deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting service:", error);
                showNotification(error.message || 'Failed to delete service. Please try again.', 'error');
            } finally {
                setDeletingServiceId(null);
            }
        }
    };

    // Handle duplicate service
    const handleDuplicateService = async (service) => {
        try {
            const duplicatedService = {
                ...service,
                name: `${service.name} (Copy)`,
                _id: undefined // Remove ID to create a new service
            };

            const response = await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(duplicatedService),
            });

            if (!response.ok) {
                throw new Error('Failed to duplicate service');
            }

            // Fetch the updated list of services
            const fetchResponse = await fetch('/api/services');
            if (fetchResponse.ok) {
                const updatedData = await fetchResponse.json();
                setServicesData(updatedData);
            }

            showNotification('Service duplicated successfully!', 'success');
        } catch (error) {
            console.error("Error duplicating service:", error);
            showNotification('Failed to duplicate service. Please try again.', 'error');
        }
    };

    // Reorder services with improved functionality
    const moveService = async (index, direction) => {
        const newServicesData = [...servicesData];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newServicesData.length) {
            [newServicesData[index], newServicesData[targetIndex]] = [newServicesData[targetIndex], newServicesData[index]];

            try {
                // Update order in database
                const serviceIds = newServicesData.map(service => service._id);
                await fetch('/api/services/reorder', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ serviceIds }),
                });

                setServicesData(newServicesData);
                console.log("Reordered services:", newServicesData);
                showNotification('Services reordered successfully!', 'success');
            } catch (error) {
                console.error("Error reordering services:", error);
                showNotification('Failed to reorder services. Please try again.', 'error');
                // Revert to original order if API call fails
                setServicesData(servicesData);
            }
        }
    };

    // Drag and drop handlers with improved functionality
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (index) => {
        if (draggedIndex === null) return;

        const newServicesData = [...servicesData];
        const draggedItem = newServicesData[draggedIndex];

        // Remove the dragged item
        newServicesData.splice(draggedIndex, 1);

        // Add it at the new position
        newServicesData.splice(index, 0, draggedItem);

        try {
            // Update order in database
            const serviceIds = newServicesData.map(service => service._id);
            await fetch('/api/services/reorder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serviceIds }),
            });

            setServicesData(newServicesData);
            setDraggedIndex(null);
            console.log("Reordered services via drag and drop:", newServicesData);
            showNotification('Services reordered successfully!', 'success');
        } catch (error) {
            console.error("Error reordering services:", error);
            showNotification('Failed to reorder services. Please try again.', 'error');
            // Revert to original order if API call fails
            setServicesData(servicesData);
            setDraggedIndex(null);
        }
    };

    // Handle edit service with improved functionality
    const handleEditService = (service) => {
        console.log("Editing service:", service);
        console.log("Service ID:", service._id);

        // Ensure ID is a string
        const serviceId = typeof service._id === 'object' ? service._id.toString() : service._id;
        console.log("Normalized service ID:", serviceId);

        setEditingService(serviceId);
        // Set the form values with the current service data
        resetEdit(service);
        setActiveTab('hero');
    };

    const refreshData = async () => {
        setRefreshing(true);
        try {
            const response = await fetch('/api/services');
            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }
            const data = await response.json();
            setServicesData(data);
            showNotification('Data refreshed successfully!', 'success');
        } catch (error) {
            console.error("Error refreshing services:", error);
            showNotification('Failed to refresh data. Please try again.', 'error');
        } finally {
            setRefreshing(false);
        }
    };

    if (isInitialLoading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">Loading services...</p>
            </div>
        </div>
    );

    // Get section index by type
    const getSectionIndex = (type) => {
        const sectionTypes = ['hero', 'overview', 'process', 'features', 'benefits', 'testimonials', 'cta'];
        return sectionTypes.indexOf(type);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    } animate-pulse`}>
                    {notification.type === 'success' ? (
                        <FaCheckCircle className="text-xl" />
                    ) : (
                        <FaExclamationTriangle className="text-xl" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 backdrop-blur-lg bg-opacity-90">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                                    <FaLayerGroup className="mr-3 text-blue-500" />
                                    Services Management
                                </h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Manage and customize your service offerings with ease</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex gap-3">
                                <button
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg shadow-md transition-all duration-200 ${previewMode
                                        ? 'bg-slate-600 text-white hover:bg-slate-700 border-slate-600'
                                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {previewMode ? <FaEyeSlash className="mr-2" /> : <FaEye className="mr-2" />}
                                    {previewMode ? 'Edit Mode' : 'Preview Mode'}
                                </button>
                                <button
                                    onClick={() => setIsAddingNew(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md transition-all duration-200 transform hover:scale-105"
                                >
                                    <FaPlus className="mr-2" />
                                    Add New Service
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {previewMode ? (
                    // Preview Mode - Display the services as they would appear on the frontend
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-xl">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                                Our Services
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                                We offer a comprehensive range of services to help your business thrive in the digital landscape.
                            </p>
                        </div>

                        <button
                            onClick={refreshData}
                            disabled={refreshing}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 mb-8"
                        >
                            {refreshing ? <FaSpinner className="mr-2 animate-spin" /> : <FaCheckCircle className="mr-2" />}
                            Refresh
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {servicesData.map((service) => (
                                <div
                                    key={service._id}
                                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 mx-auto">
                                            {renderIcon(service.sections[0]?.data?.icon || "FaRocket")}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">{service.name}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-4 text-center">{service.sections[0]?.data?.subtitle}</p>
                                        <div className="flex justify-center">
                                            <button className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r ${service.sections[0]?.data?.primaryButtonColor || "from-blue-600 to-purple-600"} hover:from-opacity-90 hover:to-opacity-90 transition-all duration-300`}>
                                                {service.sections[0]?.data?.primaryButtonText || "Get Started"}
                                                <FaArrowRight className="ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <div className="space-y-6">
                        {servicesData.map((service, index) => (
                            <div key={service._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-xl">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg cursor-move hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                                draggable
                                                onDragStart={() => handleDragStart(index)}
                                                onDragOver={handleDragOver}
                                                onDrop={() => handleDrop(index)}>
                                                <FaGripVertical className="text-slate-500 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {service.name}
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                        {service.colors?.accent || "text-blue-400"}
                                                    </span>
                                                </h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{service.sections[0]?.data?.subtitle}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => moveService(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Move Up"
                                            >
                                                <FaArrowUp />
                                            </button>
                                            <button
                                                onClick={() => moveService(index, 'down')}
                                                disabled={index === servicesData.length - 1}
                                                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Move Down"
                                            >
                                                <FaArrowDown />
                                            </button>
                                            <button
                                                onClick={() => handleDuplicateService(service)}
                                                className="p-2 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                title="Duplicate"
                                            >
                                                <FaCopy />
                                            </button>
                                            <button
                                                onClick={() => handleEditService(service)}
                                                className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteService(service._id)}
                                                disabled={deletingServiceId === service._id}
                                                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deletingServiceId === service._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {editingService === service._id ? (
                                    <form onSubmit={handleEditSubmit(onEditSubmit)} className="p-6">
                                        {/* Tab Navigation */}
                                        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                                            <nav className="-mb-px flex space-x-8">
                                                {['hero', 'overview', 'process', 'features', 'benefits', 'testimonials', 'cta'].map((tab) => (
                                                    <button
                                                        key={tab}
                                                        type="button"
                                                        onClick={() => setActiveTab(tab)}
                                                        className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                                            ? 'border-blue-500 text-blue-600'
                                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                                                            }`}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>

                                        {/* Basic Info Tab */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Service Name</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        {...registerEdit("name", { required: "Service name is required" })}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                    {editErrors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.name.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Accent Color</label>
                                                    <select
                                                        {...registerEdit("colors.accent")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    >
                                                        <option value="text-blue-400">Blue</option>
                                                        <option value="text-green-400">Green</option>
                                                        <option value="text-amber-400">Amber</option>
                                                        <option value="text-red-400">Red</option>
                                                        <option value="text-purple-400">Purple</option>
                                                        <option value="text-indigo-400">Indigo</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hero Section */}
                                        {activeTab === 'hero' && (
                                            <div className="space-y-6 mt-6">
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Hero Section</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.0.data.title", { required: "Title is required" })}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                        {editErrors.sections?.[0]?.data?.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.sections[0].data.title.message}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Icon</label>
                                                        <select
                                                            {...registerEdit("sections.0.data.icon")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        >
                                                            {Object.keys(iconMap).map(iconName => (
                                                                <option key={iconName} value={iconName}>{iconName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                        <textarea
                                                            {...registerEdit("sections.0.data.subtitle", { required: "Subtitle is required" })}
                                                            rows={3}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                        {editErrors.sections?.[0]?.data?.subtitle && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.sections[0].data.subtitle.message}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Button Text</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.0.data.primaryButtonText")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Secondary Button Text</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.0.data.secondaryButtonText")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Icon Gradient</label>
                                                        <select
                                                            {...registerEdit("sections.0.data.iconGradient")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        >
                                                            <option value="from-blue-500 to-purple-600">Blue to Purple</option>
                                                            <option value="from-green-500 to-teal-600">Green to Teal</option>
                                                            <option value="from-amber-500 to-orange-600">Amber to Orange</option>
                                                            <option value="from-red-500 to-pink-600">Red to Pink</option>
                                                            <option value="from-indigo-500 to-blue-600">Indigo to Blue</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Text Gradient</label>
                                                        <select
                                                            {...registerEdit("sections.0.data.textGradient")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        >
                                                            <option value="from-blue-400 to-purple-600">Blue to Purple</option>
                                                            <option value="from-green-400 to-teal-600">Green to Teal</option>
                                                            <option value="from-amber-400 to-orange-600">Amber to Orange</option>
                                                            <option value="from-red-400 to-pink-600">Red to Pink</option>
                                                            <option value="from-indigo-400 to-blue-600">Indigo to Blue</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Button Color</label>
                                                        <select
                                                            {...registerEdit("sections.0.data.primaryButtonColor")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        >
                                                            <option value="bg-blue-600">Blue</option>
                                                            <option value="bg-green-600">Green</option>
                                                            <option value="bg-amber-600">Amber</option>
                                                            <option value="bg-red-600">Red</option>
                                                            <option value="bg-purple-600">Purple</option>
                                                            <option value="bg-indigo-600">Indigo</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hue Shift</label>
                                                        <input
                                                            type="number"
                                                            {...registerEdit("sections.0.data.hueShift")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Overview Section */}
                                        {activeTab === 'overview' && (
                                            <div className="space-y-6 mt-6">
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Overview Section</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.1.data.title")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Alt</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.1.data.imageAlt")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description 1</label>
                                                        <textarea
                                                            {...registerEdit("sections.1.data.description1")}
                                                            rows={3}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description 2</label>
                                                        <textarea
                                                            {...registerEdit("sections.1.data.description2")}
                                                            rows={3}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.1.data.image")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Key Points */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Key Points</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => appendEditKeyPoint({ title: "", description: "" })}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                        >
                                                            <FaPlus className="mr-1" /> Add Key Point
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {editKeyPoints.map((field, index) => (
                                                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <input
                                                                    type="text"
                                                                    {...registerEdit(`sections.1.data.keyPoints.${index}.title`, { required: "Title is required" })}
                                                                    placeholder="Title"
                                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        {...registerEdit(`sections.1.data.keyPoints.${index}.description`, { required: "Description is required" })}
                                                                        placeholder="Description"
                                                                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeEditKeyPoint(index)}
                                                                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Process Section */}
                                        {activeTab === 'process' && (
                                            <div className="space-y-6 mt-6">
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Process Section</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.2.data.title")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.2.data.subtitle")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Process Steps */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Process Steps</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => appendEditProcessStep({ step: "", description: "" })}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                        >
                                                            <FaPlus className="mr-1" /> Add Process Step
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {editProcessSteps.map((field, index) => (
                                                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <input
                                                                    type="text"
                                                                    {...registerEdit(`sections.2.data.steps.${index}.step`, { required: "Step is required" })}
                                                                    placeholder="Step"
                                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        {...registerEdit(`sections.2.data.steps.${index}.description`, { required: "Description is required" })}
                                                                        placeholder="Description"
                                                                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeEditProcessStep(index)}
                                                                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Features Section */}
                                        {activeTab === 'features' && (
                                            <div className="space-y-6 mt-6">
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Features Section</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.3.data.title")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.3.data.subtitle")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Features Items */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Features</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => appendEditFeature({ name: "", description: "", icon: "FaCheck" })}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                        >
                                                            <FaPlus className="mr-1" /> Add Feature
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {editFeatures.map((field, index) => (
                                                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                <select
                                                                    {...registerEdit(`sections.3.data.items.${index}.icon`)}
                                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                >
                                                                    {Object.keys(iconMap).map(iconName => (
                                                                        <option key={iconName} value={iconName}>{iconName}</option>
                                                                    ))}
                                                                </select>
                                                                <input
                                                                    type="text"
                                                                    {...registerEdit(`sections.3.data.items.${index}.name`, { required: "Feature name is required" })}
                                                                    placeholder="Feature name"
                                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        {...registerEdit(`sections.3.data.items.${index}.description`, { required: "Description is required" })}
                                                                        placeholder="Description"
                                                                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeEditFeature(index)}
                                                                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Benefits Section */}
                                        {activeTab === 'benefits' && (
                                            <div className="space-y-6 mt-6">
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Benefits Section</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.4.data.title")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.4.data.subtitle")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Benefits Items */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Benefits</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => appendEditBenefit({ title: "", description: "" })}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                        >
                                                            <FaPlus className="mr-1" /> Add Benefit
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {editBenefits.map((field, index) => (
                                                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <input
                                                                    type="text"
                                                                    {...registerEdit(`sections.4.data.items.${index}.title`, { required: "Title is required" })}
                                                                    placeholder="Title"
                                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        {...registerEdit(`sections.4.data.items.${index}.description`, { required: "Description is required" })}
                                                                        placeholder="Description"
                                                                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeEditBenefit(index)}
                                                                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Testimonials Section */}
                                        {activeTab === 'testimonials' && (
                                            <div className="space-y-6 mt-6">
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Testimonials Section</h3>

                                                {/* Testimonials Items */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Testimonials</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => appendEditTestimonial({ name: "", position: "", text: "" })}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                        >
                                                            <FaPlus className="mr-1" /> Add Testimonial
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {editTestimonials.map((field, index) => (
                                                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                <input
                                                                    type="text"
                                                                    {...registerEdit(`sections.5.data.items.${index}.name`, { required: "Name is required" })}
                                                                    placeholder="Name"
                                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    {...registerEdit(`sections.5.data.items.${index}.position`, { required: "Position is required" })}
                                                                    placeholder="Position"
                                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        {...registerEdit(`sections.5.data.items.${index}.text`, { required: "Text is required" })}
                                                                        placeholder="Testimonial text"
                                                                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeEditTestimonial(index)}
                                                                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* CTA Section */}
                                        {activeTab === 'cta' && (
                                            <div className="space-y-6 mt-6">
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">CTA Section</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.6.data.title")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Button Text</label>
                                                        <input
                                                            type="text"
                                                            {...registerEdit("sections.6.data.buttonText")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                        <textarea
                                                            {...registerEdit("sections.6.data.subtitle")}
                                                            rows={3}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gradient</label>
                                                        <select
                                                            {...registerEdit("sections.6.data.gradient")}
                                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        >
                                                            <option value="from-blue-900 to-purple-900">Blue to Purple</option>
                                                            <option value="from-green-900 to-teal-900">Green to Teal</option>
                                                            <option value="from-amber-900 to-orange-900">Amber to Orange</option>
                                                            <option value="from-red-900 to-pink-900">Red to Pink</option>
                                                            <option value="from-indigo-900 to-blue-900">Indigo to Blue</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <button
                                                type="button"
                                                onClick={() => setEditingService(null)}
                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isEditSubmitting || savingServiceId === service._id}
                                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                            >
                                                <span className="flex items-center">
                                                    {isEditSubmitting || savingServiceId === service._id ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
                                                    {isEditSubmitting || savingServiceId === service._id ? 'Saving...' : 'Save Changes'}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Service Details</h3>
                                                <dl className="space-y-2">
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Name</dt>
                                                        <dd className="text-sm font-medium text-slate-900 dark:text-white">{service.name}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Accent Color</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{service.colors?.accent || "text-blue-400"}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Sections</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{service.sections?.length || 0} sections</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Hero Section</h3>
                                                <dl className="space-y-2">
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Title</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{service.sections[0]?.data?.title}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Icon</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{service.sections[0]?.data?.icon}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Primary Button</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{service.sections[0]?.data?.primaryButtonText}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Content Summary</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-2">
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">Key Points</div>
                                                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            {service.sections[1]?.data?.keyPoints?.length || 0}
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-2">
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">Features</div>
                                                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            {service.sections[3]?.data?.items?.length || 0}
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-2">
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">Benefits</div>
                                                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            {service.sections[4]?.data?.items?.length || 0}
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-2">
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">Testimonials</div>
                                                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            {service.sections[5]?.data?.items?.length || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add New Service Form */}
                        {isAddingNew && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                                            <FaMagic className="mr-2 text-blue-500" />
                                            Add New Service
                                        </h2>
                                        <button
                                            onClick={() => setIsAddingNew(false)}
                                            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleNewSubmit(onNewSubmit)} className="p-6">
                                    {/* Tab Navigation */}
                                    <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                                        <nav className="-mb-px flex space-x-8">
                                            {['hero', 'overview', 'process', 'features', 'benefits', 'testimonials', 'cta'].map((tab) => (
                                                <button
                                                    key={tab}
                                                    type="button"
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                                                        }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Service Name</label>
                                                <input
                                                    type="text"
                                                    {...registerNew("name", { required: "Service name is required" })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                />
                                                {newErrors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{newErrors.name.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Accent Color</label>
                                                <select
                                                    {...registerNew("colors.accent")}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                >
                                                    <option value="text-blue-400">Blue</option>
                                                    <option value="text-green-400">Green</option>
                                                    <option value="text-amber-400">Amber</option>
                                                    <option value="text-red-400">Red</option>
                                                    <option value="text-purple-400">Purple</option>
                                                    <option value="text-indigo-400">Indigo</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hero Section */}
                                    {activeTab === 'hero' && (
                                        <div className="space-y-6 mt-6">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Hero Section</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.0.data.title", { required: "Title is required" })}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                    {newErrors.sections?.[0]?.data?.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{newErrors.sections[0].data.title.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Icon</label>
                                                    <select
                                                        {...registerNew("sections.0.data.icon")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    >
                                                        {Object.keys(iconMap).map(iconName => (
                                                            <option key={iconName} value={iconName}>{iconName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                    <textarea
                                                        {...registerNew("sections.0.data.subtitle", { required: "Subtitle is required" })}
                                                        rows={3}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                    {newErrors.sections?.[0]?.data?.subtitle && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{newErrors.sections[0].data.subtitle.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Button Text</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.0.data.primaryButtonText")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Secondary Button Text</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.0.data.secondaryButtonText")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Icon Gradient</label>
                                                    <select
                                                        {...registerNew("sections.0.data.iconGradient")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    >
                                                        <option value="from-blue-500 to-purple-600">Blue to Purple</option>
                                                        <option value="from-green-500 to-teal-600">Green to Teal</option>
                                                        <option value="from-amber-500 to-orange-600">Amber to Orange</option>
                                                        <option value="from-red-500 to-pink-600">Red to Pink</option>
                                                        <option value="from-indigo-500 to-blue-600">Indigo to Blue</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Text Gradient</label>
                                                    <select
                                                        {...registerNew("sections.0.data.textGradient")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    >
                                                        <option value="from-blue-400 to-purple-600">Blue to Purple</option>
                                                        <option value="from-green-400 to-teal-600">Green to Teal</option>
                                                        <option value="from-amber-400 to-orange-600">Amber to Orange</option>
                                                        <option value="from-red-400 to-pink-600">Red to Pink</option>
                                                        <option value="from-indigo-400 to-blue-600">Indigo to Blue</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Button Color</label>
                                                    <select
                                                        {...registerNew("sections.0.data.primaryButtonColor")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    >
                                                        <option value="bg-blue-600">Blue</option>
                                                        <option value="bg-green-600">Green</option>
                                                        <option value="bg-amber-600">Amber</option>
                                                        <option value="bg-red-600">Red</option>
                                                        <option value="bg-purple-600">Purple</option>
                                                        <option value="bg-indigo-600">Indigo</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hue Shift</label>
                                                    <input
                                                        type="number"
                                                        {...registerNew("sections.0.data.hueShift")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Overview Section */}
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6 mt-6">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Overview Section</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.1.data.title")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Alt</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.1.data.imageAlt")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description 1</label>
                                                    <textarea
                                                        {...registerNew("sections.1.data.description1")}
                                                        rows={3}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description 2</label>
                                                    <textarea
                                                        {...registerNew("sections.1.data.description2")}
                                                        rows={3}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.1.data.image")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Key Points */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Key Points</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => appendNewKeyPoint({ title: "", description: "" })}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                    >
                                                        <FaPlus className="mr-1" /> Add Key Point
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {newKeyPoints.map((field, index) => (
                                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <input
                                                                type="text"
                                                                {...registerNew(`sections.1.data.keyPoints.${index}.title`, { required: "Title is required" })}
                                                                placeholder="Title"
                                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    {...registerNew(`sections.1.data.keyPoints.${index}.description`, { required: "Description is required" })}
                                                                    placeholder="Description"
                                                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewKeyPoint(index)}
                                                                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {newKeyPoints.length === 0 && (
                                                        <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                                            <div className="text-center">
                                                                <FaInfoCircle className="mx-auto h-12 w-12 text-slate-400" />
                                                                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">No key points added yet</h3>
                                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click "Add Key Point" to add one.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Process Section */}
                                    {activeTab === 'process' && (
                                        <div className="space-y-6 mt-6">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Process Section</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.2.data.title")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.2.data.subtitle")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Process Steps */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Process Steps</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => appendNewProcessStep({ step: "", description: "" })}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                    >
                                                        <FaPlus className="mr-1" /> Add Process Step
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {newProcessSteps.map((field, index) => (
                                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <input
                                                                type="text"
                                                                {...registerNew(`sections.2.data.steps.${index}.step`, { required: "Step is required" })}
                                                                placeholder="Step"
                                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    {...registerNew(`sections.2.data.steps.${index}.description`, { required: "Description is required" })}
                                                                    placeholder="Description"
                                                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewProcessStep(index)}
                                                                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {newProcessSteps.length === 0 && (
                                                        <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                                            <div className="text-center">
                                                                <FaInfoCircle className="mx-auto h-12 w-12 text-slate-400" />
                                                                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">No process steps added yet</h3>
                                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click "Add Process Step" to add one.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Features Section */}
                                    {activeTab === 'features' && (
                                        <div className="space-y-6 mt-6">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Features Section</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.3.data.title")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.3.data.subtitle")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Features Items */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Features</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => appendNewFeature({ name: "", description: "", icon: "FaCheck" })}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                    >
                                                        <FaPlus className="mr-1" /> Add Feature
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {newFeatures.map((field, index) => (
                                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <select
                                                                {...registerNew(`sections.3.data.items.${index}.icon`)}
                                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                            >
                                                                {Object.keys(iconMap).map(iconName => (
                                                                    <option key={iconName} value={iconName}>{iconName}</option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                type="text"
                                                                {...registerNew(`sections.3.data.items.${index}.name`, { required: "Feature name is required" })}
                                                                placeholder="Feature name"
                                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    {...registerNew(`sections.3.data.items.${index}.description`, { required: "Description is required" })}
                                                                    placeholder="Description"
                                                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewFeature(index)}
                                                                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {newFeatures.length === 0 && (
                                                        <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                                            <div className="text-center">
                                                                <FaInfoCircle className="mx-auto h-12 w-12 text-slate-400" />
                                                                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">No features added yet</h3>
                                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click "Add Feature" to add one.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Benefits Section */}
                                    {activeTab === 'benefits' && (
                                        <div className="space-y-6 mt-6">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Benefits Section</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.4.data.title")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.4.data.subtitle")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Benefits Items */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Benefits</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => appendNewBenefit({ title: "", description: "" })}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                    >
                                                        <FaPlus className="mr-1" /> Add Benefit
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {newBenefits.map((field, index) => (
                                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <input
                                                                type="text"
                                                                {...registerNew(`sections.4.data.items.${index}.title`, { required: "Title is required" })}
                                                                placeholder="Title"
                                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    {...registerNew(`sections.4.data.items.${index}.description`, { required: "Description is required" })}
                                                                    placeholder="Description"
                                                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewBenefit(index)}
                                                                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {newBenefits.length === 0 && (
                                                        <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                                            <div className="text-center">
                                                                <FaInfoCircle className="mx-auto h-12 w-12 text-slate-400" />
                                                                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">No benefits added yet</h3>
                                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click "Add Benefit" to add one.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Testimonials Section */}
                                    {activeTab === 'testimonials' && (
                                        <div className="space-y-6 mt-6">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Testimonials Section</h3>

                                            {/* Testimonials Items */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Testimonials</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => appendNewTestimonial({ name: "", position: "", text: "" })}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                    >
                                                        <FaPlus className="mr-1" /> Add Testimonial
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {newTestimonials.map((field, index) => (
                                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <input
                                                                type="text"
                                                                {...registerNew(`sections.5.data.items.${index}.name`, { required: "Name is required" })}
                                                                placeholder="Name"
                                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                            />
                                                            <input
                                                                type="text"
                                                                {...registerNew(`sections.5.data.items.${index}.position`, { required: "Position is required" })}
                                                                placeholder="Position"
                                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    {...registerNew(`sections.5.data.items.${index}.text`, { required: "Text is required" })}
                                                                    placeholder="Testimonial text"
                                                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewTestimonial(index)}
                                                                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {newTestimonials.length === 0 && (
                                                        <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                                                            <div className="text-center">
                                                                <FaInfoCircle className="mx-auto h-12 w-12 text-slate-400" />
                                                                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">No testimonials added yet</h3>
                                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click "Add Testimonial" to add one.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA Section */}
                                    {activeTab === 'cta' && (
                                        <div className="space-y-6 mt-6">
                                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">CTA Section</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.6.data.title")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Button Text</label>
                                                    <input
                                                        type="text"
                                                        {...registerNew("sections.6.data.buttonText")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                    <textarea
                                                        {...registerNew("sections.6.data.subtitle")}
                                                        rows={3}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gradient</label>
                                                    <select
                                                        {...registerNew("sections.6.data.gradient")}
                                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    >
                                                        <option value="from-blue-900 to-purple-900">Blue to Purple</option>
                                                        <option value="from-green-900 to-teal-900">Green to Teal</option>
                                                        <option value="from-amber-900 to-orange-900">Amber to Orange</option>
                                                        <option value="from-red-900 to-pink-900">Red to Pink</option>
                                                        <option value="from-indigo-900 to-blue-900">Indigo to Blue</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingNew(false)}
                                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isNewSubmitting}
                                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                        >
                                            <span className="flex items-center">
                                                {isNewSubmitting ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
                                                {isNewSubmitting ? 'Creating...' : 'Create Service'}
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}