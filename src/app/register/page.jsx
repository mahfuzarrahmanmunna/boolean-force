
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
    const router = useRouter();

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

            // API call to register user
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccess('Account created successfully! Redirecting to login...');

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

            // Redirect to login after successful registration
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialRegister = async (provider) => {
        setSocialLoading(provider);
        try {
            // Use NextAuth's signIn function for social providers
            await signIn(provider.toLowerCase(), {
                callbackUrl: '/dashboard' // Redirect after successful login
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

     {/* Left: Form */}
<div className="flex justify-center">
  <div className="
      bg-white/5 backdrop-blur-2xl 
      rounded-3xl p-8 
      shadow-[0_0_60px_rgba(0,255,255,0.15)]
      border border-white/20 
      w-full max-w-md 
      transition-all duration-300 
      hover:shadow-[0_0_80px_rgba(0,255,255,0.25)] 
      hover:border-cyan-400/40
  ">

    {/* Header */}
    <div className="text-center mb-5">
      <h2 className="text-3xl font-bold text-white tracking-wide">
        Create Account
      </h2>
      <p className="text-gray-300 text-base mt-1">
        Join our platform today
      </p>
    </div>

    {/* Error / Success */}
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

    {/* Form */}
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
            className="
              w-full bg-white/10 border border-white/20 rounded-xl 
              py-3 pl-12 pr-4 
              text-white placeholder-gray-400 
              focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
              outline-none transition-all
            "
          />
        </div>
        {fieldErrors.name && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
        )}
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
            className="
              w-full bg-white/10 border border-white/20 rounded-xl 
              py-3 pl-12 pr-4 
              text-white placeholder-gray-400 
              focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
              outline-none transition-all
            "
          />
        </div>
        {fieldErrors.email && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
        )}
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
            className="
              w-full bg-white/10 border border-white/20 rounded-xl 
              py-3 pl-12 pr-10 
              text-white placeholder-gray-400 
              focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
              outline-none transition-all
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 text-gray-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
        )}
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
            className="
              w-full bg-white/10 border border-white/20 rounded-xl 
              py-3 pl-12 pr-10 
              text-white placeholder-gray-400 
              focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
              outline-none transition-all
            "
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-3 text-gray-300"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-center gap-3 bg-white/5 border border-white/20 p-3 rounded-xl">
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full py-3 
          bg-gradient-to-r from-cyan-400 to-blue-500 
          rounded-xl text-white font-semibold text-sm 
          shadow-lg hover:scale-[1.03] transition-all 
          disabled:opacity-50
        "
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
        className="
          w-full flex items-center justify-center gap-3 
          bg-white/10 backdrop-blur-sm 
          border border-white/20 
          py-3 rounded-xl 
          hover:scale-[1.03] transition-all text-white
        "
      >
        <FaGoogle className="text-red-400" />
        <span className="text-sm font-medium">Continue with Google</span>
      </button>

      <button
        type="button"
        className="
          w-full flex items-center justify-center gap-3 
          bg-white/10 backdrop-blur-sm 
          border border-white/20 
          py-3 rounded-xl 
          hover:scale-[1.03] transition-all text-white
        "
      >
        <FaGithub className="text-gray-300" />
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


      {/* Right: Lottie Animation */}
      <div className="hidden md:flex justify-center ">
        <Lottie
          animationData={registerAnimation}
          loop
          className="w-[480px] h-[480px] drop-shadow-[0_0_25px_rgba(0,200,255,0.4)]"
        />
      </div>

    </div>
  </div>
);




};

export default Register;

