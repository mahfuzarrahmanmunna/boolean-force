'use client'
import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaGithub, FaEye, FaEyeSlash, FaArrowRight, FaExclamationTriangle, FaCheck, FaShieldAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [socialLoading, setSocialLoading] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear general messages when user starts typing
        if (error) setError('');
        if (success) setSuccess('');

        // Check password strength when password changes
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength(0);
            setPasswordFeedback('');
            return;
        }

        let strength = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) {
            strength += 25;
        } else {
            feedback.push('At least 8 characters');
        }

        // Complexity checks
        if (/[A-Z]/.test(password)) {
            strength += 25;
        } else {
            feedback.push('One uppercase letter');
        }

        if (/[0-9]/.test(password)) {
            strength += 25;
        } else {
            feedback.push('One number');
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 25;
        } else {
            feedback.push('One special character');
        }

        setPasswordStrength(strength);
        setPasswordFeedback(feedback.join(', '));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name || formData.name.trim() === '') {
            errors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email || formData.email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (passwordStrength < 50) {
            errors.password = 'Password is too weak';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!agreeToTerms) {
            errors.terms = 'You must agree to the terms and conditions';
        }

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            throw new Error('Please fix the errors in the form');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            validateForm();

            // API call would go here
            // const response = await fetch('/api/auth/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess('Account created successfully! You can now log in.');
            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            setAgreeToTerms(false);
            setPasswordStrength(0);
            setPasswordFeedback('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialRegister = async (provider) => {
        setSocialLoading(provider);
        try {
            // Social registration logic would go here
            console.log(`Registering with ${provider}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            setError(`Failed to register with ${provider}`);
        } finally {
            setSocialLoading('');
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 25) return 'bg-red-500';
        if (passwordStrength < 50) return 'bg-orange-500';
        if (passwordStrength < 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 25) return 'Weak';
        if (passwordStrength < 50) return 'Fair';
        if (passwordStrength < 75) return 'Good';
        return 'Strong';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 transform transition-all duration-500 hover:shadow-cyan-500/20">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mb-4 shadow-lg">
                            <FaUser className="text-white text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-300">Join us to get started with your project</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center animate-pulse">
                            <FaExclamationTriangle className="text-red-400 mr-3 flex-shrink-0" />
                            <p className="text-red-200 text-sm">{error}</p>
                            <button
                                onClick={() => setError('')}
                                className="ml-auto text-red-400 hover:text-red-300"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center animate-pulse">
                            <FaCheck className="text-green-400 mr-3 flex-shrink-0" />
                            <p className="text-green-200 text-sm">{success}</p>
                            <button
                                onClick={() => setSuccess('')}
                                className="ml-auto text-green-400 hover:text-green-300"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className={`transition-all duration-300 ${focusedField === 'name' ? 'transform scale-105' : ''}`}>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'name' ? 'text-cyan-400' : 'text-gray-400'}`}>
                                        <FaUser />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className={`appearance-none relative block w-full pl-10 pr-3 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${fieldErrors.name
                                            ? 'border-red-500 focus:ring-red-500'
                                            : focusedField === 'name'
                                                ? 'border-cyan-500 focus:ring-cyan-500'
                                                : 'border-gray-600/50 focus:ring-cyan-500'
                                            } placeholder-gray-400 text-white`}
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField('')}
                                    />
                                </div>
                                {fieldErrors.name && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center">
                                        <FaExclamationTriangle className="mr-1" />
                                        {fieldErrors.name}
                                    </p>
                                )}
                            </div>

                            <div className={`transition-all duration-300 ${focusedField === 'email' ? 'transform scale-105' : ''}`}>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'email' ? 'text-cyan-400' : 'text-gray-400'}`}>
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`appearance-none relative block w-full pl-10 pr-3 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${fieldErrors.email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : focusedField === 'email'
                                                ? 'border-cyan-500 focus:ring-cyan-500'
                                                : 'border-gray-600/50 focus:ring-cyan-500'
                                            } placeholder-gray-400 text-white`}
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField('')}
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center">
                                        <FaExclamationTriangle className="mr-1" />
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            <div className={`transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-gray-400'}`}>
                                        <FaLock />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        className={`appearance-none relative block w-full pl-10 pr-10 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${fieldErrors.password
                                            ? 'border-red-500 focus:ring-red-500'
                                            : focusedField === 'password'
                                                ? 'border-cyan-500 focus:ring-cyan-500'
                                                : 'border-gray-600/50 focus:ring-cyan-500'
                                            } placeholder-gray-400 text-white`}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField('')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-400">Password strength</span>
                                            <span className={`text-xs ${passwordStrength < 50 ? 'text-red-400' : passwordStrength < 75 ? 'text-yellow-400' : 'text-green-400'}`}>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: `${passwordStrength}%` }}
                                            ></div>
                                        </div>
                                        {passwordFeedback && (
                                            <p className="mt-1 text-xs text-gray-400">
                                                Add: {passwordFeedback}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {fieldErrors.password && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center">
                                        <FaExclamationTriangle className="mr-1" />
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className={`transition-all duration-300 ${focusedField === 'confirmPassword' ? 'transform scale-105' : ''}`}>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-cyan-400' : 'text-gray-400'}`}>
                                        <FaLock />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        className={`appearance-none relative block w-full pl-10 pr-10 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${fieldErrors.confirmPassword
                                            ? 'border-red-500 focus:ring-red-500'
                                            : focusedField === 'confirmPassword'
                                                ? 'border-cyan-500 focus:ring-cyan-500'
                                                : 'border-gray-600/50 focus:ring-cyan-500'
                                            } placeholder-gray-400 text-white`}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField('')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {fieldErrors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center">
                                        <FaExclamationTriangle className="mr-1" />
                                        {fieldErrors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={`flex items-start p-3 rounded-lg transition-all duration-300 ${fieldErrors.terms
                            ? 'bg-red-500/10 border border-red-500/30'
                            : agreeToTerms
                                ? 'bg-green-500/10 border border-green-500/30'
                                : 'bg-white/5 border border-gray-600/30'
                            }`}>
                            <input
                                id="agree-to-terms"
                                name="agree-to-terms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="h-4 w-4 bg-white/10 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2 text-cyan-500 mt-0.5"
                            />
                            <label htmlFor="agree-to-terms" className="ml-3 block text-sm text-gray-300">
                                I agree to the{' '}
                                <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                    Terms and Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {fieldErrors.terms && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <FaExclamationTriangle className="mr-1" />
                                {fieldErrors.terms}
                            </p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Create Account
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600/50"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                disabled={socialLoading === 'Google'}
                                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-600/50 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-gray-300 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleSocialRegister('Google')}
                            >
                                {socialLoading === 'Google' ? (
                                    <svg className="animate-spin h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <FaGoogle className="text-red-400" />
                                        <span className="ml-2">Google</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                disabled={socialLoading === 'GitHub'}
                                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-600/50 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-gray-300 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleSocialRegister('GitHub')}
                            >
                                {socialLoading === 'GitHub' ? (
                                    <svg className="animate-spin h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <FaGithub className="text-gray-300" />
                                        <span className="ml-2">GitHub</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-300">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                        <FaShieldAlt className="text-gray-400 mr-2" />
                        <p className="text-xs text-gray-400">
                            Your data is secure and encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;