'use client'
import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaGithub, FaEye, FaEyeSlash, FaArrowRight, FaExclamationTriangle, FaCheck, FaShieldAlt, FaTimes, FaUserShield, FaUserCog } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'worker' // Default role is now fixed
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
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (error) setError('');
        if (success) setSuccess('');

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

        if (password.length >= 8) {
            strength += 25;
        } else {
            feedback.push('At least 8 characters');
        }

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

        // Role validation is no longer needed here
        // if (!formData.role) {
        //     errors.role = 'Please select a role';
        // }

        if (!agreeToTerms) {
            errors.terms = 'You must agree to the terms and conditions';
        }

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            throw new Error('Please fix errors in the form');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            validateForm();

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'worker' // Explicitly send 'worker' role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccess('Account created! Logging you in...');
            const signInResult = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (signInResult.error) {
                throw new Error('Registration successful, but automatic login failed. Please try logging in manually.');
            }

            router.push('/workers');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialRegister = async (provider) => {
        setSocialLoading(provider);
        try {
            await signIn(provider.toLowerCase(), {
                callbackUrl: '/dashboard'
            });
        } catch (err) {
            setError(`Failed to register with ${provider}`);
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
        <div className="w-full py-16 bg-gradient-to-br from-[#0A0F1F] via-[#0F1F43] to-[#1A184E] flex items-center justify-center px-6">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-24">
                <div className="flex justify-center">
                    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_60px_rgba(0,255,255,0.15)] border border-white/20 w-full max-w-md transition-all duration-300 hover:shadow-[0_0_80px_rgba(0,255,255,0.25)] hover:border-cyan-400/40">
                        <div className="text-center mb-5">
                            <h2 className="text-3xl font-bold text-white tracking-wide">
                                Create Worker Account
                            </h2>
                            <p className="text-gray-300 text-base mt-1">
                                Join our platform as a worker today
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-5 p-3 bg-green-500/20 border border-green-500/40 rounded-xl">
                                <p className="text-green-300 text-sm">{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="text-sm text-gray-300">Full Name</label>
                                <div className="relative mt-1">
                                    <FaUser className="absolute left-4 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all"
                                    />
                                </div>
                                {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm text-gray-300">Email</label>
                                <div className="relative mt-1">
                                    <FaEnvelope className="absolute left-4 top-3 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all"
                                    />
                                </div>
                                {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm text-gray-300">Password</label>
                                <div className="relative mt-1">
                                    <FaLock className="absolute left-4 top-3 text-gray-400" />
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3 text-gray-300"
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
                                            <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
                                        </div>
                                        {passwordFeedback && <p className="mt-1 text-xs text-gray-400">Add: {passwordFeedback}</p>}
                                    </div>
                                )}
                                {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-sm text-gray-300">Confirm Password</label>
                                <div className="relative mt-1">
                                    <FaLock className="absolute left-4 top-3 text-gray-400" />
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-3 text-gray-300"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {fieldErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
                            </div>

                            {/* Terms */}
                            <div className={`flex items-center gap-3 bg-white/5 border p-3 rounded-xl ${fieldErrors.terms ? 'border-red-500/40' : 'border-white/20'}`}>
                                <input
                                    type="checkbox"
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    className="h-4 w-4 accent-cyan-400"
                                />
                                <p className="text-sm text-gray-300">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-cyan-300">Terms</Link> &
                                    <Link href="/privacy" className="text-cyan-300 ml-1">Privacy</Link>
                                </p>
                            </div>
                            {fieldErrors.terms && <p className="text-red-400 text-xs mt-1">{fieldErrors.terms}</p>}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl text-white font-semibold text-sm shadow-lg hover:scale-[1.03] transition-all disabled:opacity-50"
                            >
                                {isLoading ? "Creating..." : "Create Account"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="h-px bg-white/20 w-full"></div>
                            <span className="text-gray-300 text-sm">OR</span>
                            <div className="h-px bg-white/20 w-full"></div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                disabled={socialLoading === 'Google'}
                                onClick={() => handleSocialRegister('Google')}
                                className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 py-3 rounded-xl hover:scale-[1.03] transition-all text-white disabled:opacity-50"
                            >
                                {socialLoading === 'Google' ? (
                                    <svg className="animate-spin h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <FaGoogle className="text-red-400" />
                                )}
                                <span className="text-sm font-medium">Continue with Google</span>
                            </button>

                            <button
                                type="button"
                                disabled={socialLoading === 'GitHub'}
                                onClick={() => handleSocialRegister('GitHub')}
                                className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 py-3 rounded-xl hover:scale-[1.03] transition-all text-white disabled:opacity-50"
                            >
                                {socialLoading === 'GitHub' ? (
                                    <svg className="animate-spin h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <FaGithub className="text-gray-300" />
                                )}
                                <span className="text-sm font-medium">Continue with GitHub</span>
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-gray-300 text-center mt-6 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-cyan-300 hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>

                {/* Right: Placeholder for animation */}
                <div className="hidden md:flex justify-center">
                    <div className="w-[480px] h-[480px] bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">Join Our Worker Community</h3>
                            <p className="text-gray-300">Create a worker account and start your journey with us today.</p>
                            <div className="mt-6">
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <FaUserCog className="text-3xl text-cyan-400 mx-auto mb-2" />
                                    <h4 className="text-white font-medium">Worker Account</h4>
                                    <p className="text-gray-400 text-sm mt-1">Access tasks and manage your work</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;