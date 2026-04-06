"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, AlertTriangle, Code } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 z-0"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Number Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600 tracking-tighter">
            404
          </h1>
        </motion.div>

        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-8"
        >
          <AlertTriangle className="w-8 h-8" />
        </motion.div>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-slate-400 text-lg mb-8"
        >
          The system could not locate the resource you requested.
        </motion.p>

        {/* Dynamic Pathname Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-10 text-left inline-block w-full max-w-lg mx-auto backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 font-mono uppercase tracking-wider">
            <Code className="w-3 h-3" />
            <span>Requested Path</span>
          </div>
          <code className="block text-red-400 font-mono text-sm break-all">
            {origin}
            <span className="text-white">{pathname}</span>
          </code>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
