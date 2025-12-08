// src/app/dashboard/create-client-account/page.js
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    UserPlus,
    ArrowLeft,
    Eye,
    EyeOff,
    Copy,
    Check,
    Building,
    Mail,
    Key,
    Loader2,
    Shield,
    Clock,
    CheckCircle,
    AlertCircle,
    Users,
    BarChart3,
    Settings,
    HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CreateClientAccount() {
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [isCreatingClient, setIsCreatingClient] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [createdSuccessfully, setCreatedSuccessfully] = useState(false);
    const [createdClientEmail, setCreatedClientEmail] = useState('');
    const [createdClientName, setCreatedClientName] = useState('');
    const [errors, setErrors] = useState({});

    const router = useRouter();

    // Generate a random password
    const generateRandomPassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!clientName || clientName.trim() === '') {
            newErrors.name = 'Client name is required';
        } else if (clientName.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!clientEmail || clientEmail.trim() === '') {
            newErrors.email = 'Client email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(clientEmail)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Create client account
    const handleCreateClientAccount = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsCreatingClient(true);
        try {
            const tempPassword = generateRandomPassword();
            setGeneratedPassword(tempPassword);

            // Create client account in your database
            const response = await fetch('/api/admin/create-client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: clientName,
                    email: clientEmail,
                    password: tempPassword,
                    role: 'client',
                    // Send password reset email
                    sendResetEmail: true
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Client account created successfully! Password reset email sent.');
                setCreatedClientEmail(clientEmail);
                setCreatedClientName(clientName);
                setCreatedSuccessfully(true);
                // Reset form
                setClientEmail('');
                setClientName('');
                setErrors({});
            } else {
                toast.error(data.message || 'Failed to create client account');
            }
        } catch (error) {
            console.error('Error creating client account:', error);
            toast.error('An error occurred while creating the client account');
        } finally {
            setIsCreatingClient(false);
        }
    };

    // Copy password to clipboard
    const copyPasswordToClipboard = () => {
        navigator.clipboard.writeText(generatedPassword);
        setPasswordCopied(true);
        toast.success('Password copied to clipboard');
        setTimeout(() => setPasswordCopied(false), 2000);
    };

    // Go back to dashboard
    const goBack = () => {
        router.push('/dashboard');
    };

    // Reset form to create another account
    const resetForm = () => {
        setCreatedSuccessfully(false);
        setGeneratedPassword('');
        setCreatedClientEmail('');
        setCreatedClientName('');
    };

    if (createdSuccessfully) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white">Client Account Created Successfully!</h2>
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                                    <Building className="w-10 h-10 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                    {createdClientName}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {createdClientEmail}
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6 mb-6">
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                    <Key className="w-5 h-5 mr-2 text-amber-500" />
                                    Temporary Password
                                </h4>
                                <div className="flex items-center mb-4">
                                    <div className="flex-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg font-mono text-slate-900 dark:text-white">
                                        {showPassword ? generatedPassword : '••••••••••••'}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="ml-2 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={copyPasswordToClipboard}
                                        className="ml-1 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        {passwordCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    This password has been sent to the client's email. They can change it after logging in.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={goBack}
                                    className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium flex items-center justify-center"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Create Another Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 flex items-center">
                    <button
                        onClick={goBack}
                        className="mr-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Client Account</h1>
                        <p className="text-slate-600 dark:text-slate-400">Create a new account for your client</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                            <form onSubmit={handleCreateClientAccount} className="space-y-6">
                                {/* Client Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Client Name
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={clientName}
                                            onChange={(e) => {
                                                setClientName(e.target.value);
                                                if (errors.name) {
                                                    setErrors({ ...errors, name: '' });
                                                }
                                            }}
                                            className={`w-full pl-12 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200`}
                                            placeholder="Enter client name"
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                {/* Client Email */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Client Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={clientEmail}
                                            onChange={(e) => {
                                                setClientEmail(e.target.value);
                                                if (errors.email) {
                                                    setErrors({ ...errors, email: '' });
                                                }
                                            }}
                                            className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200`}
                                            placeholder="Enter client email"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isCreatingClient}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center disabled:opacity-50"
                                >
                                    {isCreatingClient ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="mr-2 h-5 w-5" />
                                            Create Client Account
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Instructions */}
                            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    What happens next?
                                </h3>
                                <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                    <li className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 dark:bg-blue-800 rounded-full mr-3 flex-shrink-0 text-xs font-semibold">1</span>
                                        <span>A temporary password will be generated for the client</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 dark:bg-blue-800 rounded-full mr-3 flex-shrink-0 text-xs font-semibold">2</span>
                                        <span>The client will receive an email with a password reset link</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 dark:bg-blue-800 rounded-full mr-3 flex-shrink-0 text-xs font-semibold">3</span>
                                        <span>The client can set their own password after logging in</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <Users className="w-8 h-8 text-blue-500" />
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">24</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Clients</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <BarChart3 className="w-8 h-8 text-green-500" />
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">18</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Active Projects</p>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center mb-4">
                                <Shield className="w-8 h-8 text-amber-500 mr-3" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Security Note</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                Client accounts are created with a temporary password that should be changed immediately after first login. The password reset link sent to the client's email is valid for 24 hours.
                            </p>

                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-3">Best Practices</h4>
                                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                        <span>Use a strong, unique password</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                        <span>Share login details securely</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                        <span>Enable two-factor authentication if available</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                        <span>Regularly update passwords</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <Link href="/dashboard/manage-clients" className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <Users className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                                    <span className="text-slate-900 dark:text-white">Manage Clients</span>
                                </Link>
                                <Link href="/dashboard/manage-projects" className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <BarChart3 className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                                    <span className="text-slate-900 dark:text-white">View Projects</span>
                                </Link>
                                <Link href="/dashboard/settings" className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <Settings className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                                    <span className="text-slate-900 dark:text-white">Account Settings</span>
                                </Link>
                                <Link href="/help" className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <HelpCircle className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                                    <span className="text-slate-900 dark:text-white">Help & Support</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}