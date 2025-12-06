// src/app/dashboard/manage-profile/page.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Briefcase,
    Upload,
    Facebook,
    Linkedin,
    MessageCircle,
    Save,
    Camera,
    X,
    Check,
    AlertCircle,
    Edit3
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ManageProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const fileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        whatsapp: '',
        address: '',
        city: '',
        country: '',
        birthdate: '',
        jobTitle: '',
        department: '',
        experience: '',
        education: '',
        skills: '',
        facebook: '',
        linkedin: '',
        portfolio: '',
        emergencyContact: '',
        emergencyPhone: ''
    });

    // UI state
    const [profileImage, setProfileImage] = useState('/placeholder-profile.jpg');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (status === 'loading') return;

            if (!session) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/api/users');

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const users = await response.json();
                console.log("All users:", users);

                // Find the current user from the list
                const currentUser = users.find(user => user.email === session.user.email);

                if (!currentUser) {
                    throw new Error('User not found in the system');
                }

                console.log("Current user:", currentUser);

                // Update form with fetched data
                setFormData({
                    name: currentUser.name || session.user.name || '',
                    email: currentUser.email || session.user.email || '',
                    bio: currentUser.bio || '',
                    phone: currentUser.phone || '',
                    whatsapp: currentUser.whatsapp || '',
                    address: currentUser.address || '',
                    city: currentUser.city || '',
                    country: currentUser.country || '',
                    birthdate: currentUser.birthdate ? new Date(currentUser.birthdate).toISOString().split('T')[0] : '',
                    jobTitle: currentUser.jobTitle || '',
                    department: currentUser.department || '',
                    experience: currentUser.experience || '',
                    education: currentUser.education || '',
                    skills: currentUser.skills ? (Array.isArray(currentUser.skills) ? currentUser.skills.join(', ') : currentUser.skills) : '',
                    facebook: currentUser.facebook || '',
                    linkedin: currentUser.linkedin || '',
                    portfolio: currentUser.portfolio || '',
                    emergencyContact: currentUser.emergencyContact || '',
                    emergencyPhone: currentUser.emergencyPhone || ''
                });

                // Set profile image
                if (currentUser.profileImage) {
                    setProfileImage(currentUser.profileImage);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [session, status, router]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Handle profile image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await fetch('/api/users/upload-image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            setProfileImage(data.imageUrl);
            toast.success('Profile image updated successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload profile image');
        } finally {
            setIsUploading(false);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (formData.facebook && !/^https?:\/\/(www\.)?facebook\.com\/.+/i.test(formData.facebook)) {
            newErrors.facebook = 'Please enter a valid Facebook URL';
        }

        if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(formData.linkedin)) {
            newErrors.linkedin = 'Please enter a valid LinkedIn URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix errors in form');
            return;
        }

        setIsSaving(true);

        try {
            // Convert skills string to array
            const skillsArray = formData.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);

            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    skills: skillsArray
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                disabled={isUploading}
                                className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                title="Change profile picture"
                            >
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                                ) : (
                                    <Camera className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
                            <p className="text-blue-100">{formData.jobTitle || 'Employee'}</p>
                            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                                {formData.city && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {formData.city}, {formData.country}
                                    </span>
                                )}
                                {formData.department && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                                        <Briefcase className="w-3 h-3 mr-1" />
                                        {formData.department}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-4 py-2 flex items-center transition-colors"
                        >
                            {isEditing ? (
                                <>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6 md:p-8">
                    {/* Tabs */}
                    <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'personal'
                                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Personal Information
                        </button>
                        <button
                            onClick={() => setActiveTab('professional')}
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'professional'
                                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Professional Details
                        </button>
                        <button
                            onClick={() => setActiveTab('social')}
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'social'
                                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Social & Contact
                        </button>
                        <button
                            onClick={() => setActiveTab('emergency')}
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'emergency'
                                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Emergency Contact
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Personal Information Tab */}
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            id="birthdate"
                                            name="birthdate"
                                            value={formData.birthdate}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.birthdate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.birthdate && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.birthdate}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.country && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.country}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                    />
                                    {errors.bio && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Professional Details Tab */}
                        {activeTab === 'professional' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            id="jobTitle"
                                            name="jobTitle"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.jobTitle ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.jobTitle && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.jobTitle}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            id="department"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.department && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.department}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="text"
                                            id="experience"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.experience ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.experience && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.experience}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Education
                                        </label>
                                        <input
                                            type="text"
                                            id="education"
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.education ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.education && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.education}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Skills (comma-separated)
                                    </label>
                                    <textarea
                                        id="skills"
                                        name="skills"
                                        rows={3}
                                        value={formData.skills}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="e.g. JavaScript, React, Node.js, MongoDB"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.skills ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                    />
                                    {errors.skills && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.skills}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Portfolio Website
                                    </label>
                                    <input
                                        type="url"
                                        id="portfolio"
                                        name="portfolio"
                                        value={formData.portfolio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="https://yourportfolio.com"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.portfolio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                    />
                                    {errors.portfolio && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.portfolio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Social & Contact Tab */}
                        {activeTab === 'social' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            WhatsApp Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MessageCircle className="h-5 w-5 text-green-500" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="whatsapp"
                                                name="whatsapp"
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="+1234567890"
                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.whatsapp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                            />
                                        </div>
                                        {errors.whatsapp && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.whatsapp}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Facebook Profile
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Facebook className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <input
                                                type="url"
                                                id="facebook"
                                                name="facebook"
                                                value={formData.facebook}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="https://facebook.com/yourprofile"
                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.facebook ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                            />
                                        </div>
                                        {errors.facebook && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.facebook}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            LinkedIn Profile
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Linkedin className="h-5 w-5 text-blue-700" />
                                            </div>
                                            <input
                                                type="url"
                                                id="linkedin"
                                                name="linkedin"
                                                value={formData.linkedin}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="https://linkedin.com/in/yourprofile"
                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.linkedin ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                            />
                                        </div>
                                        {errors.linkedin && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.linkedin}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Emergency Contact Tab */}
                        {activeTab === 'emergency' && (
                            <div className="space-y-6">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                Emergency Contact Information
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                <p>
                                                    This information will be used only in case of an emergency. Please provide contact details of a person we can reach out to if needed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Emergency Contact Name
                                        </label>
                                        <input
                                            type="text"
                                            id="emergencyContact"
                                            name="emergencyContact"
                                            value={formData.emergencyContact}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.emergencyContact && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.emergencyContact}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Emergency Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="emergencyPhone"
                                            name="emergencyPhone"
                                            value={formData.emergencyPhone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } ${!isEditing ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-slate-700'}`}
                                        />
                                        {errors.emergencyPhone && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.emergencyPhone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Actions */}
                        {isEditing && (
                            <div className="flex justify-end space-x-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 flex items-center"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}