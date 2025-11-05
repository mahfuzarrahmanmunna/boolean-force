// app/admin/pricing/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSave,
    FaTimes,
    FaArrowUp,
    FaArrowDown,
    FaCheck,
    FaCode,
    FaRocket,
    FaShieldAlt,
    FaUsers,
    FaBolt,
    FaClock,
    FaStar,
    FaInfinity,
    FaHeadset,
    FaDatabase,
    FaCloud,
    FaGitAlt,
    FaReact,
    FaNodeJs,
    FaArrowRight,
    FaEye,
    FaEyeSlash,
    FaGripVertical,
    FaInfoCircle,
    FaSpinner,
    FaExclamationTriangle,
    FaCheckCircle,
    FaCopy,
    FaLock,
    FaUnlock,
    FaMagic,
    FaChartLine,
    FaCrown
} from 'react-icons/fa';

// Icon mapping with additional professional icons
const iconMap = {
    FaCheck, FaCode, FaRocket, FaShieldAlt, FaUsers, FaBolt, FaClock, FaStar,
    FaInfinity, FaHeadset, FaDatabase, FaCloud, FaGitAlt, FaReact, FaNodeJs,
    FaLock, FaUnlock, FaMagic, FaChartLine, FaCrown
};

// Helper function to render icon
const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : <FaCheck />;
};

// Main component
export default function PricingAdmin() {
    const [pricingData, setPricingData] = useState([]);
    const [editingPlan, setEditingPlan] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [savingPlanId, setSavingPlanId] = useState(null);
    const [deletingPlanId, setDeletingPlanId] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [refreshing, setRefreshing] = useState(false);

    // Form for editing existing plans
    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
        control: editControl,
        formState: { errors: editErrors, isSubmitting: isEditSubmitting },
        setValue: setEditValue
    } = useForm();

    // Form for adding new plans
    const {
        register: registerNew,
        handleSubmit: handleNewSubmit,
        reset: resetNew,
        control: newControl,
        formState: { errors: newErrors, isSubmitting: isNewSubmitting }
    } = useForm({
        defaultValues: {
            name: "",
            subtitle: "",
            price: "",
            priceUnit: "",
            originalPrice: "",
            description: "",
            badge: { text: "", color: "from-gray-600 to-gray-800" },
            features: [],
            buttonText: "",
            buttonColor: "from-gray-600 to-gray-800",
            gradient: "from-gray-800/30 to-gray-900/30",
            highlight: false
        }
    });

    // Field arrays for features
    const {
        fields: editFields,
        append: appendEditFeature,
        remove: removeEditFeature
    } = useFieldArray({
        control: editControl,
        name: "features"
    });

    const {
        fields: newFields,
        append: appendNewFeature,
        remove: removeNewFeature
    } = useFieldArray({
        control: newControl,
        name: "features"
    });

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Fetch pricing data from API
    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                const response = await fetch('/api/pricing-plans');
                if (!response.ok) {
                    throw new Error('Failed to fetch pricing plans');
                }
                const data = await response.json();
                setPricingData(data);
                console.log("Fetched pricing plans:", data);
            } catch (error) {
                console.error("Error fetching pricing plans:", error);
                showNotification('Failed to load pricing plans. Please try again.', 'error');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchPricingData();
    }, []);

    // Log data to console whenever it changes
    useEffect(() => {
        console.log("Current Pricing Data:", pricingData);
    }, [pricingData]);

    // Handle form submission for editing with improved error handling
    const onEditSubmit = async (data) => {
        setIsLoading(true);
        setSavingPlanId(editingPlan);
        console.log("Submitting edit form data:", data);
        console.log("Editing plan ID:", editingPlan);
        console.log("Editing plan ID type:", typeof editingPlan);

        try {
            // Validate required fields
            if (!data.name || !data.price || !data.description) {
                throw new Error('Please fill in all required fields');
            }

            const requestBody = JSON.stringify(data);

            console.log("Request body:", requestBody);
            console.log("Request URL:", `/api/pricing-plans/${editingPlan}`);

            const response = await fetch(`/api/pricing-plans/${editingPlan}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            const responseData = await response.json();
            console.log("API Response:", responseData);

            if (!response.ok) {
                // Provide more specific error messages
                if (response.status === 404) {
                    throw new Error(`Pricing plan with ID ${editingPlan} not found. Please refresh the page and try again.`);
                } else {
                    throw new Error(responseData.error || 'Failed to update pricing plan');
                }
            }

            // Update the local state with the updated plan from the API response
            if (responseData.data) {
                const updatedData = pricingData.map(plan =>
                    plan._id === editingPlan ? responseData.data : plan
                );
                setPricingData(updatedData);
            } else {
                // Fallback to updating with the form data if API doesn't return the updated document
                const updatedData = pricingData.map(plan =>
                    plan._id === editingPlan ? { ...plan, ...data } : plan
                );
                setPricingData(updatedData);
            }

            setEditingPlan(null);
            resetEdit();
            showNotification('Pricing plan updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating pricing plan:", error);
            showNotification(error.message || 'Failed to update pricing plan. Please try again.', 'error');
        } finally {
            setIsLoading(false);
            setSavingPlanId(null);
        }
    };


    // Handle form submission for adding new plan with improved error handling
    const onNewSubmit = async (data) => {
        setIsLoading(true);
        console.log("Submitting new plan data:", data);

        try {
            // Validate required fields
            if (!data.name || !data.price || !data.description) {
                throw new Error('Please fill in all required fields');
            }

            const response = await fetch('/api/pricing-plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create pricing plan');
            }

            const result = await response.json();
            console.log("Create response:", result);

            // Update the local state with the new plan from the API response
            if (result.data) {
                setPricingData([...pricingData, result.data]);
            } else {
                // Fallback to fetching the updated list if API doesn't return the new document
                const fetchResponse = await fetch('/api/pricing-plans');
                if (fetchResponse.ok) {
                    const updatedData = await fetchResponse.json();
                    setPricingData(updatedData);
                }
            }

            setIsAddingNew(false);
            resetNew();
            showNotification('New plan added successfully!', 'success');
        } catch (error) {
            console.error("Error creating pricing plan:", error);
            showNotification(error.message || 'Failed to create pricing plan. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle plan delete with improved error handling
    const handleDeletePlan = async (planId) => {
        if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
            console.log("Deleting plan with ID:", planId);
            setDeletingPlanId(planId);

            try {
                const response = await fetch(`/api/pricing-plans/${planId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete pricing plan');
                }

                const result = await response.json();
                console.log("Delete response:", result);

                // Update the local state by removing the deleted plan
                const updatedData = pricingData.filter(plan => plan._id !== planId);
                setPricingData(updatedData);
                showNotification('Plan deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting pricing plan:", error);
                showNotification(error.message || 'Failed to delete pricing plan. Please try again.', 'error');
            } finally {
                setDeletingPlanId(null);
            }
        }
    };

    // Handle duplicate plan
    const handleDuplicatePlan = async (plan) => {
        try {
            const duplicatedPlan = {
                ...plan,
                name: `${plan.name} (Copy)`,
                _id: undefined // Remove ID to create a new plan
            };

            const response = await fetch('/api/pricing-plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(duplicatedPlan),
            });

            if (!response.ok) {
                throw new Error('Failed to duplicate pricing plan');
            }

            // Fetch the updated list of pricing plans
            const fetchResponse = await fetch('/api/pricing-plans');
            if (fetchResponse.ok) {
                const updatedData = await fetchResponse.json();
                setPricingData(updatedData);
            }

            showNotification('Plan duplicated successfully!', 'success');
        } catch (error) {
            console.error("Error duplicating pricing plan:", error);
            showNotification('Failed to duplicate pricing plan. Please try again.', 'error');
        }
    };

    // Reorder plans with improved functionality
    const movePlan = async (index, direction) => {
        const newPricingData = [...pricingData];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newPricingData.length) {
            [newPricingData[index], newPricingData[targetIndex]] = [newPricingData[targetIndex], newPricingData[index]];

            try {
                // Update order in database
                const planIds = newPricingData.map(plan => plan._id);
                await fetch('/api/pricing-plans/reorder', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ planIds }),
                });

                setPricingData(newPricingData);
                console.log("Reordered plans:", newPricingData);
                showNotification('Plans reordered successfully!', 'success');
            } catch (error) {
                console.error("Error reordering plans:", error);
                showNotification('Failed to reorder plans. Please try again.', 'error');
                // Revert to original order if API call fails
                setPricingData(pricingData);
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

        const newPricingData = [...pricingData];
        const draggedItem = newPricingData[draggedIndex];

        // Remove the dragged item
        newPricingData.splice(draggedIndex, 1);

        // Add it at the new position
        newPricingData.splice(index, 0, draggedItem);

        try {
            // Update order in database
            const planIds = newPricingData.map(plan => plan._id);
            await fetch('/api/pricing-plans/reorder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planIds }),
            });

            setPricingData(newPricingData);
            setDraggedIndex(null);
            console.log("Reordered plans via drag and drop:", newPricingData);
            showNotification('Plans reordered successfully!', 'success');
        } catch (error) {
            console.error("Error reordering plans:", error);
            showNotification('Failed to reorder plans. Please try again.', 'error');
            // Revert to original order if API call fails
            setPricingData(pricingData);
            setDraggedIndex(null);
        }
    };

    // Handle edit plan with improved functionality
    const handleEditPlan = (plan) => {
        console.log("Editing plan:", plan);
        console.log("Plan ID:", plan._id);
        console.log("Plan ID type:", typeof plan._id);

        // Ensure ID is a string
        const planId = typeof plan._id === 'object' ? plan._id.toString() : plan._id;
        console.log("Normalized plan ID:", planId);

        setEditingPlan(planId);
        // Set the form values with the current plan data
        resetEdit({
            name: plan.name,
            subtitle: plan.subtitle,
            price: plan.price,
            priceUnit: plan.priceUnit,
            originalPrice: plan.originalPrice,
            description: plan.description,
            badge: plan.badge || { text: "", color: "from-gray-600 to-gray-800" },
            features: plan.features || [],
            buttonText: plan.buttonText,
            buttonColor: plan.buttonColor || "from-gray-600 to-gray-800",
            gradient: plan.gradient || "from-gray-800/30 to-gray-900/30",
            highlight: plan.highlight || false
        });
    };

    const refreshData = async () => {
        setRefreshing(true);
        try {
            const response = await fetch('/api/pricing-plans');
            if (!response.ok) {
                throw new Error('Failed to fetch pricing plans');
            }
            const data = await response.json();
            setPricingData(data);
            showNotification('Data refreshed successfully!', 'success');
        } catch (error) {
            console.error("Error refreshing pricing plans:", error);
            showNotification('Failed to refresh data. Please try again.', 'error');
        } finally {
            setRefreshing(false);
        }
    };

    if (isInitialLoading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">Loading pricing plans...</p>
            </div>
        </div>
    );

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
                                    <FaChartLine className="mr-3 text-blue-500" />
                                    Pricing Plans Management
                                </h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Manage and customize your pricing plans with ease</p>
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
                                    Add New Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {previewMode ? (
                    // Preview Mode - Display the pricing cards as they would appear on the frontend
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-xl">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                                Developer-Focused Solutions
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                                Build, scale, and deploy with confidence. Our plans are designed for developers who value quality, performance, and clean code.
                            </p>
                        </div>

                        <button
                            onClick={refreshData}
                            disabled={refreshing}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 disabled:opacity-50"
                        >
                            {refreshing ? <FaSpinner className="mr-2 animate-spin" /> : <FaCheckCircle className="mr-2" />}
                            Refresh
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                            {pricingData.map((plan) => {
                                return (
                                    <div
                                        key={plan._id}
                                        className={`relative group ${plan.highlight ? 'md:col-span-1 md:row-span-1' : ''}`}
                                    >
                                        {/* Card Container with different sizes */}
                                        <div
                                            className={`relative bg-gradient-to-br ${plan.gradient} backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 
                            hover:shadow-2xl border border-slate-700/50 h-full
                            ${plan.highlight ? 'md:scale-105 md:shadow-2xl border-cyan-500/50 z-10' : 'hover:scale-[1.02]'}`}
                                        >
                                            {/* Badge */}
                                            {plan.badge && plan.badge.text && (
                                                <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.badge.color} text-white px-4 py-2 rounded-bl-lg text-sm font-semibold z-10`}>
                                                    {plan.badge.text}
                                                </div>
                                            )}

                                            {/* Card Content */}
                                            <div className={`p-6 md:p-8 flex flex-col h-full ${plan.highlight ? 'md:p-10' : ''}`}>
                                                <div className="mb-6">
                                                    <h3 className={`text-xl md:text-2xl font-bold text-white mb-1 ${plan.highlight ? 'md:text-3xl' : ''}`}>{plan.name}</h3>
                                                    <p className="text-slate-400 text-sm">{plan.subtitle}</p>
                                                </div>

                                                <div className="mb-6 flex items-baseline gap-2">
                                                    {plan.originalPrice && <span className="text-slate-500 line-through text-lg">{plan.originalPrice}</span>}
                                                    <span className={`text-4xl md:text-5xl font-bold text-white ${plan.highlight ? 'md:text-6xl' : ''}`}>{plan.price}</span>
                                                    {plan.priceUnit && <span className="text-slate-300">{plan.priceUnit}</span>}
                                                </div>

                                                <p className="text-slate-300 mb-8">{plan.description}</p>

                                                <div className={`border-t border-slate-700/50 pt-6 mb-8 flex-grow ${plan.highlight ? 'md:pt-8' : ''}`}>
                                                    <ul className="space-y-3">
                                                        {plan.features && plan.features.map((feature, i) => (
                                                            <li key={i} className="flex items-start gap-3">
                                                                <span className={`text-cyan-400 mt-1 ${plan.highlight ? 'text-lg' : ''}`}>
                                                                    {renderIcon(feature.icon)}
                                                                </span>
                                                                <span className="text-slate-200">{feature.text}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <button
                                                    className={`w-full bg-gradient-to-r ${plan.buttonColor} hover:from-opacity-90 hover:to-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg group
                              ${plan.highlight ? 'md:py-4 md:px-6 md:text-lg' : ''}`}
                                                >
                                                    <span className="flex items-center justify-center">
                                                        {plan.buttonText}
                                                        <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <div className="space-y-6">
                        {pricingData.map((plan, index) => (
                            <div key={plan._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-xl">
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
                                                    {plan.name}
                                                    {plan.highlight && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                                            <FaCrown className="mr-1" />
                                                            FEATURED
                                                        </span>
                                                    )}
                                                </h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{plan.subtitle}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => movePlan(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Move Up"
                                            >
                                                <FaArrowUp />
                                            </button>
                                            <button
                                                onClick={() => movePlan(index, 'down')}
                                                disabled={index === pricingData.length - 1}
                                                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Move Down"
                                            >
                                                <FaArrowDown />
                                            </button>
                                            <button
                                                onClick={() => handleDuplicatePlan(plan)}
                                                className="p-2 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                title="Duplicate"
                                            >
                                                <FaCopy />
                                            </button>
                                            <button
                                                onClick={() => handleEditPlan(plan)}
                                                className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePlan(plan._id)}
                                                disabled={deletingPlanId === plan._id}
                                                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deletingPlanId === plan._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {editingPlan === plan._id ? (
                                    <form onSubmit={handleEditSubmit(onEditSubmit)} className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Plan Name</label>
                                                <input
                                                    type="text"
                                                    {...registerEdit("name", { required: "Plan name is required" })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                />
                                                {editErrors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.name.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                                <input
                                                    type="text"
                                                    {...registerEdit("subtitle", { required: "Subtitle is required" })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                />
                                                {editErrors.subtitle && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.subtitle.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price</label>
                                                <input
                                                    type="text"
                                                    {...registerEdit("price", { required: "Price is required" })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                />
                                                {editErrors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.price.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price Unit</label>
                                                <input
                                                    type="text"
                                                    {...registerEdit("priceUnit")}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Original Price</label>
                                                <input
                                                    type="text"
                                                    {...registerEdit("originalPrice")}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Button Text</label>
                                                <input
                                                    type="text"
                                                    {...registerEdit("buttonText", { required: "Button text is required" })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                />
                                                {editErrors.buttonText && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.buttonText.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Badge Text</label>
                                                <input
                                                    type="text"
                                                    {...registerEdit("badge.text")}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Badge Color</label>
                                                <select
                                                    {...registerEdit("badge.color")}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                >
                                                    <option value="from-gray-600 to-gray-800">Gray</option>
                                                    <option value="from-cyan-600 to-blue-600">Cyan to Blue</option>
                                                    <option value="from-purple-600 to-pink-600">Purple to Pink</option>
                                                    <option value="from-green-600 to-teal-600">Green to Teal</option>
                                                    <option value="from-amber-400 to-orange-500">Amber to Orange</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Button Color</label>
                                                <select
                                                    {...registerEdit("buttonColor")}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                >
                                                    <option value="from-gray-600 to-gray-800">Gray</option>
                                                    <option value="from-cyan-600 to-blue-600">Cyan to Blue</option>
                                                    <option value="from-purple-600 to-pink-600">Purple to Pink</option>
                                                    <option value="from-green-600 to-teal-600">Green to Teal</option>
                                                    <option value="from-amber-400 to-orange-500">Amber to Orange</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gradient</label>
                                                <select
                                                    {...registerEdit("gradient")}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                >
                                                    <option value="from-gray-800/30 to-gray-900/30">Gray</option>
                                                    <option value="from-cyan-900/30 to-blue-900/30">Cyan to Blue</option>
                                                    <option value="from-purple-900/30 to-pink-900/30">Purple to Pink</option>
                                                    <option value="from-green-900/30 to-teal-900/30">Green to Teal</option>
                                                    <option value="from-amber-900/30 to-orange-900/30">Amber to Orange</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`highlight-${plan._id}`}
                                                    {...registerEdit("highlight")}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                                />
                                                <label htmlFor={`highlight-${plan._id}`} className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                                                    Featured Plan
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                            <textarea
                                                {...registerEdit("description", { required: "Description is required" })}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            />
                                            {editErrors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.description.message}</p>}
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Features</label>
                                                <button
                                                    type="button"
                                                    onClick={() => appendEditFeature({ text: "", icon: "FaCheck" })}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                >
                                                    <FaPlus className="mr-1" /> Add Feature
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {editFields.map((field, index) => (
                                                    <div key={field.id} className="flex gap-3">
                                                        <select
                                                            {...registerEdit(`features.${index}.icon`)}
                                                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                        >
                                                            {Object.keys(iconMap).map(iconName => (
                                                                <option key={iconName} value={iconName}>{iconName}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="text"
                                                            {...registerEdit(`features.${index}.text`, { required: "Feature text is required" })}
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
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <button
                                                type="button"
                                                onClick={() => setEditingPlan(null)}
                                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isEditSubmitting || savingPlanId === plan._id}
                                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                            >
                                                <span className="flex items-center">
                                                    {isEditSubmitting || savingPlanId === plan._id ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
                                                    {isEditSubmitting || savingPlanId === plan._id ? 'Saving...' : 'Save Changes'}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Plan Details</h3>
                                                <dl className="space-y-2">
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Name</dt>
                                                        <dd className="text-sm font-medium text-slate-900 dark:text-white">{plan.name}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Subtitle</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{plan.subtitle}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Price</dt>
                                                        <dd className="text-sm font-medium text-slate-900 dark:text-white">{plan.price} {plan.priceUnit}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Original Price</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{plan.originalPrice || 'N/A'}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Appearance</h3>
                                                <dl className="space-y-2">
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Badge</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{plan.badge && plan.badge.text ? plan.badge.text : 'None'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Button Text</dt>
                                                        <dd className="text-sm text-slate-700 dark:text-slate-300">{plan.buttonText}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs text-slate-500 dark:text-slate-400">Featured</dt>
                                                        <dd className="text-sm">
                                                            {plan.highlight ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                                                    <FaCrown className="mr-1" />
                                                                    Yes
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                                                    No
                                                                </span>
                                                            )}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Description</h3>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{plan.description}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Features</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {plan.features && plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                                                        <span className="text-blue-500 mr-2">
                                                            {renderIcon(feature.icon)}
                                                        </span>
                                                        {feature.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add New Plan Form */}
                        {isAddingNew && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                                            <FaMagic className="mr-2 text-blue-500" />
                                            Add New Plan
                                        </h2>
                                        <button
                                            onClick={() => setIsAddingNew(false)}
                                            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleNewSubmit(onNewSubmit)} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Plan Name</label>
                                            <input
                                                type="text"
                                                {...registerNew("name", { required: "Plan name is required" })}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            />
                                            {newErrors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{newErrors.name.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                                            <input
                                                type="text"
                                                {...registerNew("subtitle", { required: "Subtitle is required" })}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            />
                                            {newErrors.subtitle && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{newErrors.subtitle.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price</label>
                                            <input
                                                type="text"
                                                {...registerNew("price", { required: "Price is required" })}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            />
                                            {newErrors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{newErrors.price.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price Unit</label>
                                            <input
                                                type="text"
                                                {...registerNew("priceUnit")}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Original Price</label>
                                            <input
                                                type="text"
                                                {...registerNew("originalPrice")}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Button Text</label>
                                            <input
                                                type="text"
                                                {...registerNew("buttonText", { required: "Button text is required" })}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            />
                                            {newErrors.buttonText && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{newErrors.buttonText.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Badge Text</label>
                                            <input
                                                type="text"
                                                {...registerNew("badge.text")}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Badge Color</label>
                                            <select
                                                {...registerNew("badge.color")}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            >
                                                <option value="from-gray-600 to-gray-800">Gray</option>
                                                <option value="from-cyan-600 to-blue-600">Cyan to Blue</option>
                                                <option value="from-purple-600 to-pink-600">Purple to Pink</option>
                                                <option value="from-green-600 to-teal-600">Green to Teal</option>
                                                <option value="from-amber-400 to-orange-500">Amber to Orange</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Button Color</label>
                                            <select
                                                {...registerNew("buttonColor")}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            >
                                                <option value="from-gray-600 to-gray-800">Gray</option>
                                                <option value="from-cyan-600 to-blue-600">Cyan to Blue</option>
                                                <option value="from-purple-600 to-pink-600">Purple to Pink</option>
                                                <option value="from-green-600 to-teal-600">Green to Teal</option>
                                                <option value="from-amber-400 to-orange-500">Amber to Orange</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gradient</label>
                                            <select
                                                {...registerNew("gradient")}
                                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                            >
                                                <option value="from-gray-800/30 to-gray-900/30">Gray</option>
                                                <option value="from-cyan-900/30 to-blue-900/30">Cyan to Blue</option>
                                                <option value="from-purple-900/30 to-pink-900/30">Purple to Pink</option>
                                                <option value="from-green-900/30 to-teal-900/30">Green to Teal</option>
                                                <option value="from-amber-900/30 to-orange-900/30">Amber to Orange</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="new-highlight"
                                                {...registerNew("highlight")}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                            />
                                            <label htmlFor="new-highlight" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                                                Featured Plan
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                        <textarea
                                            {...registerNew("description", { required: "Description is required" })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                        />
                                        {newErrors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{newErrors.description.message}</p>}
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Features</label>
                                            <button
                                                type="button"
                                                onClick={() => appendNewFeature({ text: "", icon: "FaCheck" })}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                            >
                                                <FaPlus className="mr-1" /> Add Feature
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {newFields.map((field, index) => (
                                                <div key={field.id} className="flex gap-3">
                                                    <select
                                                        {...registerNew(`features.${index}.icon`)}
                                                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                                                    >
                                                        {Object.keys(iconMap).map(iconName => (
                                                            <option key={iconName} value={iconName}>{iconName}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        {...registerNew(`features.${index}.text`, { required: "Feature text is required" })}
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
                                            ))}
                                            {newFields.length === 0 && (
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
                                                {isNewSubmitting ? 'Creating...' : 'Create Plan'}
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