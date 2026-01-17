"use client";
import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaExclamationTriangle,
} from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loginAnimation from "../../../public/lottie/signin.json";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect based on role when session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // console.log("User logged in:", session.user);
      // console.log("User role:", session.user.role);

      // Redirect based on role
      if (session.user.role === "admin") {
        router.push("/dashboard");
      } else if (session.user.role === "worker") {
        router.push("/worker-dashboard");
      } else if (session.user.role === "client") {
        router.push("/client-dashboard");
      } else {
        // Default redirect
        router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      // console.log("Attempting login for:", formData.email);

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      // console.log("Sign in result:", result);

      if (result.error) {
        console.log("Login error:", result.error);
        throw new Error(result.error);
      }

      // Successful login - useEffect will handle redirect
      console.log("Login successful, checking session...");
    } catch (err) {
      console.log("Login error:", err.message);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    try {
      console.log(`Social login attempt: ${provider}`);

      await signIn(provider.toLowerCase(), {
        callbackUrl: window.location.origin, // Stay on same page, useEffect will handle redirect
      });
    } catch (err) {
      console.log(`Social login error: ${provider}`, err);
      setError(`Failed to sign in with ${provider}`);
      setSocialLoading("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0A0F1F] via-[#0F1F43] to-[#1A184E] flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-24">

        {/* Left form  */}
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
                Welcome Back
              </h2>
              <p className="text-gray-300 text-base mt-1">
                Sign in to your account
              </p>
            </div>

            {/* Debug Info - Only show in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/40 rounded-xl">
                <p className="text-blue-300 text-xs mb-2">
                  Session Status: {status}
                </p>
                {session && (
                  <>
                    <p className="text-blue-300 text-xs">
                      Logged in as: {session.user?.email}
                    </p>
                    <p className="text-blue-300 text-xs">
                      Role: {session.user?.role}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

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

                {/* Forgot Password */}
                <div className="text-right mt-1">
                  <Link href="/forgot-password" className="text-cyan-300 text-sm hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/20 p-3 rounded-xl">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />
                <p className="text-sm text-gray-300">Remember me</p>
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
                {isLoading ? "Signing in..." : "Sign In"}
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
                disabled={socialLoading === "Google"}
                onClick={() => handleSocialLogin("Google")}
                className="
                  w-full flex items-center justify-center gap-3 
                  bg-white/10 backdrop-blur-sm 
                  border border-white/20 
                  py-3 rounded-xl 
                  hover:scale-[1.03] transition-all text-white
                  disabled:opacity-50
                "
              >
                {socialLoading === "Google" ? (
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
                disabled={socialLoading === "GitHub"}
                onClick={() => handleSocialLogin("GitHub")}
                className="
                  w-full flex items-center justify-center gap-3 
                  bg-white/10 backdrop-blur-sm 
                  border border-white/20 
                  py-3 rounded-xl 
                  hover:scale-[1.03] transition-all text-white
                  disabled:opacity-50
                "
              >
                {socialLoading === "GitHub" ? (
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

            {/* Sign Up Link */}
            <p className="text-gray-300 text-center mt-6 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-cyan-300 hover:underline">Sign up</Link>
            </p>
          </div>
        </div>

        {/* Right: Lottie Animation */}
        <div className="hidden md:flex justify-center">
          <Lottie
            animationData={loginAnimation}
            loop
            className="w-[480px] h-[480px] drop-shadow-[0_0_25px_rgba(0,200,255,0.4)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;