// app/reset-password/page.js
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    Key,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

function ResetPasswordContent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
        }
    }, [token]);

    const validateForm = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password reset successfully!');
                setResetSuccess(true);
            } else {
                toast.error(data.error || 'Failed to reset password');
                if (data.error.includes('Invalid or expired')) {
                    setTokenValid(false);
                }
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('An error occurred while resetting your password');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-center">
                            <AlertCircle className="w-16 h-16 text-white mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white">Invalid Reset Link</h2>
                        </div>
                        <div className="p-8 text-center">
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                This password reset link is invalid or has expired. Please request a new one.
                            </p>
                            <Link
                                href="/forgot-password"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                            >
                                Request New Reset Link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (resetSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white">Password Reset Successful</h2>
                        </div>
                        <div className="p-8 text-center">
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Your password has been successfully reset. You can now log in with your new password.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                            >
                                Go to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:to-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
                        <Key className="w-16 h-16 text-white mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white">Reset Your Password</h2>
                    </div>
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) {
                                                setErrors({ ...errors, password: '' });
                                            }
                                        }}
                                        className={`w-full pl-4 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200`}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) {
                                                setErrors({ ...errors, confirmPassword: '' });
                                            }
                                        }}
                                        className={`w-full pl-4 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center justify-center disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden p-8 text-center">
                        <Loader2 className="animate-spin w-8 h-8 mx-auto text-blue-600" />
                        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}